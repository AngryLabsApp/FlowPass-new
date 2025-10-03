export interface QueryParams {
  page?: number;
  sort?: string;
  [key: string]: string | number | boolean | undefined;
}