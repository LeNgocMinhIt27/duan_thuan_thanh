import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Tooltip
} from "antd";
import { FC, useCallback, useEffect, useState } from "react";

import { ActionField } from "@/interface/common";
import BaseResponsive from "@/components/base-responsive";
import BaseTable from "@/components/base-table";
import { ColDef } from "ag-grid-community";
import { EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Lop } from "@/interface/lop";
import PageContainer from "@/Layout/PageContainer";
import SelectFilter from "@/components/custom-filter/SelectFilter";
import SelectFloatingFilterCompoment from "@/components/custom-filter/SelectFloatingFilterCompoment";
import { getKiHienGio } from "@/stores/features/config";
import kiHocApi from "@/api/kiHoc/kiHoc.api";
import lopHocApi from "@/api/lop/lopCuaSinhVien.api";
import { useAppSelector } from "@/stores/hook";
import { useTranslation } from "react-i18next";

const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  filter: true,
  floatingFilter: true
};
const LopHocPage = () => {
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

  const contentDesktop = () => <LopHocPageDesktop kiHoc={kiHoc} />;
  const contentMobile = () =>
    kiHienGio && <LopHocPageMobile kiHoc={kiHoc} kiHienGio={kiHienGio} />;
  return (
    <>
      <PageContainer title="Lớp học">
        <BaseResponsive
          contentDesktop={contentDesktop}
          contentMobile={contentMobile}
        />
      </PageContainer>
    </>
  );
};

export default LopHocPage;

const ActionCellRender: FC<{ data: Lop }> = ({ data }) => {
  if (!data) {
    return <span></span>;
  }
  return (
    <Tooltip title="Chi tiết">
      <Link to={"" + data.id}>
        <Button shape="circle" icon={<EditOutlined />} type="text"></Button>
      </Link>
    </Tooltip>
  );
};
const LopHocPageDesktop: FC<{ kiHoc: string[] }> = ({ kiHoc }) => {
  const { t } = useTranslation("lop");
  const [columnDefs, setColumDefs] = useState<ColDef<Lop & ActionField>[]>([]);
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
        headerName: t("field.ma"),
        field: "ma",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.ma_kem"),
        field: "ma_kem",
        filter: "agTextColumnFilter"
      },

      {
        headerName: t("field.ma_hp"),
        field: "ma_hp",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.ten_hp"),
        field: "ten_hp",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.phong"),
        field: "phong",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.loai"),
        field: "loai",
        filter: "agTextColumnFilter"
      },

      {
        headerName: t("field.ghi_chu"),
        field: "ghi_chu",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.action"),
        field: "action",
        width: 200,
        cellRenderer: ActionCellRender,
        cellRendererParams: {},
        filter: false
      }
    ]);
  }, [kiHoc, t]);
  return (
    <BaseTable
      columns={columnDefs}
      api={lopHocApi.list}
      gridOption={{ defaultColDef: defaultColDef }}
    ></BaseTable>
  );
};

const LopHocPageMobile: FC<{ kiHoc: string[]; kiHienGio: string }> = ({
  kiHoc,
  kiHienGio
}) => {
  const [dataSource, setDataSource] = useState<Lop[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  const getData = useCallback(async (filter: any) => {
    setLoading(true);
    try {
      const res = await lopHocApi.list(filter);
      setDataSource(res.data || []);
    } finally {
      setLoading(false);
    }
  }, []);
  const handleFieldChanged = (field: string, value: any) => {
    form.setFieldsValue({ [field]: value });
    onSubmit(form.getFieldsValue());
  };
  const onSubmit = (filter: any) => {
    getData(filter);
  };
  useEffect(() => {
    form.setFieldsValue({ ki_hoc: kiHienGio });
    onSubmit({ ki_hoc: kiHienGio });
  }, []);
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
            label="Kỳ học"
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
            name="ma"
            label="Mã lớp"
          >
            <Input onChange={(e) => handleFieldChanged("ma", e.target.value)} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ma_hp"
            label="Mã học phần"
          >
            <Input
              onChange={(e) => handleFieldChanged("ma_hp", e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ten_hp"
            label="Tên học phần"
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
      <div className="p-2 text-center">
        {" "}
        Sinh viên chưa tham gia lớp học nào
      </div>
    );
  } else {
    Content = dataSource.map((record, key) => (
      <Col span={24} key={record.id} className="my-2">
        <Card>
          <p>
            <strong>STT:</strong> {key + 1}
          </p>
          <p>
            <strong>Mã lớp:</strong> {record.ma}
          </p>
          <p>
            <strong>Mã lớp kèm:</strong> {record.ma_kem}
          </p>
          <p>
            <strong>Mã học phần:</strong> {record.ma_hp}
          </p>
          <p>
            <strong>Tên học phần:</strong> {record.ten_hp}
          </p>
          <p>
            <strong>Phòng:</strong> {record.phong}
          </p>
          <p>
            <strong>Loại:</strong> {record.loai}
          </p>
          <p>
            <strong>Ghi chú:</strong> {record.ghi_chu}
          </p>
          <div className="flex justify-center">
            <Tooltip title="Chi tiết">
              <Link to={"" + record.id}>
                <Button
                  shape="circle"
                  icon={<EditOutlined />}
                  type="text"
                ></Button>
              </Link>
            </Tooltip>
          </div>
        </Card>
      </Col>
    ));
  }

  return (
    <div>
      {Filter}
      <div className="card-container card-chi-tiet-diem-danh">{Content}</div>
    </div>
  );
};
