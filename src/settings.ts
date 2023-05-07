import { storage } from 'webextension-polyfill';

export interface ISettings {
  urls: string[];
}

export class Settings {
  async getSettings(): Promise<ISettings> {
    const settings = (await storage.sync.get()) as ISettings;
    return {
      // TODO: RegExp is not user friendly
      urls: settings.urls ?? ['https://.*/jira/software/projects'],
    };
  }

  async setSettings(settings: ISettings): Promise<void> {
    await storage.sync.set({
      urls: settings.urls,
    });
  }
}
