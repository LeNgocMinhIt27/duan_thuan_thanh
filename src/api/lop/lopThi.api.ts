import { CallbackParams } from "@/hooks/useAgGrid";
import { sdk } from "../axios";
import { ApiListReturn } from "@/interface/axios";
import {
  LoaiLopThi,
  LopThi,
  LopThiKi,
  LopThiSinhVien,
  lopCoiThiGiaoVienDetail
} from "@/interface/lop";
import { DiemItem } from "@/interface/bangdiem";
import { LaravelSuccessResponse } from "@/interface/axios/laravel";

export default {
  list: (params: any) => sdk.get<ApiListReturn<LopThi>>("lop-thi", { params }),
  listAgGrid: (params: any) =>
    sdk.post<ApiListReturn<LopThi>>("lop-thi-list", params),
  lopThiFilter: (param: CallbackParams) => sdk.post("lop-thi-filter", param),
  listDiem: (lop_thi_id: number | string, params: any = {}) =>
    sdk.get<DiemItem[]>(`lop-thi/${lop_thi_id}/diem`, {
      params
    }),
  listSinhVien: (lop_thi_id: number | string, params: any = {}) =>
    sdk.get<DiemItem[]>(`list-sinh-vien-lop-thi/${lop_thi_id}`, {
      params
    }),
  create: (item: LopThi) => sdk.post<LopThi>(`lop-thi/add`, item),
  edit: (item: LopThi) => sdk.put(`lop-thi/update/${item.id}`, item),
  delete: (item: LopThi) => sdk.delete(`lop-thi/delete/${item.id}`),
  getDetail: (id: string | number, params: any = {}) =>
    sdk.get<LopThi>(`lop-thi/${id}`, { params }).then((res) => res.data),
  lopThiMon: (param: CallbackParams, id: number, user: any) =>
    sdk.post(`lop-thi-mon/${id}`, { user: user, ...param }),
  cacheLopthi: (id: number) => sdk.post(`cache/lop-thi-mon/${id}`),
  cache: () => sdk.get<ApiListReturn<LopThi[]>>(`cache/lop-thi`),
  listLoaiThi: () => sdk.get<LoaiLopThi[]>("cache/loai-lop-thi"),
  LopThiTheoKi: (kihoc: any) => sdk.post<LopThiKi[]>("lop-thi-ki", kihoc),
  addSinhVien: (item: LopThiSinhVien) =>
    sdk.post<LopThiSinhVien>(`add-sinh-vien-lop-thi`, item),
  deleteSinhVien: (item: any) =>
    sdk.delete(`delete-sinh-vien-lop-thi/${item.sinh_vien_id}`, {
      params: item
    }),
  SapXepLichTrongThi: (data: any) => sdk.post("giao-vien-trong-thi", data),
  SapXepLichTrongThiSave: (data: any) =>
    sdk.post("giao-vien-trong-thi-save", data),
  lopCoiThiGiaoVienDetail: (data: any) =>
    sdk
      .post<LaravelSuccessResponse<lopCoiThiGiaoVienDetail[]>>(
        "lop-coi-thi-gv-detail",
        data
      )
      .then((x) => x.data)
};
