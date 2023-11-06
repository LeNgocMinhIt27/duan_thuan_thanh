import PageContainer from "@/Layout/PageContainer";
import { LanDiemDanh } from "@/interface/lop";
import { useEffect, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { Col, Form, Input, Row, Tabs, Typography } from "antd";
import { useAppDispatch } from "@/stores/hook";
import { setHeightAuto } from "@/stores/features/config";
import LopHocDetailInfoPage from "../detail/info";
import DiemDanhListSinhVien from "./list-sinh-vien";
const { Title } = Typography;

const LopHocDetailPage = () => {
  const dispatch = useAppDispatch();
  const lan_diem_danh = useLoaderData() as LanDiemDanh;
  const lop = lan_diem_danh.lop as any;
  lop.ngay_mo_diem_danh = lan_diem_danh.ngay_mo_diem_danh;
  lop.ngay_dong_diem_danh = lan_diem_danh.ngay_dong_diem_danh;
  const isHasChild =
    !!lan_diem_danh.lop.children && lan_diem_danh.lop.children.length > 0;
  const tabs = useMemo(() => {
    if (!lan_diem_danh.lop || !lan_diem_danh.lop.children) {
      return [];
    }
    return lan_diem_danh.lop.children.map((x) => ({
      key: x.ma,
      label: x.ma,
      children: <DiemDanhListSinhVien lan_diem_danh={lan_diem_danh} lop={x} />
    }));
  }, [isHasChild, lan_diem_danh]);
  const breadcrumbs = useMemo(() => {
    return [
      { router: "../../", text: "Danh sách lớp dạy" },
      { text: lan_diem_danh.lop.ten_hp },
      {
        router: "../",
        text: lan_diem_danh.lop.ma
      },
      { text: "Điểm danh" }
    ];
  }, [lan_diem_danh]);

  useEffect(() => {
    dispatch(setHeightAuto(true));
    return () => {
      dispatch(setHeightAuto(false));
    };
  });
  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <Row className="full-width p-2">
        <Col span={24} className="px-4">
          <Title level={3} className="text-center">
            Thông tin
          </Title>
          <LopHocDetailInfoPage lop={lop}>
            <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
              <Form.Item
                label="Ngày mở điểm danh"
                name="ngay_mo_diem_danh"
                labelCol={{ span: 24 }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
              <Col span={24}>
                <Form.Item
                  label="Ngày đóng điểm danh"
                  name="ngay_dong_diem_danh"
                  labelCol={{ span: 24 }}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Col>
          </LopHocDetailInfoPage>
        </Col>
        <Col span={24}>
          {isHasChild ? (
            <Tabs defaultActiveKey="1" items={tabs} />
          ) : (
            <DiemDanhListSinhVien
              lan_diem_danh={lan_diem_danh}
              lop={lan_diem_danh.lop}
            />
          )}
        </Col>
      </Row>
    </PageContainer>
  );
};

export default LopHocDetailPage;
