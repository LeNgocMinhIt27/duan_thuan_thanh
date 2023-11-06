import { Lop } from "../lop";

export interface LopThi {
  id: number;
  lop_id: number | string;
  ma: string;
  loai: string;
  create_at: string;
  update_at: string;
  lop?: Lop;
  phong_thi: string;
  kip_thi: string;
  ngay_thi: string;
  ma_lop_thi: string;
  ma_lop: string;
  ki_hoc: string;
}

export interface LoaiLopThi {
  title: string;
  value: string;
}
