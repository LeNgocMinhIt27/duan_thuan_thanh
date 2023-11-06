import { getBackEndUrl } from "@/constant";

export function convertLinkToBackEnd(link = "", baseURL = getBackEndUrl()) {
  if (!link) return "";
  if (link.startsWith("http")) {
    return link;
  }
  if (link.startsWith("https")) {
    return link;
  }
  if (link.startsWith("/static")) {
    return link;
  }
  if (link.includes("data:image/png;base64")) {
    return link;
  }
  if (link[0] == "/") link = link.substring(1);
  if (!baseURL || baseURL[0] == "/") {
    return `${window.location.origin}/${link}`;
  }
  if (baseURL[baseURL.length - 1] !== "/") baseURL = baseURL + "/";
  return `${baseURL}${link}`;
}
