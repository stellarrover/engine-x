export type AIRequestInfo<T> = {
  url: string;
  body: object;
  transformer: (json: any) => T;
};
