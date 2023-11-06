import { LoginResult } from "@/interface/user/login";

export const TOKEN_STORAGE_KEY = "t";
export const REFRESH_TOKEN_STORAGE_KEY = "t-r";
export const TOKEN_REMEMBER_KEY = "t-s";
type Auth = {
  token?: string;
  remember_token: boolean;
  refresh_token?: string;
};
const auth: Auth = {
  token: undefined,
  remember_token: true,
  refresh_token: undefined
};
export function getToken() {
  if (!auth.token) {
    initData();
  }
  return auth.token;
}
export function setToken(token: string) {
  auth.token = token;

  if (auth.remember_token && token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}
export function getRefreshToken() {
  return auth.refresh_token;
}
export function setRefreshToken(refresh_token?: string) {
  auth.refresh_token = refresh_token;
  if (auth.remember_token && refresh_token) {
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refresh_token);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
}
export function setRememberToken(enable: boolean) {
  auth.remember_token = enable;
  window.localStorage.setItem(TOKEN_REMEMBER_KEY, enable ? "true" : "false");
}

export function initData(default_remember = true) {
  const remember_token = window.localStorage.getItem(TOKEN_REMEMBER_KEY);
  if (default_remember && remember_token != "") {
    setRememberToken(true);
    auth.remember_token = true;
  } else {
    auth.remember_token = !!remember_token;
  }
  if (auth.remember_token) {
    auth.token = window.localStorage.getItem(TOKEN_STORAGE_KEY) || undefined;
  }
}
export function setDataToken(data: LoginResult) {
  setToken(data.access_token);
}
