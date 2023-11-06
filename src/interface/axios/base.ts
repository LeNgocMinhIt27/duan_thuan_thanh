import { AxiosError, AxiosResponse } from "axios";
interface IErrorBase<T> {
  error: Error | AxiosError<T>;
  type: "axios-error" | "error";
}

export interface IAxiosError<T = any> extends IErrorBase<T> {
  error: AxiosError<T>;
  type: "axios-error";
}
export interface IJsError<T> extends IErrorBase<T> {
  error: Error;
  type: "error";
}

export type AxiosResponseListReturn<T> = AxiosResponse<ApiListReturn<T>>;
export type ApiListReturn<T> = {
  list: T[];
  pagination: Paginate;
};
export interface Paginate {
  count: number;
  hasMoreItems: boolean;
  itemsPerPage: number;
  page: number;
  total: number;
  totalPage: number;
}
