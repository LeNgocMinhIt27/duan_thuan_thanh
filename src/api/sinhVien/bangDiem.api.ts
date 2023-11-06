import { CallbackParams } from "@/hooks/useAgGrid";
import { sdk } from "../axios";
import { DiemSinhVien } from "@/interface/sinhVien";

export default {
  list: (params?: CallbackParams) => sdk.post(`diem-sinh-vien-list`, params),
  item: (id: string | number, params: any = {}) =>
    sdk.get<DiemSinhVien>(`diem-sinh-vien/${id}`, { params })
};
