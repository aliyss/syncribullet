import { yearsToString } from '~/utils/helpers/date';
import type {
  PickByArrays,
  RequireAtLeastOne,
  Year,
} from '~/utils/helpers/types';
import { ManifestReceiverTypes } from '~/utils/manifest';
import { getMappingIdsHaglund } from '~/utils/mappings/haglund';
import { ReceiverServer } from '~/utils/receiver/receiver-server';
import { IDSources } from '~/utils/receiver/types/id';
import type { IDs } from '~/utils/receiver/types/id';
import { createIDCatalogString } from '~/utils/receiver/types/id';
import type { ManifestCatalogExtraParametersOptions } from '~/utils/receiver/types/manifest-types';
import type { MetaObject } from '~/utils/receiver/types/meta-object';
import type { MetaPreviewObject } from '~/utils/receiver/types/meta-preview-object';

import { KitsuAddonServerReceiver } from '../kitsu-addon/receiver-server';
import { getKitsuCurrentUser } from './api/current-user';
import {
  getKitsuMetaObject,
  getKitsuMinimalMetaObject,
} from './api/meta-object';
import { getKitsuMetaPreviews } from './api/meta-previews';
import { syncKitsuMetaObject } from './api/sync';
import {
  defaultCatalogs,
  defaultImportCatalogs,
  defaultLiveSyncTypes,
  internalIds,
  liveSyncTypes,
  manifestCatalogItems,
  receiverInfo,
  receiverTypeMapping,
  receiverTypeReverseMapping,
  syncIds,
} from './constants';
import { buildLibraryObjectUserDescription } from './meta/description';
import type { KitsuCatalogStatus } from './types/catalog/catalog-status';
import type { KitsuCatalogType } from './types/catalog/catalog-type';
import type { KitsuAnimeEntry } from './types/kitsu/anime-entry';
import type {
  KitsuLibraryEntry,
  KitsuLibraryEntryIncluded,
} from './types/kitsu/library-entry';
import type { KitsuMCIT } from './types/manifest';

export class KitsuServerReceiver extends ReceiverServer<KitsuMCIT> {
  internalIds = internalIds;
  syncIds = syncIds;

  receiverTypeMapping = receiverTypeMapping;
  receiverTypeReverseMapping = receiverTypeReverseMapping;
  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;
  defaultCatalogs = defaultCatalogs;
  defaultImportCatalogs = defaultImportCatalogs;
  liveSyncTypes = liveSyncTypes;
  defaultLiveSyncTypes = defaultLiveSyncTypes;

  kitsuAddonServerReceiver: KitsuAddonServerReceiver;

  constructor() {
    super();
    this.kitsuAddonServerReceiver = new KitsuAddonServerReceiver();
  }

  async getMappingIds(
    id: string,
    source: IDSources,
  ): Promise<RequireAtLeastOne<IDs> | {}> {
    let mappingIds = {};
    try {
      mappingIds = {
        ...mappingIds,
        ...(await getMappingIdsHaglund(id, source)),
      };
    } catch (e) {
      console.error(e);
    }
    return mappingIds;
  }

