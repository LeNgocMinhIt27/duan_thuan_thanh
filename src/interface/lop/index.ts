import { Dayjs } from "dayjs";
import { GiaoVien } from "../giaoVien";
import { SinhVien } from "../user";

export interface Lop {
  id: number;
  ma: string;
  ma_kem: string;
  ma_hp: string;
  ten_hp: string;
  phong: string;
  loai: string;
  kip: string;
  ki_hoc: string;
  ghi_chu: string;
  create_at: string;
  update_at: string;
  sinh_viens?: SinhVien[];
  giao_viens?: GiaoVien[];
  lan_diem_danhs?: LanDiemDanh[];
  parent?: Lop;
  children?: Lop[];
  count?: number | string;
  lop_id: number | string;
}
export interface LopSinhVien {
  ki_hoc: string;
  ma_lop: string;
  ma_hp: string;
  ten_hp: string;
}

export interface LanDiemDanh {
  id: number;
  lan: number;
  ngay_diem_danh: string | Dayjs;
  lop: Lop;
  lop_id: string | number;
  diem_danhs?: DiemDanh[];
  is_qua_han?: boolean;
  ngay_dong_diem_danh: string | Dayjs;
  ngay_mo_diem_danh: string | Dayjs;
}
export interface DiemDanh {
  id: string | number;
  lan_diem_danh_id?: string | number;
  lan_diem_danh?: LanDiemDanh;
  sinh_vien_id?: string | number;
  sinh_vien?: SinhVien;
  co_mat?: boolean;
  ghi_chu?: string;
}

export interface LopThiSinhVien {
  lop_thi_id: string | number;
  sinh_vien_id: string | number;
  stt: string | number;
  diem: string | number;
}

export interface DiemDanhItem {
  lan_diem_danh_id: string | number;
  diem_danh_id: string | number;
  sinh_vien_id: string | number;
  stt: number;
  lan: number;
  name: string;
  mssv: string;
  group: string;
  co_mat: boolean;
  ghi_chu: string;
}
export interface DiemYThuc {}

export interface LopThi {
  id: number;
  ma: string;
  ma_lop_thi: string;
  loai: any;
  lop_id?: number | string;
  lop_thi?: LopThi;
  lop?: Lop;
  sinh_viens: SinhVien;
  diem_count_not_null: number;
  diems_count: number;
}

export interface DiemDanhSinhVien {
  id: string;
  ma_lop: string;
  loai: string;
  lan: string;
  ngay_diem_danh: any;
  mssv: string;
  co_mat: boolean;
  ghi_chu: null;
}
export interface LoaiLopThi {
  value: string;
  title: string;
}

export interface LopThiKi {
  created_at: string;
  ghi_chu: string;
  giao_viens: { id: number; name: string; email: string }[];
  id: string | number;
  ki_hoc: string;
  kip_thi: string;
  loai: string;
  lop_id: string | number;
  ma: string;
  ma_hp: string;
  ma_kem: string;
  ngay_thi: string;
  phong: string;
  phong_thi: string;
  ten_hp: string;
  updated_at: string;
}

export interface lopCoiThiGiaoVienDetail {
  name: string;
  giao_vien_id: number;
  lop_thi_id: number;
  phong_thi: string;
  kip_thi: string;
  ngay_thi: string;
  ki_hoc: string;
  loai: string;
  ma_lop_thi: string;
  ma_lop_hoc: string;
  lop_id: number;
}
