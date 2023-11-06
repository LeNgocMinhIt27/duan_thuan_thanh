import {
  AxiosTransform,
  CreateAxiosOptions,
  RequestOptions
} from "@/interface/axios/config";
import { ContentTypeEnum, VAxios } from "./axios";

import { getBackEndUrl } from "@/constant";
import { getToken } from "../auth/helper";
import merge from "lodash.merge";
import { GlobalHandlers } from "./error-handle";

const transform: AxiosTransform = {
  beforeRequestHook: (config: any, options: RequestOptions) => {
    const { urlPrefix, joinPrefix, withoutToken, authenticationScheme } =
      options;
    const { url } = config;

    if (joinPrefix && urlPrefix) {
      if (url.trim()[0] === "/") {
        config.url = `${urlPrefix}${url}`;
      } else {
        config.url = `${urlPrefix}/${url}`;
      }
    }

    if (!withoutToken) {
      const temp_token = getToken();
      config.headers.Authorization = authenticationScheme
        ? `${authenticationScheme} ${temp_token}`
        : temp_token;
    }

    return config;
  },
  requestCatchHook: (e: Error) => {
    GlobalHandlers.responseErrorHandler(e);
    return e;
  }
};
export function createAxios(opt: CreateAxiosOptions = {}): VAxios {
  return new VAxios(
    merge(
      {
        transform,
        requestOptions: {
          joinPrefix: true,
          withoutToken: false,
          showLoading: true
        },
        // timeout: 10 * 1000,
        headers: { "Content-Type": ContentTypeEnum.JSON }
      },
      opt
    )
  );
}
// See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
// authentication schemes，e.g: Bearer
// authenticationScheme: 'Bearer',
export const sdk = createAxios({
  baseURL: getBackEndUrl(),
  headers: {
    "Content-Type": ContentTypeEnum.JSON,
    Accept: ContentTypeEnum.JSON
  },
  requestOptions: { urlPrefix: "api", authenticationScheme: "Bearer" }
});
export * from "./error";
