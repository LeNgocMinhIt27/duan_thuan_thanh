import {
  type FC,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo
} from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./styleTableOverwrite.scss";

import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import {
  GridReadyEvent,
  ColDef,
  GridApi,
  // GridOptions,
  GetLocaleTextParams
} from "ag-grid-community";
import { Pagination, type PaginationProps } from "antd";
import { ApiListReturn, Paginate } from "@/interface/axios";
import { CallbackGetData, DataSource } from "@/hooks/useAgGrid";
import { useTranslation } from "react-i18next";

const defaultColDef = {
  minWidth: 150,
  resizable: true,
  rowDrag: false,
  suppressMovable: true,
  filterParams: {
    buttons: ["reset", "apply"]
  }
};
const BaseTable: FC<{
  columns: ColDef[];
  api: CallbackGetData;
  gridOption?: AgGridReactProps;
  paginationOption?: PaginationProps;
  defaultParams?: object;
  initFilter?: object;
}> = ({
  columns,
  api,
  gridOption = {},
  paginationOption = {},
  defaultParams = {},
  initFilter
}) => {
  const { t } = useTranslation("aggird");
  const [id, setId] = useState(1);
  const [pagination, setPagination] = useState<Paginate>({
    count: 1,
    hasMoreItems: true,
    itemsPerPage: 10,
    page: 1,
    total: 1,
    totalPage: 1
  });
  const callbackSuccess = useCallback(
    (data: ApiListReturn<any>) => {
      setPagination((state) => {
        return { ...state, ...data.pagination };
      });
    },
    [setPagination]
  );
  const dataSource = useMemo(
    () => new DataSource<any>(api, callbackSuccess, pagination, defaultParams),

    [id]
  );
  const resetDataSource = useCallback(() => {
    setId((state) => {
      return ++state;
    });
  }, []);
  const gridApi = useRef<GridApi>();
  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      gridApi.current = params.api;
      if (initFilter) {
        gridApi.current.setFilterModel(initFilter);
      }
      dataSource.setGridApi(params.api);
      gridApi.current.setDatasource(dataSource);
      params.api.sizeColumnsToFit();
    },
    [dataSource]
  );
  useEffect(() => {
    if (gridApi.current && dataSource) {
      dataSource.setGridApi(gridApi.current);
      gridApi.current.setDatasource(dataSource);
    }
  }, [dataSource.id]);
  useEffect(() => {
    if (gridApi.current && columns) {
      gridApi.current.setColumnDefs(columns);
    }
  }, [columns]);

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = useCallback(
    (current: number, pageSize: number) => {
      setPagination((state) => {
        return {
          ...state,
          itemsPerPage: pageSize,
          page: current
        };
      });
      resetDataSource();
    },
    []
  );
  const getLocaleText = useCallback(
    (params: GetLocaleTextParams) => {
      return t(params.key);
    },
    [t]
  );

  return (
    <div className="d-flex flex-column full-height full-width pa-4">
      <div className="flex-grow-1 ag-theme-alpine">
        <AgGridReact
          className="full-height full-width"
          rowModelType={"infinite"}
          columnDefs={columns}
          onGridReady={onGridReady}
          paginationPageSize={pagination.itemsPerPage}
          cacheBlockSize={0}
          overlayLoadingTemplate={
            '<div class="loadingx" style="margin: 7em"></div> <span class="ag-overlay-loading-center " style="font-size: 18px; z-index: 100000"> </span>'
          }
          enableCellTextSelection
          getLocaleText={getLocaleText}
          {...gridOption}
          defaultColDef={{ ...gridOption.defaultColDef, ...defaultColDef }}
        ></AgGridReact>
      </div>
      <div
        className="flex-grow-0 d-flex align-center"
        style={{
          padding: " 8px 0"
        }}
      >
        <Pagination
          current={pagination.page}
          pageSize={pagination.itemsPerPage}
          showSizeChanger
          onChange={onShowSizeChange}
          total={pagination.total}
          {...paginationOption}
        />
        <div className="flex-grow-1"></div>
        <div className="px-2">Tổng số: {pagination.total || 0}</div>
      </div>
    </div>
  );
};
export default BaseTable;
