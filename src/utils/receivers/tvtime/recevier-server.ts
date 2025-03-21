import { yearsToString } from '~/utils/helpers/date';
import type {
  PickByArrays,
  RequireAtLeastOne,
  Year,
} from '~/utils/helpers/types';
import { ManifestReceiverTypes } from '~/utils/manifest';
import { getMappingIdsHaglund } from '~/utils/mappings/haglund';
import { ReceiverServer } from '~/utils/receiver/receiver-server';
import type { IDSources } from '~/utils/receiver/types/id';
import type { IDs } from '~/utils/receiver/types/id';
import { createIDCatalogString } from '~/utils/receiver/types/id';
import type { ManifestCatalogExtraParametersOptions } from '~/utils/receiver/types/manifest-types';
import type { MetaObject } from '~/utils/receiver/types/meta-object';
import type { MetaPreviewObject } from '~/utils/receiver/types/meta-preview-object';

import { KitsuAddonServerReceiver } from '../kitsu-addon/receiver-server';
import { episodesTVTimeMetaObject } from './api/episodes';
import './api/meta-object';
import { getTVTimeMetaPreviews } from './api/meta-previews';
import { syncTVTimeMetaObject } from './api/sync';
import {
  defaultCatalogs,
  defaultLiveSyncTypes,
  internalIds,
  liveSyncTypes,
  manifestCatalogItems,
  receiverInfo,
  syncIds,
} from './constants';
import type { TVTimeCatalogStatus } from './types/catalog/catalog-status';
import { TVTimeCatalogType } from './types/catalog/catalog-type';
import type { TVTimeMCIT } from './types/manifest';
import type {
  TVTimeLibraryEntry,
  TVTimeLibraryEntryMovie,
  TVTimeLibraryEntryShow,
} from './types/tvtime/library-entry';

