import { DanhSachLoiSv } from "@/interface/sinhVien";
import { CallbackParams } from "@/hooks/useAgGrid";
import { sdk } from "../axios";

export const baoLoiCuaSv = {
  cache: () => sdk.get("cache/sinh-vien"),
  list: (params?: CallbackParams) => sdk.post(`bao-loi-sv`, params),
  create: (sinhVien: DanhSachLoiSv) => sdk.post("bao-loi", sinhVien),
  edit: () => "",
  delete: (sinhVien: DanhSachLoiSv) => sdk.delete(`bao-loi/${sinhVien.id}`)
};
export default baoLoiCuaSv;
