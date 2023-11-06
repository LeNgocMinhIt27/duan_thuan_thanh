import { Row, Col } from "antd";
import thanhcong from "../../assets/static/phuc-khao.jpg";
import { useMediaQuery } from "react-responsive";
const PhucKhaoThanhCong = () => {
  const isMobile = useMediaQuery({ maxWidth: 500 });
  return (
    <div className="phuc-khao-thanh-cong">
      <Row justify="center">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <div className="phuc-khao-thanh-cong__content">
            <h1>THÔNG BÁO</h1>
            <h2>PHÚC KHẢO THÀNH CÔNG</h2>
            <Row justify="center">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <img
                  src={thanhcong}
                  alt="Thanh cong"
                  style={{ maxWidth: "100%" }}
                ></img>
              </Col>
            </Row>
            <h3>
              Hệ thống đã tiếp nhận thông tin yêu cầu phúc khảo
              {!isMobile ? <br></br> : ""}và thông tin nộp phí phúc khảo thành
              công.
            </h3>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default PhucKhaoThanhCong;
