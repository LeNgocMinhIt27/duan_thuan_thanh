import { FC, ReactNode } from "react";

import { useMediaQuery } from "react-responsive";

const BaseResponsive: FC<{
  contentMobile: () => ReactNode;
  contentDesktop: () => ReactNode;
}> = ({ contentMobile, contentDesktop }) => {
  const isDesktop = useMediaQuery({ minWidth: 600 });
  return isDesktop ? contentDesktop() : contentMobile();
};

export default BaseResponsive;
