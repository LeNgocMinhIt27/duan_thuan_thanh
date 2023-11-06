import bangDiemApi from "@/api/bangDiem/bangDiem.api";
import diemLopThiApi from "@/api/bangDiem/diemLopThi.api";
import lanDiemDanhApi from "@/api/lop/lanDiemDanh.api";
import lopHocApi from "@/api/lop/lopHoc.api";
import lopThiApi from "@/api/lop/lopThi.api";
import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";

//lop hoc
const LopHocPage = lazy(() => import("@/pages/lop"));
const DetailClass = lazy(() => import("@/pages/lop/detail"));

//nhan diem=n diem
const DanhSachBangDiem = lazy(
  () => import("@/pages/bang-diem/danh-sach-bang-diem")
);
// const ShowPDFPage = lazy(() => import("@/pages/bang-diem/showPDFPage"));
const DanhSachLopThi = lazy(() => import("@/pages/bang-diem/lop-thi-mon"));
const BangDiemMon = lazy(
  () => import("@/pages/bang-diem/lop-thi-mon/bang-diem-mon")
);
const NhanDienDiemPage = lazy(() => import("@/pages/bang-diem/nhanDienDiem"));

const LopHocDiemDanhPage = lazy(
  () => import("@/pages/giao-vien/lop/diem-danh")
);
const ListSinhVienLopThiPage = lazy(
  () => import("@/pages/lop/detail/list-sinh-vien-lop-thi")
);
const SettingPage = lazy(() => import("@/pages/setting"));

const ImportPage = lazy(() => import("@/pages/import/index"));

// Phuc khao
const DanhSachPhucKhao = lazy(() => import("@/pages/phuc-khao/index"));
// Thanh Toan
const TinNhanhThanhToan = lazy(
  () => import("@/pages/thanh-toan/tin-nhan-thanh-toan")
);

//
const SapXepLichTrongThiPage = lazy(
  () => import("@/pages/SapXepLichTrongThi/index")
);

const LopCoiThiGiaoViendDetail = lazy(
  () => import("@/pages/SapXepLichTrongThi/xem-giao-vien-da-sap-xep")
);

const LopCoiThiGiaoVien = lazy(
  () => import("@/pages/SapXepLichTrongThi/lop-coi-thi-giao-vien")
);
// Bao loi
const BaoLoiPage = lazy(() => import("@/pages/giao-vien/bao-loi"));
// Lop thi
const LopThiPage = lazy(() => import("@/pages/lop-thi/index"));
const DiemPhucKhaoPage = lazy(() => import("@/pages/bang-diem/diem-phuc-khao"));
const ThongKeDiemDanhPage = lazy(
  () => import("@/pages/thong-ke/thong-ke-diem-danh")
);
export const AssistantRoute: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="lop-hoc" />
  },
  {
    path: "lop-hoc",
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
            loader: async ({ params }: any) => {
              return lopHocApi
                .getDetail(params.id, {
                  with: "giaoViens,children,sinhViens"
                })
                .then((res) => res.data);
            },
            element: <DetailClass />
          },
          {
            path: "diem-danh/:diem_danh_id",
            element: <LopHocDiemDanhPage />,
            loader: async ({ params }: any) => {
              return lanDiemDanhApi.getDetail(params.diem_danh_id, {
                with: "lop,lop.children"
              }) as any;
            }
          },
          {
            path: "sinh-vien/:bang_diem_id",
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
  { path: "cai-dat", element: <SettingPage /> },
  { path: "tai-tap-tin", element: <ImportPage /> },
  {
    path: "bang-diem-tro-ly",
    children: [
      { path: "", element: <DanhSachBangDiem /> },
      {
        path: ":id",
        children: [
          {
            path: "",
            element: <NhanDienDiemPage />
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
  { path: "danh-sach-phuc-khao", element: <DanhSachPhucKhao /> },
  { path: "tin-nhan-thanh-toan", element: <TinNhanhThanhToan /> },
  { path: "bao-loi", element: <BaoLoiPage /> },
  {
    path: "sap-xep-lich-trong-thi",
    children: [
      { path: "", element: <SapXepLichTrongThiPage /> },
      {
        path: "giao-vien/:id",
        element: <LopCoiThiGiaoVien />
      },
      {
        path: "lop-coi-thi-giao-vien-chi-tiet",
        element: <LopCoiThiGiaoViendDetail />
      }
    ]
  },
  { path: "thong-ke-diem-danh", element: <ThongKeDiemDanhPage /> },
  { path: "lop-thi", element: <LopThiPage /> },
  {
    path: "diem-phuc-khao",
    element: <DiemPhucKhaoPage />
  }
];
