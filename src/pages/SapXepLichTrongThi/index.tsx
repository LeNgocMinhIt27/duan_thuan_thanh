import {
  App,
  Button,
  Form,
  Empty,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tooltip
} from "antd";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  SolutionOutlined
} from "@ant-design/icons";
import { LoaiLopThi, LopThiKi } from "@/interface/lop";
import { useEffect, useState } from "react";

import { ColumnsType } from "antd/es/table";
import { GiaoVien } from "@/interface/giaoVien";
import { ReactSortable } from "react-sortablejs";
import configApi from "@/api/config.api";
import giaoVienApi from "@/api/user/giaoVien.api";
import lopThiApi from "@/api/lop/lopThi.api";
import moment from "moment";
import { useTranslation } from "react-i18next";
import exportApi from "@/api/export/export.api";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import PageContainer from "@/Layout/PageContainer";

const { Search } = Input;
interface giangvien extends GiaoVien {
  so_lop_trong: number;
  thoi_gian_trong: string;
  ma: string[];
}

interface lopthiki extends LopThiKi {
  kip_thi_RowSpan: number;
  ngay_thi_RowSpan: number;
  phong_thi_RowSpan: number;
  sl_sinh_vien: number;
}

function getTimeInterval(startTime: string, endTime: string) {
  const start = moment(startTime, "HH:mm");
  const end = moment(endTime, "HH:mm");
  const minutes = end.diff(start, "minutes");
  const interval = moment().hour(0).minute(minutes);
  return interval.format("HH:mm");
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

function toHoursAndMinutes(
  time1: string,
  time2: string,
  method: "subtract" | "plus"
) {
  if (time1 && time2) {
    const hour = moment(time1, "HH:mm").hours();
    const minute = moment(time1, "HH:mm").minutes();
    const hour2 = moment(time2, "HH:mm").hours();
    const minute2 = moment(time2, "HH:mm").minutes();
    const calcMinutes = hour * 60 + minute;
    const calcMinutes2 = hour2 * 60 + minute2;
    let totalMinutes: number;
    switch (method) {
      case "plus":
        totalMinutes = calcMinutes + calcMinutes2;
        break;
      case "subtract":
        totalMinutes = calcMinutes - calcMinutes2;
        break;
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return (
      hours.toLocaleString("vi-VN", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      ":" +
      minutes.toLocaleString("vi-VN", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })
    );
  } else {
    return time1 || time2;
  }
}

export default function SapXepLichTrongThiPage() {
  const { t } = useTranslation("Sap-xep-lich-trong-thi");
  const [kiHocs, setKiHocs] = useState<string[]>([]);
  const [kiHoc, setKiHoc] = useState<string | undefined>();
  const [loaikyThi, setloaikyThi] = useState<string | undefined>();
  const [loaiThi, setLoaithi] = useState<LoaiLopThi[]>();
  const [listGiangvien, setlistGiangvien] = useState<giangvien[]>([]);
  const [listTempGiangvien, setlistTempGiangvien] = useState<giangvien[]>([]);
  const [listLopThi, setListLopThi] = useState<lopthiki[]>([]);
  const [listLopThiTemp, setListLopThiTemp] = useState<lopthiki[]>([]);
  const [listGiamthidrop, setListGiamthidrop] = useState<{
    [index: string]: { id: number; name: string; email?: string }[];
  }>({});
  const [lopthiHeader, setLopthiHeader] = useState<ColumnsType<lopthiki>>([]);
  const [reset, setReset] = useState(false);
  const [markHeader, setMarkHeader] = useState([0, -1, 0]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSaveAndSend, setLoadingSaveAndSend] = useState(false);
  const [SearchLoading, SetSearchLoading] = useState(false);
  const [dateFilterValue, setDateFilterValue] = useState(null);
  const [kipThiFilterValue, setkipThiFilterValue] = useState(null);
  const [kipThiValue, setKipThiValue] = useState<any[]>([]);
  const [ngayThiValue, setNgayThiValue] = useState<any[]>();
  const [dialogSendMail, setDialogSendMail] = useState(false);
  const [dialogExport, setDialogExport] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loaiLopSelected, setLoaiLopSelected] = useState<boolean>();
  const [formTitle] = Form.useForm();
  const navigate = useNavigate();
  const { message, notification } = App.useApp();
  //set colomn cho bảng lớp thi
  useEffect(() => {
    setLopthiHeader([
      {
        title: t("field.ngay_thi"),
        dataIndex: "ngay_thi",
        render: (_v, r) => {
          return r.ngay_thi && moment(r.ngay_thi).format("DD/MM/YYYY");
        }
      },
      {
        title: t("field.kip_thi"),
        dataIndex: "kip_thi",
        onCell: (r) => ({ rowSpan: r.kip_thi_RowSpan })
      },
      {
        title: t("field.phong_thi"),
        dataIndex: "phong_thi",
        onCell: (r) => ({ rowSpan: r.phong_thi_RowSpan })
      },
      { title: t("field.ma_hp"), dataIndex: "ma_hp" },
      {
        title: t("field.ma"),
        dataIndex: "ma",
        render: (_v, r) => (
          <p>
            {r.ma}{" "}
            <span>{`(${r.sl_sinh_vien != null ? r.sl_sinh_vien : 0})`}</span>
          </p>
        )
      },
      // {
      //   title: t("field.loai"),
      //   dataIndex: "loai",
      //   onCell: (r) => ({ rowSpan: r.loai_RowSpan })
      // },
      {
        title: t("field.giam_thi"),
        dataIndex: "giao_viens",
        render: (_value, r) => {
          return (
            <ReactSortable
              group={{
                name: "giangvien",
                put: (_to, from, el) => {
                  const name = el.textContent?.replace(/[\d:]/g, "");
                  if (!(from.options.group instanceof Object)) {
                    return false;
                  }
                  if (from.options.group?.["name"] !== "shared") {
                    return false;
                  }
                  if (name) el.textContent = name;
                  return true;
                }
              }}
              swapThreshold={1}
              list={listGiamthidrop[r.ma]}
              onAdd={(x) => {
                const id = Number(x.item.getAttribute("data-id"));
                const name = x.item.textContent?.replace(/[\d:]/g, "");
                //Kiểm trả xem để thể không thêm 1 giám thị vào trông 2 lớp khác nhau cùng ngày và giờ
                if (
                  listLopThi.every((lt) => {
                    if (
                      lt.kip_thi === r.kip_thi &&
                      lt.loai === r.loai &&
                      lt.phong_thi !== r.phong_thi
                    ) {
                      if (lt.ngay_thi === r.ngay_thi) {
                        if (listGiamthidrop[lt.ma].some((x) => x.id === id)) {
                          return false;
                        } else {
                          return true;
                        }
                      } else {
                        return true;
                      }
                    } else {
                      return true;
                    }
                  })
                ) {
                  //Kiểm trả xem nếu phòng đang coi cùng phòng và giờ đang trong thì không tính thêm giờ và lớp phải trông
                  if (
                    !listLopThi.some((lt) => {
                      if (listGiamthidrop[lt.ma].some((x) => x.id === id)) {
                        if (
                          lt.kip_thi === r.kip_thi &&
                          lt.loai === r.loai &&
                          lt.phong_thi === r.phong_thi &&
                          lt.ngay_thi === r.ngay_thi
                        )
                          return true;
                      }
                    })
                  ) {
                    if (name) {
                      const newdata = {
                        id: id,
                        name: name
                      };
                      setListGiamthidrop((pre) => {
                        pre[r.ma] = [...pre[r.ma], newdata];
                        return pre;
                      });
                    }
                    setlistGiangvien((pre) =>
                      pre.map((GV) => {
                        if (GV.id === id) {
                          const hours = r.kip_thi
                            .split("-")
                            .map((d) =>
                              moment(`${d}`, "hh[h]mm").format("hh:mm:ss")
                            );
                          const intervalTime = getTimeInterval(
                            hours[0],
                            hours[1]
                          );

                          return {
                            ...GV,
                            so_lop_trong: GV.so_lop_trong + 1,
                            thoi_gian_trong: toHoursAndMinutes(
                              GV.thoi_gian_trong,
                              intervalTime,
                              "plus"
                            ),
                            ma: [...GV.ma, r.ma]
                          };
                        } else {
                          return { ...GV };
                        }
                      })
                    );
                  } else {
                    message.error(t("message.sameClassError"));
                  }
                } else {
                  message.error(t("message.sortTeacheError"));
                }
              }}
              setList={() => {
                setReset((x) => !x);
              }}
            >
              {listGiamthidrop?.[r.ma]?.map((d) => {
                return (
                  <div key={d.id} className="flex justify-between">
                    <span>{d.name}</span>
                    <Tooltip title={"Xoá"}>
                      <button
                        onClick={() => {
                          setListGiamthidrop((pre) => {
                            pre[r.ma] = pre[r.ma].filter((f) => f.id != d.id);
                            return pre;
                          });
                          if (
                            !listLopThi.some((lt) => {
                              if (
                                lt.kip_thi === r.kip_thi &&
                                lt.loai === r.loai &&
                                lt.phong_thi === r.phong_thi &&
                                lt.ngay_thi === r.ngay_thi &&
                                lt.ma != r.ma
                              )
                                if (
                                  listGiamthidrop[lt.ma].some(
                                    (x) => x.id === d.id
                                  )
                                ) {
                                  return true;
                                }
                            })
                          ) {
                            setlistGiangvien((pre) =>
                              pre.map((GV) => {
                                if (GV.id === d.id) {
                                  const hours = r.kip_thi
                                    .split("-")
                                    .map((d) =>
                                      moment(`${d}`, "hh[h]mm").format(
                                        "hh:mm:ss"
                                      )
                                    );

                                  const intervalTime = getTimeInterval(
                                    hours[0],
                                    hours[1]
                                  );
                                  return {
                                    ...GV,
                                    so_lop_trong: GV.so_lop_trong + -1,
                                    thoi_gian_trong: toHoursAndMinutes(
                                      GV.thoi_gian_trong,
                                      intervalTime,
                                      "subtract"
                                    ),
                                    ma: GV?.ma.filter((ma) => ma != r.ma)
                                  };
                                } else {
                                  return { ...GV };
                                }
                              })
                            );
                          } else {
                            setlistGiangvien((pre) =>
                              pre.map((GV) => {
                                if (GV.id === d.id) {
                                  return {
                                    ...GV,
                                    ma: GV?.ma.filter((ma) => ma != r.ma)
                                  };
                                } else {
                                  return { ...GV };
                                }
                              })
                            );
                          }
                          setReset((rs) => !rs);
                        }}
                        className="cursor-pointer text-md border-0 ms-2 bg-transparent"
                      >
                        X
                      </button>
                    </Tooltip>
                  </div>
                );
              })}
            </ReactSortable>
          );
        }
      }
    ]);
  }, [reset, listLopThi, listGiamthidrop]);

  //lấy dữ liệu cần thiết khi mới bắt đầu như giảng viên,kỳ học,loại kỳ học
  useEffect(() => {
    const getdata = async () => {
      const kihocData = await configApi.getKiHocs();
      setKiHocs(kihocData);
      const listLoaiThi = await lopThiApi.listLoaiThi();
      setLoaithi(listLoaiThi.data);
      const giaoVienData = await giaoVienApi.cache();
      setlistGiangvien(
        giaoVienData.data.map((x) => ({
          ...x,
          so_lop_trong: 0,
          thoi_gian_trong: "",
          ma: []
        }))
      );
      const kyhiengio = await configApi.getKiHienGio();
      setKiHoc(kyhiengio.data);
    };
    getdata();
  }, []);

  //lấy lớp theo kì học
  const getLoptheokiHoc = async () => {
    SetSearchLoading(true);
    if (!kiHoc) {
      return;
    }
    const listLoaiThi = await lopThiApi.LopThiTheoKi({
      ki_hoc: kiHoc,
      loai: loaikyThi,
      is_dai_cuong: loaiLopSelected
    });
    const uniqueKipthi = new Set<string>();
    const uniqueNgayThi = new Set<string>();

    // xắp xếp lại lớp thi
    const sortedList = listLoaiThi.data.sort((a, b) => {
      if (moment(a.ngay_thi).isAfter(b.ngay_thi)) {
        return 1;
      } else if (moment(a.ngay_thi).isBefore(b.ngay_thi)) {
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
            return 0;
          }
        }
      }
    });

    const groupedData = countNearbyDuplicatesAndMark(sortedList, [
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

    listLoaiThi.data.forEach((x: any) => {
      setListGiamthidrop((pre) => {
        pre[x.ma] = x.giao_viens;
        return pre;
      });
    });

    setListLopThi(groupedData);

    const giaoVienMapping: {
      [key: string]: { so_lop_trong: number; ma: string[] };
    } = {};

    listLoaiThi.data.forEach((x) => {
      if (x.kip_thi) {
        uniqueKipthi.add(x.kip_thi);
      }
      if (x.ngay_thi) {
        uniqueNgayThi.add(x.ngay_thi);
      }
      if (!x.giao_viens || x.giao_viens.length == 0) {
        return;
      }
      x.giao_viens.forEach((giao_vien) => {
        if (!giaoVienMapping[giao_vien.id]) {
          giaoVienMapping[giao_vien.id] = {
            so_lop_trong: 0,
            ma: []
          };
        }
        giaoVienMapping[giao_vien.id].so_lop_trong++;
        giaoVienMapping[giao_vien.id].ma.push(x.ma);
      });
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

    setlistGiangvien((pre) => {
      const filstArr = pre.map((gv) => {
        return {
          ...gv,
          so_lop_trong: giaoVienMapping[gv.id]
            ? giaoVienMapping[gv.id].so_lop_trong || 0
            : 0,
          thoi_gian_trong: "",
          ma: giaoVienMapping[gv.id]?.ma || []
        };
      });
      return filstArr;
    });
    SetSearchLoading(false);
  };

  const sortListGiamthi = (
    index: number,
    key: string,
    order: "asc" | "desc" | ""
  ) => {
    if (order === "desc") {
      if (index === 0) {
        setlistTempGiangvien((pre) => [
          ...pre.sort(
            (a: { [index: string]: any }, b: { [index: string]: any }) => {
              if (
                a[key]
                  ?.split(" ")
                  .slice(0, a[key]?.split(" ")?.length - 1)
                  .join(" ") >
                b[key]
                  ?.split(" ")
                  .slice(0, b[key]?.split(" ")?.length - 1)
                  .join(" ")
              ) {
                return 1;
              } else if (
                a[key]
                  ?.split(" ")
                  .slice(0, a[key]?.split(" ")?.length - 1)
                  .join(" ") <
                b[key]
                  ?.split(" ")
                  .slice(0, b[key]?.split(" ")?.length - 1)
                  .join(" ")
              ) {
                return -1;
              } else {
                return 0;
              }
            }
          )
        ]);
      } else if (index === 1) {
        setlistTempGiangvien((pre) => [
          ...pre.sort(
            (a: { [index: string]: any }, b: { [index: string]: any }) => {
              if (
                a[key]?.split(" ")[a[key]?.split(" ")?.length - 1] >
                b[key]?.split(" ")[b[key]?.split(" ")?.length - 1]
              ) {
                return 1;
              } else if (
                a[key]?.split(" ")[a[key]?.split(" ")?.length - 1] <
                b[key]?.split(" ")[b[key]?.split(" ")?.length - 1]
              ) {
                return -1;
              } else {
                return 0;
              }
            }
          )
        ]);
      } else {
        setlistTempGiangvien((pre) => [
          ...pre.sort(
            (a: { [index: string]: any }, b: { [index: string]: any }) => {
              if (a[key] > b[key]) {
                return 1;
              } else if (a[key] < b[key]) {
                return -1;
              } else {
                return 0;
              }
            }
          )
        ]);
      }
    } else if (order === "asc") {
      if (index === 0) {
        setlistTempGiangvien((pre) => [
          ...pre.sort(
            (a: { [index: string]: any }, b: { [index: string]: any }) => {
              if (
                a[key]
                  ?.split(" ")
                  .slice(0, a[key]?.split(" ")?.length - 1)
                  .join(" ") >
                b[key]
                  ?.split(" ")
                  .slice(0, b[key]?.split(" ")?.length - 1)
                  .join(" ")
              ) {
                return -1;
              } else if (
                a[key]
                  ?.split(" ")
                  .slice(0, a[key]?.split(" ")?.length - 1)
                  .join(" ") <
                b[key]
                  ?.split(" ")
                  .slice(0, b[key]?.split(" ")?.length - 1)
                  .join(" ")
              ) {
                return 1;
              } else {
                return 0;
              }
            }
          )
        ]);
      } else if (index === 1) {
        setlistTempGiangvien((pre) => [
          ...pre.sort(
            (a: { [index: string]: any }, b: { [index: string]: any }) => {
              if (
                a[key]?.split(" ")[a[key]?.split(" ")?.length - 1] >
                b[key]?.split(" ")[b[key]?.split(" ")?.length - 1]
              ) {
                return -1;
              } else if (
                a[key]?.split(" ")[a[key]?.split(" ")?.length - 1] <
                b[key]?.split(" ")[b[key]?.split(" ")?.length - 1]
              ) {
                return 1;
              } else {
                return 0;
              }
            }
          )
        ]);
      } else {
        setlistTempGiangvien((pre) => [
          ...pre.sort(
            (a: { [index: string]: any }, b: { [index: string]: any }) => {
              if (a[key] > b[key]) {
                return -1;
              } else if (a[key] < b[key]) {
                return 1;
              } else {
                return 0;
              }
            }
          )
        ]);
      }
    } else {
      setlistTempGiangvien((pre) => [...pre]);
    }
  };
  useEffect(() => {
    if (markHeader.every((x) => x === 0)) {
      setlistTempGiangvien(listGiangvien);
    } else {
      const indexOFsort = markHeader.findIndex((n) => n > 0 || n < 0);
      const valueOFsort = markHeader[indexOFsort];
      setlistTempGiangvien(listGiangvien);
      sortListGiamthi(
        indexOFsort,
        indexOFsort === 3
          ? "thoi_gian_trong"
          : indexOFsort === 2
          ? "so_lop_trong"
          : "name",
        valueOFsort === 1 ? "asc" : valueOFsort === -1 ? "desc" : ""
      );
    }
  }, [listGiangvien]);

  useEffect(() => {
    setListLopThiTemp(listLopThi);
  }, [listLopThi]);

  const filterListGiangthi = (value: string) => {
    setlistTempGiangvien(() =>
      listGiangvien.filter(
        (data) => data.name?.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const MarkChangeHandle = (index: number, key: string) => {
    if (markHeader[index] === 0) {
      setMarkHeader((pre) =>
        pre.map((_x, i) => {
          if (i === index) {
            return 1;
          } else {
            return 0;
          }
        })
      );
      sortListGiamthi(index, key, "asc");
    } else if (markHeader[index] === 1) {
      setMarkHeader((pre) =>
        pre.map((_x, i) => {
          if (i === index) {
            return -1;
          } else {
            return 0;
          }
        })
      );
      sortListGiamthi(index, key, "desc");
    } else if (markHeader[index] === -1) {
      setMarkHeader([0, 0, 0, 0]);
      sortListGiamthi(index, key, "");
    }
  };

  const onSave = async (api: (data: any) => any, key: number) => {
    if (key == 1) {
      setLoadingSaveAndSend(true);
    } else {
      setLoadingSave(true);
    }
    const newArr = listGiangvien
      .map((gv) => {
        if (gv.ma?.length > 0) {
          const listLT = listLopThi.filter((x) => gv.ma?.includes(x.ma));
          return {
            giao_vien_id: gv.id,
            name: gv.name,
            email: gv.email,
            lop_thi: listLT.map((lt) => ({
              ma_lop: lt.ma_hp,
              ma_lop_thi: lt.ma,
              ngay_thi: lt.ngay_thi,
              kip_thi: lt.kip_thi,
              phong_thi: lt.phong_thi
            }))
          };
        } else {
          return null;
        }
      })
      .filter((x) => x != null);

    await api({ info: newArr, ki_hoc: kiHoc, loai: loaikyThi })
      .then(() => {
        notification.success({
          message: t("nofi.saveSuccess"),
          description: t("nofi.saveSuccess_desc")
        });
      })
      .catch(() => {
        notification.error({
          message: t("nofi.savefailed"),
          description: t("nofi.savefailed_desc")
        });
      })
      .finally(() => {
        setLoadingSave(false);
        setLoadingSaveAndSend(false);
      });
  };
  const exportDS = async (value: any) => {
    try {
      const res = await exportApi.excelXepLichThi({
        ki_hoc: kiHoc,
        loai: loaikyThi,
        kip_thi: kipThiFilterValue,
        ngay_thi: dateFilterValue,
        title: String(value.title).toUpperCase()
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Lich-coi-thi-giao-vien_${
          dateFilterValue || dayjs().format("DD-MM-YYYY")
        }_${kipThiFilterValue || ""}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    } finally {
      setDialogExport(false);
    }
  };
  const filterListLopthi = () => {
    setListLopThiTemp(() => {
      if (dateFilterValue == null && kipThiFilterValue == null) {
        return listLopThi;
      }
      return listLopThi.filter((x) => {
        if (
          dateFilterValue &&
          dateFilterValue != "" &&
          kipThiFilterValue &&
          kipThiFilterValue != ""
        ) {
          return (
            x.ngay_thi === dateFilterValue && x.kip_thi === kipThiFilterValue
          );
        } else {
          if (dateFilterValue && dateFilterValue != "") {
            return x.ngay_thi === dateFilterValue;
          } else if (kipThiFilterValue && kipThiFilterValue != "") {
            return x.kip_thi === kipThiFilterValue;
          }
        }
      });
    });
  };

  const onSaveAndSend = async (value: any) => {
    setLoadingSaveAndSend(true);
    try {
      const newArr = listGiangvien
        .map((gv) => {
          if (gv.ma.length > 0) {
            const listLT = listLopThi.filter((x) => gv.ma.includes(x.ma));
            return {
              giao_vien_id: gv.id,
              name: gv.name,
              email: gv.email,
              lop_thi: listLT.map((lt) => ({
                ma_lop: lt.ma_hp,
                ma_lop_thi: lt.ma,
                ngay_thi: lt.ngay_thi,
                kip_thi: lt.kip_thi,
                phong_thi: lt.phong_thi
              }))
            };
          } else {
            return null;
          }
        })
        .filter((x) => x != null);

      await lopThiApi.SapXepLichTrongThi({
        info: newArr,
        ki_hoc: kiHoc,
        loai: loaikyThi,
        title: value.title
      });

      notification.success({
        message: t("nofi.saveSuccess"),
        description: t("nofi.saveSuccess_desc")
      });
      setDialogSendMail(false);
    } catch (error) {
      console.log(error);
      notification.error({
        message: t("nofi.savefailed"),
        description: t("nofi.savefailed_desc")
      });
    } finally {
      setLoadingSaveAndSend(false);
      formTitle.resetFields();
    }
  };
  return (
    <PageContainer title={t("title.main")}>
      <div className="flex">
        <div className="w-full">
          <div className="flex flex-wrap gap-2 2xl:justify-between me-2 mb-2">
            <Space className="bg-gray-200 border-solid border border-[#c0c0c0] p-1 rounded-lg">
              <Tooltip title={t("action.detail")}>
                <Button
                  type="default"
                  className="hover:!border-blue-700 hover:!text-blue-700 !border-gray-600 !text-gray-800"
                  icon={<SolutionOutlined />}
                  onClick={() => {
                    navigate("lop-coi-thi-giao-vien-chi-tiet");
                  }}
                />
              </Tooltip>
            </Space>
            <Space className="bg-gray-200 border-solid border border-[#c0c0c0] py-2 px-4 rounded-lg">
              <Select
                className="me-1"
                placeholder={t("placeholder.ki_hoc")}
                style={{ width: "7rem" }}
                allowClear
                value={kiHoc}
                onChange={setKiHoc}
                options={kiHocs.map((x) => ({ label: x, value: x }))}
              />
              <Select
                className="me-1"
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
              <Select
                placeholder={"Chọn loại lớp"}
                allowClear
                className="w-[9rem]"
                value={loaiLopSelected}
                onChange={setLoaiLopSelected}
                options={[
                  { label: "Đại cương", value: 1 },
                  { label: "Chuyên ngành", value: 2 }
                ]}
              />
              <Button loading={SearchLoading} onClick={getLoptheokiHoc}>
                {t("action.search")}
              </Button>
            </Space>
            <Space className="bg-gray-200 py-2 px-4 rounded-lg">
              <Select
                className="me-1"
                style={{ width: "9rem" }}
                placeholder={t("placeholder.filter_ngay_thi")}
                allowClear
                value={dateFilterValue}
                onChange={setDateFilterValue}
                options={ngayThiValue}
              />
              <Select
                className="me-1"
                style={{ width: "9rem" }}
                placeholder={t("placeholder.filter_kip_thi")}
                allowClear
                value={kipThiFilterValue}
                onChange={setkipThiFilterValue}
                options={kipThiValue}
              />
              <Button
                disabled={listLopThiTemp.length > 1 ? false : true}
                onClick={filterListLopthi}
              >
                {t("action.filter")}
              </Button>
            </Space>
            <Space className="bg-gray-200 border-solid border border-[#c0c0c0] py-2 px-4 rounded-lg">
              <Button type="primary" onClick={() => setDialogExport(true)}>
                {t("action.exportList")}
              </Button>
              <Button
                loading={loadingSaveAndSend}
                onClick={() => setDialogSendMail(true)}
                type="primary"
              >
                {t("action.saveAndSendMail")}
              </Button>
              <Button
                loading={loadingSave}
                onClick={() => onSave(lopThiApi.SapXepLichTrongThiSave, 0)}
                type="primary"
              >
                {t("action.save")}
              </Button>
            </Space>
          </div>
          <div className="max-h-[600px] overflow-y-scroll mb-1 lg:mb-0">
            <Table
              className="lich-thi-gv"
              rowClassName={"allowDrag"}
              pagination={false}
              tableLayout="fixed"
              dataSource={listLopThiTemp}
              columns={lopthiHeader}
              bordered
            />
          </div>
        </div>
        <div>
          <div className="mb-2 mx-2">
            <div className="bg-gray-200 border-solid border border-[#c0c0c0] py-2 px-3 rounded-lg  ">
              <Search
                style={{ width: "100%" }}
                placeholder={t("placeholder.search")}
                onSearch={filterListGiangthi}
                allowClear
              />
            </div>
          </div>
          <div className="mx-2 max-h-[600px] overflow-y-scroll  mt-1 lg:mt-0">
            <table className="border-collapse min-h-[222px] border-solid border border-[#c0c0c0] table-auto">
              <thead className="bg-[#eff0f3] rounded border-2 border-gray-700 nodrag">
                <tr>
                  <th
                    onClick={() => {
                      MarkChangeHandle(0, "name");
                    }}
                    className="border-solid border border-[#c0c0c0] rounded-ss-md p-4 whitespace-nowrap cursor-pointer text-sm font-semibold tracking-wide text-left"
                  >
                    {t("field.ho")}{" "}
                    <span>
                      {markHeader[0] === 1 ? (
                        <CaretUpOutlined />
                      ) : markHeader[0] === -1 ? (
                        <CaretDownOutlined />
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => {
                      MarkChangeHandle(1, "name");
                    }}
                    className=" border-solid border border-[#c0c0c0] p-4 whitespace-nowrap cursor-pointer text-sm font-semibold tracking-wide text-left"
                  >
                    {t("field.ten")}{" "}
                    <span>
                      {markHeader[1] === 1 ? (
                        <CaretUpOutlined />
                      ) : markHeader[1] === -1 ? (
                        <CaretDownOutlined />
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => {
                      MarkChangeHandle(2, "so_lop_trong");
                    }}
                    className=" border-solid border border-[#c0c0c0] p-4 whitespace-nowrap cursor-pointer text-sm font-semibold tracking-wide text-left"
                  >
                    {t("field.so_lop_trong")}{" "}
                    <span>
                      {markHeader[2] === 1 ? (
                        <CaretUpOutlined />
                      ) : markHeader[2] === -1 ? (
                        <CaretDownOutlined />
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                </tr>
              </thead>
              {listTempGiangvien.length >= 1 ? (
                <ReactSortable
                  group={{
                    name: "shared",
                    pull: "clone",
                    put: false
                  }}
                  tag={"tbody"}
                  key={reset + "2"}
                  filter={".nodrag"}
                  swapThreshold={100}
                  list={listTempGiangvien}
                  setList={() => {}}
                  sort={false}
                >
                  {listTempGiangvien.map((gv) => {
                    if (gv?.name && gv?.name != "") {
                      return (
                        <tr
                          className="w-full hover:bg-[#e4e4e4] bg-[#f4f5f8]"
                          onClick={(evt) => {
                            if (evt.detail === 2) {
                              navigate("giao-vien/" + gv.id);
                            }
                          }}
                          key={gv?.id}
                        >
                          <td className=" whitespace-nowrap border-solid border border-[#c0c0c0] p-3 text-sm text-gray-700">
                            {gv?.name
                              .split(" ")
                              .slice(0, gv?.name?.split(" ")?.length - 1)
                              .join(" ")}{" "}
                          </td>
                          <td className=" border-solid whitespace-nowrap border border-[#c0c0c0] p-3 text-sm text-gray-700">
                            {
                              gv?.name?.split(" ")[
                                gv?.name?.split(" ")?.length - 1
                              ]
                            }
                          </td>
                          <td className=" border-solid border border-[#c0c0c0] p-3 text-sm text-gray-700">
                            {gv?.so_lop_trong}
                          </td>
                        </tr>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </ReactSortable>
              ) : (
                <tr>
                  <td className="bg-[#f4f5f8]" colSpan={4} rowSpan={6}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </td>
                </tr>
              )}
            </table>
          </div>
        </div>
      </div>
      <Modal
        open={dialogSendMail}
        onCancel={() => {
          setDialogSendMail(false), formTitle.resetFields();
        }}
        footer={<></>}
        centered
      >
        <Form
          form={formTitle}
          onFinish={onSaveAndSend}
          className="pt-8"
          layout="vertical"
        >
          <h2 className="text-center mb-4">Lưu và gửi mail cho giảng viên</h2>
          <Form.Item label="Tiêu đề email" name="title">
            <Input placeholder="Nhập tiêu đề cho email"></Input>
          </Form.Item>
          <Form.Item className="">
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setDialogSendMail(false), formTitle.resetFields();
                }}
              >
                Huỷ
              </Button>
              <Button
                loading={loadingSaveAndSend}
                type="primary"
                htmlType="submit"
              >
                Gửi
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={dialogExport}
        onCancel={() => {
          setDialogExport(false), formTitle.resetFields();
        }}
        footer={<></>}
        centered
      >
        <Form
          form={formTitle}
          onFinish={exportDS}
          className="pt-8"
          layout="vertical"
        >
          <h2 className="text-center mb-4">Xuất danh sách lớp thi giáo viên</h2>
          <Form.Item label="Tiêu đề bảng" name="title">
            <Input placeholder="Nhập tiêu đề cho bảng"></Input>
          </Form.Item>
          <Form.Item className="">
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setLoadingExport(false), formTitle.resetFields();
                }}
              >
                Huỷ
              </Button>
              <Button loading={loadingExport} type="primary" htmlType="submit">
                Xuất
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
