import { runtime } from 'webextension-polyfill';
import { BackgroundService } from './background-service';

runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    void runtime.openOptionsPage();
  }
});

new BackgroundService().init();
