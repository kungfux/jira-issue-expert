export const Selectors = {
  global: {
    createButton:
      '//*[@role="button" and @id="create_link" and "Jira v.9.10.1"]',
  },
  issueDetailView: {
    issueNumberContainer:
      '//*[@id="issuekey-val" and .//a[text()="{issueNumber}"] and "Jira v.9.10.1"]/../../..',
    issueSummary: '//*[@data-field-id="summary" and "Jira v.9.10.1"]',
  },
  issueView: {
    issueNumberContainer:
      '//header//*[@id="key-val" and //a[text()="{issueNumber}"] and "Jira v.9.10.1"]/../..',
    issueSummary: '//header//*[@id="summary-val" and "Jira v.9.10.1"]',
  },
};
