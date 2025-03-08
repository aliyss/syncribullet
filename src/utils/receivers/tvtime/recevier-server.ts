import { yearsToString } from '~/utils/helpers/date';
import type { RequireAtLeastOne, Year } from '~/utils/helpers/types';
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
import './api/meta-object';
import { getTVTimeMetaPreviews } from './api/meta-previews';
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
    [ManifestReceiverTypes.ANIME]: TVTimeCatalogType.SERIES,
    [ManifestReceiverTypes.CHANNELS]: TVTimeCatalogType.SERIES,
    [ManifestReceiverTypes.TV]: TVTimeCatalogType.SERIES,
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

  async _syncMetaObject() // ids: {
  //   ids: PickByArrays<IDs, TVTimeMCIT['syncIds']>;
  //   count:
  //     | {
  //         season: number;
  //         episode: number;
  //       }
  //     | undefined;
  // },
  // type: TVTimeMCIT['receiverCatalogType'],
  // potentialTypes: AnilistMCIT['receiverCatalogType'][],
  : Promise<void> {
    // if (!ids.ids.imdb) {
    //   throw new Error('No TVTime ID provided!');
    // }
    // const currentProgressMedia = await getTVTimeMinimalMetaObject(
    //   ids.ids.imdb,
    //   type,
    //   this.userSettings,
    // );
    // let status =
    //   'type' in currentProgressMedia.data[0] &&
    //   currentProgressMedia.data[0].type === 'anime'
    //     ? 'current'
    //     : currentProgressMedia.data[0]?.attributes?.status;
    //
    // if (status === 'completed') {
    //   return;
    // }
    // if (status === 'on_hold' || status === 'dropped' || status === 'planned') {
    //   status = 'current';
    // }
    // const anime = (
    //   currentProgressMedia.included[0] as TVTimeLibraryEntryIncluded | undefined
    // )?.attributes;
    // const animeEpisodeCount = anime?.episodeCount || 1;
    //
    // if (status === 'current' && !ids.count) {
    //   status = 'completed';
    //   ids.count = {
    //     season: 0,
    //     episode: animeEpisodeCount,
    //   };
    // } else if (
    //   status === 'current' &&
    //   (ids.count?.episode || 1) >= animeEpisodeCount &&
    //   anime?.status === 'finished'
    // ) {
    //   status = 'completed';
    //   ids.count = {
    //     season: 0,
    //     episode: animeEpisodeCount,
    //   };
    // }
    //
    // await syncTVTimeMetaObject(
    //   ids.ids.imdb,
    //   status,
    //   ids.count,
    //   this.userSettings,
    //   currentUser,
    //   'type' in currentProgressMedia.data[0] &&
    //     currentProgressMedia.data[0].type === 'anime'
    //     ? undefined
    //     : currentProgressMedia.data[0].id,
    // );
  }
}
