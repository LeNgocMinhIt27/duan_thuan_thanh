import { Breadcrumb, Col, Row } from "antd";
import { FC, ReactNode, useMemo } from "react";

import { NavLink } from "react-router-dom";
import { TextTrans } from "@/interface/common";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";

type PageContainerOption = {
  children?: ReactNode | undefined;
  title?: string;
  titleTrans?: string;
  breadcrumbs?: Breadcrumbs[];
  extraTitle?: ReactNode | undefined;
};
type Breadcrumbs = TextTrans & {
  router?: string;
};
const PageContainer: FC<PageContainerOption> = ({
  children,
  title,
  titleTrans,
  breadcrumbs = [],
  extraTitle
}) => {
  const { t } = useTranslation("sidebar");
  const items = useMemo(() => {
    return breadcrumbs.map((x) => {
      let label = x.trans ? t(x.trans) : x.text;
      if (x.router) {
        label = (<NavLink to={x.router}>{label}</NavLink>) as any;
      }
      const temp = { ...x, title: label };
      return temp;
    });
  }, [t, breadcrumbs]);
  return (
    <div className="d-flex flex-column full-height">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={items} className="flex-grow-0"></Breadcrumb>
      )}
      <Row className="flex-grow-0">
        <Col span={12}>
          {title && <Title level={2}>{title}</Title>}
          {titleTrans && <Title level={2}>{t(titleTrans)}</Title>}
        </Col>
        <Col span={12}>{extraTitle && extraTitle}</Col>
      </Row>

      <Row className="flex-grow-1">
        <Col span={24}>{children}</Col>
      </Row>
    </div>
  );
};
export default PageContainer;

export { PageContainer };
