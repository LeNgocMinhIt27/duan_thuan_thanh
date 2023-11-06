import { ApiListReturn } from "@/interface/axios";
import { sdk } from "../axios";
import { DiemDanhItem, LanDiemDanh } from "@/interface/lop";

export default {
  list: (params: any) =>
    sdk.get<ApiListReturn<LanDiemDanh>>("lan-diem-danh", { params }),
  listDiemDanh: (lan_diem_danh_id: number | string, params: any = {}) =>
    sdk.get<DiemDanhItem[]>(`lan-diem-danh/${lan_diem_danh_id}/diem-danhs`, {
      params
    }),
  create: (data: any) =>
    sdk.post<LanDiemDanh>(`lan-diem-danh`, data).then((res) => res.data),
  getDetail: (id: string, params: any = {}) =>
    sdk
      .get<LanDiemDanh>(`lan-diem-danh/${id}`, { params })
      .then((res) => res.data),
  delete: (item: LanDiemDanh, params: any = {}) =>
    sdk.delete(`lan-diem-danh/${item.id}`, { params }),
  edit: (item: LanDiemDanh) => sdk.put(`lan-diem-danh/${item.id}`, item)
};
