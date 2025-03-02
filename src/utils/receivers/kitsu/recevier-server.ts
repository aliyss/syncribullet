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
import { getAnilistMinimalMetaObject } from './api/meta-object';
import { getKitsuMetaPreviews } from './api/meta-previews';
import { syncAnilistMetaObject } from './api/sync';
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
import type { KitsuCatalogStatus } from './types/catalog/catalog-status';
import { KitsuCatalogType } from './types/catalog/catalog-type';
import type { KitsuLibraryEntry } from './types/kitsu/library-entry';
import type { KitsuMCIT } from './types/manifest';

export class KitsuServerReceiver extends ReceiverServer<KitsuMCIT> {
  internalIds = internalIds;
  syncIds = syncIds;
  receiverTypeMapping = {
    [KitsuCatalogType.MOVIES]: ManifestReceiverTypes.MOVIE,
    [KitsuCatalogType.SHOWS]: ManifestReceiverTypes.SERIES,
    [KitsuCatalogType.ANIME]: ManifestReceiverTypes.ANIME,
  };
  receiverTypeReverseMapping = {
    [ManifestReceiverTypes.MOVIE]: KitsuCatalogType.ANIME,
    [ManifestReceiverTypes.SERIES]: KitsuCatalogType.ANIME,
    [ManifestReceiverTypes.ANIME]: KitsuCatalogType.ANIME,
    [ManifestReceiverTypes.CHANNELS]: KitsuCatalogType.ANIME,
    [ManifestReceiverTypes.TV]: KitsuCatalogType.ANIME,
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
    previewObject: KitsuLibraryEntry,
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
    object: KitsuLibraryEntry,
    // oldIds:
    //   | PickByArrays<IDs, DeepWriteable<AnilistServerReceiver['internalIds']>>
    //   | undefined,
    // oldType: AnilistCatalogType,
    // potentialType: ManifestReceiverTypes,
  ): Promise<MetaObject> {
    // const kitsuAddonCatalogType = KitsuAddonCatalogType.ANIME;

    const newIds = {
      'kitsu-nsfw': object.meta.attributes.nsfw ? object.meta.id : undefined,
      kitsu: object.meta.id,
      ...(await this.getMappingIds(object.meta.id.toString(), IDSources.KITSU)),
    } as RequireAtLeastOne<IDs>;

    const manifestCatalogType =
      object.meta.attributes.showType.toUpperCase() === 'MOVIE'
        ? ManifestReceiverTypes.MOVIE
        : ManifestReceiverTypes.SERIES;

    const id = createIDCatalogString(newIds);

    if (!id) {
      throw new Error('No ID found!');
    }

    const meta: MetaObject | undefined = {
      id,
      name: object.meta.attributes.titles.en,
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
      genres: [],
      imdbRating:
        Math.round(parseFloat(object.meta.attributes.averageRating || '0')) /
        10,
      posterShape: 'poster',
      description: buildLibraryObjectUserDescription(object),
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

    return previews.filter((o) => {
      if (
        type === KitsuCatalogType.ANIME &&
        options?.genre &&
        o.meta.attributes.showType.toUpperCase() !== options.genre.toUpperCase()
      ) {
        return false;
      }
      return true;
    });
  }

  _getMetaObject(
    ids: PickByArrays<IDs, KitsuMCIT['internalIds']>,
    type: KitsuMCIT['receiverCatalogType'],
    // potentialTypes: AnilistMCIT['receiverCatalogType'][],
  ): Promise<KitsuLibraryEntry> {
    console.log('KitsuServerReceiver -> _getMetaObject -> id', ids, type);
    throw new Error('Method not implemented.');
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
    const currentProgressMedia = await getAnilistMinimalMetaObject(
      ids.ids.kitsu,
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
      ids.ids.kitsu,
      status,
      ids.count,
      this.userSettings,
    );
    // throw new Error('Method not implemented.');
  }
}
