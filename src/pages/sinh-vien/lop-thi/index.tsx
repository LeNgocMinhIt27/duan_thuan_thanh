import { Card, Col, Form, Input, Row, Select, Spin } from "antd";
import { FC, useCallback, useEffect, useState } from "react";
import { ActionField } from "@/interface/common";
import BaseResponsive from "@/components/base-responsive";
import BaseTable from "@/components/base-table";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { LopThi } from "@/interface/lop-thi";
import PageContainer from "@/Layout/PageContainer";
import SelectFilter from "@/components/custom-filter/SelectFilter";
import SelectFloatingFilterCompoment from "@/components/custom-filter/SelectFloatingFilterCompoment";
import lopThiApi from "@/api/lop/lopThiCuaSinhVien.api";
import kiHocApi from "@/api/kiHoc/kiHoc.api";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/stores/hook";
import { getKiHienGio } from "@/stores/features/config";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localeData from "dayjs/plugin/localeData";
import moment from "moment";
import Calendar from "./Calendar";
import { useLoaiLopThi } from "@/hooks/useLoaiLopThi";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);

const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  filter: true,
  floatingFilter: true
};
const LopThiPage = () => {
  const kiHienGio = useAppSelector(getKiHienGio);
  const [kiHoc, setKihoc] = useState<string[]>([]);

  useEffect(() => {
    const getKyHoc = async () => {
      const res = await kiHocApi.list();
      if (res.data && res.data.length > 0) {
        setKihoc(res.data);
      }
    };
    getKyHoc();
  }, []);

  const contentDesktop = () => <LopThiPageDesktop kiHoc={kiHoc} />;
  const contentMobile = () =>
    kiHienGio && <LopThiPageMobile kiHoc={kiHoc} kiHienGio={kiHienGio} />;
  return (
    <>
      <PageContainer title="Lớp thi">
        <BaseResponsive
          contentDesktop={contentDesktop}
          contentMobile={contentMobile}
        />
      </PageContainer>
    </>
  );
};

export default LopThiPage;

const LopThiPageDesktop: FC<{ kiHoc: string[] }> = ({ kiHoc }) => {
  const { t } = useTranslation("lop-thi");
  const { items: dotThi, format: formatDotThi } = useLoaiLopThi();
  const [dataSource, setDataSource] = useState<LopThi[]>([]);
  const [columnDefs, setColumDefs] = useState<ColDef<LopThi & ActionField>[]>(
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

    const loai_columns: ColDef = {
      headerName: t("field.loai"),
      field: "loai",
      filter: SelectFilter,
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
      ki_hoc_columns,
      {
        headerName: t("field.ma_lop_thi"),
        field: "ma",
        filter: "agTextColumnFilter"
      },
      loai_columns,
      {
        headerName: t("field.ngay_thi"),
        field: "ngay_thi",
        filter: "agDateColumnFilter",
        cellRenderer: DateFormat
      },
      {
        headerName: t("field.kip_thi"),
        field: "kip_thi",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.phong_thi"),
        field: "phong_thi",
        filter: "agTextColumnFilter"
      }
    ]);
  }, [dotThi, kiHoc, t]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await lopThiApi.list();
      if (response.data) {
        setDataSource(response.data);
      }
    };

    fetchData();
  }, []);

  return (
    <Row className="flex-grow-0">
      <Col span={24}>
        <BaseTable
          columns={columnDefs}
          api={lopThiApi.list}
          gridOption={{ defaultColDef: defaultColDef }}
        ></BaseTable>
      </Col>
      <Col span={24}>
        <Calendar event={dataSource} />
      </Col>
    </Row>
  );
};

const LopThiPageMobile: FC<{
  kiHoc: string[];
  kiHienGio: string;
}> = ({ kiHoc, kiHienGio }) => {
  const [dataSource, setDataSource] = useState<LopThi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { format: formatDotThi } = useLoaiLopThi();
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  const getData = useCallback(async (filter: any) => {
    setLoading(true);
    try {
      const res = await lopThiApi.list(filter);
      setDataSource(res.data || []);
    } finally {
      setLoading(false);
    }
  }, []);
  const handleFieldChanged = (field: string, value: any) => {
    form.setFieldsValue({ [field]: value });
    onSubmit(form.getFieldsValue());
  };
  const onSubmit = (filter?: any) => {
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
            label="Mã lớp thi"
          >
            <Input onChange={(e) => handleFieldChanged("ma", e.target.value)} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="phong_thi"
            label="Phòng thi"
          >
            <Input
              onChange={(e) => handleFieldChanged("phong_thi", e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="kip_thi"
            label="Kíp thi"
          >
            <Input
              onChange={(e) => handleFieldChanged("kip_thi", e.target.value)}
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
        Sinh viên chưa tham gia lớp thi nào
      </div>
    );
  } else {
    Content = dataSource.map((record) => (
      <Col span={24} key={record.id} className="my-2">
        <Card>
          <p>
            <strong>Mã lớp thi:</strong> {record.ma}
          </p>
          <p>
            <strong>Đợt thi:</strong> {formatDotThi(record.loai)}
          </p>
          <p>
            <strong>Ngày thi:</strong> <DateFormat data={record} />
          </p>
          <p>
            <strong>Kíp thi:</strong> {record.kip_thi}
          </p>
          <p>
            <strong>Phòng:</strong> {record.phong_thi}
          </p>
        </Card>
      </Col>
    ));
  }

  return (
    <div>
      {Filter}
      <div className="card-container card-chi-tiet-diem-danh">{Content}</div>
      <Col span={24}>
        <Calendar event={dataSource} />
      </Col>
    </div>
  );
};

const DateFormat: FC<any> = ({ data }) => {
  if (!data) {
    return <span></span>;
  }
  if (!data.ngay_thi) {
    return <span></span>;
  }

  const formattedDate = moment(data.ngay_thi).format("DD/MM/YYYY");
  return <>{<span>{formattedDate}</span>}</>;
};

export interface LoaiCellRendererParams extends ICellRendererParams {
  format: (value: string) => string;
}
const loaiCellRenderer: FC<LoaiCellRendererParams> = (params) => {
  if (!params.value) {
    return "";
  }
  return params.format(params.value);
};
