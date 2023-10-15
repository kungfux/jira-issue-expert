import { Settings } from './settings';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Log {
  private static readonly tag = '[IssueExpert]';

  public static async info(message: string): Promise<void> {
    const settings = await new Settings().getSettings();
    if (settings.enableDebugMode) {
      console.log(`${this.tag} ${message}`);
    }
  }

  public static async error(message: string): Promise<void> {
    const settings = await new Settings().getSettings();
    if (settings.enableDebugMode) {
      console.error(`${this.tag} ${message}`);
    }
  }
}
