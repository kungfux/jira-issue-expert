import { Settings } from '../settings';
import { ServiceWorker } from './service-worker';

const settings = new Settings().getSettings();
const serviceWorker = new ServiceWorker(settings.urls);
serviceWorker.init();
