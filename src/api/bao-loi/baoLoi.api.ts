import { CallbackParams } from "@/hooks/useAgGrid";
import { BaoLoi } from "@/interface/bao-loi";
import { sdk } from "../axios";

export default {
  cache: () => sdk.get("cache/bao-loi"),
  list: (params?: CallbackParams) => sdk.post("bao-loi-list", params),
  delete: (item: BaoLoi) => sdk.delete(`bao-loi-id/${item.id}`),
  edit: (item: BaoLoi) => sdk.put(`bao-loi-update/${item.id}`, item)
};
