import PageContainer from "@/Layout/PageContainer";
import configApi from "@/api/config.api";
import lopThiApi from "@/api/lop/lopThi.api";
import giaoVienApi from "@/api/user/giaoVien.api";
import { GiaoVien } from "@/interface/giaoVien";
import { LoaiLopThi } from "@/interface/lop";
import { Button, Select, Space, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface LopThiGV {
  ngay_thi: string;
  kip_thi: string;
  phong_thi: string;
  ma_lop_hoc: string;
  ma_lop_thi: string;
}

const LopCoiThiGiaoVien = () => {
  const { t } = useTranslation("Sap-xep-lich-trong-thi");
  const [kiHocs, setKiHocs] = useState<string[]>([]);
  const [loaiThi, setLoaithi] = useState<LoaiLopThi[]>();
  const [kiHocSelected, setKiHocSelected] = useState<string | undefined>();
  const [loaiThiSelected, setLoaithiSelected] = useState<LoaiLopThi[]>();
  const [ngayThi, setNgayThi] = useState<any>([]);
  const [kipThi, setKipThi] = useState<any>([]);
  const [ngayThiSelected, setNgayThiSelected] = useState<string>();
  const [kipThiSelected, setKipThiSelected] = useState<string>();

  const [lopThiGV, setLopThiGV] = useState<LopThiGV[]>([]);
  const [lopThiGVFilter, setLopThiGVFilter] = useState<LopThiGV[]>([]);

  const navigate = useNavigate();
  const [giaoVien, setGiaoVien] = useState<GiaoVien>();
  const loca = useLocation();
  const path = loca.pathname.split("/");

  const columns: ColumnsType<LopThiGV> = [
    {
      title: "Ngày thi",
      dataIndex: "ngay_thi",
      key: "ngay_thi",
      render: (_, r) => {
        return r.ngay_thi && dayjs(r.ngay_thi).format("DD/MM/YYYY");
      },
      sorter: (a, b) => a.ngay_thi.localeCompare(b.ngay_thi)
    },
    {
      title: "Kíp thi",
      dataIndex: "kip_thi",
      key: "kip_thi",
      sorter: (a, b) =>
        new Date().setHours(
          parseInt(a.kip_thi.split(" ")[0].split("h")[0], 10)
        ) -
        new Date().setHours(parseInt(b.kip_thi.split(" ")[0].split("h")[0], 10))
    },
    {
      title: "Phòng",
      dataIndex: "phong_thi",
      key: "phong_thi",
      sorter: (a, b) => a.phong_thi.localeCompare(b.phong_thi)
    },
    {
      title: "Mã lớp học",
      dataIndex: "ma_lop_hoc",
      key: "ma_lop_hoc",
      sorter: (a, b) => a.ma_lop_hoc.localeCompare(b.ma_lop_hoc)
    },
    {
      title: "Mã  lớp thi",
      dataIndex: "ma_lop_thi",
      key: "ma_lop_thi",
      sorter: (a, b) => a.ma_lop_thi.localeCompare(b.ma_lop_thi)
    }
  ];

  const getLopThi = async () => {
    try {
      const res = await lopThiApi.lopCoiThiGiaoVienDetail({
        giao_vien_id: path[path.length - 1]
      });
      setLopThiGV(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDetailGV = async () => {
    try {
      const res = await giaoVienApi.detail(Number(path[path.length - 1]));
      setGiaoVien(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getLopThiFilter = async () => {
    try {
      const res = await lopThiApi.lopCoiThiGiaoVienDetail({
        giao_vien_id: path[path.length - 1],
        ki_hoc: kiHocSelected,
        loai: loaiThiSelected,
        ngay_thi: ngayThiSelected,
        kip_thi: kipThiSelected
      });
      setLopThiGV(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterTable = () => {
    const newData: LopThiGV[] = [];
    if (kipThiSelected && !ngayThiSelected) {
      lopThiGV.forEach((item: LopThiGV) => {
        if (item.kip_thi === kipThiSelected) {
          newData.push(item);
        }
      });
    }
    if (ngayThiSelected && !kipThiSelected) {
      lopThiGV.forEach((item: LopThiGV) => {
        if (item.ngay_thi === ngayThiSelected) {
          newData.push(item);
        }
      });
    } else {
      lopThiGV.forEach((item: LopThiGV) => {
        if (
          item.ngay_thi === ngayThiSelected &&
          item.kip_thi === kipThiSelected
        ) {
          newData.push(item);
        }
      });
    }
    setLopThiGVFilter(newData);
  };

  useEffect(() => {
    const getdata = async () => {
      const kihocData = await configApi.getKiHocs();
      setKiHocs(kihocData);
      const listLoaiThi = await lopThiApi.listLoaiThi();
      setLoaithi(listLoaiThi.data);
    };
    getdata();
    getLopThi();
    getDetailGV();
  }, []);

  useEffect(() => {
    const listCacheNT: { [key: string]: string } = {};
    const listCacheKip: { [key: string]: string } = {};

    if (lopThiGV.length <= 0) return;
    const listNgayThi = lopThiGV.reduce((acc: any, item: LopThiGV) => {
      const ngayThi = item.ngay_thi;
      if (!listCacheNT[ngayThi]) {
        listCacheNT[ngayThi] = ngayThi;
        acc.push(ngayThi);
      }
      return acc;
    }, []);
    const listKipThi = lopThiGV.reduce((acc: any, item: LopThiGV) => {
      const kipThi = item.kip_thi;
      if (!listCacheKip[kipThi]) {
        listCacheKip[kipThi] = kipThi;
        acc.push(kipThi);
      }
      return acc;
    }, []);
    setNgayThi(listNgayThi.sort().map((x: string) => ({ value: x, label: x })));
    setKipThi(
      listKipThi
        .sort((a: any, b: any) => {
          if (!a.value || !b.value) {
            return 0;
          }
          try {
            return new Date().setHours(
              parseInt(a.value.split(" ")[0].split("h")[0], 10)
            ) <
              new Date().setHours(
                parseInt(b.value.split(" ")[0].split("h")[0], 10)
              )
              ? -1
              : 1;
          } catch (error) {
            return 0;
          }
        })
        .map((x: string) => ({ value: x, label: x }))
    );
  }, [lopThiGV]);

  return (
    <PageContainer title={`${t("title.viewDetailGiaoVien")} ${giaoVien?.name}`}>
      <div className="flex gap-4 mb-4 flex-wrap items-center">
        <Tooltip title="Quay lại">
          <Button
            type="default"
            className="hover:!border-blue-700 hover:!text-blue-700 !border-gray-600 !text-gray-800"
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              navigate("/sohoa/sap-xep-lich-trong-thi/");
            }}
          />
        </Tooltip>

        <Space className="bg-gray-200 border-solid border border-[#c0c0c0] py-2 px-4 rounded-lg">
          <Select
            className="me-1"
            placeholder={t("placeholder.ki_hoc")}
            style={{ width: "7rem" }}
            allowClear
            value={kiHocSelected}
            onChange={setKiHocSelected}
            options={kiHocs.map((x) => ({ label: x, value: x }))}
          />
          <Select
            className="me-1"
            style={{ width: "9rem" }}
            placeholder={t("placeholder.loai_ki_hoc")}
            allowClear
            value={loaiThiSelected}
            onChange={setLoaithiSelected}
            options={loaiThi?.map((x) => ({
              label: x.title,
              value: x.value
            }))}
          />
          <Button onClick={getLopThiFilter}>{t("action.search")}</Button>
        </Space>
        <Space className="bg-gray-200 py-2 px-4 rounded-lg">
          <Select
            className="me-1"
            style={{ width: "9rem" }}
            placeholder={t("placeholder.filter_ngay_thi")}
            allowClear
            value={ngayThiSelected}
            onChange={setNgayThiSelected}
            options={ngayThi}
          />
          <Select
            className="me-1"
            style={{ width: "9rem" }}
            placeholder={t("placeholder.filter_kip_thi")}
            allowClear
            value={kipThiSelected}
            onChange={setKipThiSelected}
            options={kipThi}
          />
          <Button onClick={filterTable}>{t("action.filter")}</Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={lopThiGVFilter.length > 0 ? lopThiGVFilter : lopThiGV}
        rowKey={(r: any) => r.lop_thi_id}
      />
    </PageContainer>
  );
};

export default LopCoiThiGiaoVien;
