import bangDiemApi from "@/api/bangDiem/bangDiem.api";
import diemLopThiApi from "@/api/bangDiem/diemLopThi.api";
import lanDiemDanhApi from "@/api/lop/lanDiemDanh.api";
import lopCuaGiaoVienApi from "@/api/lop/lopCuaGiaoVien.api";
import lopThiApi from "@/api/lop/lopThi.api";

import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";

//lop hoc
const LopHocPage = lazy(() => import("@/pages/giao-vien/lop"));
const LopHocDetailPage = lazy(() => import("@/pages/giao-vien/lop/detail"));

const LopHocDiemDanhPage = lazy(
  () => import("@/pages/giao-vien/lop/diem-danh")
);
const ListSinhVienLopThiPage = lazy(
  () => import("@/pages/lop/detail/list-sinh-vien-lop-thi")
);

//bảng diêm
const DanhSachBangDiem = lazy(
  () => import("@/pages/bang-diem/danh-sach-bang-diem")
);
const ShowPDFPage = lazy(() => import("@/pages/bang-diem/showPDFPage"));
const DanhSachLopThi = lazy(
  () => import("@/pages/bang-diem/lop-thi-mon/index")
);
const BangDiemMon = lazy(
  () => import("@/pages/bang-diem/lop-thi-mon/bang-diem-mon")
);

//lớp trông thi
const LopTrongThiPage = lazy(() => import("@/pages/giao-vien/lop-trong-thi"));

export const TeacherRoute: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="lop-day" />
  },
  {
    path: "lop-day",
    children: [
      {
        path: "",
        element: <LopHocPage />
      },
      {
        path: ":id",
        children: [
          {
            path: "",
            element: <LopHocDetailPage />,
            loader: async ({ params }: any) => {
              return lopCuaGiaoVienApi.getDetail(params.id, {
                with: "giaoViens,children"
              });
            }
          },
          {
            path: "diem-danh/:diem_danh_id",
            element: <LopHocDiemDanhPage />,
            loader: async ({ params }: any) => {
              return lanDiemDanhApi.getDetail(params.diem_danh_id, {
                with: "lop,lop.children"
              });
            }
          },
          {
            path: "bang-diem/:bang_diem_id",
            element: <ListSinhVienLopThiPage />,
            loader: async ({ params }: any) => {
              return lopThiApi.getDetail(params.bang_diem_id, {
                with: "sinhViens,lopThiSinhVien,lop"
              });
            }
          }
        ]
      }
    ]
  },
  {
    path: "danh-sach-bang-diem",
    children: [
      { path: "", element: <DanhSachBangDiem /> },
      {
        path: ":id",
        children: [
          {
            path: "",
            element: <ShowPDFPage />
          },
          {
            path: "danh-sach-lop-thi",
            children: [
              { path: "", element: <DanhSachLopThi /> },
              {
                path: "bang-diem/:lop_thi_id",
                element: <BangDiemMon />,
                loader: async ({ params }: any) => {
                  return Promise.all([
                    diemLopThiApi
                      .list({ id: params.lop_thi_id })
                      .then((res) => res.data),
                    bangDiemApi.show(params.id).then((res) => res.data)
                  ]);
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: "lop-trong-thi",
    element: <LopTrongThiPage />
  }
];
