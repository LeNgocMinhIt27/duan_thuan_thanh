import { RootState } from "@/stores";

export * from "./action";
export { logout } from "./store";
export const getAuthUser = (state: RootState) => state.auth.currentUser;
export const authLoading = (state: RootState) => state.auth.loading;
export const authInfoLoading = (state: RootState) => state.auth.loadingInfo;
export const authErrorMessage = (state: RootState) => state.auth.errorMessage;
