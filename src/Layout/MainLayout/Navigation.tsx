import { Button, Dropdown, Menu, MenuProps } from "antd";
import { FC, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AlignLeftOutlined } from "@ant-design/icons";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { MenuMode } from "rc-menu/lib/interface";
import { ROLE_CODE } from "@/constant";
import { checkUserRoleAllow } from "@/interface/user/auth";
import { getAuthUser } from "@/stores/features/auth";
import { useAppSelector } from "@/stores/hook";

interface Props {
  styles?: object;
  mode: MenuMode;
}
type MENU_ITEM = ItemType;
const MENUS: { [key: string]: MENU_ITEM[] } = {
  [ROLE_CODE.ADMIN]: [
    {
      label: "Tài khoản",
      key: "tai-khoan"
    },
    {
      label: "Cài đặt",
      key: "cai-dat"
    },
    {
      label: "Nhập tập tin",
      key: "tai-tap-tin"
    },

    {
      label: "Danh mục",
      key: "danh-muc",
      children: [
        {
          label: "Giảng viên",
          key: "giang-vien"
        },
        {
          label: "Sinh viên",
          key: "sinh-vien"
        },
        {
          label: "Lớp học",
          key: "lop-hoc"
        },
        {
          label: "Lớp thi",
          key: "lop-thi"
        },
        {
          label: "Bảng điểm",
          key: "bang-diem-tro-ly"
        },
        {
          label: "Bảng điểm phúc khảo",
          key: "diem-phuc-khao"
        }
      ]
    },
    {
      label: "Dịch vụ",
      key: "dich-vu",
      children: [
        {
          label: "Phúc khảo",
          key: "danh-sach-phuc-khao"
        },
        {
          label: "Tin nhắn",
          key: "tin-nhan-thanh-toan"
        },
        {
          label: "Báo lỗi",
          key: "bao-loi"
        }
      ]
    },
    {
      label: "Công cụ",
      key: "cong-cu",
      children: [
        {
          label: "Thống kê điểm danh",
          key: "thong-ke-diem-danh"
        },
        {
          label: "Sắp xếp lịch trông thi",
          key: "sap-xep-lich-trong-thi"
        }
      ]
    }
  ],
  [ROLE_CODE.ASSISTANT]: [
    {
      label: "Cài đặt",
      key: "cai-dat"
    },
    {
      label: "Nhập tập tin",
      key: "tai-tap-tin"
    },

    {
      label: "Danh mục",
      key: "danh-muc",
      children: [
        {
          label: "Giảng viên",
          key: "giang-vien"
        },
        {
          label: "Sinh viên",
          key: "sinh-vien"
        },
        {
          label: "Lớp học",
          key: "lop-hoc"
        },
        {
          label: "Lớp thi",
          key: "lop-thi"
        },
        {
          label: "Bảng điểm",
          key: "bang-diem-tro-ly"
        },
        {
          label: "Bảng điểm phúc khảo",
          key: "diem-phuc-khao"
        }
      ]
    },
    {
      label: "Dịch vụ",
      key: "dich-vu",
      children: [
        {
          label: "Phúc khảo",
          key: "danh-sach-phuc-khao"
        },
        {
          label: "Tin nhắn",
          key: "tin-nhan-thanh-toan"
        },
        {
          label: "Báo lỗi",
          key: "bao-loi"
        }
      ]
    },
    {
      label: "Công cụ",
      key: "cong-cu",
      children: [
        {
          label: "Thống kê điểm danh",
          key: "thong-ke-diem-danh"
        },
        {
          label: "Sắp xếp lịch trông thi",
          key: "sap-xep-lich-trong-thi"
        }
      ]
    }
  ],

  [ROLE_CODE.TEACHER]: [
    {
      label: "Lớp dạy",
      key: "lop-day"
    },
    {
      label: "Bảng điểm",
      key: "danh-sach-bang-diem"
    },
    {
      label: "Lớp coi thi",
      key: "lop-trong-thi"
    }
  ],
  [ROLE_CODE.STUDENT]: [
    {
      label: "Lớp học",
      key: "phong-hoc"
    },

    {
      label: "Điểm thi",
      key: "diem-sinh-vien"
    },
    {
      label: "Báo lỗi",
      key: "bao-loi-sinh-vien"
    },
    { label: "Điểm thi", key: "diem-sinh-vien" },
    { label: "Phúc khảo", key: "phuc-khao" },
    {
      label: "Lịch thi",
      key: "lich-thi"
    }
  ]
};
const Navigation: FC<Props> = ({ styles, mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useAppSelector(getAuthUser);
  const [current, setCurrent] = useState(`${location.pathname.split("/")[2]}`);

  const menuItems: MENU_ITEM[] = useMemo(() => {
    if (!authUser) {
      return [];
    }
    let menus: MENU_ITEM[] = [];
    for (const key in MENUS) {
      if (Object.prototype.hasOwnProperty.call(MENUS, key)) {
        const element = MENUS[key];
        if (checkUserRoleAllow(authUser, key)) {
          menus = menus.concat(element);
        }
      }
    }
    return getUniqueItemsByProperties(menus, ["key"]);
  }, [authUser]);

  authUser ? MENUS[authUser.role_code] : [];

  const handleNavigate: MenuProps["onClick"] = (e) => {
    if (location.pathname == "sami/" + e.key) return;
    setCurrent(e.key);
    navigate(e.key);
  };
  useEffect(() => {
    setCurrent(`${location.pathname.split("/")[2]}`);
  }, [location.pathname]);
  return (
    <div className="w-full">
      <Menu
        mode={mode}
        style={{ border: "none", ...styles }}
        className="desk w-full flex-shrink-0"
        selectedKeys={[current]}
        items={menuItems}
        onClick={handleNavigate}
      />
      {authUser && (
        <Dropdown
          menu={{
            items: menuItems,
            selectable: true,
            selectedKeys: [current],
            onClick: handleNavigate
          }}
          className="mobile"
        >
          <Button className="bg-[#f3c309] text-[20px] flex items-center">
            <AlignLeftOutlined />
          </Button>
        </Dropdown>
      )}
    </div>
  );
};
export default Navigation;
const isPropValuesEqual = (subject: any, target: any, propNames: string[]) =>
  propNames.every((propName) => subject[propName] === target[propName]);

const getUniqueItemsByProperties = (items: any[], propNames: string[]) =>
  items.filter(
    (item, index, array) =>
      index ===
      array.findIndex((foundItem) =>
        isPropValuesEqual(foundItem, item, propNames)
      )
  );
