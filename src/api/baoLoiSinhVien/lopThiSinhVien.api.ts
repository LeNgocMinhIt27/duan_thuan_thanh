import { sdk } from "../axios";
import { Lop } from "@/interface/lop";

export default {
  list: () => sdk.post("student-lop-list"),
  getDetail: (item: Lop) => sdk.get(`student-lop-list/${item.id}`)
};
