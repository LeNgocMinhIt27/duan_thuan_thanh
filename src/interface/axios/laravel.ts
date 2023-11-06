import { AxiosResponse } from "axios";

export interface LaravelValidationResponse extends AxiosResponse {
  status: 422;
  message: string;
  errors: Record<string, Array<string>>;
}

export interface Laravel400ErrorResponse extends AxiosResponse {
  status: 400;
  message: string;
}

export interface LaravelServerErrorResponse extends AxiosResponse {
  status: 500;
  message: string;
}
export interface Laravel401Response extends AxiosResponse {
  status: 401;
  message: string;
}
export interface LaravelSuccessResponse<T> {
  data: T;
  message: string;
}

// export interface Laravel419ErrorResponse extends AxiosResponse {
//   status: 419;
//   message: string;
// }
