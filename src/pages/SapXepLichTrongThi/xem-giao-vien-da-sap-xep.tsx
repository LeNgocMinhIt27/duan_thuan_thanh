import PageContainer from "@/Layout/PageContainer";
import configApi from "@/api/config.api";
import lopThiApi from "@/api/lop/lopThi.api";
import { lopCoiThiGiaoVienDetail } from "@/interface/lop";
import { LoaiLopThi } from "@/interface/lop-thi";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Select, Space, Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface lopCoiThiGiaoVien extends lopCoiThiGiaoVienDetail {
  kip_thi_RowSpan: number;
  giao_vien_id_RowSpan: number;
  phong_thi_RowSpan: number;
  ngay_thi_RowSpan: number;
}

function countNearbyDuplicatesAndMark(
  array: any[],
  InputAndOutKeys: { comperaKey: string; outputKey: string }[]
) {
  const cloneArr = [...array];
  InputAndOutKeys.forEach((keys) => {
    let count = 1;
    for (let i = 0; i < array.length; i++) {
      if (cloneArr[i][keys.comperaKey] === cloneArr[i + 1]?.[keys.comperaKey]) {
        count++;
        cloneArr[i + 1][keys.outputKey] = 0;
      } else {
        cloneArr[i - count + 1][keys.outputKey] = count;
        count = 1;
      }
    }
  });
  return cloneArr;
}

