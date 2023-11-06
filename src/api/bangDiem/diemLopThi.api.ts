import { sdk } from "../axios";

export default {
  list: (data: any) => sdk.post(`diem-lop-thi-list/${data.id}`, data),
  nhanDienList: (data: any) => sdk.post(`diem-nhan-dien-list/${data.id}`, data),
  save: (data: any) => sdk.post(`diem-lop-thi/save/${data.id}`, data)
};
