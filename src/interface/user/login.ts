import { User } from "./user";

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface LogoutResult {
  message: string;
}
export interface GetMeResult {
  user: User;
}
