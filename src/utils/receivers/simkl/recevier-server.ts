import { yearsToString } from '~/utils/helpers/date';
import type {
  DeepWriteable,
  PickByArrays,
  RequireAtLeastOne,
  Year,
} from '~/utils/helpers/types';
import { ManifestReceiverTypes } from '~/utils/manifest';
import { ReceiverServer } from '~/utils/receiver/receiver-server';
import type { IDSources, IDs } from '~/utils/receiver/types/id';
import { createIDCatalogString } from '~/utils/receiver/types/id';
import type { ManifestCatalogExtraParametersOptions } from '~/utils/receiver/types/manifest-types';
import type { MetaObject } from '~/utils/receiver/types/meta-object';
import type { MetaPreviewObject } from '~/utils/receiver/types/meta-preview-object';

import { CinemetaServerReceiver } from '../cinemeta/receiver-server';
import { CinemetaCatalogType } from '../cinemeta/types/catalog/catalog-type';
import { KitsuAddonServerReceiver } from '../kitsu-addon/receiver-server';
import { KitsuAddonCatalogType } from '../kitsu-addon/types/catalog/catalog-type';
import { getSimklMetaPreviews } from './api/meta-previews';
import { syncSimklMetaObject } from './api/sync';
import {
  defaultCatalogs,
  defaultLiveSyncTypes,
  internalIds,
  liveSyncTypes,
  manifestCatalogItems,
  receiverInfo,
  syncIds,
} from './constants';
import { buildLibraryObjectUserDescription } from './meta/description';
import type { SimklCatalogStatus } from './types/catalog/catalog-status';
import { SimklCatalogType } from './types/catalog/catalog-type';
import type { SimklMCIT } from './types/manifest';
import type { SimklLibraryListEntry } from './types/simkl/library';

export class SimklServerReceiver extends ReceiverServer<SimklMCIT> {
  internalIds = internalIds;
  syncIds = syncIds;

  receiverTypeMapping = {
    [SimklCatalogType.MOVIES]: ManifestReceiverTypes.MOVIE,
    [SimklCatalogType.SHOWS]: ManifestReceiverTypes.SERIES,
    [SimklCatalogType.ANIME]: ManifestReceiverTypes.ANIME,
  };
  receiverTypeReverseMapping = {
    [ManifestReceiverTypes.MOVIE]: SimklCatalogType.MOVIES,
    [ManifestReceiverTypes.SERIES]: SimklCatalogType.SHOWS,
    [ManifestReceiverTypes.ANIME]: SimklCatalogType.ANIME,
    [ManifestReceiverTypes.CHANNELS]: SimklCatalogType.SHOWS,
    [ManifestReceiverTypes.TV]: SimklCatalogType.SHOWS,
  };

  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;
  defaultCatalogs = defaultCatalogs;
  liveSyncTypes = liveSyncTypes;
  defaultLiveSyncTypes = defaultLiveSyncTypes;

  cinemetaServerReceiver: CinemetaServerReceiver;
  kitsuAddonServerReceiver: KitsuAddonServerReceiver;
  HAS_INTERNAL_SKIP = false;

  constructor() {
    super();
    this.cinemetaServerReceiver = new CinemetaServerReceiver();
    this.kitsuAddonServerReceiver = new KitsuAddonServerReceiver();
  }

  async getMappingIds(
    id: string,
    source: string,
  ): Promise<RequireAtLeastOne<IDs> | {}> {
    console.log(id, source);
    throw new Error('Method not implemented.');
  }

