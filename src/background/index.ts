import { runtime } from 'webextension-polyfill';
import { Settings } from '../settings';
import { ServiceWorker } from './service-worker';

runtime.onInstalled.addListener((details) => {
  void runtime.openOptionsPage();
});

const settings = new Settings();
const s = await settings.getSettings();
const serviceWorker = new ServiceWorker(s.urls);
serviceWorker.init();
