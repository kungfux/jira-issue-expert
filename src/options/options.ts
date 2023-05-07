import { Settings } from '../settings';

const settings = new Settings();
const separatorChar = ';';
const selectors = {
  url: '#urls',
  save: '#save',
};

function saveOptions(): void {
  const urls: string | undefined =
    (document.querySelector(selectors.url) as HTMLTextAreaElement)?.value ??
    undefined;
  if (urls !== undefined) {
    void settings.setSettings({ urls: urls.split(separatorChar) });
  }
}

function restoreOptions(): void {
  settings
    .getSettings()
    .then((settings) => {
      const urls = document.querySelector(selectors.url) as HTMLTextAreaElement;
      if (urls !== null && settings.urls.length > 0) {
        urls.value = settings.urls.join(separatorChar);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector(selectors.save)?.addEventListener('click', saveOptions);
