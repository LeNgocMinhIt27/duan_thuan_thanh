import { CallbackParams } from "@/hooks/useAgGrid";
import { sdk } from "../axios";
import { Lop } from "@/interface/lop";
import { SinhVien } from "@/interface/user";
import { downloadFromApiReturnKey } from "../download.api";

export default {
  cache: () => sdk.get<Lop[]>("cache/lop"),
  list: (params: CallbackParams) => sdk.post("lop-list", params),
  get: () => sdk.get("lop-list-student"),
  getDetail: (id: string | number, params: any = {}) =>
    sdk.get<Lop>(`lop/${id}`, { params }),
  create: (item: Lop) => sdk.post("lop", item),
  edit: (item: Lop) => sdk.put(`lop/${item.id}`, item),
  delete: (item: Lop) => sdk.delete(`lop/${item.id}`),
  detail: (id: number) => sdk.post(`lop-detail/${id}`),
  listSinhVien: (id: number) => sdk.get<SinhVien[]>(`lop/${id}/sinh-viens`),
  addSV: (data: any) => sdk.post(`lop-detail/add-student/${data.id}`, data),
  updateSV: (data: any) =>
    sdk.post(`lop-detail/update-student/${data.id}`, data),

  removeSV: (data: any) =>
    sdk.post(`lop-detail/remove-student/${data.id}`, data),
  exportStudent: (data: any) =>
    sdk.post(`/export/lop-sinh-vien/${data.id}/sinh-viens`, data, {
      responseType: "blob"
    }),
  exportLopLt: (data: any) =>
    downloadFromApiReturnKey(() => {
      return sdk.post(`/export/lop-li-thuyet/${data.id}/lop-lt`, data);
    }),
  item: (id: string | number, params: any = {}) =>
    sdk.get<Lop>(`student-lop-list-item/${id}`, { params }),
  sinhVienLopHoc: (id: string | number, params: any = {}) =>
    sdk.get<SinhVien[]>(`sinh-vien-lop-thi/${id}`, { params }),
  lopGiaoVien: (data: any) =>
    sdk.get(`lop-teacher/${data.id}`, { params: data }),
  listLopDiemDanh: (params: any) =>
    sdk.post<Lop[]>("lop-list-diem-danh", params)
};