export class TVTimeServerReceiver extends ReceiverServer<TVTimeMCIT> {
  internalIds = internalIds;
  syncIds = syncIds;
  receiverTypeMapping = {
    [TVTimeCatalogType.MOVIE]: ManifestReceiverTypes.MOVIE,
    [TVTimeCatalogType.SERIES]: ManifestReceiverTypes.SERIES,
  };
  receiverTypeReverseMapping = {
    [ManifestReceiverTypes.MOVIE]: TVTimeCatalogType.MOVIE,
    [ManifestReceiverTypes.SERIES]: TVTimeCatalogType.SERIES,
    [ManifestReceiverTypes.ANIME]: undefined,
    [ManifestReceiverTypes.CHANNELS]: undefined,
    [ManifestReceiverTypes.TV]: undefined,
  };

  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;
  defaultCatalogs = defaultCatalogs;
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
    object: TVTimeLibraryEntry,
    // oldType: TVTimeMCIT['receiverCatalogType'],
    // options?: ManifestCatalogExtraParametersOptions,
    // index?: number,
  ): Promise<MetaPreviewObject> {
    const meta = await this._convertObjectToMetaObject(object);

    return {
      id: meta.id,
      type: meta.type,
      runtime: meta.runtime,
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

  async _convertObjectToMetaObjectMovie(
    object: TVTimeLibraryEntryMovie,
    // oldIds:
    //   | PickByArrays<IDs, DeepWriteable<TVTimeServerReceiver['internalIds']>>
    //   | undefined,
    // oldType: TVTimeCatalogType,
    // potentialType: ManifestReceiverTypes,
  ): Promise<MetaObject> {
    const newIds = {
      imdb: object.meta.imdb_id,
      tvdb: object.meta.external_sources.find((x) => x.source === 'tvdb')?.id,
      tvtime: object.uuid,
    } as RequireAtLeastOne<IDs>;

    const manifestCatalogType = ManifestReceiverTypes.MOVIE;

    const id = createIDCatalogString(newIds, false);

    if (!id) {
      throw new Error('No ID found!');
    }

    const meta: MetaObject | undefined = {
      id: id,
      name: object.meta.name,
      type: manifestCatalogType,
      logo: newIds.imdb
        ? `https://images.metahub.space/logo/medium/${newIds.imdb}/img`
        : undefined,
      releaseInfo: yearsToString(
        object.meta.first_release_date.split('-')[0] as any,
        undefined,
      ) as any,
      background: object.meta.fanart[0]?.url,
      poster: object.meta.posters[0]?.url,
      genres: object.meta.genres,
      description: object.meta.overview,
    } satisfies MetaObject;

    return meta;
  }

  async _convertObjectToMetaObjectShow(
    object: TVTimeLibraryEntryShow,
    // oldIds:
    //   | PickByArrays<IDs, DeepWriteable<TVTimeServerReceiver['internalIds']>>
    //   | undefined,
    // oldType: TVTimeCatalogType,
    // potentialType: ManifestReceiverTypes,
  ): Promise<MetaObject> {
    const newIds = {
      imdb: object.imdb_id,
      tvdb: object.id,
    } as RequireAtLeastOne<IDs>;

    const manifestCatalogType = ManifestReceiverTypes.SERIES;

    const id = createIDCatalogString(newIds, false);

    if (!id) {
      throw new Error('No ID found!');
    }

    const meta: MetaObject | undefined = {
      id: id,
      name: object.name,
      imdbRating: object.rating.toString().slice(0, 3),
      runtime: `${object.runtime} min`,
      type: manifestCatalogType,
      logo: newIds.imdb
        ? `https://images.metahub.space/logo/medium/${newIds.imdb}/img`
        : undefined,
      releaseInfo: yearsToString(undefined, undefined) as any,
      background: object.fanart.url,
      poster: object.poster.url,
      genres: object.genres,
      description: object.overview,
    } satisfies MetaObject;

    return meta;
  }

  async _convertObjectToMetaObject(
    object: TVTimeLibraryEntry,
    // oldIds:
    //   | PickByArrays<IDs, DeepWriteable<TVTimeServerReceiver['internalIds']>>
    //   | undefined,
    // oldType: TVTimeCatalogType,
    // potentialType: ManifestReceiverTypes,
  ): Promise<MetaObject> {
    if (object.type === 'series') {
      return this._convertObjectToMetaObjectShow(object);
    }
    return this._convertObjectToMetaObjectMovie(object);
  }

  async _getMetaPreviews(
    type: TVTimeCatalogType,
    _potentialTypes: TVTimeCatalogType[],
    status: TVTimeCatalogStatus,
    options?: ManifestCatalogExtraParametersOptions,
  ): Promise<TVTimeLibraryEntry[]> {
    const previews = await getTVTimeMetaPreviews(
      type,
      status,
      this.userSettings,
      options?.skip || 0,
      100,
    );

    return previews;
  }

  async _getMetaObject() // ids: PickByArrays<IDs, TVTimeMCIT['internalIds']>,
  // type: TVTimeMCIT['receiverCatalogType'],
  // potentialTypes: AnilistMCIT['receiverCatalogType'][],
  : Promise<TVTimeLibraryEntry | undefined> {
    throw new Error('Method not implemented.');
    // if ('tvtime-nsfw' in ids && ids['tvtime-nsfw']) {
    //   return await getTVTimeMetaObject(
    //     ids['tvtime-nsfw'],
    //     type,
    //     this.userSettings,
    //   );
    // }
  }

  async _syncMetaObject(
    ids: {
      ids: PickByArrays<IDs, TVTimeMCIT['syncIds']>;
      count:
        | {
            season: number;
            episode: number;
          }
        | undefined;
    },
    type: TVTimeMCIT['receiverCatalogType'], // potentialTypes: AnilistMCIT['receiverCatalogType'][],
  ): Promise<void> {
    const id =
      'tvtime' in ids.ids && ids.ids.tvtime
        ? ids.ids.tvtime
        : 'tvdb' in ids.ids && ids.ids.tvdb && !ids.count
        ? ids.ids.tvdb
        : undefined;

    if (!id) {
      throw new Error('No valid ID found for TVTime!');
    }

    let episode = undefined;

    if (type === TVTimeCatalogType.SERIES && ids.count) {
      episode = await episodesTVTimeMetaObject(
        id.toString(),
        ids.count,
        this.userSettings,
      );
    }

    await syncTVTimeMetaObject(
      id.toString(),
      type,
      this.userSettings,
      episode ? episode.id : undefined,
    );
  }
}
