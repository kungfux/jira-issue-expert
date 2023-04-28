import { runtime } from 'webextension-polyfill';
import { BackgroundService } from './background-service';

new BackgroundService().init();

runtime.onInstalled.addListener(() => {
  void runtime.openOptionsPage();
});
