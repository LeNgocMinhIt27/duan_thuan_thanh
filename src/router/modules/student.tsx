// import configApi from "@/api/config.api";
import phucKhaoSinhVienApi from "@/api/phucKhao/phucKhaoSinhVien.api";
import bangDiemApi from "@/api/sinhVien/bangDiem.api";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

//lop hoc
const LopHocPage = lazy(() => import("@/pages/sinh-vien/lop.tsx"));
const LopThiPage = lazy(() => import("@/pages/sinh-vien/lop-thi"));
const DanhSachLoiCuaSinhVien = lazy(() => import("@/pages/sinh-vien/bao-loi"));
const LopHocDetailPage = lazy(() => import("@/pages/sinh-vien/lop/detail"));
const BangDiemPage = lazy(() => import("@/pages/sinh-vien/bang-diem"));
const QrCode = lazy(() => import("@/pages/phuc-khao/qr-code"));
const PhucKhaoForm = lazy(() => import("@/pages/phuc-khao/phuc-khao"));
const PhucKhaoThanhCong = lazy(
  () => import("@/pages/phuc-khao/thong-bao-thanh-cong")
);
const PhucKhaoPages = lazy(
  () => import("@/pages/phuc-khao/sinh-vien-phuc-khao")
);
export const StudentRoute = [
  {
    path: "",
    element: <Navigate to="phong-hoc" />
  },
  {
    path: "phong-hoc",
    element: <LopHocPage />
  },
  {
    path: "phong-hoc/:id",
    element: <LopHocDetailPage />
  },
  {
    path: "diem-sinh-vien",
    element: <BangDiemPage />
  },
  {
    path: "bao-loi-sinh-vien",
    element: <DanhSachLoiCuaSinhVien />
  },
  // {
  //   path: "phuc-khao/thanh-toan",
  //   element: <NopPhiPage />,
  //   loader: async () => {
  //     return configApi.getKiHocs();
  //   },
  // },
  {
    path: "qr-code/:id",
    element: <QrCode />,
    loader: async ({ params }: any) => {
      return Promise.all([
        phucKhaoSinhVienApi.cache().then((res) => res.data),
        phucKhaoSinhVienApi.getDetail(params.id).then((res) => res.data)
      ]);
    }
  },
  {
    path: "phuc-khao/:id",
    element: <PhucKhaoForm />,
    loader: async ({ params }: any) => {
      return bangDiemApi
        .item(params.id, { check_phuc_khao: true })
        .then((res) => res.data);
    }
  },
  {
    path: "phuc-khao",
    element: <PhucKhaoPages />
  },
  {
    path: "phuc-khao-thanh-cong",
    element: <PhucKhaoThanhCong />
  },
  {
    path: "lich-thi",
    element: <LopThiPage />
  }
];
