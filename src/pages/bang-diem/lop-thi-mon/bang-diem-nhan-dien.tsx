import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { CellEditingStoppedEvent, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { FC, useCallback, useEffect, useState } from "react";
import { convertLinkToBackEnd } from "@/utils/url";
import { useLocation } from "react-router-dom";
import diemLopThiApi from "@/api/bangDiem/diemLopThi.api";

const defaultColDef = {
  flex: 1,
  resizable: true,
  editable: true
};
interface Props {
  diemData: any;
  setDiemEdit: (value: any) => void;
}
interface Diem {
  bang_diem_id?: number;
  diem: 3.14;
  mssv: string;
  page?: number;
  stt: string | number;
  create_at?: string;
  update_at?: string;
}
const baseApi = convertLinkToBackEnd("/sohoa/api");

const DiemNhanDien: FC<Props> = ({ diemData, setDiemEdit }) => {
  const loca = useLocation();
  const path = loca.pathname.split("/");
  const [diemCompare, setDiemCompare] = useState<Diem[]>([]);
  const [diemNhanDien, setDiemNhanDien] = useState<Diem[]>([]);
  const [columnDefs, setColumDefs] = useState<ColDef[]>([]);
  const [keyRender, setKeyRender] = useState<number>();

  const lopThiId = path[path.length - 1];
  const columNhanDien = [
    {
      field: "stt",
      headerName: "STT",
      sortable: true,
      maxWidth: 70,
      valueGetter: (params: any) =>
        params.data.diem_goc ? parseInt(params.data.diem_goc.stt) : "",
      editable: false
    },
    {
      field: "stt",
      headerName: "STT ND",
      maxWidth: 90,
      valueGetter: (params: any) =>
        params.data.diem_nd ? parseInt(params.data.diem_nd.stt) : "",
      editable: false
    },
    {
      field: "mssv",
      headerName: "MSSV",
      maxWidth: 200,
      valueGetter: (params: any) =>
        params.data.diem_goc ? params.data.diem_goc.mssv : "",
      editable: false
    },
    {
      field: "mssv",
      headerName: "MSSV ND",
      maxWidth: 200,
      valueGetter: (params: any) => {
        return params.data.diem_nd ? params.data.diem_nd.mssv : "";
      },
      editable: false
    },
    {
      field: "diem_goc.diem",
      headerName: "Điểm"
    },
    {
      field: "diem_nd.diem",
      headerName: "Điểm ND",
      editable: false
    }
  ];
  const columNhanDienHadDiem = [
    {
      field: "stt",
      headerName: "STT",
      sortable: true,
      maxWidth: 70
    },
    {
      field: "mssv",
      headerName: "MSSV",
      maxWidth: 200
    },
    {
      field: "diem",
      headerName: "Điểm"
    }
  ];
  const getDiemNhanDien = async () => {
    try {
      const res = await diemLopThiApi.nhanDienList({ id: lopThiId });
      setDiemNhanDien(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const compareDiem = () => {
    const diem_cache: any[] = [];

    const mergeArr = diemData.diem.map((init: Diem) => {
      const itemMatching = diemNhanDien.find(
        (itemA) => itemA.mssv === init.mssv
      );
      const diem_goc = itemMatching
        ? { ...init, diem: itemMatching.diem || 0 }
        : { ...init, diem: 0 };
      diem_cache.push(diem_goc);
      return {
        diem_goc,
        diem_nd: itemMatching || null,
        status: 0
      };
    });

    if (diemData.diem.length > diemNhanDien.length && !diemData.had_diem) {
      const diem_du = diemData.diem
        .filter(
          (item: Diem) =>
            !diemNhanDien.some((item2: Diem) => item2.mssv === item.mssv)
        )
        .map((item: Diem) => ({ diem_goc: item, diem_nd: null, status: 0 }));
      mergeArr.push(...diem_du);
    } else {
      const diem_du = diemNhanDien
        .filter(
          (item: Diem) =>
            !diemData.diem.some((item2: Diem) => item2.mssv === item.mssv)
        )
        .map((item: Diem) => ({ diem_goc: null, diem_nd: item, status: 1 }));
      mergeArr.push(...diem_du);
    }
    setDiemCompare(mergeArr);
    setDiemEdit(diem_cache);
  };
  const onCellEditingStopped = useCallback(
    (event: CellEditingStoppedEvent) => {
      if (!diemData.had_diem) {
        const updatedDiem = diemCompare.map((itemA: any) => {
          if (itemA.diem_goc.mssv === event.data.diem_goc.mssv) {
            return {
              ...event.data.diem_goc,
              stt: Number(event.data.diem_goc.stt)
            };
          }
          return { ...itemA.diem_goc };
        });
        setDiemEdit(updatedDiem);
      } else {
        const updatedDiem = diemData.diem.map((itemA: any) => {
          if (itemA.mssv === event.data.mssv) {
            return {
              ...event.data,
              stt: Number(event.data.stt)
            };
          }
          return { ...itemA };
        });
        setDiemEdit(updatedDiem);
      }
    },
    [diemData, diemCompare]
  );
  const getRowStyle = (params: any) => {
    if (
      params.data.status == 0 &&
      params.data.diem_nd?.diem !== params.data.diem_goc?.diem &&
      !diemData.had_diem
    ) {
      return { background: "yellow" };
    }
    if (!diemData.had_diem && params.data.status == 1) {
      return { background: "red" };
    }
    return { background: "white" };
  };
  useEffect(() => {
    if (!diemData.had_diem) {
      setColumDefs(columNhanDien);
      getDiemNhanDien();
    } else {
      setColumDefs(columNhanDienHadDiem);
    }
  }, []);
  useEffect(() => {
    if (!diemData.had_diem) {
      compareDiem();
    }
    setKeyRender(Math.random());
  }, [diemData, diemNhanDien]);
  return (
    <div className="flex gap-4">
      <div className="col-span-1 flex-1 pdf">
        <iframe
          className="w-full"
          src={`${baseApi}/bang-diem/show-slice-pdf/${path[path.length - 1]}`}
        ></iframe>
      </div>
      <div className="flex-1">
        <AgGridReact
          className="ag-theme-alpine"
          rowData={diemData.had_diem ? diemData.diem : diemCompare}
          defaultColDef={defaultColDef}
          enableCellTextSelection
          columnDefs={columnDefs}
          key={keyRender}
          onCellEditingStopped={onCellEditingStopped}
          getRowStyle={getRowStyle}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default DiemNhanDien;
