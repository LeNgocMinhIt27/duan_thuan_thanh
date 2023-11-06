import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  notification
} from "antd";
import { DiemDanhSinhVien, Lop } from "@/interface/lop";
import React, { useEffect, useState } from "react";

import { GiaoVien } from "@/interface/giaoVien";
import PageContainer from "@/Layout/PageContainer";
import TableDiemDanh from "./info";
import { sdk } from "@/api/axios";
import { setHeightAuto } from "@/stores/features/config";
import LopSinhVienApi from "@/api/lop/lopCuaSinhVien.api";
import { useMediaQuery } from "react-responsive";
import { useAppDispatch } from "@/stores/hook";
import { useParams } from "react-router-dom";

const layout = {
  // labelCol: { span: 12 },
  // wrapperCol: { span: 24 },
};
const LopHocSDetailPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [data, setData] = useState<Lop | any>([]);
  const [giaoVien, setGiaoVien] = useState<GiaoVien[]>();
  const [diemDanh, setDiemDanh] = useState<DiemDanhSinhVien[]>();
  const [dataSource, setDataSource] = useState<DiemDanhSinhVien[]>([]);
  const param = useParams();
  const { Option } = Select;
  const [api, contextHolder] = notification.useNotification();

  const getDiemDanh = async () => {
    try {
      const res = await LopSinhVienApi.getDiemDanh(param.id);
      setDiemDanh(res.data);
    } catch (error) {
      api.error({
        message: "Thất bại",
        description: "Hiện nay không thể lấy thông tin điểm danh của bạn"
      });
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const res = await sdk.get(`student-lop-list/${param.id}`);
        setData(res.data);
        setGiaoVien(res.data.giao_viens.map((item: GiaoVien) => item.name));
        form.setFieldsValue({
          ...res.data,
          giao_viens: res.data.giao_viens.map((item: GiaoVien) => item.name)
        });
      } catch (err) {
        console.log(err);
      }
    };
    initData();
    getDiemDanh();
  }, []);

  useEffect(() => {
    dispatch(setHeightAuto(true));
    return () => {
      dispatch(setHeightAuto(false));
    };
  });
  useEffect(() => {
    const getdataSource = async () => {
      const res = await LopSinhVienApi.getDiemDanh(param.id);
      if (res.data && res.data.length > 0) {
        setDataSource(res.data);
      }
    };
    getdataSource();
  }, []);
  const isMobile = useMediaQuery({ maxWidth: 600 });
  return (
    <>
      <PageContainer title={`Thông tin lớp học mã ${data.ma}`}>
        <div>
          <Form
            {...layout}
            form={form}
            disabled={true}
            layout="vertical"
            className=""
          >
            {contextHolder}
            <Row>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  style={{ padding: "0 16px" }}
                  name="ki_hoc"
                  label="Kì học"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  style={{ padding: "0 16px" }}
                  name="loai"
                  label="Loại"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  style={{ padding: "0 16px" }}
                  name="ma_hp"
                  label="Mã học phần"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  style={{ padding: "0 16px" }}
                  name="ten_hp"
                  label="Tên học phần"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  style={{ padding: "0 16px" }}
                  name="ma_kem"
                  label="Mã lớp kèm"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  style={{ padding: "0 16px" }}
                  name="ma"
                  label="Mã lớp"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  style={{ padding: "0 16px" }}
                  name="phong"
                  label="Phòng"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  style={{ padding: "0 16px" }}
                  name="ghi_chu"
                  label="Ghi chú"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={24}>
                <Form.Item
                  style={{ padding: "0 16px" }}
                  name="giao_viens"
                  label="Giảng viên"
                >
                  <Select mode="multiple" suffixIcon={null}>
                    {giaoVien &&
                      giaoVien.map((item, index) => (
                        <Option key={index} value={item.name}>
                          <></>
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div style={{ marginTop: "8px" }}>
          <Typography.Title
            level={3}
            style={{ textAlign: "left", marginTop: "20px" }}
          >
            Điểm chuyên cần học tập:{" "}
            {data.sinh_viens ? data.sinh_viens[0].pivot.diem : ""}
          </Typography.Title>
          <Typography.Title level={3} style={{ textAlign: "center" }}>
            Danh sách điểm danh
          </Typography.Title>

          {isMobile ? (
            <div className="card-container card-chi-tiet-diem-danh">
              {dataSource.map((record, key) => (
                <Col span={24} key={record.id}>
                  <Card>
                    <p>
                      <strong>STT:</strong> {key + 1}
                    </p>
                    <p>
                      <strong>Lớp:</strong> {record.ma_lop}
                    </p>
                    <p>
                      <strong>Loại:</strong> {record.loai}
                    </p>
                    <p>
                      <strong>Lần:</strong> {record.lan}
                    </p>
                    <p>
                      <strong>Ngày điểm danh:</strong> {record.ngay_diem_danh}
                    </p>
                    <p>
                      <strong>Điểm danh:</strong> {record.co_mat}
                    </p>
                  </Card>
                </Col>
              ))}
            </div>
          ) : (
            <TableDiemDanh diemDanh={diemDanh} />
          )}
        </div>
      </PageContainer>
    </>
  );
};

export default LopHocSDetailPage;
