import { useEffect, useState } from "react";
import BaseTable from "@/components/base-table/lan-diem-danh";
import PageContainer from "@/Layout/PageContainer";
// import { DeleteOutlined } from "@ant-design/icons";
import lopHocApi from "@/api/lop/lopHoc.api";
import kiHocApi from "@/api/kiHoc/kiHoc.api";
import { convertErrorAxios } from "@/api/axios";
import {
  Button,
  Select,
  Form,
  Row,
  Col,
  notification,
  Tooltip,
  InputNumber
} from "antd";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import configApi from "@/api/config.api";
const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  filter: true,
  floatingFilter: true
};
const { Option } = Select;
interface LoaiLop {
  value: number;
  name: string;
}
const ThongKeDiemDanhPage = () => {
  const [kiHoc, setKihoc] = useState<string[]>([]);
  const lanDiemDanh = [1, 2, 3, 4];
  const [loaiLop, setLoaiLop] = useState<LoaiLop[]>([
    { value: 1, name: "Đại cương" },
    { value: 2, name: "Chuyên ngành" }
  ]);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [values, setValues] = useState<any>({});
  const [listData, setListData] = useState<any[]>([]);
  const [kiHienGio, setKiHienGio] = useState<string>("");
  const [errorMessage, setErrorMessage] =
    useState<LaravelValidationResponse | null>(null);
  const [form] = Form.useForm();
  const [loaded, setLoaded] = useState(false);
  const [updatedColumnsDef] = useState<any[]>([
    {
      title: "Tên giảng viên",
      key: "name",
      render: (_: any, record: any) => {
        const giaoViens = record.lop.giao_viens;
        if (giaoViens.length > 0) {
          const uniqueNames: string[] = [];
          const names = giaoViens.map((gv: any) => gv.name);

          names.forEach((name: any) => {
            if (!uniqueNames.includes(name)) {
              uniqueNames.push(name);
            }
          });

          return (
            <Tooltip title={uniqueNames.join(", ")}>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100px"
                }}
              >
                {uniqueNames.join(", ")}
              </div>
            </Tooltip>
          );
        }
        return "";
      }
    },
    {
      title: "Mã học phần",
      dataIndex: ["lop", "ma_hp"],
      key: "ma_hp"
    },
    {
      title: "Tên học phần",
      dataIndex: ["lop", "ten_hp"],
      key: "ten_hp"
    },
    {
      title: "Mã lớp",
      dataIndex: ["lop", "ma"],
      key: "ma"
    },
    {
      title: "Loại",
      dataIndex: ["lop", "loai"],
      key: "loai"
    },
    {
      title: "Tuần học",
      dataIndex: ["lop", "tuan_hoc"],
      key: "tuan_hoc"
    },
    {
      title: "Số lần điểm danh",
      dataIndex: "count",
      key: "lan"
    },
    {
      title: "Tuần đóng điểm danh",
      dataIndex: "",
      key: "tuan_dong_diem_danh"
    },
    {
      title: "Yêu cầu",
      dataIndex: ["lop", "loai"],
      key: "lan",
      render: (loaiLop: string) => {
        if (loaiLop === "BT" || loaiLop === "LT") {
          return 1;
        } else if (loaiLop === "BT+LT" || loaiLop === "LT+BT") {
          return 2;
        }
        return null;
      }
    },
    {
      title: "Lệch",
      dataIndex: "count", // Chỉ cần trỏ tới "count" ở đây
      key: "lech",
      render: (count: number, record: any) => {
        const loaiLop = record.lop.loai;
        const yeuCau =
          loaiLop === "BT" || loaiLop === "LT"
            ? 1
            : loaiLop === "BT+LT"
            ? 2
            : 0;
        const isNegative = count - yeuCau < 0;
        return (
          <span className={isNegative ? "negative-lech" : ""}>
            {count - yeuCau}
          </span>
        );
      }
    }
  ]);
  const handleChange = (name: any) => {
    if (errorMessage) {
      const updatedErrors = { ...errorMessage.errors };
      if (name && updatedErrors[name]) {
        updatedErrors[name] = [];
        setErrorMessage({ ...errorMessage, errors: updatedErrors });
      }
    }
  };
  useEffect(() => {
    const getKyHoc = async () => {
      const res = await kiHocApi.list();
      if (res.data && res.data.length > 0) {
        setKihoc(res.data);
      }
    };
    getKyHoc();
  }, []);
  useEffect(() => {
    const getKyHocHienGio = async () => {
      const res = await configApi.getKiHienGio();
      if (res.data && res.data.length > 0) {
        setKiHienGio(res.data);
      }
    };
    getKyHocHienGio();
  }, []);
  useEffect(() => {
    form.setFieldsValue({ ki_hoc: kiHienGio });
    onFinish({ ki_hoc: kiHienGio });
  }, [kiHienGio]);
  const onFinish = async (values: any) => {
    console.log(values);
    setLoading(true);
    try {
      setValues({ ...values });
    } catch (err: any) {
      const res = convertErrorAxios<LaravelValidationResponse>(err);
      setErrorMessage(err.data);
      if (res.type === "axios-error") {
        api.error({
          message: "message.error_edit",
          description: "message.error_desc_edit"
        });
        const { response } = res.error;
        if (response) setErrorMessage(response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await lopHocApi.listLopDiemDanh({ ...values });
        setListData(response.data);
        console.log(listData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    loaded && fetchData();
  }, [values]);
  return (
    <>
      {contextHolder}
      <Form
        method="POST"
        form={form}
        noValidate
        onFinish={onFinish}
        initialValues={{ ki_hoc: kiHienGio || undefined }}
        className="ki-hoc-lan-diem-danh"
        style={{ width: "100%" }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={4} lg={4} xxl={4}>
            <Form.Item
              label="Kì học"
              name="ki_hoc"
              style={{ marginBottom: "0" }}
            >
              <Select
                onChange={(selectedValues) => {
                  handleChange(selectedValues);
                }}
                filterOption={(input, option) => {
                  const searchText = input.toLowerCase();
                  const label = String(option?.label).toLowerCase();
                  return label?.includes(searchText);
                }}
                placeholder="Kỳ học"
              >
                {renderOptionAdmin(kiHoc)}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={4} lg={4} xxl={4}>
            <Form.Item
              label="Loại lớp"
              name="loai_lop"
              style={{ marginBottom: "0" }}
            >
              <Select
                allowClear
                onChange={(selectedValues) => {
                  handleChange(selectedValues);
                }}
                filterOption={(input, option) => {
                  const searchText = input.toLowerCase();
                  const label = String(option?.label).toLowerCase();
                  return label?.includes(searchText);
                }}
                placeholder="Chọn loại lớp"
              >
                {loaiLop.map((item) => (
                  <Option key={item.value} value={item.value} label={item.name}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={4} lg={4} xxl={4}>
            <Form.Item
              label="Đợt"
              name="lan_diem_danh"
              style={{ marginBottom: "0" }}
            >
              <Select
                onChange={(selectedValues) => {
                  handleChange(selectedValues);
                }}
                filterOption={(input, option) => {
                  const searchText = input.toLowerCase();
                  const label = String(option?.label).toLowerCase();
                  return label?.includes(searchText);
                }}
                placeholder="Đợt"
              >
                {renderOptionLan(lanDiemDanh)}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Form.Item
              label="Tuần điểm danh"
              name="tuan_diem_danh"
              style={{ marginBottom: "0" }}
            >
              <InputNumber
                placeholder="Tuần điểm danh"
                min={1}
                style={{ width: "100%" }}
                onChange={(value: any) => {
                  handleChange(value.toString()); // Convert the number value to a string and pass it to handleChange
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={3} lg={3} xl={3}>
            <Form.Item>
              <Button
                block
                htmlType="submit"
                loading={loading}
                type="primary"
                onClick={() => setLoaded(true)}
              >
                Lọc
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <PageContainer title="">
        <BaseTable
          columns={updatedColumnsDef}
          data={listData}
          gridOption={{ defaultColDef: defaultColDef }}
          loading={loading}
        />
      </PageContainer>
    </>
  );
};
export default ThongKeDiemDanhPage;

const renderOptionAdmin = (kihoc: string[]) => {
  if (!Array.isArray(kihoc)) return <></>;
  if (!kihoc || !kihoc.length) return <></>;
  return (
    <>
      {kihoc.map((item) => {
        return (
          <Option key={item} value={item} label={item}>
            {item}
          </Option>
        );
      })}
    </>
  );
};
const renderOptionLan = (lan: number[]) => {
  if (!Array.isArray(lan)) return <></>;
  if (!lan || !lan.length) return <></>;
  return (
    <>
      {lan.map((item) => {
        return (
          <Option key={item} value={item} label={item}>
            {item}
          </Option>
        );
      })}
    </>
  );
};
