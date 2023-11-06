import { sdk } from "../axios";
import { DiemDanh, DiemDanhItem } from "@/interface/lop";

export default {
  edit: (item: DiemDanh) => sdk.put(`diem-danh/${item.id}`, item),
  editall: (item: DiemDanhItem[]) => sdk.put(`diem-danh-lop`, item)
};
