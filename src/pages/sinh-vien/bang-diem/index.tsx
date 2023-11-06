import { EditOutlined } from "@ant-design/icons";
import { FC, useCallback, useEffect, useState } from "react";
import BaseTable from "@/components/base-table";
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
import { ColDef, ICellRendererParams } from "ag-grid-community";
import PageContainer from "@/Layout/PageContainer";
import { useTranslation } from "react-i18next";
import bangDiemApi from "@/api/sinhVien/bangDiem.api";
import { ActionField } from "@/interface/common";
import { Lop } from "@/interface/lop";
import SelectFilter from "@/components/custom-filter/SelectFilter";
import SelectFloatingFilterCompoment from "@/components/custom-filter/SelectFloatingFilterCompoment";
import { Link } from "react-router-dom";
import { BangDiemSV } from "@/interface/bangdiem";
import kiHocApi from "@/api/kiHoc/kiHoc.api";
import { getPrefix } from "@/constant";
import { useAppSelector } from "@/stores/hook";
import { getKiHienGio } from "@/stores/features/config";
import BaseResponsive from "@/components/base-responsive";
import { useLoaiLopThi } from "@/hooks/useLoaiLopThi";

const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  filter: true,
  floatingFilter: true
};
const BangDiemPage = () => {
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

  const contentDesktop = () => <BangDiemPageDesktop kiHoc={kiHoc} />;
  const contentMobile = () =>
    kiHienGio && <BangDiemPageMobile kiHoc={kiHoc} kiHienGio={kiHienGio} />;
  return (
    <>
      <PageContainer title="Bảng điểm sinh viên">
        <BaseResponsive
          contentDesktop={contentDesktop}
          contentMobile={contentMobile}
        />
      </PageContainer>
    </>
  );
};

export default BangDiemPage;

const BangDiemPageDesktop: FC<{ kiHoc: string[] }> = ({ kiHoc }) => {
  const { t } = useTranslation("bang-diem-sinh-vien");
  const [columnDefs, setColumDefs] = useState<ColDef<Lop & ActionField>[]>([]);
  const ki_hoc_option = kiHoc.map((item) => {
    return {
      value: item,
      label: item
    };
  });
  const { format: formatDotThi } = useLoaiLopThi();
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
        data: ki_hoc_option
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
        headerName: t("field.ma_hp"),
        field: "ma_hp",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.ten_hp"),
        field: "ten_hp",
        filter: false
      },
      {
        headerName: t("field.lop_hoc"),
        field: "ma_lop",
        filter: false
      },
      {
        headerName: t("field.lop_thi"),
        field: "ma_lop_thi",
        filter: false,
        cellRenderer: LopThiCellRender
      },
      {
        headerName: t("field.dot_thi"),
        field: "loai",
        filter: false,
        cellRenderer: DotThiCellRender,
        cellRendererParams: {
          format: formatDotThi
        }
      },
      {
        headerName: t("field.diem"),
        field: "diem",
        filter: false
      },
      {
        headerName: t("field.diem_phuc_khao"),
        field: "diem_phuc_khao",
        filter: false,
        cellRenderer: DiemPhucKhaoRender
      },
      {
        headerName: t("field.han_phuc_khao"),
        field: "ngay_ket_thuc_phuc_khao",
        filter: false
      },
      {
        headerName: t("field.action"),
        field: "is_phuc_khao",
        width: 150,
        cellRenderer: ActionCellRender,
        cellRendererParams: {},
        filter: false
      }
    ]);
  }, [ki_hoc_option, formatDotThi]);

  return (
    <BaseTable
      columns={columnDefs}
      api={bangDiemApi.list}
      gridOption={{ defaultColDef: defaultColDef }}
    ></BaseTable>
  );
};

