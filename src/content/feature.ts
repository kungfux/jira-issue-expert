export interface Feature {
  name: string;
  matchingUrls: RegExp[];
  init: (url: string) => void;
}
