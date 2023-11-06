import { CallbackParams } from "@/hooks/useAgGrid";
import { sdk } from "../axios";

export default {
  list: (params: CallbackParams) => sdk.post(`tin-nhan`, params)
};
