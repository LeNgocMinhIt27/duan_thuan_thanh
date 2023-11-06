import {} from "@ant-design/icons";

import {
  CarOutlined,
  DatabaseOutlined,
  ProjectOutlined
} from "@ant-design/icons";

import { NavigationMenu } from "./sidebar";

const webHeaderItem: NavigationMenu[] = [
  {
    trans: "management.title",
    key: "admin",
    router: "/admin/users"
  },
  {
    trans: "businessManagement.title",
    key: "dynamic",
    router: "/admin/dynamic/tables"
  },
  {
    trans: "transportManagement.title",
    key: "example",
    children: [
      {
        icon: <ProjectOutlined />,
        text: "Thành phần",
        key: "component",
        router: "/example/component"
      },
      {
        icon: <ProjectOutlined />,
        text: "Bảng",
        key: "table",
        router: "/example/table"
      },
      {
        icon: <ProjectOutlined />,
        text: "Biểu mẫu",
        key: "form",
        router: "/example/form"
      }
    ]
  },
  {
    trans: "vehicleManagement.title",
    key: "phuong-tien",
    children: [
      {
        icon: <CarOutlined />,
        text: "Xe vận chuyển",
        key: "xe-van-chuyen",
        router: "/admin/phuong-tien/xe-van-chuyen"
      },
      {
        icon: <CarOutlined />,
        text: "Hãng xe",
        key: "hang-xe",
        router: "/admin/phuong-tien/hang-xe"
      },
      {
        icon: <CarOutlined />,
        text: "Loại xe",
        key: "loai-xe",
        router: "/admin/phuong-tien/loai-xe"
      }
    ]
  },
  {
    trans: "inventoryManagement.title",
    key: "quan-ly-kho",
    children: [
      {
        icon: <DatabaseOutlined />,
        text: "kho",
        key: "kho",
        router: "/admin/quan-ly-kho/kho"
      }
    ]
  },
  {
    trans: "humanResourceManagement.title",
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
export const headerItem = webHeaderItem;
