import { Button, Col, Input, Row } from "antd";
import { Navigate, useLoaderData } from "react-router-dom";

import CreateMaCode from "./xac-nhan";
import { DiemSinhVienPhucKhao } from "@/interface/sinhVien";
import { EditOutlined } from "@ant-design/icons";
import { Lop } from "@/interface/lop";
import { getPrefix } from "@/constant";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";

const PhucKhaoFrom = () => {
  const data = useLoaderData() as DiemSinhVienPhucKhao;
  const [isEdit, setIsEdit] = useState(false);
  const [lopData] = useState<Lop>();
  const [modalEditor, setModalEditor] = useState(false);
  const isMobile = useMediaQuery({ minWidth: 600 });
  if (data.trang_thai_phuc_khao) {
    return <Navigate to={getPrefix() + "/phuc-khao"} />;
  }
  return (
    <div
      className="phuc-khao-sinh-vien-form"
      style={{ backgroundColor: "#f5f5f5", padding: 10 }}
    >
      <Row justify="center">
        <h1 style={{ marginBottom: 20, marginTop: 0 }}>PHÚC KHẢO</h1>
      </Row>
      <Row justify="center">
        <Col span={isMobile ? 16 : 24}>
          <div style={{ backgroundColor: "white", padding: 20 }}>
            <Row justify="space-evenly">
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <div>
                  <Input
                    size="large"
                    placeholder="MSSV"
                    style={{ margin: "10px 0 " }}
                    value={data?.mssv}
                    disabled
                  />
                  <Input
                    size="large"
                    placeholder="Mã học phần"
                    style={{ margin: "10px 0 " }}
                    value={data?.ma_hp}
                    disabled
                  />
                  <Input
                    size="large"
                    placeholder="Mã lớp học"
                    style={{ margin: "10px 0 " }}
                    value={data?.ma_lop}
                    disabled
                  />
                  <Input
                    size="large"
                    placeholder="Mã lớp thi"
                    style={{ margin: "10px 0 " }}
                    value={data?.ma_lop_thi}
                    disabled
                  />
                  <Input
                    size="large"
                    placeholder="Kì học"
                    style={{ margin: "10px 0 " }}
                    value={data?.ki_hoc}
                    disabled
                  />
                  <Button
                    type="primary"
                    style={{
                      color: "#000000",
                      backgroundColor: "#fadb14",
                      margin: "15px 0px"
                    }}
                    onClick={() => setModalEditor(true)}
                    size="large"
                    icon={<EditOutlined />}
                  >
                    <strong>Yêu cầu phúc khảo</strong>
                    {modalEditor && (
                      <CreateMaCode
                        isEdit={isEdit}
                        setEdit={setIsEdit}
                        data={data}
                        dataLop={lopData}
                        showModal={modalEditor}
                        setShowModal={setModalEditor}
                      />
                    )}
                  </Button>
                </div>
              </Col>
              <Col
                className="gutter-row"
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
              >
                <div className="phuc-khao-sinh-vien-form__sub">
                  <Row justify="center">
                    <h3>Hướng dẫn</h3>
                    <p style={{ margin: "10px 0" }}>
                      <strong>Bước 1.</strong> Kiểm tra thông tin ở biểu mẫu bên
                      trái và nhấn nút Yêu cầu phúc khảo
                    </p>
                    <p style={{ margin: "10px 0" }}>
                      <strong>Bước 2.</strong> Chuyển khoản phí phúc khảo tới
                      tài khoản ngân hàng theo hướng dẫn chi tiết
                    </p>
                    <p style={{ margin: "10px 50px 10px 0" }}>
                      <strong>Bước 3.</strong> Theo dõi trạng thái phúc khảo
                    </p>
                    <h5 style={{ margin: "13px", color: "#f5222d" }}>
                      Mọi thông tin thắc mắc vui lòng điện thoại trực tiếp cán
                      bộ theo số máy: 09437558xx
                    </h5>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default PhucKhaoFrom;
