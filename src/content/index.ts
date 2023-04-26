import { IssueExpert } from './issue-expert';

declare global {
  interface Window {
    hasRun: boolean;
  }
}

(function run() {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  new IssueExpert().print();
})();
