import { IAxiosError, IJsError } from "@/interface/axios";
import {
  Laravel401Response,
  LaravelServerErrorResponse,
  LaravelValidationResponse
} from "@/interface/axios/laravel";
import axios, { AxiosError, AxiosResponse } from "axios";

export function convertErrorAxios<T = any>(
  error: Error | AxiosError<T>
): IAxiosError<T> | IJsError<T> {
  if (axios.isAxiosError(error)) {
    return {
      error: error,
      type: "axios-error"
    };
  } else {
    return {
      error: error,
      type: "error"
    };
  }
}

export function axiosErrorHandler<T>(
  callback: (err: IAxiosError<T> | IJsError<T>) => void
) {
  return (error: Error | AxiosError<T>) => {
    callback(convertErrorAxios(error));
  };
}
export function isAxiosError<ResponseType>(
  error: unknown
): error is AxiosError<ResponseType> {
  return axios.isAxiosError(error);
}

export function axiosResponseIsLaravelValidationResponse(
  response: AxiosResponse
): response is LaravelValidationResponse {
  return (
    response.status === 422 &&
    typeof response.data?.message === "string" &&
    typeof response.data?.errors === "object"
  );
}
export function isTokenInvalid(e: AxiosError<Laravel401Response>): boolean {
  return (
    !!e.response &&
    (e.response.status === 401 ||
      e.response.data.message === "Unauthenticated.")
  );
}
export function isForbidden(e: AxiosError): boolean {
  return !!e.response && e.response.status === 403;
}

export function isMaintenance(e: AxiosError): boolean {
  return !!e.response && e.response.status === 503;
}

export function isServerError(
  e: AxiosError<LaravelServerErrorResponse>
): boolean {
  return !!e.response && e.response.status === 500;
}