  async _convertPreviewObjectToMetaPreviewObject(
    object: KitsuLibraryEntry,
    // oldType: KitsuMCIT['receiverCatalogType'],
    // options?: ManifestCatalogExtraParametersOptions,
    // index?: number,
  ): Promise<MetaPreviewObject> {
    const newIds = {
      'kitsu-nsfw': object.meta.attributes.nsfw ? object.meta.id : undefined,
      kitsu: object.meta.id,
      ...(await this.getMappingIds(object.meta.id.toString(), IDSources.KITSU)),
    } as RequireAtLeastOne<IDs>;

    const manifestCatalogType =
      object.meta.attributes.showType.toUpperCase() === 'MOVIE' ||
      (object.meta.attributes.nsfw &&
        object.meta.attributes.showType.toUpperCase() === 'OVA')
        ? ManifestReceiverTypes.MOVIE
        : ManifestReceiverTypes.SERIES;

    const id = createIDCatalogString(newIds, true);

    if (!id) {
      throw new Error('No ID found!');
    }

    const meta: MetaObject | undefined = {
      id,
      name:
        object.meta.attributes.titles.en ??
        object.meta.attributes.titles.en_us ??
        object.meta.attributes.titles.en_jp ??
        object.meta.attributes.titles.ja_jp ??
        'Unknown Title',
      type: manifestCatalogType,
      logo: newIds.imdb
        ? `https://images.metahub.space/logo/medium/${newIds.imdb}/img`
        : undefined,
      releaseInfo: yearsToString(
        object.meta.attributes.startDate?.split('-')[0] as any,
        object.meta.attributes.endDate?.split('-')[0] as any,
      ) as any,
      poster:
        object.meta.attributes.posterImage.medium ??
        object.meta.attributes.posterImage.large ??
        object.meta.attributes.posterImage.original,
      background:
        object.meta.attributes.coverImage?.original ??
        object.meta.attributes.coverImage?.large ??
        object.meta.attributes.posterImage.original,
      genres: object.genres || [],
      imdbRating: (
        Math.round(parseFloat(object.meta.attributes.averageRating || '0')) / 10
      ).toString(),
      description: buildLibraryObjectUserDescription(object),
    } satisfies MetaObject;

    return {
      id: meta.id,
      type: meta.type,
      releaseInfo: meta.releaseInfo as Year,
      name: meta.name,
      logo: meta.logo,
      background: meta.background,
      poster: meta.poster,
      posterShape: meta.posterShape,
      imdbRating: meta.imdbRating,
      links: meta.links,
      genres: meta.genres,
      description: meta.description,
      trailers: meta.trailers,
    };
  }

  async _convertObjectToMetaObject(
    object: KitsuAnimeEntry,
    // oldIds:
    //   | PickByArrays<IDs, DeepWriteable<KitsuServerReceiver['internalIds']>>
    //   | undefined,
    // oldType: KitsuCatalogType,
    // potentialType: ManifestReceiverTypes,
  ): Promise<MetaObject> {
    const newIds = {
      'kitsu-nsfw': object.attributes.nsfw ? object.id : undefined,
      kitsu: object.id,
      ...(await this.getMappingIds(object.id.toString(), IDSources.KITSU)),
    } as RequireAtLeastOne<IDs>;

    const manifestCatalogType =
      object.attributes.showType.toUpperCase() === 'MOVIE' ||
      (object.attributes.nsfw &&
        object.attributes.showType.toUpperCase() === 'OVA')
        ? ManifestReceiverTypes.MOVIE
        : ManifestReceiverTypes.SERIES;

    const id = createIDCatalogString(newIds, false);

    if (!id) {
      throw new Error('No ID found!');
    }

    const meta: MetaObject | undefined = {
      id: object.attributes.slug || id,
      name:
        object.attributes.titles.en_jp ??
        object.attributes.titles.en ??
        object.attributes.titles.en_us ??
        object.attributes.titles.ja_jp ??
        'Unknown Title',
      type: manifestCatalogType,
      logo: newIds.imdb
        ? `https://images.metahub.space/logo/medium/${newIds.imdb}/img`
        : undefined,
      releaseInfo: yearsToString(
        object.attributes.startDate?.split('-')[0] as any,
        object.attributes.endDate?.split('-')[0] as any,
      ) as any,
      background:
        object.attributes.coverImage?.original ??
        object.attributes.coverImage?.large ??
        object.attributes.posterImage.original,
      poster:
        object.attributes.posterImage.medium ??
        object.attributes.posterImage.large ??
        object.attributes.posterImage.original,
      genres: object.genres || [],
      videos: object.episodes?.map(
        (episode) =>
          ({
            id: object.attributes.nsfw
              ? (object.episodes?.length || 1) <= 1
                ? `${object.attributes.slug}`
                : `${object.attributes.slug}-${episode.attributes.number}`
              : `${id}:${episode.attributes.number}`,
            title:
              (episode.attributes.titles?.en_jp ??
                episode.attributes.titles?.en ??
                episode.attributes.titles?.en_us ??
                episode.attributes.titles?.ja_jp ??
                episode.attributes.canonicalTitle ??
                object.attributes.titles.en_jp ??
                object.attributes.titles.en ??
                object.attributes.titles.en_us ??
                object.attributes.titles.ja_jp ??
                'Unknown Title') +
              ' Ep.' +
              episode.attributes.number,
            season: episode.attributes.seasonNumber || 1,
            episode:
              episode.attributes.relativeNumber ??
              episode.attributes.number ??
              1,
            released: episode.attributes.airdate
              ? new Date(episode.attributes.airdate).toISOString()
              : new Date(
                  object.attributes.startDate || episode.attributes.createdAt,
                ).toISOString(),
            thumbnail:
              episode.attributes.thumbnail?.original ??
              object.attributes.posterImage.original,
            overview: episode.attributes.description,
          }) as any,
      ),
      imdbRating: (
        Math.round(parseFloat(object.attributes.averageRating || '0')) / 10
      ).toString(),
      description: object.attributes.description,
    } satisfies MetaObject;

    return meta;
  }

