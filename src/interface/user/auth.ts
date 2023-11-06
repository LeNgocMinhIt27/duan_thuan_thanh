import { User } from "./user";

export function createAuthUser(user: User): AuthUser {
  const roles = user.roles || [];
  return {
    ...user,
    role_code: roles[0]
  };
}
export interface AuthUser extends User {
  role_code: string;
}
export function checkUserRoleAllow(user: User, role: string) {
  const roles = user.roles || [];
  return roles.includes(role);
}
export function checkUserRoleAllowMultiple(user: User, roles: string[]) {
  const auth_roles = user.roles || [];
  return roles.some((role) => auth_roles.includes(role));
}
