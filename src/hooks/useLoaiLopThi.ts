import lopThiApi from "@/api/lop/lopThi.api";
import { LoaiLopThi } from "@/interface/lop";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useLoaiLopThi() {
  const [items, setLoaiData] = useState<LoaiLopThi[]>([]);
  useEffect(() => {
    const fetchLoaiData = async () => {
      try {
        const response = await lopThiApi.listLoaiThi();

        if (response.data && Array.isArray(response.data)) {
          setLoaiData(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLoaiData();
  }, []);
  const items_cache = useMemo(
    () =>
      items.reduce<{ [key: string]: string }>((acc, x) => {
        acc[x.value] = x.title;
        return acc;
      }, {}),
    [items]
  );
  const format = useCallback(
    function (value: string) {
      return items_cache[value] || "";
    },
    [items_cache]
  );
  return { items, format };
}
