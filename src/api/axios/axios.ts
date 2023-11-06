import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { CreateAxiosOptions, RequestOptions } from "@/interface/axios/config";

/**
 * @description request method
 */
export const RequestEnum = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE"
};

/**
 * @description  contentType
 */
export const ContentTypeEnum = {
  // json
  JSON: "application/json;charset=UTF-8",
  // form-data qs
  FORM_URLENCODED: "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data  upload
  FORM_DATA: "multipart/form-data;charset=UTF-8"
};

/**
 * @description  axios module
 */
export class VAxios {
  _axios: AxiosInstance;
  _options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this._options = options;
    this._axios = Axios.create(options);
    this.setupInterceptors();
  }
  /**
   *
   * @private
   * @returns {import("@/type/axios").AxiosTransform}
   */
  getTransform() {
    const { transform } = this._options;
    return transform;
  }
  /**
   *
   * @private
   * @description Interceptor configuration
   */
  setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) {
      return;
    }
    let {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch
    } = transform;
    requestInterceptors = checkFunction(requestInterceptors);
    requestInterceptorsCatch = checkFunction(requestInterceptorsCatch);
    responseInterceptors = checkFunction(responseInterceptors);
    responseInterceptorsCatch = checkFunction(responseInterceptorsCatch);

    this._axios.interceptors.request.use((config: any) => {
      // If cancel repeat request is turned on, then cancel repeat request is prohibited

      if (requestInterceptors) {
        config = requestInterceptors(config, this._options);
      }
      return config;
    }, requestInterceptorsCatch);
    this._axios.interceptors.response.use((res) => {
      if (responseInterceptors) {
        res = responseInterceptors(res);
      }
      return res;
    }, responseInterceptorsCatch);
  }

  request<T>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<AxiosResponse<T>> {
    let conf: any = Object.assign({ headers: {} }, config);
    const transform = this.getTransform();

    const { requestOptions } = this._options;

    const opt = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, requestCatchHook, transformRequestHook } =
      transform || {};
    if (beforeRequestHook) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;
    return new Promise((resolve, reject) => {
      this._axios
        .request(conf)
        .then((res) => {
          if (transformRequestHook) {
            try {
              const ret = transformRequestHook(res, opt);
              resolve(ret);
            } catch (err) {
              reject(err || new Error("request error!"));
            }
            return;
          }
          resolve(res);
        })
        .catch((e) => {
          if (requestCatchHook) {
            reject(requestCatchHook(e, opt));
            return;
          }
          reject(e);
        });
    });
  }
  get<Result = any>(
    url: string,
    config?: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<AxiosResponse<Result>> {
    return this.request<Result>({ url, ...config, method: "GET" }, options);
  }

  post<Result = any, T = any>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<AxiosResponse<Result>> {
    return this.request<Result>(
      { url, data, ...config, method: "POST" },
      options
    );
  }

  put<Result = any, T = any>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<AxiosResponse<Result>> {
    return this.request<Result>(
      { url, data, ...config, method: "PUT" },
      options
    );
  }

  delete<Result = any>(
    url: string,
    config?: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<AxiosResponse<Result>> {
    return this.request<Result>({ url, ...config, method: "DELETE" }, options);
  }
}

function checkFunction(cb: any) {
  return cb ? cb : undefined;
}
