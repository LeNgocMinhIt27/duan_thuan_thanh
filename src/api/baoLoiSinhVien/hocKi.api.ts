import { sdk } from "../axios";

export default {
  listHocKi: () => sdk.get("ki-hocs")
};
