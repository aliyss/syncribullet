import type {
  AllImporters,
  ImporterMCITypes,
  Importers,
} from './types/importers';
import type { UserSettings } from './types/user-settings/settings';

export interface ImporterInfoBase<R extends AllImporters> {
  id: R;
  text: string;
}

export interface ImporterInfo<R extends Importers> extends ImporterInfoBase<R> {
  icon: string;
  backgroundColour: string;
  borderColour: string;
}

export abstract class ImporterBase<R extends AllImporters> {
  public abstract importerInfo: R extends Importers
    ? ImporterInfo<R>
    : ImporterInfoBase<R>;
}

export abstract class Importer<
  MCIT extends ImporterMCITypes,
> extends ImporterBase<MCIT['importerType']> {
  public userSettings: UserSettings<MCIT> | null = null;

  public _setUserConfig(userSettings: Importer<MCIT>['userSettings']): void {
    this.userSettings = userSettings;
  }

  abstract setUserConfig(userSettings: Importer<MCIT>['userSettings']): void;
}
