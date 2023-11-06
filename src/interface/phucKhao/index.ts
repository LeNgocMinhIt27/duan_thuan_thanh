import { GiaoVien } from "../giaoVien";
import { Lop, LopThi } from "../lop";
import { SinhVien } from "../sinhVien";

export interface PhucKhao {
  id: number;
  tieu_de: any;
  sinh_vien_id: number;
  ki_hoc: string;
  ma: string;
  ma_lop: string;
  mssv: string;
  ma_lop_thi: string;
  lop_id: number;
  lop_thi_id: number;
  trang_thai: string | number;
  ma_thanh_toan: string;
  created_at: string;
  updated_at: string;
  sinh_vien: SinhVien;
  giao_vien?: GiaoVien;
  lop: Lop;
  lop_thi: LopThi;
}
export interface IQrCode {
  ten_ngan_hang: string;
  so_tai_khoan: string;
  ten_tai_khoan: string;
  so_tien: number | string;
  image: string;
}
export type CallbackGetData = (
  id: string | number,
  params?: any
) => Promise<PhucKhao>;

export interface ParamsId {
  id: any;
}
