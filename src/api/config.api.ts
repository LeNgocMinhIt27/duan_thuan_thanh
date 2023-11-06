import { LaravelSuccessResponse } from "@/interface/axios/laravel";
import { sdk } from "./axios";

export default {
  getSetting: () => sdk.get("config/setting"),
  updateHust: (data: any) => sdk.post("config/hust", data),
  createDongDiemDanh: (data: any) => sdk.post("config/dong-diem-danh", data),
  listDongDiemDanh: (data: any) => sdk.post("config/list-dong-diem-danh", data),
  listTimKiem: (data: any) => sdk.post("config/lich-hoc", data),
  editDongDiemDanh: (data: any) =>
    sdk.put(`config/dong-diem-danh/${data.id}`, data),
  deleteDongDiemDanh: (data: any) =>
    sdk.delete(`config/dong-diem-danh/${data.id}`),
  getKiHienGio: () =>
    sdk
      .get<LaravelSuccessResponse<string>>(`cache/config/ki-hien-gio`)
      .then((res) => res.data),
  getKiHocs: () => sdk.get<string[]>("ki-hocs").then((x) => x.data)
};