export default function LopCoiThiGiaoViendDetail() {
  const { t } = useTranslation("Sap-xep-lich-trong-thi");
  const [columnsHeader] = useState<ColumnsType<lopCoiThiGiaoVien>>([
    {
      title: "Giáo Viên",
      dataIndex: "name",
      onCell: (r) => ({ rowSpan: r.giao_vien_id_RowSpan })
    },
    {
      title: "Kíp thi",
      dataIndex: "kip_thi",
      onCell: (r) => ({ rowSpan: r.kip_thi_RowSpan })
    },
    {
      title: "Phòng thi",
      dataIndex: "phong_thi",
      onCell: (r) => ({ rowSpan: r.phong_thi_RowSpan })
    },
    { title: "Mã lớp thi", dataIndex: "ma_lop_thi" },
    {
      title: "Mã lớp học",
      dataIndex: "ma_lop_hoc"
    },
    {
      title: "Ngày thi",
      dataIndex: "ngay_thi",
      onCell: (r) => ({ rowSpan: r.ngay_thi_RowSpan })
    }
  ]);
  const [listLopThi, setListLopThi] = useState<lopCoiThiGiaoVien[]>([]);
  const [dateFilterValue, setDateFilterValue] = useState(null);
  const [kipThiFilterValue, setkipThiFilterValue] = useState(null);
  const [kiHocs, setKiHocs] = useState<string[]>([]);
  const [kiHoc, setKiHoc] = useState<string | undefined>();
  const [loaikyThi, setloaikyThi] = useState<string | undefined>();
  const [loaiThi, setLoaithi] = useState<LoaiLopThi[]>();
  const [kipThiValue, setKipThiValue] = useState<any[]>([]);
  const [ngayThiValue, setNgayThiValue] = useState<any[]>();
  const [SearchLoading, SetSearchLoading] = useState(false);
  const navigate = useNavigate();

  //lấy dữ liệu cần thiết khi mới bắt đầu như giảng viên,kỳ học,loại kỳ học
  useEffect(() => {
    const getdata = async () => {
      const kihocData = await configApi.getKiHocs();
      setKiHocs(kihocData);
      const listLoaiThi = await lopThiApi.listLoaiThi();
      setLoaithi(listLoaiThi.data);
      const kyhiengio = await configApi.getKiHienGio();
      setKiHoc(kyhiengio.data);
    };
    getdata();
  }, []);

  const getDetailData = async () => {
    SetSearchLoading(true);
    if (!kiHoc) {
      return;
    }
    const listLoaiThi = await lopThiApi.lopCoiThiGiaoVienDetail({
      ki_hoc: kiHoc,
      loai: loaikyThi,
      ngay_thi: dateFilterValue,
      kip_thi: kipThiFilterValue
    });
    const uniqueKipthi = new Set<string>();
    const uniqueNgayThi = new Set<string>();

    // xắp xếp lại lớp thi
    const sortedList = listLoaiThi.data.sort((a, b) => {
      if (a.giao_vien_id > b.giao_vien_id) {
        return 1;
      } else if (a.giao_vien_id < b.giao_vien_id) {
        return -1;
      } else {
        if (!a.kip_thi || !b.kip_thi) {
          return -1;
        }
        if (
          new Date().setHours(
            parseInt(a.kip_thi.split(" ")[0].split("h")[0], 10)
          ) >
          new Date().setHours(
            parseInt(b.kip_thi.split(" ")[0].split("h")[0], 10)
          )
        ) {
          return 1;
        } else if (
          new Date().setHours(
            parseInt(a.kip_thi.split(" ")[0].split("h")[0], 10)
          ) <
          new Date().setHours(
            parseInt(b.kip_thi.split(" ")[0].split("h")[0], 10)
          )
        ) {
          return -1;
        } else {
          if (a.phong_thi > b.phong_thi) {
            return 1;
          } else if (a.phong_thi < b.phong_thi) {
            return -1;
          } else {
            if (moment(a.ngay_thi).isAfter(b.ngay_thi)) {
              return 1;
            } else if (moment(a.ngay_thi).isBefore(b.ngay_thi)) {
              return -1;
            } else {
              return 0;
            }
          }
        }
      }
    });

    const groupedData = countNearbyDuplicatesAndMark(sortedList, [
      {
        comperaKey: "giao_vien_id",
        outputKey: "giao_vien_id_RowSpan"
      },
      {
        comperaKey: "kip_thi",
        outputKey: "kip_thi_RowSpan"
      },
      { comperaKey: "ngay_thi", outputKey: "ngay_thi_RowSpan" },
      {
        comperaKey: "phong_thi",
        outputKey: "phong_thi_RowSpan"
      }
    ]);

    setListLopThi(groupedData);

    listLoaiThi.data.forEach((x) => {
      if (x.kip_thi) {
        uniqueKipthi.add(x.kip_thi);
      }
      if (x.ngay_thi) {
        uniqueNgayThi.add(x.ngay_thi);
      }
    });

    setKipThiValue(
      [...uniqueKipthi]
        .sort((a, b) => {
          if (!a || !b) {
            return 0;
          }
          try {
            return new Date().setHours(
              parseInt(a.split(" ")[0].split("h")[0], 10)
            ) < new Date().setHours(parseInt(b.split(" ")[0].split("h")[0], 10))
              ? -1
              : 1;
          } catch (error) {
            return 0;
          }
        })
        .map((x) => ({ value: x, label: x }))
    );

    setNgayThiValue(
      [...uniqueNgayThi].sort().map((x) => ({ value: x, label: x }))
    );

    SetSearchLoading(false);
  };

  return (
    <PageContainer title={t("title.viewTrolyDetail")}>
      <div className="flex flex-wrap gap-2 mb-2">
        <Space className="bg-gray-200 border-solid border border-[#c0c0c0] p-1 rounded-lg">
          <Tooltip title={t("action.detail")}>
            <Button
              type="default"
              className="hover:!border-blue-700 hover:!text-blue-700 !border-gray-600 !text-gray-800"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                navigate("/sohoa/sap-xep-lich-trong-thi/");
              }}
              size="large"
            />
          </Tooltip>
        </Space>
        <Space className="bg-gray-200 border-solid border border-[#c0c0c0] py-2 px-4 rounded-lg">
          <Select
            className="me-1"
            size="large"
            placeholder={t("placeholder.ki_hoc")}
            style={{ width: "7rem" }}
            allowClear
            value={kiHoc}
            onChange={setKiHoc}
            options={kiHocs.map((x) => ({ label: x, value: x }))}
          />
          <Select
            className="me-1"
            size="large"
            style={{ width: "9rem" }}
            placeholder={t("placeholder.loai_ki_hoc")}
            allowClear
            value={loaikyThi}
            onChange={setloaikyThi}
            options={loaiThi?.map((x) => ({
              label: x.title,
              value: x.value
            }))}
          />
          <Button onClick={getDetailData} loading={SearchLoading}>
            {t("action.search")}
          </Button>
        </Space>
        <Space className="bg-gray-200 border-solid border border-[#c0c0c0] py-2 px-4 rounded-lg">
          <Select
            className="me-1"
            size="large"
            style={{ width: "9rem" }}
            placeholder={t("placeholder.filter_ngay_thi")}
            allowClear
            value={dateFilterValue}
            onChange={setDateFilterValue}
            options={ngayThiValue}
          />
          <Select
            className="me-1"
            size="large"
            style={{ width: "9rem" }}
            placeholder={t("placeholder.filter_kip_thi")}
            allowClear
            value={kipThiFilterValue}
            onChange={setkipThiFilterValue}
            options={kipThiValue}
          />
          <Button
            disabled={listLopThi.length > 1 ? false : true}
            onClick={getDetailData}
            loading={SearchLoading}
          >
            {t("action.filter")}
          </Button>
        </Space>
      </div>
      <Table
        tableLayout="fixed"
        bordered
        dataSource={listLopThi}
        columns={columnsHeader}
      />
    </PageContainer>
  );
}
