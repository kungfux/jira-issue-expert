import type { Tabs, WebNavigation } from 'webextension-polyfill';
import { tabs, webNavigation, scripting } from 'webextension-polyfill';
import { Settings } from '../settings';

export class BackgroundService {
  private readonly settings = new Settings();
  private urlRegexs: RegExp[] = [];

  public init(): void {
    void this.getUrlsToListen();
    this.settings.onChanged(() => {
      void this.getUrlsToListen();
    });
    tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
      void this.onTabUpdated(tabId, changeInfo, tabInfo);
    });
    webNavigation.onCompleted.addListener((details) => {
      void this.onNavigationCompleted(details);
    });
  }

  private async onTabUpdated(
    tabId: number,
    changeInfo: Tabs.OnUpdatedChangeInfoType,
    tabInfo: Tabs.Tab
  ): Promise<void> {
    if (changeInfo.url !== undefined && this.isJiraUrl(changeInfo.url)) {
      await this.injectContentScript(tabId);
    }
  }

  private async onNavigationCompleted(
    details: WebNavigation.OnCompletedDetailsType
  ): Promise<void> {
    if (details.url.length > 0 && this.isJiraUrl(details.url)) {
      await this.injectContentScript(details.tabId);
    }
  }

  private async getUrlsToListen(): Promise<void> {
    const { urls } = await this.settings.getSettings();
    this.urlRegexs = [];
    for (const url of urls) {
      this.urlRegexs.push(new RegExp(url, 'i'));
    }
  }

  private isJiraUrl(url: string): boolean {
    for (const x of this.urlRegexs) {
      if (x.test(url)) {
        return true;
      }
    }
    return false;
  }

  private async injectContentScript(tabId: number): Promise<void> {
    try {
      await scripting.executeScript({
        target: {
          tabId,
        },
        files: ['content.bundle.js'],
      });
    } catch (error) {
      console.error(`Failed to inject content script: ${String(error)}`);
    }
  }
}
