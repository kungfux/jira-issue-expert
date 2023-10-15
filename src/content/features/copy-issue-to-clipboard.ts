import { Locator } from '../../locator';
import { Log } from '../../log';
import { type Feature } from '../feature';
import { Selectors } from '../jira/selectors';

export class CopyIssueToClipboard implements Feature {
  public name: string = 'Copy issue number';
  public get matchingUrls(): RegExp[] {
    return [this.issueBrowseUrlRegExp, this.issueSelectedUrlRegExp];
  }

  private readonly locator: Locator = new Locator();
  private readonly issueBrowseUrlRegExp: RegExp = /browse\/([a-z]+-\d+)/i;
  private readonly issueSelectedUrlRegExp: RegExp =
    /selectedissue=([a-z]+-\d+)/i;

  private readonly classes = {
    copyContentOpen: 'ie-copy-content-open',
  };

  private readonly ids = {
    copyLinkActionId: 'ie-copy-link',
    copyNumberActionId: 'ie-copy-number',
    copyNumberAndSummaryActionId: 'ie-copy-number-and-summary',
    copyLinkAndSummaryActionId: 'ie-copy-link-and-summary',
    copyMarkdownActionId: 'ie-copy-markdown',
  };

  private readonly selectors = {
    copySection: '//*[@id="ie-copy-section"]',
    copyContent: '//*[@id="ie-copy-content"]',
    copyLinkAction: `//*[@id="${this.ids.copyLinkActionId}"]`,
    copyNumberAction: `//*[@id="${this.ids.copyNumberActionId}"]`,
    copyNumberAndSummaryAction: `//*[@id="${this.ids.copyNumberAndSummaryActionId}"]`,
    copyLinkAndSummaryAction: `//*[@id="${this.ids.copyLinkAndSummaryActionId}"]`,
    copyMarkdownAction: `//*[@id="${this.ids.copyMarkdownActionId}"]`,
  };

  public async init(url: string): Promise<void> {
    const browseIssueNumber = this.issueBrowseUrlRegExp.exec(url)?.[1];
    const selectedIssueNumber = this.issueSelectedUrlRegExp.exec(url)?.[1];

    if (browseIssueNumber !== undefined) {
      void this.addCopyButton(
        browseIssueNumber,
        url,
        Selectors.issueView.issueNumberContainer,
        Selectors.issueView.issueSummary
      );
      return;
    }

    if (selectedIssueNumber !== undefined) {
      void this.addCopyButton(
        selectedIssueNumber,
        url,
        Selectors.issueDetailView.issueNumberContainer,
        Selectors.issueDetailView.issueSummary
      );
    }
  }

