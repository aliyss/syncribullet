export type ExternalStreamAddon = {
  url: string;
};

export type SyncriBulletGeneralSettingsId = 'syncribullet-settings';

export type GeneralSettings = {
  externalStreamAddons?: ExternalStreamAddon[] | undefined;
};

export type GeneralFormSettings = {
  externalStreamAddons: ExternalStreamAddon[] | undefined;
};
