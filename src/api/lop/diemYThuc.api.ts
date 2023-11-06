import { sdk } from "../axios";

export default {
  edit: (item: any) => sdk.put(`sua-diem-y-thuc/${item.id}`, item),
  editall: (item: any, lopid: number | string) =>
    sdk.put(`lop/${lopid}/diem-y-thuc`, item)
};
