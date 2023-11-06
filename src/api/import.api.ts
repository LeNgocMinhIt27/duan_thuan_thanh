import { JsonToFormData } from "@/utils/JsonToFormData";
import { sdk } from "./axios";
import { LaravelSuccessResponse } from "@/interface/axios/laravel";
type ImportReadFileExcelResult = LaravelSuccessResponse<{
  items: any[];
  headers: string[];
  total: number;
}>;
type ImportGiaoVienParams = {
  items: any[];
  fields: { name: string; email: string };
};
type ImportGiaoVienResult = LaravelSuccessResponse<
  { name: string; email: string; password?: string }[]
>;
type ImportLopParams = {
  items: any[];
  ki_hoc: string;
  fields: {
    ma: string;
    ma_kem: string;
    ma_hp: string;
    ten_hp: string;
    loai: string;
    tuan_hoc: string;
    ghi_chu: string;
    giao_vien_email: string;
    lop_thu: string;
    lop_thoigian: string;
    lop_kip: string;
    lop_phong: string;
  };
};
type ImportLopResult = {
  data: any[];
  message: string;
};
type ImportSinhVienParams = {
  items: any[];
  ki_hoc: string;
  fields: {
    ten_hp: string;
    ma_hp: string;
    ma_lop: string;
    sinh_vien_id: string;
    sinh_vien_name: string;
    sinh_vien_birthday: string;
    sinh_vien_lop: string;
  };
};
type ImportSinhVienResult = {
  data: any[];
  message: string;
};
type ImportDiemPhucKhaoParams = {
  items: any[];
  fields: {
    ma_hp: string;
    ma_lop: string;
    ma_lop_thi: string;
    sinh_vien_id: string;
    sinh_vien_name: string;
    stt: string;
    diem: string;
    diem_moi: string;
    ghi_chu: string;
    ki_hoc: string;
  };
};
type ImportDiemPhucKhaoResult = {
  data: any[];
  message: string;
};
type ImportThiGiuaKyParams = {
  items: any[];
  fields: {
    ma_lop: string;
    lop_chinh: string;
    ma_hp: string;
    ghi_chu: string;
    nhom: string;
    ma_lop_thi: string;
    term: string;
  };
};
type ImportSinhVienThiGiuaKyResult = {
  data: any[];
  message: string;
};

type ImportSinhVienThiGiuaKyParams = {
  items: any[];
  fields: {
    mssv: string;
    ma_lop: string;
    loai: string;
    nhom: string;
  };
};
type ImportThiGiuaKyResult = {
  data: any[];
  message: string;
};

export type ImportType =
  | "giao-vien"
  | "sinh-vien"
  | "lop"
  | "lop-thi"
  | "lop-thi-sv"
  | "diem-phuc-khao";

export default {
  readExcel: (file: File) =>
    sdk
      .post<ImportReadFileExcelResult>(
        "import/excel",
        JsonToFormData({ file }),
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((res) => res.data),
  importGiaoVien: (data: ImportGiaoVienParams) =>
    sdk
      .post<ImportGiaoVienResult>("import/giao-vien", data)
      .then((res) => res.data),
  importLop: (data: ImportLopParams) =>
    sdk.post<ImportLopResult>("import/lop", data).then((res) => res.data),

  importLopThi: (data: ImportThiGiuaKyParams) =>
    sdk
      .post<ImportThiGiuaKyResult>("import/lop-thi", data)
      .then((res) => res.data),
  importSinhVienLopThi: (data: ImportSinhVienThiGiuaKyParams) =>
    sdk
      .post<ImportSinhVienThiGiuaKyResult>("import/sinh-vien-lop-thi", data)
      .then((res) => res.data),
  importSinhVien: (data: ImportSinhVienParams) =>
    sdk
      .post<ImportSinhVienResult>("import/sinh-vien", data)
      .then((res) => res.data),
  importDiemPhucKhao: (data: ImportDiemPhucKhaoParams) =>
    sdk
      .post<ImportDiemPhucKhaoResult>("import/diem-phuc-khao", data)
      .then((res) => res.data),
  importSuggest: (datatype: ImportType) =>
    sdk.get(`cache/import/suggest?type=${datatype}`).then((res) => res.data),

  importDiemYThuc: (data: ImportDiemPhucKhaoParams) =>
    sdk
      .post<ImportDiemPhucKhaoResult>(`import/diem-y-thuc`, data)
      .then((res) => res.data)
};
