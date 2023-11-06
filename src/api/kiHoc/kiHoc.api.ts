import { sdk } from "../axios";
export default {
  list: () => sdk.get<string[]>("ki-hocs"),
  cache: () => sdk.get("cache/ki-hoc")
};
