import React, { useState } from "react";

import { ActionField } from "@/interface/common";
import BaseTable from "@/components/base-table";
import { ColDef } from "ag-grid-community";
import { DiemPhucKhao } from "@/interface/bangdiem";
import ImportDiemPhucKhaoAmin from "./import-diem-dialog";
import PageContainer from "@/Layout/PageContainer";
import diemPhucKhaoApi from "@/api/bangDiem/diemPhucKhao.api";
import importApi from "@/api/import.api";
import { useTranslation } from "react-i18next";
import { Button } from "antd";

const BangDiemPhucKhaoPage: React.FC = () => {
  const { t } = useTranslation("diem-phuc-khao");
  const [columnDefs] = useState<ColDef<DiemPhucKhao & ActionField>[]>([
    {
      headerName: t("field.ma_lop_thi"),
      field: "lop_thi.ma",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.loai"),
      field: "lop_thi.loai",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.mssv"),
      field: "sinh_vien.mssv",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.ten_sv"),
      field: "sinh_vien.name",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.diem"),
      field: "diem",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.ghi_chu"),
      field: "ghi_chu",
      filter: "agTextColumnFilter"
    }
  ]);
  const handleDownloadFile = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "public/download/mau_nhap_diem_phuc_khao.xlsx";
    downloadLink.download = "mau_nhap_diem_phuc_khao.xlsx";
    downloadLink.click();
  };
  return (
    <>
      <PageContainer
        title={t("title.title")}
        extraTitle={
          <div style={{ float: "right" }}>
            <Button
              className="mr-2"
              onClick={handleDownloadFile}
              type="primary"
            >
              Tải tệp dữ liệu mẫu
            </Button>
            <ImportDiemPhucKhaoAmin
              suggestType="giao-vien"
              fieldName={[
                { name: "sinh_vien_id" },
                { name: "ma_hp" },
                { name: "nhom" },
                { name: "ma_lop" },
                { name: "ma_lop_thi" },
                { name: "diem" },
                { name: "diem_moi" },
                { name: "ghi_chu" }
              ]}
              fileDownloadName="diem_phuc_khao"
              downloadable={false}
              translation="diem-phuc-khao-Import"
              uploadformApi={importApi.importDiemPhucKhao}
            />
          </div>
        }
      >
        <BaseTable api={diemPhucKhaoApi.list} columns={columnDefs}></BaseTable>
      </PageContainer>
    </>
  );
};

export default BangDiemPhucKhaoPage;
