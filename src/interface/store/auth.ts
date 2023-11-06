import { AuthUser } from "../user/auth";

export interface AuthState {
  logged: boolean;
  currentUser?: AuthUser;
  loading: boolean;
  loadingInfo: boolean;
  errorMessage: any;
}
