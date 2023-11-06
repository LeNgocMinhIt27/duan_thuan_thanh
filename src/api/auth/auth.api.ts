import type {
  GetMeResult,
  LoginParams,
  LoginResult,
  LogoutResult
} from "@/interface/user/login";

import { sdk } from "../axios";

export const apiLogin = (data: LoginParams) =>
  sdk
    .post<LoginResult, LoginParams>(`web-authenticate`, data)
    .then((res) => res.data);

export const apiLoginMicrosoft = (code: string) =>
  sdk
    .get<LoginResult>(`auth/loginWithMicrosoftCode`, { params: { code } })
    .then((res) => res.data);
export const apiGetMe = () =>
  sdk.get<GetMeResult>("me").then((res) => res.data);
export const apiUpdatePassword = (data: any) => sdk.put("me/password", data);

export const apiLogout = () =>
  sdk.post<LogoutResult>("logout").then((res) => res.data);
