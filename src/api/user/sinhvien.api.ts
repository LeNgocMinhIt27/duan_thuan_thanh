import { CallbackParams } from "@/hooks/useAgGrid";
import { SinhVien } from "@/interface/user/user";
import { sdk } from "../axios";

export const sinhVienApi = {
  cache: () => sdk.get("cache/sinh-vien"),
  list: (params: CallbackParams) => sdk.post(`sinh-vien-list`, params),
  create: (sinhVien: SinhVien) => sdk.post("sinh-vien", sinhVien),
  edit: (sinhVien: SinhVien) => sdk.put(`sinh-vien/${sinhVien.id}`, sinhVien),
  delete: (sinhVien: SinhVien) => sdk.delete(`sinh-vien/${sinhVien.id}`),
  filter: (params: CallbackParams) => sdk.post(`sinh-vien-filter`, params),
  listSV: (id: any[], params: any = {}) =>
    sdk.get<SinhVien>(`list-sinh-vien-many/${id}`, { params })
};
export default sinhVienApi;
