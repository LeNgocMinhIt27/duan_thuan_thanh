import { CallbackParams } from "@/hooks/useAgGrid";
import { sdk } from "../axios";
import { LoaiLopThi } from "@/interface/lop-thi";

export default {
  list: (params?: CallbackParams) => sdk.post("teacher-lop-thi-list", params),
  listLoaiThi: () => sdk.get<LoaiLopThi[]>("cache/loai-lop-thi")
};
