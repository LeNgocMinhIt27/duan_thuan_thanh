import { FC } from "react";
import { ConfigProvider, Checkbox, theme } from "antd";
const { useToken } = theme;

const ColorCheckbox: FC<any> = ({ children, override, ...props }) => {
  const { token } = useToken();
  const overrideColor = override ?? token.colorPrimary;
  const modifiedTheme = {
    token: {
      ...token
    },
    components: {
      Checkbox: {
        colorPrimary: overrideColor,
        algorithm: true // Enable algorithm
      }
    }
  };

  return (
    <ConfigProvider theme={modifiedTheme}>
      <Checkbox {...props}>{children}</Checkbox>
    </ConfigProvider>
  );
};

export default ColorCheckbox;
