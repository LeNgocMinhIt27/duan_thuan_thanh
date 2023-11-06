import { CallbackParams } from "@/hooks/useAgGrid";
import { GiaoVien } from "@/interface/giaoVien";
import { sdk } from "../axios";

export default {
  cache: () => sdk.get<GiaoVien[]>("cache/giao-vien"),
  list: (params: CallbackParams) => sdk.post("giao-vien-list", params),
  create: (item: GiaoVien) => sdk.post("giao-vien", item),
  delete: (item: GiaoVien) => sdk.delete(`giao-vien/${item.id}`),
  edit: (item: GiaoVien) => sdk.put(`giao-vien/${item.id}`, item),
  detail: (id: number) => sdk.get(`giao-vien-detail/${id}`)
};
