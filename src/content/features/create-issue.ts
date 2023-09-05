import { Locator } from '../../locator';
import { Log } from '../../log';
import { type Feature } from '../feature';
import { Selectors } from '../jira/selectors';

export class CreateIssue implements Feature {
  public name: string = 'Create issue dialog';
  public matchingUrls: RegExp[] = [/.*/i];

  private readonly attributeName: string = 'IssueExpertListenerAttached';
  private readonly locator: Locator = new Locator();

  public async init(): Promise<void> {
    const createButton = await this.locator.waitForElement(
      Selectors.global.createButton
    );
    if (createButton?.getAttribute(this.attributeName) !== 'true') {
      createButton?.setAttribute(this.attributeName, 'true');
      createButton?.addEventListener('click', () => {
        void Log.info('Create button is clicked!');
      });
    }
  }
}
