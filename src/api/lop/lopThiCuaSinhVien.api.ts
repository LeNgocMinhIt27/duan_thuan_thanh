import { CallbackParams } from "@/hooks/useAgGrid";
import { sdk } from "../axios";
import { LoaiLopThi } from "@/interface/lop-thi";

export default {
  list: (params?: CallbackParams) => sdk.post("student-lop-thi-list", params),
  // getDetail: (item: LopThi, params: any) =>
  //   sdk.get(`student-lop-thi-list/${item.id}`, { params }),
  // getDiemDanh: (id: any) => sdk.get(`student-diem-danh-list/${id}`),
  listLoaiThi: () => sdk.get<LoaiLopThi[]>("cache/loai-lop-thi")
};
