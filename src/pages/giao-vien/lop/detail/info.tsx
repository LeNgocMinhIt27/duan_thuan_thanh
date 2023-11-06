import { Lop } from "@/interface/lop";
import { Col, Form, Input, Row } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { FC } from "react";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
const LopHocDetailInfoPage: FC<{ lop: Lop; children?: any }> = ({
  lop,
  children
}) => {
  const [form] = Form.useForm();
  return (
    <div className="diemdanh__respon">
      <Form form={form} {...layout} disabled labelWrap initialValues={lop}>
        <Row>
          <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
            <Form.Item name="ma" label="Mã lớp" labelCol={{ span: 24 }}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
            <Form.Item name="ma_kem" label="Mã lớp kèm" labelCol={{ span: 24 }}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
            <Form.Item name="ma_hp" label="Mã học phần" labelCol={{ span: 24 }}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
            <Form.Item
              name="ten_hp"
              label="Tên học phần"
              labelCol={{ span: 24 }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
            <Form.Item name="loai" label="Loại" labelCol={{ span: 24 }}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
            <Form.Item name="ki_hoc" label="Kì học" labelCol={{ span: 24 }}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
            <Form.Item name="phong" label="Phòng" labelCol={{ span: 24 }}>
              <TextArea rows={2} style={{ resize: "none" }} disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
            <Form.Item name="ghi_chu" label="Ghi chú" labelCol={{ span: 24 }}>
              <TextArea rows={2} style={{ resize: "none" }} disabled />
            </Form.Item>
          </Col>
          {children}
        </Row>
      </Form>
    </div>
  );
};

export default LopHocDetailInfoPage;
