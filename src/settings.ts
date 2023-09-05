import { storage } from 'webextension-polyfill';

export interface ISettings {
  urls: string[];
  enableDebugMode: boolean;
}

export class Settings {
  public async getSettings(): Promise<ISettings> {
    const settings = (await storage.sync.get()) as ISettings;
    return {
      // TODO: RegExp is not user friendly
      urls:
        settings.urls !== undefined && settings.urls.length > 0
          ? settings.urls
          : ['/secure/RapidBoard.jspa', '/browse/(\\w+-\\d+)'],
      enableDebugMode: settings.enableDebugMode ?? false,
    };
  }

  public async setSettings(settings: ISettings): Promise<void> {
    await storage.sync.set({
      urls: settings.urls,
      enableDebugMode: settings.enableDebugMode,
    });
  }

  public onChanged(callback: () => void): void {
    if (!storage.onChanged.hasListener(callback)) {
      storage.onChanged.addListener(() => {
        callback();
      });
    }
  }
}
