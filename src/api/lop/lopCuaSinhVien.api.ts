import { CallbackParams } from "@/hooks/useAgGrid";
import { sdk } from "../axios";
import { Lop } from "@/interface/lop";

export default {
  list: (params?: CallbackParams) => sdk.post("student-lop-list", params),
  getDetail: (item: Lop, params: any) =>
    sdk.get(`student-lop-list/${item.id}`, { params }),
  getDiemDanh: (id: any) => sdk.get(`student-diem-danh-list/${id}`)
};
