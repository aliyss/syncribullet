import type {
  DeepWriteable,
  PickByArrays,
  RequireAtLeastOne,
  Year,
} from '~/utils/helpers/types';
import { ManifestReceiverTypes } from '~/utils/manifest';
import { ReceiverServer } from '~/utils/receiver/receiver-server';
import { type IDs, createIDCatalogString } from '~/utils/receiver/types/id';
import type { MetaObject } from '~/utils/receiver/types/meta-object';
import type { MetaPreviewObject } from '~/utils/receiver/types/meta-preview-object';
import type { IDSources } from '~/utils/simkl/validate';

import { CinemetaServerReceiver } from '../cinemeta/receiver-server';
import { CinemetaCatalogType } from '../cinemeta/types/catalog/catalog-type';
import { getSimklMetaPreviews } from './api/meta-previews';
import {
  defaultCatalogs,
  defaultLiveSyncTypes,
  internalIds,
  liveSyncTypes,
  manifestCatalogItems,
  receiverInfo,
} from './constants';
import { buildMovieUserDescription } from './meta/description';
import type { SimklCatalogStatus } from './types/catalog/catalog-status';
import { SimklCatalogType } from './types/catalog/catalog-type';
import type { SimklMCIT } from './types/manifest';
import type { SimklLibraryListEntry } from './types/simkl/library';

export class SimklServerReceiver extends ReceiverServer<SimklMCIT> {
  internalIds = internalIds;
  receiverTypeMapping = {
    [SimklCatalogType.MOVIES]: ManifestReceiverTypes.MOVIE,
    [SimklCatalogType.SHOWS]: ManifestReceiverTypes.SERIES,
    [SimklCatalogType.ANIME]: ManifestReceiverTypes.ANIME,
  };

  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;
  defaultCatalogs = defaultCatalogs;
  liveSyncTypes = liveSyncTypes;
  defaultLiveSyncTypes = defaultLiveSyncTypes;

  cinemetaServerReceiver: CinemetaServerReceiver;

  constructor() {
    super();
    this.cinemetaServerReceiver = new CinemetaServerReceiver();
  }

  getMappingIds(id: string, source: string): Promise<IDs> {
    console.log(id, source);
    throw new Error('Method not implemented.');
  }

  async _convertPreviewObjectToMetaPreviewObject(
    previewObject: SimklLibraryListEntry,
    oldType: SimklMCIT['receiverCatalogType'],

    // options?: ManifestCatalogExtraParametersOptions,
    // index?: number,
  ): Promise<MetaPreviewObject> {
    return await this._convertObjectToMetaObject(
      previewObject,
      undefined,
      oldType,
      this.receiverTypeMapping[oldType],
    );
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
    let catalogType;

    let meta: MetaObject | undefined;

    if ('movie' in object) {
      newIds = object.movie.ids;
      catalogType = CinemetaCatalogType.MOVIE;

      const id = createIDCatalogString(object.movie.ids);
      if (!id) {
        throw new Error('No ID found!');
      }

      const partialMeta = {
        id,
        name: object.movie.title,
        type: ManifestReceiverTypes.MOVIE,
        releaseInfo: object.movie.year.toString() as Year,
        poster: 'https://simkl.in/posters/' + object.movie.poster + '_0.jpg',
        posterShape: 'poster',
        imdbRating: object.user_rating ?? undefined,
        trailers: [
          {
            name: 'Open Simkl',
            description: 'Open Page in Simkl',
            externalUrl: `https://simkl.com/movies/${object.movie.ids.simkl}`,
          },
        ],
        description: buildMovieUserDescription(object),
      } satisfies MetaObject;
      meta = partialMeta;
    } else if ('show' in object) {
      newIds = object.show.ids;
      catalogType = CinemetaCatalogType.SERIES;

      const id = createIDCatalogString(object.show.ids);
      if (!id) {
        throw new Error('No ID found!');
      }
      throw new Error('Method not implemented.');
    }

    if (newIds && catalogType && newIds.imdb) {
      // Required to satisfy TypeScript
      const usableIds = newIds as RequireAtLeastOne<IDs> &
        Pick<IDs, IDSources.IMDB>;
      const response = await this.cinemetaServerReceiver.getMetaObject(
        usableIds,
        catalogType,
        potentialType,
      );
      meta = {
        imdbRating: object.user_rating ?? undefined,
        trailers: [
          {
            name: 'Open Simkl',
            description: 'Open Page in Simkl',
            externalUrl: `https://simkl.com/movies/${object.movie.ids.simkl}`,
          },
          ...(response.trailers ?? []),
        ],
        description: meta?.description + '\n' + response.description,
        ...response,
      };
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
    // _options?: ManifestCatalogExtraParametersOptions,
  ): Promise<SimklLibraryListEntry[]> {
    const previews = await getSimklMetaPreviews(
      type,
      status,
      this.userSettings,
    );
    return [
      ...(previews.movies ?? []),
      ...(previews.shows ?? []),
      ...(previews.anime ?? []),
    ];
  }

  _getMetaObject(
    ids: IDs,
    type: SimklMCIT['receiverCatalogType'],
    // potentialTypes: AnilistMCIT['receiverCatalogType'][],
  ): Promise<SimklLibraryListEntry> {
    console.log('SimklServerReceiver -> _getMetaObject -> id', ids, type);
    throw new Error('Method not implemented.');
  }
}
