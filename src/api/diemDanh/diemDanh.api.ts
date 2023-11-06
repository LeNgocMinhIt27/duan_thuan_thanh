import { sdk } from "../axios";

export default {
  create: (data: any) => sdk.post("lan-diem-danh", data),
  updateLDM: (data: any) => sdk.put(`lan-diem-danh/${data.id}`, data),
  updateDM: (data: any) => sdk.put(`diem-danh/${data.id}`, data),
  get: () => sdk.get("lan-diem-danh"),
  show: (id: any) => sdk.get(`lan-diem-danh/${id}`),
  indexLDM: (id: any) => sdk.get(`lan-diem-danh/${id}/diem-danhs`),
  delete: (id: any) => sdk.delete(`lan-diem-danh/${id}`)
};
