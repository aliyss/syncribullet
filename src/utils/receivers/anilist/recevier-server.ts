import { yearsToString } from '~/utils/helpers/date';
import type {
  PickByArrays,
  RequireAtLeastOne,
  Year,
} from '~/utils/helpers/types';
import { ManifestReceiverTypes } from '~/utils/manifest';
import { getMappingIdsHaglund } from '~/utils/mappings/haglund';
import { getMappingIdsToKitsu } from '~/utils/mappings/kitsu';
import { ReceiverServer } from '~/utils/receiver/receiver-server';
import { IDSources } from '~/utils/receiver/types/id';
import type { IDs } from '~/utils/receiver/types/id';
import { createIDCatalogString } from '~/utils/receiver/types/id';
import type { ManifestCatalogExtraParametersOptions } from '~/utils/receiver/types/manifest-types';
import type { MetaObject } from '~/utils/receiver/types/meta-object';
import type { MetaPreviewObject } from '~/utils/receiver/types/meta-preview-object';

import { KitsuAddonServerReceiver } from '../kitsu-addon/receiver-server';
import { getAnilistCurrentUser } from './api/current-user';
import { getAnilistMinimalMetaObject } from './api/meta-object';
import { getAnilistMetaPreviews } from './api/meta-previews';
import { syncAnilistMetaObject } from './api/sync';
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
import type { AnilistLibraryListEntry } from './types/anilist/library';
import type { AnilistCatalogStatus } from './types/catalog/catalog-status';
import { AnilistCatalogType } from './types/catalog/catalog-type';
import type { AnilistMCIT } from './types/manifest';

