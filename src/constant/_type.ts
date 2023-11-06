export const EDIT_TYPE = {
  CREATE: "create",
  UPDATE: "update",
  DETAIL: "detail",
  DELETE: "delete"
} as const;

type Keys = keyof typeof EDIT_TYPE;

export type EDIT_TYPE_TYPE = (typeof EDIT_TYPE)[Keys];
