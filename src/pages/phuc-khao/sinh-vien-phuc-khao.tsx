import { Button, Card, Col, Form, Input, Row, Select, Spin, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FC, useCallback, useEffect, useState } from "react";
import PageContainer from "@/Layout/PageContainer";
import { Pagination } from "antd";
import { useTranslation } from "react-i18next";
import BaseTable from "@/components/base-table";
import { ColDef } from "ag-grid-community";
import { ActionField } from "@/interface/common";
import BaseResponsive from "@/components/base-responsive";
// import CreateNEditDialog from "@/components/createNEditDialog";
import DeleteDialog from "@/components/dialog/deleteDialog";
import { Link } from "react-router-dom";
import { Paginate } from "@/interface/axios";
import { PaginationProps } from "antd/lib";
import { PhucKhao } from "@/interface/phucKhao";
import SelectFilter from "@/components/custom-filter/SelectFilter";
import SelectFloatingFilterCompoment from "@/components/custom-filter/SelectFloatingFilterCompoment";
import { getKiHienGio } from "@/stores/features/config";
import { getPrefix } from "@/constant";
import kiHocApi from "@/api/kiHoc/kiHoc.api";
// import phucKhaoAdmin from "@/api/phucKhao/phucKhaoAdmin.api";
import phucKhaoSinhVienApi from "@/api/phucKhao/phucKhaoSinhVien.api";
import { useAppSelector } from "@/stores/hook";

const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  filter: true,
  floatingFilter: true
};
const PhucKhaoPages = () => {
  const [kiHoc, setKihoc] = useState<string[]>([]);
  const kiHienGio = useAppSelector(getKiHienGio);

  useEffect(() => {
    const getKyHoc = async () => {
      const res = await kiHocApi.list();
      if (res.data && res.data.length > 0) {
        setKihoc(res.data);
      }
    };
    getKyHoc();
  }, []);

  const contentDesktop = () => <PhucKhaoPagesDesktop kiHoc={kiHoc} />;
  const contentMobile = () =>
    kiHienGio && <PhucKhaoPagesMobile kiHoc={kiHoc} kiHienGio={kiHienGio} />;
  return (
    <>
      <PageContainer title="Quản lý phúc khảo">
        <BaseResponsive
          contentDesktop={contentDesktop}
          contentMobile={contentMobile}
        />
      </PageContainer>
    </>
  );
};

export default PhucKhaoPages;

const PhucKhaoPagesDesktop: FC<{ kiHoc: string[] }> = ({ kiHoc }) => {
  const { t } = useTranslation("phuc-khao");
  const [data, setData] = useState<PhucKhao>();
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [keyRender, setKeyRender] = useState(0);
  const [columnDefs, setColumDefs] = useState<ColDef<PhucKhao & ActionField>[]>(
    []
  );
  useEffect(() => {
    const ki_hoc_columns: ColDef = {
      headerName: t("field.ki_hoc"),
      field: "ki_hoc",
      filter: SelectFilter,
      floatingFilter: true
    };
    if (kiHoc && kiHoc.length > 0) {
      ki_hoc_columns.floatingFilterComponent = SelectFloatingFilterCompoment;
      ki_hoc_columns.floatingFilterComponentParams = {
        suppressFilterButton: true,
        placeholder: "Kỳ học",
        data: kiHoc.map((x: any) => ({ value: x, label: x }))
      };
    }
    setColumDefs([
      ki_hoc_columns,
      {
        headerName: t("field.mssv"),
        field: "mssv",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.ma_lop"),
        field: "ma_lop",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.ma_lop_thi"),
        field: "ma_lop_thi",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.ma_thanh_toan"),
        field: "ma_thanh_toan",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.trang_thai"),
        field: "trang_thai",
        filter: SelectFilter,
        floatingFilterComponent: SelectFloatingFilterCompoment,
        cellRenderer: StatusCellRender,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Trạng thái",
          data: statusoption
        }
      },
      {
        headerName: t("field.action"),
        field: "action",
        pinned: "right",
        width: 150,
        cellRenderer: ActionCellRender,
        cellRendererParams: {
          onDeleteItem: (item: PhucKhao) => {
            setData(item);
            setIsModalDelete(true);
            // setKeyRender(Math.random());
          }
        }
      }
    ]);
  }, [kiHoc]);
  return (
    <>
      <BaseTable
        columns={columnDefs}
        api={phucKhaoSinhVienApi.list}
        key={keyRender}
        gridOption={{ defaultColDef: defaultColDef }}
      ></BaseTable>
      <DeleteDialog
        openModal={isModalDelete}
        translation="phuc-khao"
        closeModal={setIsModalDelete}
        name={"Đơn phúc khảo"}
        apiDelete={() => {
          data && phucKhaoSinhVienApi.delete(data);
          setKeyRender(Math.random());
        }}
      />
    </>
  );
};

