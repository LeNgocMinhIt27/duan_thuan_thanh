import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { ActionField } from "@/interface/common";
import BaseTable from "@/components/base-table";
import {
  Button,
  Tag,
  Tooltip,
  Form,
  Col,
  Select,
  Spin,
  Card,
  Pagination
} from "antd";
import { CallbackParams } from "@/hooks/useAgGrid";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { LopThi } from "@/interface/lop";
import PageContainer from "@/Layout/PageContainer";
import filterAggridComponent from "@/components/custom-filter/filterAggridComponent";
import lopThiApi from "@/api/lop/lopThi.api";
import { useTranslation } from "react-i18next";
import SelectFloatingFilterCompoment from "@/components/custom-filter/SelectFloatingFilterCompoment";
import BaseResponsive from "@/components/base-responsive";
import { Paginate } from "@/interface/axios";
import { PaginationProps } from "antd/lib";
import { getAuthUser } from "@/stores/features/auth";
import { useAppSelector } from "@/stores/hook";
import { useLoaiLopThi } from "@/hooks/useLoaiLopThi";

const defaultColDef = {
  flex: 1,
  minWidth: 100,
  resizable: true,
  filter: true,
  floatingFilter: true
};

const DanhSachLopThi = () => {
  const contentDesktop = () => <DanhSachLopThiDesktop />;
  const contentMobile = () => <DanhSachLopThiMobile />;
  const breadcrumbs = useMemo(() => {
    return [
      { router: "../../", text: "Bảng điểm" },
      { text: "Danh sách lớp thi môn" }
    ];
  }, []);
  return (
    <>
      <PageContainer breadcrumbs={breadcrumbs} title="Danh sách lớp thi môn">
        <BaseResponsive
          contentDesktop={contentDesktop}
          contentMobile={contentMobile}
        />
      </PageContainer>
    </>
  );
};

export default DanhSachLopThi;

const DanhSachLopThiDesktop: FC<{ kiHoc?: string[] }> = () => {
  const { t } = useTranslation("lop-thi-mon");
  const [keyRender] = useState(0);
  const location = useLocation();
  const path = location.pathname.split("/");
  const bang_diem_id = Number(path[path.length - 2]);
  const { items: dotThi, format: formatDotThi } = useLoaiLopThi();
  const [lopThi, setLopThi] = useState<LopThi[]>([]);
  const authUser = useAppSelector(getAuthUser);

  const [columnDefs, setColumDefs] = useState<ColDef<LopThi & ActionField>[]>(
    []
  );
  useEffect(() => {
    const lop_thi_column: ColDef = {
      headerName: t("field.ma_lop_thi"),
      field: "lopThi",
      filter: filterAggridComponent,
      floatingFilter: true,
      cellRenderer: renderLopThi
    };
    if (lopThi && lopThi.length > 0) {
      lop_thi_column.floatingFilterComponent = SelectFloatingFilterCompoment;
      lop_thi_column.floatingFilterComponentParams = {
        suppressFilterButton: true,
        placeholder: "Mã lớp thi",
        data: lopThi.map((x) => ({
          label: x.lop_thi?.ma,
          value: x.lop_thi?.id
        }))
      };
    }

    const loai_columns: ColDef = {
      headerName: "Đợt thi",
      field: "loai",
      filter: false,
      floatingFilter: true,
      cellRenderer: loaiCellRenderer
    };

    if (dotThi && dotThi.length > 0) {
      loai_columns.floatingFilterComponent = SelectFloatingFilterCompoment;
      loai_columns.floatingFilterComponentParams = {
        suppressFilterButton: true,
        placeholder: "Đợt thi",
        data: dotThi.map((x) => ({
          label: x.title,
          value: x.value
        }))
      };
      loai_columns.cellRendererParams = {
        format: formatDotThi
      };
    }

    setColumDefs([
      lop_thi_column,
      {
        headerName: t("field.ma_lop"),
        field: "ma_lop",
        filter: false,
        cellRenderer: renderLopHoc
      },
      loai_columns,
      // {
      //   headerName: t("field.loai"),
      //   field: "loai",
      //   filter: false,
      //   cellRenderer: renderLoai
      // },
      {
        headerName: "Trạng thái",
        filter: false,
        cellRenderer: renderTrangThai
      },
      {
        headerName: t("field.action"),
        field: "action",
        pinned: "right",
        width: 150,
        cellRenderer: ActionCellRender,
        cellRendererParams: {
          onUpdateItem: () => {},
          onDeleteItem: () => {}
        },
        filter: false
      }
    ]);
  }, [lopThi, dotThi]);
  useEffect(() => {
    const getLopThi = async () => {
      const res = await lopThiApi.cacheLopthi(bang_diem_id);
      if (res.data && res.data.length > 0) {
        setLopThi(res.data);
      }
    };

    getLopThi();
  }, []);
  return (
    <BaseTable
      key={keyRender}
      columns={columnDefs}
      api={(params: CallbackParams) =>
        lopThiApi.lopThiMon(params, bang_diem_id, authUser)
      }
      gridOption={{ defaultColDef: defaultColDef }}
    ></BaseTable>
  );
};

