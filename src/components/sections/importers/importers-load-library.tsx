import { component$, useSignal, useStore } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import { Button } from '~/components/buttons/button';
import { ChevronDown } from '~/components/icons/chevron';

import { exists } from '~/utils/helpers/array';
import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import type { ImporterClients } from '~/utils/importer/types/importers';
import { ManifestReceiverTypes } from '~/utils/manifest';
import type {
  ReceiverClients,
  ReceiverMCITypes,
} from '~/utils/receiver/types/receivers';

import { ImportersSettingsView } from './importers-settings';

export interface ManifestSettingsProps<
  R extends KnownNoSerialize<ReceiverClients>,
  T extends KnownNoSerialize<ImporterClients>,
> {
  currentReceiver: R;
  currentImporter: T;
  importedCatalogs: Awaited<ReturnType<T['loadLibraryDiff']>>;
  receiverCatalogItems: Awaited<
    ReturnType<NonNullable<R['importer']>['loadLibraryDiff']>
  >;
  libraryDiff: Awaited<ReturnType<T['sortLibraryDiff']>>;
  updateView$: PropFunction<(view: ImportersSettingsView) => void>;
}

export default component$(
  <
    R extends KnownNoSerialize<ReceiverClients>,
    T extends KnownNoSerialize<ImporterClients>,
  >({
    libraryDiff,
    currentReceiver,
    currentImporter,
    updateView$,
  }: ManifestSettingsProps<R, T>) => {
    const hideCatalogItems = useSignal<
      (typeof currentReceiver.manifestCatalogItems)[number]['id'][]
    >([]);

    const hasAnimeCatalogs = currentReceiver.manifestCatalogItems.some(
      (x) => x.type === ManifestReceiverTypes.ANIME,
    );

    const userDiff = useStore<
      Record<
        string,
        | {
            item: (typeof libraryDiff)[number]['items'][number]['diffItem'];
            catalogId: (typeof libraryDiff)[number]['id'] | 'no-sync';
          }
        | undefined
      >
    >({});

    return (
      <div>
        <div class="flex flex-col gap-2 items-start text-on-background w-full overflow-scroll max-h-[calc(100vh-450px)]">
          {currentReceiver.manifestCatalogItems.map((catalogInfo) => {
            const catalog = libraryDiff.find((x) => x.id === catalogInfo.id);
            return (
              <div key={catalogInfo.id} class="flex flex-col gap-2 w-full">
                <div class="flex flex-row gap-2 w-full items-center sticky top-0 bg-secondary-container text-info py-2 justify-start">
                  <button
                    onClick$={() => {
                      hideCatalogItems.value = hideCatalogItems.value.includes(
                        catalogInfo.id,
                      )
                        ? hideCatalogItems.value.filter(
                            (x) => x !== catalogInfo.id,
                          )
                        : [...hideCatalogItems.value, catalogInfo.id];
                    }}
                    class="flex flex-row gap-2 items-center"
                  >
                    <ChevronDown
                      class={`w-4 h-4 transition-transform duration-200 ${hideCatalogItems.value.includes(catalogInfo.id) ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <h4 class="text-lg font-bold w-full text-start">
                    {catalogInfo.name} ({catalogInfo.type})
                  </h4>
                </div>
                <div class="flex flex-col gap-2 w-full">
                  {!hideCatalogItems.value.includes(catalogInfo.id) &&
                    catalog?.items.map((diff) => {
                      const item = diff.diffItem;
                      const diff2Item = diff.diff2Item;

                      return (
                        <div
                          key={item.info.id}
                          class="flex flex-row gap-2 w-full"
                        >
                          <div class="pt-1">
                            {item.info.posterUrl ? (
                              <img
                                width={50}
                                height={75}
                                src={item.info.posterUrl}
                                class="bg-secondary/20 rounded-md h-[75px] w-[50px] min-w-[50px] min-h-[75px]"
                                alt=""
                              />
                            ) : (
                              <div class="w-[50px] h-[75px] bg-secondary/20 rounded-md min-w-[50px] min-h-[75px]" />
                            )}
                          </div>
                          <div class="flex-col gap-2 items-start h-full justify-between text-start w-full">
                            <p class="text-base font-bold line-clamp-1 overflow-hidden">
                              {item.info.name || item.info.id}
                            </p>
                            <div class="flex flex-row w-full justify-between">
                              <p class="text-sm">Last Modified:</p>
                              <p class="text-sm font-mono">
                                {
                                  item.metadata.modified
                                    .toISOString()
                                    .split('T')
                                    .join(' ')
                                    .split('.')[0]
                                }

                                <span class="text-info invisible">
                                  {' '}
                                  (Newer)
                                </span>
                              </p>
                            </div>
                            {item.metadata.last_watched && (
                              <div class="flex flex-row w-full justify-between">
                                <p class="text-sm">Last Watched:</p>
                                <p class="text-sm font-mono">
                                  {
                                    item.metadata.last_watched
                                      .toISOString()
                                      .split('T')
                                      .join(' ')
                                      .split('.')[0]
                                  }

                                  <span class="text-info invisible">
                                    {' '}
                                    (Newer)
                                  </span>
                                </p>
                              </div>
                            )}
                            {diff2Item?.metadata.last_watched && (
                              <div class="flex flex-row w-full justify-between">
                                <p class="text-sm">
                                  Last Watched:{' '}
                                  <span class="text-tertiary">
                                    (in library)
                                  </span>
                                </p>
                                <p class={`text-sm font-mono`}>
                                  <span
                                    class={`${item.metadata.last_watched && diff2Item.metadata.last_watched > item.metadata.last_watched ? 'text-info' : ''}`}
                                  >
                                    {
                                      diff2Item.metadata.last_watched
                                        .toISOString()
                                        .split('T')
                                        .join(' ')
                                        .split('.')[0]
                                    }
                                  </span>
                                  <span
                                    class={`${item.metadata.last_watched && diff2Item.metadata.last_watched > item.metadata.last_watched ? 'visible' : 'invisible'} text-info`}
                                  >
                                    {' '}
                                    (Newer)
                                  </span>
                                </p>
                              </div>
                            )}
                            <p class={`text-sm pt-2`}>
                              ID:{' '}
                              <span
                                class={`${diff2Item ? 'text-tertiary' : 'text-success'}`}
                              >
                                {item.info.id}
                              </span>
                              {!diff2Item && (
                                <span class="text-success"> (New)</span>
                              )}
                            </p>
                            <p class="text-sm line-clamp-1 overflow-hidden w-full">
                              Other IDs:{' '}
                              {Object.values(item.id)
                                .filter((x) => x !== item.info.id)
                                .join(', ') || 'N/A'}
                            </p>
                            {item.info.maybeAnime && hasAnimeCatalogs && (
                              <p class="text-sm">Type: {item.info.type}</p>
                            )}
                            {item.info.series && (
                              <>
                                {diff2Item?.info.seriesFullCount?.episode && (
                                  <div class="flex flex-row w-full gap-1">
                                    <p class="text-sm">
                                      Total Episodes:{' '}
                                      {[
                                        diff2Item.info.seriesFullCount
                                          .episode || 0,
                                      ].join(' / ')}
                                    </p>
                                  </div>
                                )}
                                <div class="flex flex-row gap-2 items-center py-2 w-full">
                                  {diff2Item?.info.series && (
                                    <div class="flex flex-row gap-2 items-center py-2">
                                      <div class="flex flex-col">
                                        <div class="flex flex-row w-full justify-between gap-1">
                                          <p class="text-sm">Season:</p>
                                          <input
                                            class="text-sm bg-transparent"
                                            disabled={true}
                                            value={[
                                              diff2Item.info.series.season || 1,
                                            ].join(' / ')}
                                          />
                                        </div>
                                        <div class="flex flex-row w-full justify-between gap-1">
                                          <p class="text-sm">Episode:</p>
                                          <input
                                            class="text-sm bg-transparent"
                                            disabled={true}
                                            value={[
                                              diff2Item.info.series.episode ||
                                                1,
                                            ].join(' / ')}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <div class="flex flex-col w-full">
                                    <div class="flex flex-row w-full justify-between gap-1">
                                      <p
                                        class={`text-sm ${
                                          (userDiff[item.info.id]?.item.info
                                            .series?.season ||
                                            item.info.series.season ||
                                            0) -
                                            (diff2Item?.info.series?.season ||
                                              0) >=
                                          0
                                            ? (userDiff[item.info.id]?.item.info
                                                .series?.season ||
                                                item.info.series.season ||
                                                0) -
                                                (diff2Item?.info.series
                                                  ?.season || 0) >
                                              0
                                              ? 'text-success'
                                              : ''
                                            : 'text-error'
                                        }`}
                                      >
                                        Season:
                                      </p>
                                      <input
                                        class={`text-sm ${userDiff[item.info.id] && userDiff[item.info.id]?.item.info.series?.season !== item.info.series.season ? 'bg-warning' : 'bg-secondary/20'}`}
                                        value={
                                          userDiff[item.info.id]?.item.info
                                            .series?.season ||
                                          item.info.series.season ||
                                          0
                                        }
                                        type="number"
                                        min={0}
                                        step={1}
                                        onChange$={(e) => {
                                          if (
                                            !e.target ||
                                            !('value' in e.target)
                                          ) {
                                            return;
                                          }
                                          const value = parseInt(
                                            (
                                              e.target.value as string
                                            ).toString() as string,
                                          );
                                          if (isNaN(value)) {
                                            return;
                                          }
                                          userDiff[item.info.id] = {
                                            ...(userDiff[item.info.id] || {
                                              catalogId: catalog.id,
                                            }),
                                            item: {
                                              ...(userDiff[item.info.id]
                                                ?.item || item),
                                              info: {
                                                ...(userDiff[item.info.id]?.item
                                                  .info || item.info),
                                                series: {
                                                  ...(userDiff[item.info.id]
                                                    ?.item.info.series ||
                                                    item.info.series!),
                                                  season: value,
                                                  cinemeta:
                                                    userDiff[item.info.id]?.item
                                                      .info.series?.cinemeta ||
                                                    item.info.series?.cinemeta,
                                                },
                                              },
                                            },
                                          };
                                        }}
                                      />
                                    </div>
                                    <div class="flex flex-row w-full justify-between gap-1">
                                      <p
                                        class={`text-sm ${
                                          (userDiff[item.info.id]?.item.info
                                            .series?.season ||
                                            item.info.series.season ||
                                            0) -
                                            (diff2Item?.info.series?.season ||
                                              0) ==
                                            0 &&
                                          (userDiff[item.info.id]?.item.info
                                            .series?.episode ||
                                            item.info.series.episode ||
                                            0) -
                                            (diff2Item?.info.series?.episode ||
                                              0) >=
                                            0
                                            ? (userDiff[item.info.id]?.item.info
                                                .series?.episode ||
                                                item.info.series.episode ||
                                                0) -
                                                (diff2Item?.info.series
                                                  ?.episode || 0) >
                                              0
                                              ? 'text-success'
                                              : ''
                                            : (userDiff[item.info.id]?.item.info
                                                  .series?.season ||
                                                  item.info.series.season ||
                                                  0) -
                                                  (diff2Item?.info.series
                                                    ?.season || 0) ==
                                                0
                                              ? 'text-error'
                                              : ''
                                        }`}
                                      >
                                        Episode:
                                      </p>
                                      <input
                                        class={`text-sm ${userDiff[item.info.id] && userDiff[item.info.id]?.item.info.series?.episode !== item.info.series.episode ? 'bg-warning' : 'bg-secondary/20'}`}
                                        value={
                                          userDiff[item.info.id]?.item.info
                                            .series?.episode ||
                                          item.info.series.episode ||
                                          0
                                        }
                                        type="number"
                                        min={0}
                                        step={1}
                                        onChange$={(e) => {
                                          if (
                                            !e.target ||
                                            !('value' in e.target)
                                          ) {
                                            return;
                                          }
                                          const value = parseInt(
                                            (
                                              e.target.value as string
                                            ).toString() as string,
                                          );
                                          if (isNaN(value)) {
                                            return;
                                          }
                                          userDiff[item.info.id] = {
                                            ...(userDiff[item.info.id] || {
                                              catalogId: catalog.id,
                                            }),
                                            item: {
                                              ...(userDiff[item.info.id]
                                                ?.item || item),
                                              info: {
                                                ...(userDiff[item.info.id]?.item
                                                  .info || item.info),
                                                series: {
                                                  ...(userDiff[item.info.id]
                                                    ?.item.info.series ||
                                                    item.info.series),
                                                  episode: value,
                                                  cinemeta:
                                                    userDiff[item.info.id]?.item
                                                      .info.series?.cinemeta ||
                                                    item.info.series?.cinemeta,
                                                },
                                              },
                                            },
                                          };
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <div class="flex flex-col w-full gap-1 pt-2">
                              {item.info.currentLibrary && (
                                <div class="flex flex-row w-full gap-1">
                                  <p class="text-sm font-mono w-[80px]">
                                    Current:
                                  </p>
                                  <select
                                    value={
                                      currentReceiver.manifestCatalogItems.find(
                                        (x) =>
                                          x.id ===
                                          `${'syncribullet'}-${currentReceiver.receiverInfo.id}-${currentReceiver.receiverTypeReverseMapping[catalogInfo.type]}-${item.info.currentLibrary}`,
                                      )?.id
                                    }
                                    class="bg-secondary/10 truncate w-full"
                                    disabled={true}
                                  >
                                    {currentReceiver.manifestCatalogItems
                                      .filter(
                                        (x) =>
                                          x.id ===
                                          `${'syncribullet'}-${currentReceiver.receiverInfo.id}-${currentReceiver.receiverTypeReverseMapping[catalogInfo.type]}-${item.info.currentLibrary}`,
                                      )
                                      .map((catalog) => {
                                        const catalogName =
                                          catalog.name +
                                          ' (' +
                                          catalog.type +
                                          ')';
                                        return (
                                          <option
                                            value={catalog.id}
                                            key={catalog.id}
                                          >
                                            {catalogName}
                                          </option>
                                        );
                                      })}
                                  </select>
                                </div>
                              )}
                              <div class="flex flex-row w-full gap-1">
                                <p class="text-sm font-mono w-[80px]">
                                  Updated:
                                </p>
                                <select
                                  value={
                                    userDiff[item.info.id]?.catalogId ||
                                    catalog.id
                                  }
                                  class={`truncate w-full ${userDiff[item.info.id] && userDiff[item.info.id]?.catalogId !== catalog.id ? 'bg-warning' : 'bg-secondary/20'}`}
                                  onChange$={(e) => {
                                    if (!e.target || !('value' in e.target)) {
                                      return;
                                    }
                                    const selectedCatalogId = e.target.value as
                                      | (typeof libraryDiff)[number]['id']
                                      | 'no-sync';

                                    userDiff[item.info.id] = {
                                      ...(userDiff[item.info.id] || {
                                        item,
                                      }),
                                      catalogId: selectedCatalogId,
                                    };
                                  }}
                                >
                                  {currentReceiver.manifestCatalogItems
                                    .filter(
                                      (x) =>
                                        x.type === catalogInfo.type ||
                                        x.type === item.info.type,
                                    )
                                    .map((catalog) => {
                                      const catalogName =
                                        catalog.name +
                                        ' (' +
                                        catalog.type +
                                        ')';
                                      return (
                                        <option
                                          value={catalog.id}
                                          key={catalog.id}
                                        >
                                          {catalogName}
                                        </option>
                                      );
                                    })}
                                  <option value={'no-sync'} key={'no-sync'}>
                                    Don't Sync
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
        <div class="flex flex-col gap-2 pt-4">
          <div>
            <Button
              type="button"
              class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline text-on-primary`}
              backgroundColour="bg-primary"
              borderColour="border-primary"
              onClick$={async () => {
                const libraryItems: {
                  item: (typeof libraryDiff)[number]['items'][number]['diffItem'];
                  catalogId: [
                    ReceiverMCITypes['receiverType'],
                    ReceiverMCITypes['receiverCatalogType'],
                    ReceiverMCITypes['receiverCatalogStatus'],
                  ];
                  originalCatalogId: (typeof libraryDiff)[number]['id'];
                  hasBeenModified: boolean;
                }[] = [];
                libraryDiff.forEach((catalog) => {
                  libraryItems.push(
                    ...catalog.items
                      .map((item) => {
                        const userDiffItem = userDiff[item.diffItem.info.id];
                        if (!userDiffItem) {
                          return {
                            item: item.diffItem,
                            catalogId:
                              currentReceiver.getManifestCatalogIdParsed(
                                catalog.id,
                              ),
                            originalCatalogId: catalog.id,
                            hasBeenModified: false,
                          };
                        }
                        if (userDiffItem.catalogId === 'no-sync') {
                          return;
                        }
                        return {
                          item: userDiffItem.item,
                          catalogId: currentReceiver.getManifestCatalogIdParsed(
                            userDiffItem.catalogId,
                          ),
                          originalCatalogId: userDiffItem.catalogId,
                          hasBeenModified: true,
                        };
                      })
                      .filter(exists),
                  );
                });

                const userConfig = currentReceiver.getUserConfig();
                if (!userConfig) {
                  throw new Error('User config not found');
                }
                try {
                  await currentReceiver.importer?.startImport(
                    libraryItems,
                    userConfig,
                    currentImporter,
                  );
                  const newUserConfig: typeof userConfig = {
                    ...userConfig,
                    lastImportSync: {
                      stremio: {},
                      simkl: {},
                      ...userConfig.lastImportSync,
                      [currentImporter.importerInfo.id]: {
                        ...userConfig.lastImportSync?.[
                          currentImporter.importerInfo.id
                        ],
                        lastImport: new Date().getTime().toString(),
                      },
                    },
                  };
                  currentReceiver.mergeUserConfig(newUserConfig);
                  alert(
                    'Import completed successfully! Please check the console for details on potential errors.',
                  );
                } catch (error) {
                  console.error('Error starting import:', error);
                  alert(
                    'An error occurred while starting the import. Please check the console for details.',
                  );
                }
                updateView$(ImportersSettingsView.SETTINGS);
              }}
            >
              Start Import
            </Button>
          </div>
        </div>
      </div>
    );
  },
);
