import "./scss/index.scss";

import { ConfigProvider, theme } from "antd";
import React, { Suspense } from "react";

import AdminHeader from "./Header";
import Footer from "./Footer";
import HeaderSticky from "./HeaderSticky";
import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";
import { PageLoading } from "@/pages/Loading";
import UserAction from "./UserAction";
import { useAppSelector } from "@/stores/hook";

const THEME_CONFIG = {
  token: {
    colorBgContainer: "#F4F5F8"
  },
  components: {
    Menu: {
      activeBarBorderWidth: 0,
      itemSelectedColor: "#fff",
      horizontalItemSelectedBg: "#033681",
      horizontalItemHoverBg: "#033681",
      horizontalItemHoverColor: "#fff"
    }
  }
};
const LAYOUT_CONFIG = {
  token: {
    colorBgContainer: "#F4F5F8"
  },
  components: {
    Menu: {
      activeBarBorderWidth: 0,
      itemSelectedColor: "#1677FF",
      horizontalItemSelectedBg: "transparent",
      horizontalItemHoverBg: "transparent",
      horizontalItemHoverColor: "#1677FF"
    }
  }
};
const AdminLayout: React.FC<any> = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const heightAuto = useAppSelector((state) => state.config.heightAuto);

  return (
    <ConfigProvider theme={THEME_CONFIG}>
      <div className="wrapper">
        <div className="header">
          <AdminHeader />
        </div>
        <ConfigProvider theme={LAYOUT_CONFIG}>
          <div className="relative">
            <HeaderSticky>
              <div className="flex bg-[#cf1627] justify-between items-center px-[15px] h-full">
                <Navigation
                  mode="horizontal"
                  styles={{ background: "#cf1627" }}
                />
                <UserAction />
              </div>
            </HeaderSticky>
            <div
              className={`main_content ${
                heightAuto ? "main_content-auto" : ""
              } `}
            >
              <div
                className="h-full flex-grow-1"
                style={{
                  background: colorBgContainer,
                  padding: 16
                }}
              >
                <Suspense fallback={<PageLoading></PageLoading>}>
                  <Outlet />
                </Suspense>
              </div>
              <Footer />
            </div>
          </div>
        </ConfigProvider>
      </div>
    </ConfigProvider>
  );
};

export default AdminLayout;
