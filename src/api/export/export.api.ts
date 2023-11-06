import { sdk } from "../axios";
import { downloadFromApiReturnKey } from "../download.api";

export default {
  excelDiemDanh: (data: any) =>
    sdk.post(`/export/lop-sinh-vien/${data.id}/excel`, data, {
      responseType: "blob"
    }),
  excelSinhVien: (data: any) =>
    sdk.post(`/export/sinh-vien-lop/${data.id}/excel`, data, {
      responseType: "blob"
    }),
  excelDiemDanhAll: (data: any) =>
    sdk.post(`/export/lop-sinh-vien-all/${data.id}/excel`, data, {
      responseType: "blob"
    }),
  excelSinhVienAll: (data: any) =>
    sdk.post(`/export/sinh-vien-lop-all/${data.id}/excel`, data, {
      responseType: "blob"
    }),
  diemThanhTich: (data: any) =>
    sdk.post(`/export/diem-thanh-tich/${data.id}/pdf`, data, {
      responseType: "blob"
    }),
  diemThanhTichAll: (data: any) =>
    downloadFromApiReturnKey(() => {
      return sdk.post(`/export/diem-thanh-tich-all/${data.id}/pdf`, data);
    }),
  excelPhucKhao: (data: any) =>
    sdk.post(`/export/phuc-khao/excel`, data, { responseType: "blob" }),
  excelXepLichThi: (data: any) =>
    sdk.post(`/export/xep-lich-thi-gv/excel`, data, { responseType: "blob" })
};
