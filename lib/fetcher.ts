export const fetcher = (url: string) =>
  fetch(url).then((result) => result.json());
