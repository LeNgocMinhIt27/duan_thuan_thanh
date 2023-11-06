import { convertLinkToBackEnd } from "@/utils/url";
import { sdk } from "./axios";
import { AxiosResponse } from "axios";
import { getPrefix } from "@/constant";

export async function downloadFromApiReturnKey(
  api: () => Promise<AxiosResponse<DownloadReturn>>
) {
  const res = await api();

  const data = res.data;
  if (data.data) {
    window.open(
      convertLinkToBackEnd(getPrefix() + `/api/download/data/${data.data}`),
      "_blank"
    );
  }
  return res;
}
type ExportExcel = {
  name: string;
  title: string;
  headers: { value: string; text: string }[];
  data: any[];
};
type DownloadReturn = {
  data: string;
};
export default {
  downloadExcel: (data: ExportExcel) =>
    downloadFromApiReturnKey(() =>
      sdk.request<DownloadReturn>({
        method: "post",
        url: `download/excel`,
        data
      })
    )
};