const PhucKhaoPagesMobile: FC<{
  kiHoc: string[];
  kiHienGio: string;
}> = ({ kiHoc, kiHienGio }) => {
  const [dataSource, setDataSource] = useState<PhucKhao[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PhucKhao>();
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [keyRender, setKeyRender] = useState(0);
  const { t } = useTranslation("phuc-khao");
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  const getData = useCallback(
    async (filter: any) => {
      setLoading(true);
      try {
        const res = await phucKhaoSinhVienApi.list(filter);
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
    },
    [keyRender]
  );
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
          ki_hoc: {
            filterType: "text",
            type: "contains",
            filter: filter.ki_hoc
          },
          ma_lop: {
            filterType: "text",
            type: "contains",
            filter: filter.ma_lop
          },
          ma_lop_thi: {
            filterType: "text",
            type: "contains",
            filter: filter.ma_lop_thi
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
    form.setFieldsValue({ ki_hoc: kiHienGio });
    onSubmit({ ki_hoc: kiHienGio });
  }, []);
  useEffect(() => {
    onSubmit(form.getFieldsValue());
  }, [pagination.itemsPerPage, pagination.page, keyRender]);
  const Filter = (
    <Form
      form={form}
      layout="vertical"
      {...layout}
      labelWrap
      onFinish={onSubmit}
      initialValues={{
        ki_hoc: kiHienGio
      }}
    >
      <Row>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ki_hoc"
            label="Kì học"
          >
            <Select onChange={(value) => handleFieldChanged("ki_hoc", value)}>
              {kiHoc.map((item) => (
                <Select.Option key={item}>{item}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ma_lop"
            label="Mã lớp"
          >
            <Input onChange={(e) => handleFieldChanged("ma", e.target.value)} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ma_lop_thi"
            label="Mã lớp thi"
          >
            <Input
              onChange={(e) => handleFieldChanged("ten_hp", e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
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
      <div className="p-2 text-center"> Sinh viên chưa gửi phúc khảo nào</div>
    );
  } else {
    Content = (
      <>
        {dataSource.map((record, key) => {
          return (
            <Col span={24} key={record.id} className="my-2">
              <Card>
                <p className="my-1">
                  <strong>STT:</strong> {key + 1}
                </p>
                <p className="my-1">
                  <strong>{t("field.mssv")}:</strong> {record.mssv}
                </p>
                <p className="my-1">
                  <strong>{t("field.ki_hoc")}:</strong> {record.ki_hoc}
                </p>
                <p className="my-1">
                  <strong>{t("field.ma_lop")}:</strong> {record.ma_lop}
                </p>
                <p className="my-1">
                  <strong>{t("field.ma_lop_thi")}:</strong> {record.ma_lop_thi}
                </p>
                <p className="my-1">
                  <strong>{t("field.ma_thanh_toan")}:</strong>{" "}
                  {record.ma_thanh_toan}
                </p>
                <p className="my-1">
                  <strong>{t("field.trang_thai")}:</strong>{" "}
                  {record.trang_thai == 1 ? "Đã xử lý" : "Chưa xử lý"}
                </p>
                <div className="flex justify-center">
                  <>
                    <Link to={getPrefix() + "/qr-code/" + record.id}>
                      <Button
                        shape="circle"
                        icon={<EditOutlined />}
                        type="text"
                      />
                    </Link>
                    <Button
                      shape="circle"
                      icon={<DeleteOutlined />}
                      type="text"
                      onClick={() => {
                        setData(record);
                        setIsModalDelete(true);
                      }}
                    />
                  </>
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
      <div className="card-container card-chi-tiet-diem-danh">
        {Content}
        <DeleteDialog
          openModal={isModalDelete}
          translation="phuc-khao"
          closeModal={setIsModalDelete}
          name={"Đơn phúc khảo"}
          apiDelete={() => data && phucKhaoSinhVienApi.delete(data)}
          setKeyRender={setKeyRender}
        />
      </div>
    </div>
  );
};

const statusoption = [
  {
    value: "1",
    label: "Đã thanh toán"
  },
  {
    value: "0",
    label: "Chưa thanh toán"
  }
];

const ActionCellRender: FC<any> = ({ onDeleteItem, data }) => {
  if (!data) {
    return <span></span>;
  }
  return (
    <>
      <Link to={getPrefix() + "/qr-code/" + data.id}>
        <Button shape="circle" icon={<EditOutlined />} type="text" />
      </Link>
      <Button
        shape="circle"
        icon={<DeleteOutlined />}
        type="text"
        onClick={() => onDeleteItem(data)}
      />
    </>
  );
};

const StatusCellRender: FC<any> = ({ data }) => {
  if (!data) {
    return <span></span>;
  }
  return (
    <>
      {data.trang_thai == 0 ? (
        <Tag key="0">Chưa thanh toán</Tag>
      ) : data.trang_thai == 1 ? (
        <Tag key="1">Đã thanh toán</Tag>
      ) : null}
    </>
  );
};
