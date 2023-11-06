import { Form, Input } from "antd";

import { FC } from "react";
interface Props {
  children: object[];
}
const FilterGroup: FC<Props> = ({ children }) => {
  return (
    <div>
      <Form layout="vertical">
        {children.map((item: any, index) => (
          <Form.Item
            label={item.title}
            name="username"
            key={index}
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
        ))}
      </Form>
    </div>
  );
};

export default FilterGroup;
