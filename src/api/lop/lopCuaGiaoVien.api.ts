import { CallbackParams } from "@/hooks/useAgGrid";
import { sdk } from "../axios";
import { AxiosResponse } from "axios";
import { Lop } from "@/interface/lop";
import { SinhVien } from "@/interface/user";

export default {
  list: (params?: CallbackParams) => sdk.post("teacher-lop-list", params),
  listSinhVien: (id: string | number) =>
    sdk.get<SinhVien[]>(`teacher-lop-list/${id}/sinh-viens`),
  getDetail: (id: string, params: any = {}) =>
    sdk
      .get<AxiosResponse<Lop>>(`teacher-lop-list/${id}`, { params })
      .then((res) => res.data)
};