  async _convertPreviewObjectToMetaPreviewObject(
    previewObject: SimklLibraryListEntry,
    oldType: SimklMCIT['receiverCatalogType'],

    // options?: ManifestCatalogExtraParametersOptions,
    // index?: number,
  ): Promise<MetaPreviewObject> {
    const meta = await this._convertObjectToMetaObject(
      previewObject,
      undefined,
      oldType,
      this.receiverTypeMapping[oldType],
    );

    return {
      id: meta.id,
      type: meta.type,
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

  async _convertObjectToMetaObject(
    object: SimklLibraryListEntry,
    oldIds:
      | PickByArrays<IDs, DeepWriteable<SimklServerReceiver['internalIds']>>
      | undefined,
    oldType: SimklCatalogType,
    potentialType: ManifestReceiverTypes,
  ): Promise<MetaObject> {
    let newIds: RequireAtLeastOne<IDs> | undefined;
    let cinemetaCatalogType;
    let kitsuAddonCatalogType;

    let meta: MetaObject | undefined;

    if ('movie' in object) {
      newIds = object.movie.ids;
      const manifestCatalogType = ManifestReceiverTypes.MOVIE;
      cinemetaCatalogType = CinemetaCatalogType.MOVIE;
      kitsuAddonCatalogType = KitsuAddonCatalogType.ANIME;

      const id = createIDCatalogString(object.movie.ids);
      if (!id) {
        throw new Error('No ID found!');
      }

      const partialMeta = {
        id,
        name: object.movie.title,
        type: manifestCatalogType,
        releaseInfo: yearsToString(object.movie.year, undefined),
        poster: 'https://simkl.in/posters/' + object.movie.poster + '_0.jpg',
        posterShape: 'poster',
        description: buildLibraryObjectUserDescription(object),
      } satisfies MetaObject;
      meta = partialMeta;
    } else if ('show' in object) {
      newIds = object.show.ids;
      const manifestCatalogType = ManifestReceiverTypes.SERIES;
      cinemetaCatalogType = CinemetaCatalogType.SERIES;
      kitsuAddonCatalogType = KitsuAddonCatalogType.ANIME;

      if ('anime_type' in object) {
        if (['movie', 'music video', 'special'].includes(object.anime_type)) {
          cinemetaCatalogType = CinemetaCatalogType.MOVIE;
        }
      }

      const id = createIDCatalogString(object.show.ids);
      if (!id) {
        throw new Error('No ID found!');
      }

      const partialMeta = {
        id,
        name: object.show.title,
        type: manifestCatalogType,
        releaseInfo: object.show.year?.toString() as Year,
        poster: 'https://simkl.in/posters/' + object.show.poster + '_0.jpg',
        posterShape: 'poster',
        description: buildLibraryObjectUserDescription(object),
      } satisfies MetaObject;
      meta = partialMeta;
    }

    if (newIds) {
      let response;

      if (newIds.kitsu && kitsuAddonCatalogType) {
        try {
          const usableIds = newIds as RequireAtLeastOne<IDs> &
            Pick<IDs, IDSources.KITSU>;
          response = await this.kitsuAddonServerReceiver.getMetaObject(
            usableIds,
            kitsuAddonCatalogType,
            potentialType,
          );
        } catch (e) {
          if (e instanceof Error && e.message.includes('Not found')) {
            // Do nothing
          } else if (e instanceof Error && e.message.includes('meta object')) {
            console.log(e.message);
          } else {
            console.error(e);
          }
        }
      }

      if (!response && newIds.imdb && cinemetaCatalogType) {
        // Required to satisfy TypeScript
        const usableIds = newIds as RequireAtLeastOne<IDs> &
          Pick<IDs, IDSources.IMDB>;
        try {
          response = await this.cinemetaServerReceiver.getMetaObject(
            usableIds,
            cinemetaCatalogType,
            potentialType,
          );
        } catch (e) {
          if (e instanceof Error && e.message.includes('Not found')) {
            // Do nothing
          } else if (e instanceof Error && e.message.includes('meta object')) {
            console.log(e.message);
          } else {
            // console.error(e);
          }
        }
      }

      if (response) {
        meta = {
          ...(meta as any),
          ...response,
          trailers: [...(response.trailers ?? []), ...(meta?.trailers ?? [])],
          description: meta?.description + '\n' + (response.description ?? ''),
        };
      }
    }

    if (!meta) {
      throw new Error('No meta found!');
    }

    return meta;
  }

  async _getMetaPreviews(
    type: SimklCatalogType,
    _potentialTypes: SimklCatalogType[],
    status: SimklCatalogStatus,
    options?: ManifestCatalogExtraParametersOptions,
  ): Promise<SimklLibraryListEntry[]> {
    const previews = await getSimklMetaPreviews(
      type,
      status,
      this.userSettings,
    );
    return [
      ...(previews.movies ?? []),
      ...(previews.shows ?? []),
      ...(previews.anime?.filter((o) => {
        if (
          type === SimklCatalogType.ANIME &&
          options?.genre &&
          o.anime_type !== options.genre
        ) {
          return false;
        }
        return true;
      }) ?? []),
    ];
  }

  _getMetaObject(
    ids: PickByArrays<IDs, SimklMCIT['internalIds']>,
    type: SimklMCIT['receiverCatalogType'],
    // potentialTypes: AnilistMCIT['receiverCatalogType'][],
  ): Promise<SimklLibraryListEntry> {
    console.log('SimklServerReceiver -> _getMetaObject -> id', ids, type);
    throw new Error('Method not implemented.');
  }

  async _syncMetaObject(ids: {
    ids: PickByArrays<IDs, SimklMCIT['syncIds']>;
    count:
      | {
          season: number;
          episode: number;
        }
      | undefined;
  }): Promise<void> {
    await syncSimklMetaObject(ids, this.userSettings);
  }
}
