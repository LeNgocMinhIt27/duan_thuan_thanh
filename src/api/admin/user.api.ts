import { CallbackParams } from "@/hooks/useAgGrid";
import { User } from "@/interface/user/user";
import { sdk } from "../axios";

export default {
  list: (params: CallbackParams) => sdk.post(`users-list`, params),
  create: (user: User) => sdk.post("users", user),
  resetPassword: (user: User, value: any) =>
    sdk.post(`users/${user.id}/reset-password`, value),
  edit: (user: User) => sdk.put(`users/${user.id}`, user),
  delete: (user: User) => sdk.delete(`users/${user.id}`),
  setinactive: (user: User) => sdk.put(`users/${user.id}/inactive`),
  setactive: (user: User) => sdk.put(`users/${user.id}/active`),
  editAdmin: (value: any) =>
    sdk.post(`editAdmin/profile`, value, {
      headers: { "Content-Type": "multipart/form-data" }
    })
};
