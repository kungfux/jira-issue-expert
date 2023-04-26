import type { Tabs, WebNavigation } from 'webextension-polyfill';
import { tabs, webNavigation, scripting } from 'webextension-polyfill';

export class ServiceWorker {
  private readonly urls: string[];
  private readonly urlRegexs: RegExp[];

  public constructor(urls: string[]) {
    this.urls = urls;
    this.urlRegexs = [];
    for (const url of this.urls) {
      this.urlRegexs.push(new RegExp(url, 'i'));
    }
  }

  public init(): void {
    tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
      void this.onTabUpdated(tabId, changeInfo, tabInfo);
    });
    webNavigation.onCompleted.addListener((details) => {
      void this.onNavigationCompleted(details);
    });
  }

  public async onTabUpdated(
    tabId: number,
    changeInfo: Tabs.OnUpdatedChangeInfoType,
    tabInfo: Tabs.Tab
  ): Promise<void> {
    if (changeInfo.url !== undefined && this.isJiraUrl(changeInfo.url)) {
      await this.injectContentScript(tabId);
    }
  }

  public async onNavigationCompleted(
    details: WebNavigation.OnCompletedDetailsType
  ): Promise<void> {
    if (details.url.length > 0 && this.isJiraUrl(details.url)) {
      await this.injectContentScript(details.tabId);
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
