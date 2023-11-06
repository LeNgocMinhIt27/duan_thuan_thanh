import { CallbackParams } from "@/hooks/useAgGrid";
import { sdk } from "../axios";
import { IBangDiem } from "@/interface/bangdiem";
import { LopThi } from "@/interface/lop";

export default {
  list: (params: CallbackParams) => sdk.post(`bang-diem-list`, params),

  create: (data: any) =>
    sdk.post(`bang-diem/add`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
  createExcel: (data: any) =>
    sdk.post(`bang-diem/add/excel`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
  update: (data: IBangDiem) =>
    sdk.post(`bang-diem/update/${data.id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
  updateExcel: (data: IBangDiem) =>
    sdk.post(`bang-diem/update/${data.id}/excel`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
  delete: (data: any) => sdk.put(`bang-diem/delete/${data.id}`, data),
  slicePdf: (data: any) => sdk.post(`bang-diem/slice-pdf/${data.id}`, data),
  show: (id: number | string) => sdk.get<IBangDiem>("bang-diem/show/" + id),
  congBo: (data: IBangDiem) =>
    sdk.post(`bang-diem/cong-bo-diem/${data.id}`, data),
  layTrangChuaNhanDien: (id?: string | number) =>
    sdk.get<string[]>(`bang-diem/${id}/chua-nhan-dien`),
  nhanDien: (data: any, id: any) => sdk.put(`bang-diem/${id}/nhan_diens`, data),
  getLopthiThuocBangdiem: (id: number | string) =>
    sdk.get<LopThi[]>(`bang-diem/${id}/lop-this`),
  // nhandienDiem: (data: any) => sdk.get(`bang-diem/${data.id}/nhan-dien`, data),
  nhandienDiem: (data: any) =>
    sdk.get(`bang-diem/${data.id}/nhan-dien`, { params: data }),
  lopThiGiaoVien: (id: number) => sdk.get(`lop-thi-giao-vien/${id}`)
};
