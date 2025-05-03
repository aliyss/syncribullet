import { Importer } from './importer';
import type { ImporterMCITypes } from './types/importers';

export abstract class ImporterClient<
  MCIT extends ImporterMCITypes,
> extends Importer<MCIT> {
  public setUserConfig(
    userSettings: ImporterClient<MCIT>['userSettings'],
  ): void {
    this._setUserConfig(userSettings);
    localStorage.setItem(
      'importer-settings-' + this.importerInfo.id,
      JSON.stringify(userSettings),
    );
  }

  constructor() {
    super();
    this.userSettings = null;
  }

  public mergeUserConfig(
    userSettings: Partial<ImporterClient<MCIT>['userSettings']>,
  ): void {
    const existingSettings = this.getUserConfig();

    if (!existingSettings) {
      this.setUserConfig(userSettings as ImporterClient<MCIT>['userSettings']);
      return;
    }

    this.setUserConfig({
      ...existingSettings,
      ...userSettings,
    });
  }

  public removeUserConfig(): void {
    this.userSettings = null;
    localStorage.removeItem('importer-settings-' + this.importerInfo.id);
  }

  private _loadUserConfig(): ImporterClient<MCIT>['userSettings'] {
    const data = localStorage.getItem(
      'importer-settings-' + this.importerInfo.id,
    );
    if (data) {
      try {
        this.userSettings = JSON.parse(data);
      } catch (e) {
        this.userSettings = null;
      }
    } else {
      this.userSettings = null;
    }
    return this.userSettings;
  }

  public getUserConfig(): ImporterClient<MCIT>['userSettings'] {
    if (!this.userSettings) {
      return this._loadUserConfig();
    }
    return this.userSettings;
  }
}
