import type { Tabs, WebNavigation } from 'webextension-polyfill';
import { tabs, webNavigation, scripting } from 'webextension-polyfill';
import { Settings } from '../settings';
import { Log } from '../log';
import * as Browser from 'webextension-polyfill';

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
      void Log.info('onTabUpdated gets called');
      await this.injectContentScript(tabId);
      this.sendNewUrlMessage(tabId, changeInfo.url);
    }
  }

  private async onNavigationCompleted(
    details: WebNavigation.OnCompletedDetailsType
  ): Promise<void> {
    if (details.url.length > 0 && this.isJiraUrl(details.url)) {
      void Log.info('onNavigationCompleted gets called');
      await this.injectContentScript(details.tabId);
      this.sendNewUrlMessage(details.tabId, details.url);
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
      void Log.error(`Failed to inject content script: ${String(error)}`);
    }
  }

  private sendNewUrlMessage(tabId: number, newUrl: string): void {
    void Browser.tabs.sendMessage(tabId, { newUrl });
  }
}