const BangDiemPageMobile: FC<{ kiHoc: string[]; kiHienGio: string }> = ({
  kiHoc,
  kiHienGio
}) => {
  const { format: formatDotThi } = useLoaiLopThi();
  const [dataSource, setDataSource] = useState<BangDiemSV[]>([]);
  const { t } = useTranslation("bang-diem-sinh-vien");

  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  const getData = useCallback(async (filter: any) => {
    setLoading(true);
    try {
      const res = await bangDiemApi.list(filter);
      setDataSource(res.data.list || []);
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
            name="mssv"
            label="MSSV"
          >
            <Input
              onChange={(e) => handleFieldChanged("mssv", e.target.value)}
            />
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
      <div className="p-2 text-center"> Sinh viên chưa có bảng điểm nào</div>
    );
  } else {
    Content = dataSource.map((record, key) => {
      const disabled = !record.is_phuc_khao;
      return (
        <Col span={24} key={record.id} className="my-2">
          <Card>
            <p>
              <strong>STT:</strong> {key + 1}
            </p>
            <p>
              <strong>{t("field.mssv")}:</strong> {record.mssv}
            </p>
            <p>
              <strong>{t("field.ma_hp")}:</strong> {record.ma_hp}
            </p>
            <p>
              <strong>{t("field.ki_hoc")}:</strong> {record.ki_hoc}
            </p>
            <p>
              <strong>{t("field.ten_hp")}:</strong> {record.ten_hp}
            </p>
            <p>
              <strong>{t("field.lop_hoc")}:</strong> {record.ma_lop}
            </p>
            <p>
              <strong>{t("field.lop_thi")}:</strong> {record.ma_lop_thi}
            </p>
            <p>
              <strong>{t("field.dot_thi")}:</strong>
              {formatDotThi(record.loai)}
            </p>
            <p>
              <strong>{t("field.diem")}:</strong> {record.diem}
            </p>
            <p>
              <strong>{t("field.han_phuc_khao")}:</strong>
              {record.ngay_ket_thuc_phuc_khao.toLocaleString()}
            </p>
            <div className="flex justify-center">
              <Tooltip placement="top">
                <Link to={getPrefix() + "/phuc-khao/" + record.id}>
                  <Button
                    disabled={disabled}
                    shape="circle"
                    icon={<EditOutlined />}
                    type="text"
                  ></Button>
                </Link>
              </Tooltip>
            </div>
          </Card>
        </Col>
      );
    });
  }

  return (
    <div>
      {Filter}
      <div className="card-container card-chi-tiet-diem-danh">{Content}</div>
    </div>
  );
};

const ActionCellRender: FC<{ data: any }> = ({ data }) => {
  if (!data) {
    return <span></span>;
  }
  const disabled = !data.is_phuc_khao;
  const text = data.is_phuc_khao ? "Phúc khảo" : "Hết hạn phúc khảo";
  return (
    <>
      <Tooltip placement="top" title={text}>
        <Link to={getPrefix() + "/phuc-khao/" + data.id}>
          <Button
            shape="circle"
            disabled={disabled}
            icon={<EditOutlined />}
            type="text"
          ></Button>
        </Link>
      </Tooltip>
    </>
  );
};

const LopThiCellRender: FC<{ data: any }> = ({ data }) => {
  if (!data) {
    return <span></span>;
  }
  if (data.loai != "GK") return <span>{data.ma_lop_thi}</span>;
};

export interface LoaiCellRendererParams extends ICellRendererParams {
  format: (value: string) => string;
}
const DotThiCellRender: FC<LoaiCellRendererParams> = (params) => {
  if (!params.value) {
    return "";
  }
  return params.format(params.value);
};

const DiemPhucKhaoRender: FC<{ data: any }> = ({ data }) => {
  if (!data) {
    return <span></span>;
  }
  if (data.diem_phuc_khao == null) {
    return <span>Chưa phúc khảo</span>;
  }
  if (data.diem == data.diem_phuc_khao) {
    return <span>Không thay đổi</span>;
  }
  if (data.diem != data.diem_phuc_khao) {
    return <span>{data.diem_phuc_khao}</span>;
  }
};
