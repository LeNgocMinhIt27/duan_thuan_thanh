export function getBackEndUrl() {
  return import.meta.env.VITE_API_BASE_URL || "/";
}
export function getPrefix() {
  return import.meta.env.VITE_PREFIX || "/";
}
export const ROLE_CODE = {
  TEACHER: "teacher",
  ADMIN: "admin",
  STUDENT: "student",
  ASSISTANT: "assistant"
};

export * from "./_type";
