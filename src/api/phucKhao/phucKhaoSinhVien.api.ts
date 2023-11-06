import { CallbackParams } from "@/hooks/useAgGrid";
import { sdk } from "../axios";
import { IQrCode, PhucKhao } from "@/interface/phucKhao";

export default {
  cache: () => sdk.get<IQrCode>("cache/phuc-khao-qr-code"),
  list: (params: CallbackParams) =>
    sdk.post("sinh-vien-phuc-khao-list", params),
  create: (item: Partial<PhucKhao>) => sdk.post("sinh-vien-phuc-khao", item),
  getDetail: (id: string | number, params: any = {}) =>
    sdk.get<PhucKhao>(`sinh-vien-phuc-khao/${id}`, { params }),
  delete: (item: PhucKhao) => sdk.delete(`sinh-vien-phuc-khao/${item.id}`)
};
