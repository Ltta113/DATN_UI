export interface ResponseData<T = unknown> {
  message?: string;
  data?: T;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
