import { CallbackParams } from "@/hooks/useAgGrid";
import { sdk } from "../axios";

export default {
  list: (params: CallbackParams) => sdk.post("diem-phuc-khao-list", params)
};
