export interface ISettings {
  urls: string[];
}

export class Settings {
  getSettings(): ISettings {
    return {
      // TODO: RegExp is not user friendly
      urls: ['https://.*.atlassian.net/jira/software/projects'],
    };
  }
}
