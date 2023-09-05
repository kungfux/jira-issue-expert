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
    const issueSummaryElement = await this.locator.waitForElement(
      issueSummarySelector
    );
    const issueSummary = issueSummaryElement?.textContent ?? '';
    const issueBrowseUrl = `${new URL(url).origin}/browse/${issueNumber}`;

    if (issueNumberContainer === undefined || issueSummary === undefined) {
      void Log.error('Failed to retrieve the issue summary.');
      return;
    }

    if (
      this.locator.getElementByXpath('//*[@id="ie-copy-section"]') !== undefined
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
      .ie-copy-dd:hover .ie-copy-content {
        display: block;
      }
      hr.ie-copy-hr {
        color: #42526e;
        background-color: #42526e;
        opacity: .2;
        border: none;
        height: 1px;
      }
    `);
    (issueNumberContainer as HTMLElement).style.overflow = 'visible';
    issueNumberContainer.innerHTML += `
      <div id='ie-copy-section' class="ie-copy-dd">
        <button class="ie-copy-btn">Copy</button>
        <div class="ie-copy-content">
          <a id="ie-copy-link" title="${issueBrowseUrl}">Link</a>
          <a id="ie-copy-number" title="${issueNumber}">Number</a>
          <hr class="ie-copy-hr"/>
          <a id="ie-copy-link-and-summary" title="${issueNumber} ${issueSummary}">Link and Summary</a>
          <a id="ie-copy-number-and-summary" title="${issueSummary} ${issueBrowseUrl}">Number and Summary</a>
          <hr class="ie-copy-hr"/>
          <a id="ie-copy-markdown" title="[${issueNumber} ${issueSummary}](${issueBrowseUrl})">Markdown</a>
        </div>
      </div>
    `;
    this.locator
      .getElementByXpath('//*[@id="ie-copy-link"]')
      ?.addEventListener('click', () => {
        this.copyToClipboard(issueBrowseUrl);
      });
    this.locator
      .getElementByXpath('//*[@id="ie-copy-number"]')
      ?.addEventListener('click', () => {
        this.copyToClipboard(issueNumber);
      });
    this.locator
      .getElementByXpath('//*[@id="ie-copy-number-and-summary"]')
      ?.addEventListener('click', () => {
        this.copyToClipboard(`${issueNumber} ${issueSummary}`);
      });
    this.locator
      .getElementByXpath('//*[@id="ie-copy-link-and-summary"]')
      ?.addEventListener('click', () => {
        this.copyToClipboard(`${issueSummary}\n${issueBrowseUrl}`);
      });
    this.locator
      .getElementByXpath('//*[@id="ie-copy-markdown"]')
      ?.addEventListener('click', () => {
        this.copyToClipboard(
          `[${issueNumber} ${issueSummary}](${issueBrowseUrl})`
        );
      });
  }

  private addStyles(css: string): void {
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.append(style);
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
}
