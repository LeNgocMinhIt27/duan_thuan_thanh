import {} from "@ant-design/icons";

import {
  DatabaseOutlined,
  ProjectOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";

import { BiSolidCity } from "react-icons/bi";
import { ReactNode } from "react";
import { TextTrans } from "@/interface/common";

const webSidebarItem: NavigationMenu[] = [
  {
    icon: <UserOutlined />,
    trans: "user.title",
    key: "admin",
    router: "/admin/users"
  },
  {
    icon: <TeamOutlined />,
    trans: "department.title",
    router: "/admin/department",
    children: [
      {
        icon: <TeamOutlined />,
        trans: "Nhóm",
        router: "/admin/danh-muc/nhom"
      },
      {
        icon: <TeamOutlined />,
        trans: "Phòng ban",
        router: "/admin/danh-muc/phong-ban"
      },
      {
        icon: <TeamOutlined />,
        trans: "Loại hàng hóa",
        router: "/admin/danh-muc/loai-hang-hoa"
      },
      {
        icon: <TeamOutlined />,
        trans: "Đơn vị tính",
        router: "/admin/danh-muc/don-vi-tinh"
      }
    ]
  },
  {
    icon: <DatabaseOutlined />,
    trans: "dynamic.table.title",
    router: "/admin/dynamic/tables"
  },
  {
    icon: <BiSolidCity />,
    trans: "region.title",
    router: "/admin/regions"
  },
  {
    icon: <ProjectOutlined />,
    trans: "component.title",
    router: "/example",
    children: [
      {
        icon: <ProjectOutlined />,
        text: "Thành phần",
        router: "/example/component"
      },
      {
        icon: <ProjectOutlined />,
        text: "Bảng",
        router: "/example/table"
      },
      {
        icon: <ProjectOutlined />,
        text: "Biểu mẫu",
        router: "/example/form"
      }
    ]
  }
];
export const sidebarItem = webSidebarItem;
/**
 * @property {keyList} dùng để thay nếu muốn highlight nếu có key bị trùng trong đường dẫn
 */
export type NavigationMenu = {
  icon?: ReactNode;
  router?: string;
  children?: any[];
  highLightKeyList?: string[];
  key?: string;
} & TextTrans;
