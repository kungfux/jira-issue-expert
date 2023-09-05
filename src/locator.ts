import { Log } from './log';

export class Locator {
  public getElementByXpath(
    xpath: string,
    context = document
  ): Element | undefined {
    const result = document.evaluate(
      xpath,
      context,
      undefined,
      XPathResult.FIRST_ORDERED_NODE_TYPE
    );

    if (result.singleNodeValue?.nodeType === Node.ELEMENT_NODE) {
      return result.singleNodeValue as Element;
    }
    return undefined;
  }

  public getElementsByXpath(xpath: string, context = document): Element[] {
    const iterator = document.evaluate(
      xpath,
      context,
      undefined,
      XPathResult.ORDERED_NODE_ITERATOR_TYPE
    );
    const nodes: Element[] = [];

    let node;
    while ((node = iterator.iterateNext()) !== null) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        nodes.push(node as Element);
      }
    }

    return nodes;
  }

  public async waitForElement(
    xpath: string,
    context = document,
    // TODO: Move default timeout to settings
    timeout = 30_000
  ): Promise<Element | undefined> {
    return await new Promise((resolve, reject) => {
      if (this.getElementByXpath(xpath, context) !== undefined) {
        resolve(this.getElementByXpath(xpath, context));
        return;
      }

      const timerId = setTimeout(() => {
        const message = `Timed out after ${timeout} ms waiting for element with selector '${xpath}' to be present in DOM`;
        void Log.error(message);
        reject(new Error(message));
      }, timeout);

      const observer = new MutationObserver(() => {
        if (this.getElementByXpath(xpath, context) !== undefined) {
          resolve(this.getElementByXpath(xpath, context));
          clearTimeout(timerId);
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  public async waitForElementToBeVisible(
    xpath: string,
    context = document,
    // TODO: Move default timeout to settings
    timeout = 30_000
  ): Promise<Element | undefined> {
    const startTime = Date.now();
    return await new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        const element = this.getElementByXpath(xpath, context);
        if ((element as HTMLElement)?.offsetParent !== undefined) {
          clearInterval(intervalId);
          resolve(element);
        }
        if (Date.now() - startTime >= timeout) {
          clearInterval(intervalId);
          const message = `Timed out after ${timeout} ms waiting for element with selector '${xpath}' to become visible`;
          void Log.error(message);
          reject(new Error(message));
        }
      }, 100);
    });
  }
}
