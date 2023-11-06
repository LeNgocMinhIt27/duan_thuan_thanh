import { convertLinkToBackEnd } from "@/utils/url";

export async function downloadFromApiReturnKey(api: any) {
  let res = await api();

  res = res.data;
  if (res.data) {
    window.open(
      convertLinkToBackEnd(`/api/download/data/${res.data}`),
      "_blank"
    );
  }
  return res;
}
