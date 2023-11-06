import { EmailForgotPassword, ResetPassword } from "@/interface/user";
import { sdk } from "../axios";

export const forgotPassword = {
  post: (username: EmailForgotPassword) => sdk.post(`quen-mat-khau`, username),
  resetPassword: (item: ResetPassword) => sdk.post(`luu-mat-khau-moi`, item),
  checkToken: (token: { token: string }) => sdk.post("kiem-tra-token", token)
};
export default forgotPassword;
