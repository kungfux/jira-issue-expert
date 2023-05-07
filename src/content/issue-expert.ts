import { Settings } from '../settings';

export class IssueExpert {
  private readonly settings = new Settings();

  init(): void {
    console.log('Injected!');
    this.settings.onChanged(() => {
      console.log('Settings changed');
    });
  }
}