export class AnilistServerReceiver extends ReceiverServer<AnilistMCIT> {
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
    if (!('kitsu' in mappingIds)) {
      try {
        mappingIds = {
          ...mappingIds,
          ...(await getMappingIdsToKitsu(id, source)),
        };
      } catch (e) {
        console.error(e);
      }
    }
    return mappingIds;
  }

  async _convertPreviewObjectToMetaPreviewObject(
    previewObject: AnilistLibraryListEntry,
    // oldType: AnilistMCIT['receiverCatalogType'],
    // options?: ManifestCatalogExtraParametersOptions,
    // index?: number,
  ): Promise<MetaPreviewObject> {
    const meta = await this._convertObjectToMetaObject(
      previewObject,
      // undefined,
      // oldType,
      // this.receiverTypeMapping[oldType],
    );

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
    object: AnilistLibraryListEntry,
    // oldIds:
    //   | PickByArrays<IDs, DeepWriteable<AnilistServerReceiver['internalIds']>>
    //   | undefined,
    // oldType: AnilistCatalogType,
    // potentialType: ManifestReceiverTypes,
  ): Promise<MetaObject> {
    // const kitsuAddonCatalogType = KitsuAddonCatalogType.ANIME;

    const mappingIds = await this.getMappingIds(
      object.media.id.toString(),
      IDSources.ANILIST,
    );
    const newIds = {
      anilist: object.media.id,
      mal: object.media.idMal,
      ...mappingIds,
    } as RequireAtLeastOne<IDs>;

    if (newIds.kitsu && object.media.isAdult) {
      newIds['kitsu-nsfw'] = newIds.kitsu;
    }

    const manifestCatalogType =
      object.media.format?.toUpperCase() === 'MOVIE' ||
      (object.media.isAdult && object.media.format?.toUpperCase() === 'OVA')
        ? ManifestReceiverTypes.MOVIE
        : ManifestReceiverTypes.SERIES;

    const id = createIDCatalogString(newIds);

    if (!id) {
      throw new Error('No ID found!');
    }

    const meta: MetaObject | undefined = {
      id,
      name:
        object.media.title.userPreferred ??
        object.media.title.english ??
        object.media.title.native,
      type: manifestCatalogType,
      logo: newIds.imdb
        ? `https://images.metahub.space/logo/medium/${newIds.imdb}/img`
        : undefined,
      releaseInfo: yearsToString(
        object.media.startDate?.year,
        object.media.endDate?.year,
      ) as any,
      poster: object.media.coverImage.large,
      background: object.media.bannerImage || undefined,
      genres: [...object.media.genres, ...object.media.tags.map((o) => o.name)],
      imdbRating: (object.media.averageScore / 10).toString(),
      posterShape: 'poster',
      description: buildLibraryObjectUserDescription(object),
      trailers:
        object.media.trailer?.id && object.media.trailer.site === 'youtube'
          ? [
              {
                source: object.media.trailer.id,
                type: 'Trailer',
              },
            ]
          : [],
    } satisfies MetaObject;

    return meta;
  }

  async _getMetaPreviews(
    type: AnilistCatalogType,
    _potentialTypes: AnilistCatalogType[],
    status: AnilistCatalogStatus,
    options?: ManifestCatalogExtraParametersOptions,
  ): Promise<AnilistLibraryListEntry[]> {
    const currentUser = await getAnilistCurrentUser(this.userSettings);
    const previews = await getAnilistMetaPreviews(
      type,
      status,
      this.userSettings,
      currentUser,
      Math.ceil(((options?.skip || 1) - 1) / 100),
      100,
      options?.genre,
    );

    const items = previews.MediaListCollection.lists.reduce((acc, list) => {
      return [
        ...acc,
        ...list.entries.map((entry) => {
          return {
            ...entry,
            listData: {
              name: list.name,
              status: list.status,
              isCustomList: list.isCustomList,
              isSplitCompletedList: list.isSplitCompletedList,
            },
          } as AnilistLibraryListEntry;
        }),
      ];
    }, [] as AnilistLibraryListEntry[]);

    return items.filter((o) => {
      if (
        type === AnilistCatalogType.ANIME &&
        options?.genre &&
        o.media.format?.toUpperCase() !== options.genre.toUpperCase()
      ) {
        return false;
      }
      return true;
    });
  }

  _getMetaObject(
    ids: PickByArrays<IDs, AnilistMCIT['internalIds']>,
    type: AnilistMCIT['receiverCatalogType'],
    // potentialTypes: AnilistMCIT['receiverCatalogType'][],
  ): Promise<AnilistLibraryListEntry> {
    console.log('SimklServerReceiver -> _getMetaObject -> id', ids, type);
    throw new Error('Method not implemented.');
  }

  async _syncMetaObject(
    ids: {
      ids: PickByArrays<IDs, AnilistMCIT['syncIds']>;
      count:
        | {
            season: number;
            episode: number;
          }
        | undefined;
    },
    type: AnilistMCIT['receiverCatalogType'],
    // potentialTypes: AnilistMCIT['receiverCatalogType'][],
  ): Promise<void> {
    if (!ids.ids.anilist) {
      throw new Error('No Anilist ID provided!');
    }
    const currentProgressMedia = await getAnilistMinimalMetaObject(
      ids.ids.anilist,
      type,
      this.userSettings,
    );
    let status = currentProgressMedia.Media.mediaListEntry?.status;
    if (status === 'COMPLETED') {
      return;
    }
    if (!status) {
      status = 'CURRENT';
    }
    if (status === 'PAUSED' || status === 'DROPPED' || status === 'PLANNING') {
      status = 'CURRENT';
    }

    if (status === 'CURRENT' && !ids.count) {
      status = 'COMPLETED';
      ids.count = {
        season: 0,
        episode: currentProgressMedia.Media.episodes,
      };
    } else if (
      status === 'CURRENT' &&
      (ids.count?.episode || 1) >= currentProgressMedia.Media.episodes &&
      currentProgressMedia.Media.status === 'FINISHED'
    ) {
      status = 'COMPLETED';
    }

    await syncAnilistMetaObject(
      ids.ids.anilist,
      status,
      ids.count,
      this.userSettings,
    );
    // throw new Error('Method not implemented.');
  }
}
