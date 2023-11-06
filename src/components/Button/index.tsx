import { Button, ConfigProvider, theme } from "antd";

import { FC } from "react";
const { useToken } = theme;

const ColorButton: FC<any> = ({ children, color, type, ...props }) => {
  const { token } = useToken();

  let overwriteColor = token.colorPrimary;
  let overwriteTextColor = token.colorTextLightSolid;

  switch (color) {
    case "primary":
      overwriteColor = token.colorPrimary;
      break;
    case "secondary":
      overwriteColor = "#2484FC";
      break;
    case "third":
      overwriteColor = "#D0D4DD";
      overwriteTextColor = "rgba(0, 0, 0, 0.88)";
      break;
    case "transparent":
      overwriteColor = "#7d7d7e";
      overwriteTextColor = "#fff";
      break;
    default:
      overwriteColor = color || token.colorPrimary;
  }
  let overwriteType = type;
  if (overwriteType == "border") {
    overwriteType = undefined;
  }
  const modifiedTheme = {
    token: {
      ...token
    },
    components: {
      Button: {
        colorPrimary: overwriteColor,
        colorTextLightSolid: overwriteTextColor,
        algorithm: true // Enable algorithm
      }
    }
  };

  return (
    <ConfigProvider theme={modifiedTheme}>
      <Button {...props} type={overwriteType}>
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default ColorButton;
