import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface CreateAxiosOptions extends AxiosRequestConfig {
  transform?: AxiosTransform;
  requestOptions?: RequestOptions;
}
export interface RequestOptions {
  withoutToken?: boolean;
  isCancelToken?: boolean;
  joinPrefix?: boolean;
  authenticationScheme?: string;
  urlPrefix?: string;
  withCsrf?: boolean;
}

export abstract class AxiosTransform {
  /**
   * @description: Process configuration before request
   */
  beforeRequestHook?: (
    config: AxiosRequestConfig,
    options: RequestOptions
  ) => AxiosRequestConfig;

  /**
   * @description: Request successfully processed
   */
  transformRequestHook?: (res: AxiosResponse, options: RequestOptions) => any;

  /**
   * @description
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => any;

  /**
   * @description
   */
  requestInterceptors?: (
    config: AxiosRequestConfig,
    options: CreateAxiosOptions
  ) => AxiosRequestConfig;

  /**
   * @description
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description
   */
  responseInterceptorsCatch?: (error: Error) => void;
}
