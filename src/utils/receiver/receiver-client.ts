import { buildUserConfigBuildFromUserConfigBuildMinifiedStringClients } from '../config/buildReceiversFromUrl';
import { Receiver } from './receiver';
import type { ReceiverMCITypes } from './types/receivers';

export abstract class ReceiverClient<
  MCIT extends ReceiverMCITypes,
> extends Receiver<MCIT> {
  public setUserConfig(
    userSettings: ReceiverClient<MCIT>['userSettings'],
  ): void {
    this._setUserConfig(userSettings);
    localStorage.setItem(
      'user-settings-' + this.receiverInfo.id,
      JSON.stringify(userSettings),
    );
  }

  constructor() {
    super();
    this.userSettings = null;
  }

  public withUserConfig(userConfig: any) {
    this.userSettings =
      buildUserConfigBuildFromUserConfigBuildMinifiedStringClients<any>(
        this,
        userConfig,
      );
    return this;
  }

  public mergeUserConfig(
    userSettings: Partial<ReceiverClient<MCIT>['userSettings']>,
  ): void {
    const existingSettings = this.getUserConfig();

    if (!existingSettings) {
      this.setUserConfig(userSettings as ReceiverClient<MCIT>['userSettings']);
      return;
    }

    this.setUserConfig({
      ...existingSettings,
      ...userSettings,
    });
  }

  public removeUserConfig(): void {
    this.userSettings = null;
    localStorage.removeItem('user-settings-' + this.receiverInfo.id);
  }

  private _loadUserConfig(): ReceiverClient<MCIT>['userSettings'] {
    const data = localStorage.getItem('user-settings-' + this.receiverInfo.id);
    if (data) {
      try {
        this.userSettings = JSON.parse(data);
      } catch {
        this.userSettings = null;
      }
    } else {
      this.userSettings = null;
    }
    return this.userSettings;
  }

  public getUserConfig(): ReceiverClient<MCIT>['userSettings'] {
    if (!this.userSettings) {
      return this._loadUserConfig();
    }
    return this.userSettings;
  }
}
