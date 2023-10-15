import * as Browser from 'webextension-polyfill';
import { Log } from '../log';
import { Settings } from '../settings';
import { CopyIssueToClipboard } from './features/copy-issue-to-clipboard';
import { type Feature } from './feature';

(() => {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  const settings = new Settings();

  settings.onChanged(() => {
    void Log.info('Settings have changed.');
  });

  const features: Feature[] = [new CopyIssueToClipboard()];

  Browser.runtime.onMessage.addListener((message) => {
    void Log.info(`Message received: ${JSON.stringify(message)}`);
    const newUrl = message?.newUrl as string;
    for (const feature of features) {
      if (feature.matchingUrls?.some((x) => x.test(newUrl)) ?? false) {
        void Log.info(`Init feature: ${feature.name}`);
        feature.init(newUrl);
      }
    }
  });
})();
