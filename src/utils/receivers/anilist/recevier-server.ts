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

import { KitsuAddonServerReceiver } from '../kitsu-addon/receiver-server';
import { KitsuAddonCatalogType } from '../kitsu-addon/types/catalog/catalog-type';
import { getAnilistCurrentUser } from './api/current-user';
import { getAnilistMetaPreviews } from './api/meta-previews';
import {
  defaultCatalogs,
  defaultLiveSyncTypes,
  internalIds,
  liveSyncTypes,
  manifestCatalogItems,
  receiverInfo,
} from './constants';
import type { AnilistLibraryListEntry } from './types/anilist/library';
import type { AnilistCatalogStatus } from './types/catalog/catalog-status';
import { AnilistCatalogType } from './types/catalog/catalog-type';
import type { AnilistMCIT } from './types/manifest';

export class AnilistServerReceiver extends ReceiverServer<AnilistMCIT> {
  internalIds = internalIds;
  receiverTypeMapping = {
    [AnilistCatalogType.MOVIES]: ManifestReceiverTypes.MOVIE,
    [AnilistCatalogType.SHOWS]: ManifestReceiverTypes.SERIES,
    [AnilistCatalogType.ANIME]: ManifestReceiverTypes.ANIME,
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

  getMappingIds(id: string, source: string): Promise<IDs> {
    console.log(id, source);
    throw new Error('Method not implemented.');
  }

  async _convertPreviewObjectToMetaPreviewObject(
    previewObject: AnilistLibraryListEntry,
    oldType: AnilistMCIT['receiverCatalogType'],
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
    object: AnilistLibraryListEntry,
    oldIds:
      | PickByArrays<IDs, DeepWriteable<AnilistServerReceiver['internalIds']>>
      | undefined,
    oldType: AnilistCatalogType,
    potentialType: ManifestReceiverTypes,
  ): Promise<MetaObject> {
    const kitsuAddonCatalogType = KitsuAddonCatalogType.ANIME;

    const newIds = {
      anilist: object.media.id,
      mal: object.media.idMal,
    } as RequireAtLeastOne<IDs> &
      Pick<IDs, IDSources.ANILIST | IDSources.MAL | IDSources.KITSU>;

    const id = createIDCatalogString(newIds);

    if (!id) {
      throw new Error('No ID found!');
    }

    let meta: MetaObject | undefined = {
      id,
      name:
        object.media.title.userPreferred ??
        object.media.title.english ??
        object.media.title.native,
      type: ManifestReceiverTypes.ANIME,
      releaseInfo: object.media.startDate?.year
        ? ((object.media.startDate.year.toString() +
            '-' +
            (object.media.endDate?.year
              ? object.media.endDate.year.toString()
              : '')) as Year)
        : undefined,
      poster: object.media.coverImage.large,
      genres: [...object.media.genres, ...object.media.tags.map((o) => o.name)],
      imdbRating: object.media.averageScore / 10,
      posterShape: 'poster',
      description: object.media.description,
    } satisfies MetaObject;

    if (id) {
      let response;

      if (newIds.kitsu) {
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

      if (response) {
        meta = {
          ...(meta as any),
          ...response,
          trailers: [...(response.trailers ?? []), ...(meta.trailers ?? [])],
          description: meta.description + '\n' + (response.description ?? ''),
        };
      }
    }

    if (!meta) {
      throw new Error('No meta found!');
    }

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
        o.media.format !== options.genre.toUpperCase()
      ) {
        return false;
      }
      return true;
    });
  }

  _getMetaObject(
    ids: IDs,
    type: AnilistMCIT['receiverCatalogType'],
    // potentialTypes: AnilistMCIT['receiverCatalogType'][],
  ): Promise<AnilistLibraryListEntry> {
    console.log('SimklServerReceiver -> _getMetaObject -> id', ids, type);
    throw new Error('Method not implemented.');
  }
}
