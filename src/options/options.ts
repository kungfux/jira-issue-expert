import { Log } from '../log';
import { Settings } from '../settings';

const settings = new Settings();
const separatorChar = ';';
const selectors = {
  url: '#urls',
  enableDebugMode: '#enableDebugMode',
  save: '#save',
};

function saveOptions(): void {
  const urls: string | undefined =
    (document.querySelector(selectors.url) as HTMLTextAreaElement)?.value ??
    undefined;
  const enableDebugMode: boolean =
    (document.querySelector(selectors.enableDebugMode) as HTMLInputElement)
      ?.checked ?? false;

  void settings.setSettings({
    urls: urls?.length > 0 ? urls.split(separatorChar) : [],
    enableDebugMode,
  });
}

function restoreOptions(): void {
  settings
    .getSettings()
    .then((settings) => {
      const urls = document.querySelector(selectors.url) as HTMLTextAreaElement;
      if (urls !== undefined && settings.urls.length > 0) {
        urls.value = settings.urls.join(separatorChar);
      }

      const enableDebugMode = document.querySelector(
        selectors.enableDebugMode
      ) as HTMLInputElement;
      enableDebugMode.checked = settings.enableDebugMode;
    })
    .catch((error) => {
      void Log.error(error);
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector(selectors.save)?.addEventListener('click', saveOptions);
