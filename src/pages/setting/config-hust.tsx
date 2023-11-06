import { Button, Card, DatePicker, Form, Select, notification } from "antd";
import { FC, useEffect, useState } from "react";

import configApi from "@/api/config.api";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import utc from "dayjs/plugin/utc";
import kiHocApi from "@/api/kiHoc/kiHoc.api";

dayjs.extend(utc);

const layout = {
  labelCol: {
    span: 10
  },
  wrapperCol: { span: 24 }
};
const ConfigHust: FC<{ setting: any }> = ({ setting }) => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [kiHoc, setKihoc] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    if (setting && setting.config) {
      form.setFieldsValue({
        ki_hoc: setting.config?.ki_hoc,
        day_start_week_1: dayjs(setting.config?.day_start_week_1, "YYYY-MM-DD")
          .utc()
          .local(),
        so_lan_diem_danh_toi_da: setting.config?.so_lan_diem_danh_toi_da,
        tuan_diem_danh: setting.tuan_diem_danh
      });
    }
  }, [setting, form]);
  useEffect(() => {
    const getKihoc = async () => {
      const res = await kiHocApi.list();
      if (res.data && res.data.length > 0) {
        setKihoc(res.data.map((x: any) => ({ value: x, label: x })));
      }
    };
    getKihoc();
  }, []);
  const onFinish = async (value: any) => {
    setLoading(true);
    try {
      if (value.day_start_week_1) {
        value.day_start_week_1 = dayjs(value.day_start_week_1).format(
          "YYYY-MM-DD"
        );
      }
      await configApi.updateHust(value);
      api.success({
        message: "Thành công",
        description: "Cập nhật cài đặt thành công"
      });
    } catch (err: any) {
      api.error({
        message: "Thất bại",
        description: "Cập nhật cài đặt thất bại"
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {contextHolder}
      <Card style={{ maxWidth: "550px" }}>
        <Form
          form={form}
          {...layout}
          onFinish={(value) => onFinish(value)}
          labelWrap
        >
          <Form.Item name="ki_hoc" label="Kì học hiện tại">
            <Select style={{ maxWidth: "160px" }} options={kiHoc} />
          </Form.Item>
          <Form.Item name="day_start_week_1" label="T2 tuần 1 cùa kì học">
            <DatePicker allowClear={false} />
          </Form.Item>

          {/* <Form.Item
            name="so_lan_diem_danh_toi_da"
            label="Số lần điểm danh tối đa"
          >
            <InputNumber />
          </Form.Item> */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size={"large"}
              loading={loading}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default ConfigHust;
