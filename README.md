# Introduction

`IssueExpert for JIRA` is a browser extension that adds extra functionality to JIRA for operating with issues.

> Note: Currently supported JIRA version is 9.4.0 only!

# Features

> Check out [demo](#demo) section to see it in action.

- Copy issue link, number, summary to clipboard

# Install

Add an extension to your favorite browser by visiting extensions store

[![](docs/get_addon_firefox.png)](https://addons.mozilla.org/en-US/firefox/addon/issueexpert-for-jira/) [![](docs/get_addon_chrome.png)](https://chrome.google.com/webstore/detail/issueexpert-for-jira/fdpnlhakdaikopniehgchiagamknknom)

## Note for Firefox users

Make sure to allow the extension to access website:

- Navigate to JIRA instance site
- Click the extensions icon
- Click gear icon
- Click `Always Allow on *.issueexpert.com`

![asd](docs/firefox_permissions.png)

# Build and test locally

- Install [Node.js](https://nodejs.org/) (LTS version)
- Run following commands from project's root directory to build extension

```bash
$ npm install # Restore project dependencies
$ npm run build:chrome # Build extension for Chrome
$ npm run build:firefox # Build extension for Firefox
```

- Run following commands to debug extension

```bash
$ npm run watch:chrome
$ npm run watch:firefox
```

- Follow these articles to load unpacked extension from `dist` folder into your browser
  - [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing)
  - [Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)

# License information

- Check out [LICENSE](LICENSE) for the license details
- Icons by [Flatart](https://www.freepik.com/author/flatart)

# Demo

![Copy issue number](docs/copy-issue-number.png)
&nbsp;
