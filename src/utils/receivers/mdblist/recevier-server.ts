import type { PickByArrays, RequireAtLeastOne, Year } from '~/utils/helpers/types';
import { ManifestReceiverTypes } from '~/utils/manifest';
import { ReceiverServer } from '~/utils/receiver/receiver-server';
import type { IDSources, IDs } from '~/utils/receiver/types/id';
import { createIDCatalogString } from '~/utils/receiver/types/id';
import type { ManifestCatalogExtraParametersOptions } from '~/utils/receiver/types/manifest-types';
import type { MetaObject } from '~/utils/receiver/types/meta-object';
import type { MetaPreviewObject } from '~/utils/receiver/types/meta-preview-object';

import { CinemetaServerReceiver } from '../cinemeta/receiver-server';
import { CinemetaCatalogType } from '../cinemeta/types/catalog/catalog-type';
import type { MDBListLibrary } from './api/meta-previews';
import { getMDBListMetaPreviews } from './api/meta-previews';
import { syncMDBListMetaObject } from './api/sync';
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
import type { MDBListCatalogStatus } from './types/catalog/catalog-status';
import type { MDBListCatalogType } from './types/catalog/catalog-type';
import type { MDBListMCIT } from './types/manifest';

export class MDBListServerReceiver extends ReceiverServer<MDBListMCIT> {
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

  cinemetaServerReceiver: CinemetaServerReceiver;
  HAS_INTERNAL_SKIP = false;

  constructor() {
    super();
    this.cinemetaServerReceiver = new CinemetaServerReceiver();
  }

  async getMappingIds(
    id: string,
    source: string,
  ): Promise<RequireAtLeastOne<IDs> | {}> {
    console.log(id, source);
    throw new Error('Method not implemented.');
  }

  async _convertPreviewObjectToMetaPreviewObject(
    previewObject: MDBListLibrary['movies'][number] | MDBListLibrary['shows'][number],
    oldType: MDBListMCIT['receiverCatalogType'],
    _options?: ManifestCatalogExtraParametersOptions,
    _index?: number,
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
    object: MDBListLibrary['movies'][number] | MDBListLibrary['shows'][number],
    _oldIds:
      | PickByArrays<IDs, MDBListMCIT['internalIds']>
      | undefined,
    _oldType: MDBListMCIT['receiverCatalogType'],
    potentialType: ManifestReceiverTypes,
  ): Promise<MetaObject> {
    const isMovie = object.mediatype === 'movie';
    const type: ManifestReceiverTypes = isMovie
      ? ManifestReceiverTypes.MOVIE
      : ManifestReceiverTypes.SERIES;

    const cinemetaCatalogType = isMovie
      ? CinemetaCatalogType.MOVIE
      : CinemetaCatalogType.SERIES;

    // Build IDs object from MDBList data
    const newIds: Partial<IDs> = {};
    if (object.imdb_id) {
      newIds.imdb = object.imdb_id;
    }
    if (object.tvdb_id) {
      newIds.tvdb = object.tvdb_id;
    }
    if ('tmdb_id' in object && object.tmdb_id) {
      newIds.tmdb = object.tmdb_id;
    }
    // Note: mdblist_id is a string in API but IDs type expects number, so we skip it
    // TMDB should be sufficient for most lookups

    const id = createIDCatalogString(newIds);
    if (!id) {
      throw new Error('No ID found!');
    }

    // Format release year
    const releaseInfo = object.release_year
      ? (object.release_year.toString().padStart(4, '0') as Year)
      : undefined;

    // Extract IMDB rating from ratings array if available
    const imdbRating = object.ratings?.find(
      (r) => r.source === 'imdb',
    )?.value?.toFixed(1);

    // Create partial meta with MDBList data
    const partialMeta = {
      id,
      name: object.title,
      type,
      releaseInfo,
      poster: object.poster || undefined,
      description: object.description,
      genres: object.genres,
      imdbRating,
    } satisfies Partial<MetaObject> as MetaObject;

    let meta: MetaObject = partialMeta;

    // Enrich with Cinemeta data only if we have IMDB ID (Cinemeta requirement)
    if (newIds.imdb) {
      let response;
      try {
        const usableIds = newIds as RequireAtLeastOne<IDs> &
          Pick<IDs, IDSources.IMDB>;
        response = await this.cinemetaServerReceiver.getMetaObject(
          usableIds,
          cinemetaCatalogType,
          potentialType,
        );
      } catch (e) {
        if (e instanceof Error && e.message.includes('Not found')) {
          // Cinemeta doesn't have this content, use MDBList data only
        } else if (e instanceof Error && e.message.includes('meta object')) {
          console.error(e.message);
        } else {
          // console.error(e);
        }
      }

      if (response) {
        meta = {
          ...(meta as any),
          ...response,
          // Preserve MDBList-specific fields if they exist
          description: meta.description
            ? meta.description + '\n' + (response.description ?? '')
            : response.description,
          genres: [...(meta.genres ?? []), ...(response.genres ?? [])],
          imdbRating: meta.imdbRating || response.imdbRating,
        };
      }
    }
    // Note: Items without IMDB IDs (fallback) will use MDBList data without Cinemeta enrichment

    if (!meta) {
      throw new Error('No meta found!');
    }

    return meta;
  }

  async _getMetaPreviews(
    type: MDBListCatalogType,
    _potentialTypes: MDBListCatalogType[],
    status: MDBListCatalogStatus,
    _options?: ManifestCatalogExtraParametersOptions,
  ): Promise<any[]> {
    const previews = await getMDBListMetaPreviews(
      type,
      status,
      this.userSettings,
    );

    // Combine movies and shows, sort by date
    const combined = [
      ...(previews.movies ?? []),
      ...(previews.shows ?? []),
    ].sort((a, b) => {
      const dateA = a.watchlist_at || '';
      const dateB = b.watchlist_at || '';
      return dateB.localeCompare(dateA);
    });

    return combined;
  }

  _getMetaObject(
    ids: PickByArrays<IDs, MDBListMCIT['syncIds']>,
    type: MDBListMCIT['receiverCatalogType'],
  ): Promise<any> {
    console.log('MDBListServerReceiver -> _getMetaObject -> id', ids, type);
    throw new Error('Method not implemented.');
  }

  async _syncMetaObject(ids: {
    ids: PickByArrays<IDs, MDBListMCIT['syncIds']>;
    count:
      | {
          season: number;
          episode: number;
        }
      | undefined;
  }): Promise<void> {
    await syncMDBListMetaObject(ids, this.userSettings);
  }
}