  private async addCopyButton(
    issueNumber: string,
    url: string,
    containerSelector: string,
    issueSummarySelector: string
  ): Promise<void> {
    void Log.info(`Add buttons for issue: ${issueNumber}`);
    const issueNumberContainer = await this.locator.waitForElement(
      containerSelector.replace('{issueNumber}', issueNumber)
    );
    const issueSummaryElement =
      await this.locator.waitForElement(issueSummarySelector);
    const issueSummary = issueSummaryElement?.textContent ?? '';
    const issueBrowseUrl = `${new URL(url).origin}/browse/${issueNumber}`;

    if (issueNumberContainer === undefined || issueSummary === undefined) {
      void Log.error('Failed to retrieve the issue summary.');
      return;
    }

    if (
      this.locator.getElementByXpath(this.selectors.copySection) !== undefined
    ) {
      return;
    }

    this.addStyles(`
      .ie-copy-dd {
        position: relative;
        display: inline-block;
      }
      .ie-copy-btn {
        border: none;
        border-radius: 4px;
      }
      .ie-copy-content {
        display: none;
        position: absolute;
        background-color: #fff;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 9999;
        white-space: nowrap;
        border-radius: 4px;
      }
      .ie-copy-content a {
        text-decoration: none;
        display: block;
        color: #42526e;
        padding: 7px 10px;
        border-radius: 4px;
      }
      .ie-copy-content a:hover {
        background-color: #ddd;
      }
      .ie-copy-content a:focus,
      .ie-copy-content a:active {
        background-color: #0052cc;
        color: #fff;
        transition: background-color .1s;
      }
      hr.ie-copy-hr {
        color: #42526e;
        background-color: #42526e;
        opacity: .2;
        border: none;
        height: 1px;
      }
      .${this.classes.copyContentOpen} {
        display: block;
      }
    `);
    (issueNumberContainer as HTMLElement).style.overflow = 'visible';
    issueNumberContainer.innerHTML += `
      <div id="ie-copy-section" class="ie-copy-dd">
        <button class="ie-copy-btn">Copy</button>
        <div id="ie-copy-content" class="ie-copy-content">
          <a id="${this.ids.copyLinkActionId}" title="${issueBrowseUrl}">Link</a>
          <a id="${this.ids.copyNumberActionId}" title="${issueNumber}">Number</a>
          <hr class="ie-copy-hr"/>
          <a id="${this.ids.copyLinkAndSummaryActionId}" title="${issueNumber} ${issueSummary}">Link and Summary</a>
          <a id="${this.ids.copyNumberAndSummaryActionId}" title="${issueSummary} ${issueBrowseUrl}">Number and Summary</a>
          <hr class="ie-copy-hr"/>
          <a id="${this.ids.copyMarkdownActionId}" title="[${issueNumber} ${issueSummary}](${issueBrowseUrl})">Markdown</a>
        </div>
      </div>
    `;

    const copySectionElement = this.locator.getElementByXpath(
      this.selectors.copySection
    );
    const copyContentElement = this.locator.getElementByXpath(
      this.selectors.copyContent
    );
    copySectionElement?.addEventListener('mouseenter', () => {
      copyContentElement?.classList.add(this.classes.copyContentOpen);
    });
    copySectionElement?.addEventListener('mouseleave', () => {
      copyContentElement?.classList.remove(this.classes.copyContentOpen);
    });

    this.addCopyClickHandler(this.selectors.copyLinkAction, issueBrowseUrl);
    this.addCopyClickHandler(this.selectors.copyNumberAction, issueNumber);
    this.addCopyClickHandler(
      this.selectors.copyNumberAndSummaryAction,
      `${issueNumber} ${issueSummary}`
    );
    this.addCopyClickHandler(
      this.selectors.copyLinkAndSummaryAction,
      `${issueSummary}\n${issueBrowseUrl}`
    );
    this.addCopyClickHandler(
      this.selectors.copyMarkdownAction,
      `[${issueNumber} ${issueSummary}](${issueBrowseUrl})`
    );

    this.watchForElementRemoval(this.selectors.copySection, () => {
      void this.addCopyButton(
        issueNumber,
        url,
        containerSelector,
        issueSummarySelector
      );
    });
  }

  private addStyles(css: string): void {
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.append(style);
  }

  private addCopyClickHandler(
    elementXPathSelector: string,
    textToCopy: string
  ): void {
    this.locator
      .getElementByXpath(elementXPathSelector)
      ?.addEventListener('click', () => {
        this.copyToClipboard(textToCopy);
        const copyContentElement = this.locator.getElementByXpath(
          this.selectors.copyContent
        );
        copyContentElement?.classList.remove(this.classes.copyContentOpen);
      });
  }

  private copyToClipboard(text: string): void {
    const copyTextArea: HTMLTextAreaElement =
      document.createElement('textarea');
    copyTextArea.value = text;
    document.body.append(copyTextArea);
    copyTextArea.focus();
    copyTextArea.select();
    try {
      const copyResult = document.execCommand('copy');
      void Log.info(
        `Copy to clipboard result: ${copyResult ? 'success' : 'failed'}`
      );
    } catch (error) {
      void Log.error(`Copy to clipboard error: ${error as string}`);
    }
    copyTextArea.remove();
  }

  private watchForElementRemoval(
    xPathSelector: string,
    callback: () => void
  ): void {
    new MutationObserver((_mutations, observer) => {
      const element = this.locator.getElementByXpath(xPathSelector);
      if (element === undefined) {
        observer.disconnect();
        callback();
      }
    }).observe(document.body, { childList: true });
  }
}