  async _getMetaPreviews(
    type: KitsuCatalogType,
    _potentialTypes: KitsuCatalogType[],
    status: KitsuCatalogStatus,
    options?: ManifestCatalogExtraParametersOptions,
  ): Promise<KitsuLibraryEntry[]> {
    const currentUser = await getKitsuCurrentUser(this.userSettings);
    const previews = await getKitsuMetaPreviews(
      type,
      status,
      this.userSettings,
      currentUser,
      options?.skip || 0,
      100,
      options?.genre,
    );

    return previews;
  }

  async _getMetaObject(
    ids: PickByArrays<IDs, KitsuMCIT['internalIds']>,
    type: KitsuMCIT['receiverCatalogType'],
    // potentialTypes: AnilistMCIT['receiverCatalogType'][],
  ): Promise<KitsuAnimeEntry | undefined> {
    if ('kitsu-nsfw' in ids && ids['kitsu-nsfw']) {
      return await getKitsuMetaObject(
        ids['kitsu-nsfw'],
        type,
        this.userSettings,
      );
    }
  }

  async _syncMetaObject(
    ids: {
      ids: PickByArrays<IDs, KitsuMCIT['syncIds']>;
      count:
        | {
            season: number;
            episode: number;
          }
        | undefined;
    },
    type: KitsuMCIT['receiverCatalogType'],
    // potentialTypes: AnilistMCIT['receiverCatalogType'][],
  ): Promise<void> {
    if (!ids.ids.kitsu) {
      throw new Error('No Kitsu ID provided!');
    }
    const currentUser = await getKitsuCurrentUser(this.userSettings);
    const currentProgressMedia = await getKitsuMinimalMetaObject(
      ids.ids.kitsu,
      type,
      this.userSettings,
      currentUser,
    );
    let status =
      'type' in currentProgressMedia.data[0] &&
      currentProgressMedia.data[0].type === 'anime'
        ? 'current'
        : currentProgressMedia.data[0]?.attributes?.status;

    if (status === 'completed') {
      return;
    }
    if (status === 'on_hold' || status === 'dropped' || status === 'planned') {
      status = 'current';
    }
    const anime = (
      currentProgressMedia.included[0] as KitsuLibraryEntryIncluded | undefined
    )?.attributes;
    const animeEpisodeCount = anime?.episodeCount || 1;

    if (status === 'current' && !ids.count) {
      status = 'completed';
      ids.count = {
        season: 0,
        episode: animeEpisodeCount,
      };
    } else if (
      status === 'current' &&
      (ids.count?.episode || 1) >= animeEpisodeCount &&
      anime?.status === 'finished'
    ) {
      status = 'completed';
      ids.count = {
        season: 0,
        episode: animeEpisodeCount,
      };
    }

    await syncKitsuMetaObject(
      ids.ids.kitsu,
      status,
      ids.count,
      this.userSettings,
      currentUser,
      'type' in currentProgressMedia.data[0] &&
        currentProgressMedia.data[0].type === 'anime'
        ? undefined
        : currentProgressMedia.data[0].id,
    );
  }
}
