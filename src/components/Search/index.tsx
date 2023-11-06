import { FC } from "react";
import { ConfigProvider, Input, theme } from "antd";
const { useToken } = theme;

const DarkSearch: FC<any> = ({ children, ...props }) => {
  const { token } = useToken();

  const modifiedTheme = {
    token: {
      ...token
    },
    components: {
      Input: {
        colorBgContainer: "#22215B",
        colorBgContainerDisabled: "rgba(255, 255, 255, 0.08)",
        colorBorder: "#424242",
        colorFillAlter: "rgba(255, 255, 255, 0.04)",
        colorIcon: "rgba(255, 255, 255, 0.45)",
        colorIconHover: "rgba(255, 255, 255, 0.85)",
        colorPrimary: "#093f90",
        colorPrimaryActive: "#0c3573",
        colorPrimaryHover: "#225aa3",
        colorText: "rgba(255, 255, 255, 0.85)",
        colorTextDescription: "rgba(255, 255, 255, 0.45)",
        colorTextDisabled: "rgba(255, 255, 255, 0.25)",
        colorTextPlaceholder: "rgba(255, 255, 255, 0.45)",
        colorTextQuaternary: "rgba(255, 255, 255, 0.25)",
        colorTextTertiary: "rgba(255, 255, 255, 0.45)",
        controlOutline: "rgba(0, 33, 87, 0.15)",
        algorithm: true // Enable algorithm
      }
    }
  };

  return (
    <ConfigProvider theme={modifiedTheme}>
      <Input {...props}>{children}</Input>
    </ConfigProvider>
  );
};

export default DarkSearch;
