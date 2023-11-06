import { GiaoVien } from "@/interface/giaoVien";
import { Lop } from "@/interface/lop";
import { Col, Form, Input, Row, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { FC, useEffect } from "react";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
const { Option } = Select;
const LopHocDetailInfoPage: FC<{ lop: Lop }> = ({ lop }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (lop) {
      form.setFieldsValue({
        ...lop,
        giao_viens: lop.giao_viens?.map((item: GiaoVien) => item.id)
      });
    }
  }, [lop, form]);
  const teachers = lop.giao_viens;
  return (
    <Form form={form} disabled={true} layout="vertical" {...layout} labelWrap>
      <Row>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ki_hoc"
            label="Kì học"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="loai"
            label="Loại"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ma_hp"
            label="Mã học phần"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ten_hp"
            label="Tên học phần"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="ma_kem"
            label="Mã lớp kèm"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="phong"
            label="Phòng"
          >
            <TextArea rows={1} style={{ resize: "none" }} disabled />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="giao_viens"
            label="Giảng viên"
          >
            <Select mode="multiple" suffixIcon={null}>
              {teachers &&
                teachers.map((item, index) => (
                  <Option key={index} value={item.id}>
                    <>{item.name}</>
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xxl={6}>
          <Form.Item
            className="col-span-12 sm:col-span-6 lg:col-span-3"
            name="tuan_hoc"
            label="Tuần học"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default LopHocDetailInfoPage;
