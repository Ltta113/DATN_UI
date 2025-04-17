import { AxiosError as OriginalAxiosError } from "axios";

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export type AxiosError<T = unknown> = OriginalAxiosError<T> & {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
    headers?: Record<string, string>;
  };
};
