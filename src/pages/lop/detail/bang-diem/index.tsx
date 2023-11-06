import PageContainer from "@/Layout/PageContainer";
import { LopThi } from "@/interface/lop";
import { useEffect, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { Col, Row, Typography } from "antd";
import { useAppDispatch } from "@/stores/hook";
import { setHeightAuto } from "@/stores/features/config";
import LopHocDetailInfoPage from "../info";
import BangDiemSinhVien from "./bang-diem-sinh-vien";
const { Title } = Typography;

const LopThiBangDiemPage = () => {
  const dispatch = useAppDispatch();
  const lop_thi = useLoaderData() as LopThi;

  const lop = lop_thi.lop as any;
  const breadcrumbs = useMemo(() => {
    return [
      { router: "../../", text: "Danh sách lớp dạy" },
      { text: lop_thi.lop?.ten_hp },
      {
        router: "../",
        text: lop_thi.lop?.ma
      },
      { text: "Bảng điểm" }
    ];
  }, [lop_thi]);

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
          <LopHocDetailInfoPage lop={lop} />
        </Col>
        <Col span={24}>
          <Title level={3} className="text-center">
            Bảng điểm Sinh Viên
          </Title>
          <BangDiemSinhVien lop_thi={lop_thi} lop={lop_thi.lop} />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default LopThiBangDiemPage;
