import { Typography, Row, Col, Button } from "antd";

import { useMediaQuery } from "react-responsive";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { IQrCode, PhucKhao } from "@/interface/phucKhao";
import { getPrefix } from "@/constant";
const QrCode = () => {
  const [dataQr, phucKhao] = useLoaderData() as [IQrCode, PhucKhao];
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ minWidth: 800 });
  const { Title, Paragraph } = Typography;
  const handleMoveDiem = () => {
    return navigate(getPrefix() + "/phuc-khao");
  };

  const addInfo = "SAMI" + (phucKhao.ma_thanh_toan || "");

  return (
    <>
      <div
        className="qr-code"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          position: "relative"
        }}
      >
        <Row
          justify="center"
          style={{ width: isMobile ? "800px" : "100%", textAlign: "center" }}
        >
          <Col xs={24} sm={16} md={12} lg={12} xl={12}>
            <Title
              level={3}
              style={{
                fontWeight: "700",
                marginTop: isMobile ? "15px" : "20px",
                fontSize: isMobile ? "24px" : "18px"
              }}
            >
              THÔNG TIN NỘP PHÍ PHÚC KHẢO
            </Title>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                className="loading-container"
                src={`https://img.vietqr.io/image/${dataQr?.ten_ngan_hang}-${dataQr?.so_tai_khoan}-${dataQr?.image}.png?amount=${dataQr?.so_tien}&addInfo=${addInfo}&accountName=${dataQr?.ten_tai_khoan}`}
                alt="QR Code"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  backgroundColor: "#f0f2f5"
                }}
              />
            </div>
            <Paragraph
              style={{
                marginTop: "-10px",
                marginBottom: "8px",
                fontSize: "25px",
                color: "#cf1627",
                fontWeight: "bolder"
              }}
            ></Paragraph>
            <Row justify="start" align="middle">
              <Col xs={18} sm={18} md={18} lg={18} xl={18}>
                <Link to={getPrefix() + "/phuc-khao"}>
                  <Button className="kiem-tra-ck-code">
                    <span style={{ fontSize: isMobile ? "14px" : "12px" }}>
                      Kiểm tra trạng thái chuyển khoản
                    </span>
                  </Button>
                </Link>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <Button className="dong-qr-code" onClick={handleMoveDiem}>
                  ĐÓNG
                </Button>
              </Col>
            </Row>
          </Col>
          <Paragraph style={{ marginTop: "20px", marginBottom: "0" }}>
            Hệ thống tự động cập nhật trạng thái nộp phí phúc khảo sau mỗi 5s
            hoặc
          </Paragraph>
          <Paragraph style={{ marginBottom: "20px" }}>
            có thể chủ động nhấn nút kiểm tra trạng thái chuyển khoản để theo
            dõi trạng thái thanh toán.
          </Paragraph>
        </Row>
      </div>
    </>
  );
};
export default QrCode;