const DanhSachLopThiMobile: FC<{
  kiHoc?: string[];
}> = () => {
  const [dataSource, setDataSource] = useState<LopThi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const path = location.pathname.split("/");
  const bang_diem_id = Number(path[path.length - 2]);
  const [lopThi, setLopThi] = useState<LopThi[]>([]);
  const { t } = useTranslation("lop-thi-mon");
  const { format: formatDotThi } = useLoaiLopThi();
  const [form] = Form.useForm();
  const authUser = useAppSelector(getAuthUser);
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  useEffect(() => {
    const getLopThi = async () => {
      const res = await lopThiApi.cacheLopthi(bang_diem_id);
      if (res.data && res.data.length > 0) {
        setLopThi(res.data);
      }
    };

    getLopThi();
  }, []);
  const getData = useCallback(async (filter: any) => {
    setLoading(true);
    try {
      const res = await lopThiApi.lopThiMon(filter, bang_diem_id, authUser);
      setDataSource(res.data.list || []);
      setPagination((state) => {
        return {
          ...state,
          total: res.data.pagination.total
        };
      });
    } finally {
      setLoading(false);
    }
  }, []);
  const [pagination, setPagination] = useState<Paginate>({
    count: 1,
    hasMoreItems: true,
    itemsPerPage: 10,
    page: 1,
    total: 1,
    totalPage: 1
  });
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = useCallback(
    (current: number, pageSize: number) => {
      setPagination((state) => {
        return {
          ...state,
          itemsPerPage: pageSize,
          page: current
        };
      });
    },
    []
  );
  const handleFieldChanged = (field: string, value: any) => {
    form.setFieldsValue({ [field]: value });
    onSubmit(form.getFieldsValue());
  };
  const onSubmit = useCallback(
    (filter: any) => {
      const sendData = {
        filterModel: {
          lopThi: {
            filterType: "relationship",
            type: "contains",
            relationship: "lopThi",
            filter: filter.lopThi
          }
        },
        count: 1,
        hasMoreItems: true,
        itemsPerPage: pagination.itemsPerPage,
        page: pagination.page,
        total: 1,
        totalPage: 1
      };
      getData(sendData);
    },
    [pagination.itemsPerPage, pagination.page]
  );
  useEffect(() => {
    onSubmit(form.getFieldsValue());
  }, [pagination.itemsPerPage, pagination.page]);
  const Filter = (
    <Form
      form={form}
      layout="vertical"
      {...layout}
      labelWrap
      onFinish={onSubmit}
    >
      <Form.Item
        className="col-span-12 sm:col-span-6 lg:col-span-3"
        name="lopThi"
        label="Mã lớp thi"
      >
        <Select
          allowClear
          onChange={(value) => handleFieldChanged("ki_hoc", value)}
        >
          {lopThi.map((item) => (
            <Select.Option key={item.lop_thi?.id}>
              {item.lop_thi?.ma}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
  let Content = undefined;
  if (loading) {
    Content = (
      <div className="p-2">
        {" "}
        <Spin />{" "}
      </div>
    );
  } else if (dataSource.length == 0) {
    Content = (
      <div className="p-2 text-center"> Giáo viên chưa có lớp thi nào</div>
    );
  } else {
    Content = (
      <>
        {dataSource.map((record: any) => {
          return (
            <Col span={24} key={record.id} className="my-2">
              <Card>
                {/* <p>
                  <strong>STT:</strong> {key + 1}
                </p> */}
                <p className="my-1">
                  <strong>{t("field.ma_lop_thi")}:</strong> {record.ma_lop_thi}
                </p>
                <p className="my-1">
                  <strong>{t("field.ma_lop")}:</strong> {record.ma_lop}
                </p>
                <p className="my-1">
                  <strong>{t("field.dot_thi")}: </strong>
                  {formatDotThi(record.loai)}
                </p>
                <p className="my-1">
                  <strong>{t("field.trang_thai")}: </strong>
                  {record.diem_count_not_null == record.diems_count &&
                  record.diems_count != 0 ? (
                    <Tag color="success">Hoàn thành</Tag>
                  ) : (
                    <Tag color="error">Chưa hoàn thành</Tag>
                  )}
                </p>
                <div className="flex justify-center">
                  {
                    <Tooltip title="Chi tiết">
                      <Link to={"bang-diem/" + record.id}>
                        <Button shape="circle" type="text">
                          <i className="fa-solid fa-chevron-right"></i>
                        </Button>
                      </Link>
                    </Tooltip>
                  }
                </div>
              </Card>
            </Col>
          );
        })}

        <div
          className="flex-grow-0"
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
          />
        </div>
      </>
    );
  }
  return (
    <div>
      {Filter}
      <div className="card-container card-chi-tiet-diem-danh">{Content}</div>
    </div>
  );
};

const ActionCellRender: FC<any> = ({ data }) => {
  if (!data) {
    return <span></span>;
  }
  return (
    <Tooltip title="Chi tiết">
      <Link to={"bang-diem/" + data.id + `?p=${data.lop_thi_id}`}>
        <Button shape="circle" type="text">
          <i className="fa-solid fa-chevron-right"></i>
        </Button>
      </Link>
    </Tooltip>
  );
};
const renderLopThi: FC<any> = ({ data }) => {
  if (!data) return <></>;

  return <span>{data.ma}</span>;
};
const renderLopHoc: FC<any> = ({ data }) => {
  if (!data) return <></>;

  return <span>{data.ma_lop}</span>;
};
export interface LoaiCellRendererParams extends ICellRendererParams {
  format: (value: string) => string;
}
const loaiCellRenderer: FC<LoaiCellRendererParams> = (params) => {
  if (!params.value) {
    return "";
  }
  if (!params.format) {
    return "";
  }

  return params.format(params.value);
};
const renderTrangThai: FC<any> = ({ data }) => {
  if (!data) return <></>;

  if (data.diem_count_not_null == data.diems_count && data.diems_count != 0) {
    return <Tag color="success">Hoàn thành</Tag>;
  } else {
    return <Tag color="error">Chưa hoàn thành</Tag>;
  }
};
