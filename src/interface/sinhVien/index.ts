import { IBangDiem } from "../bangdiem";
import { LopThi } from "../lop";
import { User } from "../user";

export interface SinhVien {
  id: number;
  name: string;
  email: string;
  mssv: string;
  birth_day: string;
  group: string;
}
export interface DiemSinhVien {
  id: number;
  bang_diem_id: number;
  lop_thi_id: number;
  sinh_vien_id: number;
  diem: string;
  ghi_chu: string;
  nguoi_nhap_id: number;
  bang_diem: IBangDiem;
  lop_thi: LopThi;
  sinh_vien: SinhVien;
  user: User;
  ki_hoc: string;
  mssv: string;
  ma_hp: string;
  ma_lop_thi: string;
  ma_lop: string;
}
export interface DiemSinhVienPhucKhao extends DiemSinhVien {
  trang_thai_phuc_khao?: string;
}

export interface DanhSachLoiSv {
  id: number;
  tieu_de: string;
  lop_thi_id: string;
  ghi_chu: string;
  ki_hoc: string;
  ly_do: string;
  ma: string;
  ten_hp: string;
  trang_thai: number;
  item: number;
  sinh_vien: {
    name: string;
    email: string;
  };
  lop: {
    ma_hp: string;
    ten_hp: string;
    ki_hoc: string;
    ma: string;
  };
}
