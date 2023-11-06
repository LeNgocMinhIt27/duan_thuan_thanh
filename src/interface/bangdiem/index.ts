import { SinhVien } from "../user";

export interface IBangDiem {
  created_at: Date;
  duong_dan_tap_tin?: File;
  ghi_chu: string;
  id: string | number;
  ma_hp: string;
  ten_hp: string;
  ki_hoc: string;
  ki_thi: string;
  file?: File;
  trang_thai_nhan_dien: "success" | "processing" | "failed" | null;
  ngay_cong_khai: string;
  ngay_ket_thuc_phuc_khao: string;
  is_cong_khai: boolean;
  loai: "nhan_dien" | "nhap_tay";
  update_at: Date;
}
export interface IBangDiemEdit {
  created_at: Date;
  duong_dan_tap_tin?: File;
  ghi_chu: string;
  id: string | number;
  isPhucKhao?: boolean;
  ki_hoc: string;
  ki_thi: string;
  loai: string;
  ma_hp: string;
  ten_hp: string;
  ngay_cong_khai: Date;
  ngay_ket_thuc_phuc_khao: Date;
  trang_thai_nhan_dien: "success" | "processing" | null;
  update_at: Date;
  file?: File;
}
export interface DiemLopThi {
  diem: string | number;
  diem_id?: number;
  ghi_chu: string;
  group: string;
  loai: string;
  ma: string;
  mssv: string;
  name?: string;
  sinh_vien_id: number;
  stt: number | string;
}

export interface DiemItem {
  record?: any;
  diem_id: string | number;
  sinh_vien_id: string | number;
  stt: number;
  diem: number;
  name: string;
  mssv: string;
  group: string;
  ghi_chu: string;
  sinh_vien: SinhVien;
}

export interface BangDiemSV {
  created_at: Date;
  duong_dan_tap_tin?: File;
  ghi_chu: string;
  id: string | number;
  ma_hp: string;
  ten_hp: string;
  ki_hoc: string;
  file?: File;
  trang_thai_nhan_dien: "success" | "processing" | null;
  ngay_cong_khai: Date;
  ngay_ket_thuc_phuc_khao: Date;
  ma_lop: string;
  ma: string;
  mssv: number;
  ma_lop_thi: string;
  loai: string;
  diem: number;
  update_at: Date;
  is_phuc_khao: any;
}
export interface DiemPhucKhao {
  bang_diem_id: number;
  lop_thi_id: number;
  sinh_vien_id: number;
  diem: string;
  ghi_chu: string;
  nguoi_nhap_id: number;
  created_at: string;
  updated_at: string;
}
