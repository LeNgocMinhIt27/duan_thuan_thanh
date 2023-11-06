import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { CellEditingStoppedEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { FC, useCallback } from "react";

const defaultColDef = {
  flex: 1,
  minWidth: 200,
  resizable: true,
  editable: true
};
interface Props {
  diemData: any;
  setDiemEdit: (value: any) => void;
}
const DiemNhapExcel: FC<Props> = ({ diemData, setDiemEdit }) => {
  //   const [diemEdit,setDiemEdit] = useState();
  const columExcel = [
    {
      field: "stt",
      headerName: "STT",
      sortable: true,
      valueGetter: (params: any) =>
        params.data.stt ? parseInt(params.data.stt) : "",
      editable: false
    },
    {
      field: "mssv",
      headerName: "Mã sinh viên",
      valueGetter: (params: any) => (params.data.mssv ? params.data.mssv : ""),
      editable: false
    },
    {
      field: "diem",
      headerName: "Điểm"
    }
  ];

  const onCellEditingStopped = useCallback(
    (event: CellEditingStoppedEvent) => {
      const updatedDiem = diemData.diem.map((itemA: any) => {
        if (itemA.sinh_vien_id === event.data.sinh_vien_id) {
          return { ...event.data, stt: Number(event.data.stt) };
        }
        return itemA;
      });

      setDiemEdit(updatedDiem);
    },
    [diemData]
  );
  const getRowStyle = (params: any) => {
    if (params.data.diem === null) {
      return { background: "yellow" };
    }
    return { background: "white" };
  };
  return (
    <AgGridReact
      className="ag-theme-alpine bang_diem_ag"
      rowData={diemData.diem}
      defaultColDef={defaultColDef}
      enableCellTextSelection
      columnDefs={columExcel}
      onCellEditingStopped={onCellEditingStopped}
      getRowStyle={getRowStyle}
    ></AgGridReact>
  );
};

export default DiemNhapExcel;
