export interface QueryParams {
  page?: number;
  sort?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: string | number | boolean | undefined;
}