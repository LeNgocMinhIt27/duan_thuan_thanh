import { Button, Form, Select, Typography } from "antd";
import { FC, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import ImportExcelCompoment from "@/components/importDrawer";
import importApi from "@/api/import.api";
import configApi from "@/api/config.api";
import { DownloadOutlined } from "@ant-design/icons";
import { useLoaiLopThi } from "@/hooks/useLoaiLopThi";

const { Title } = Typography;
const ImportPage: FC<any> = () => {
  const { t } = useTranslation("sinh-vien");
  const { items: dotThi } = useLoaiLopThi();
  const [kihoc, setKiHoc] = useState<string[]>([]);
  const [isDaiCuong, setIsDaiCuong] = useState(false);

  const dowloadSampleFile = () => {
    const fileUrl = "public/download/file_mau_import.zip";

    const a = document.createElement("a");
    a.href = fileUrl;

    a.setAttribute("download", "file_mau_import.zip");
    a.click();
  };
  useEffect(() => {
    const getkihoc = async () => {
      const kihocs = await configApi.getKiHocs();
      setKiHoc(kihocs);
    };
    getkihoc();
  }, []);
  return (
    <div className="flex flex-col max-h-full overflow-hidden overflow-y-auto">
      <Button
        className="w-fit mx-1"
        icon={<DownloadOutlined />}
        onClick={dowloadSampleFile}
      >
        Tải file mẫu import
      </Button>
      <div className="flex flex-wrap md:flex-row">
        <div className="mx-1 my-2">
          <ImportExcelCompoment
            suggestType="giao-vien"
            fieldName={[{ name: "name" }, { name: "email" }]}
            fileDownloadName="giao_vien"
            downloadable={true}
            uploadType=" .xls,.xlsx"
            appcectType={[
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "application/vnd.ms-excel"
            ]}
            translation="giao-Vien-Import"
            extraDownloadFileHeader={[
              { keyName: "password", value: "password" }
            ]}
            uploadformApi={importApi.importGiaoVien}
          />
        </div>
        <div className="mx-1 my-2">
          <ImportExcelCompoment
            fieldName={[
              {
                name: "ma"
              },
              {
                name: "ma_kem"
              },
              {
                name: "ma_hp"
              },
              { name: "ten_hp" },
              {
                name: "ghi_chu"
              },
              {
                name: "tuan_hoc"
              },
              {
                name: "giao_vien_email"
                // ghi_chu: `Ngăn cách giữa các email bằng dấu ","`,
              },
              {
                name: "loai"
              },
              {
                name: "lop_thu"
              },
              {
                name: "lop_thoigian"
              },
              {
                name: "lop_kip"
              },
              {
                name: "lop_phong"
              }
            ]}
            extraFormItemCompoment={{
              position: "top",
              element: (
                <>
                  <Form.Item
                    name={"ki_hoc"}
                    rules={[
                      {
                        required: true,
                        message: "Hãy nhâp thông tin cho trường kì học"
                      }
                    ]}
                    label={t("field.ki_hoc")}
                  >
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={kihoc.map((x) => ({ label: x, value: x }))}
                    />
                  </Form.Item>
                  <Form.Item
                    name={"is_dai_cuong"}
                    initialValue={true}
                    rules={[
                      {
                        required: true,
                        message: "Hãy nhâp thông tin cho trường loại lớp"
                      }
                    ]}
                    label={"Loại lớp"}
                  >
                    <Select
                      allowClear
                      value={isDaiCuong}
                      onChange={(value) => setIsDaiCuong(value)}
                      options={[
                        { label: "Đại cương", value: true },
                        { label: "Chuyên ngành", value: false }
                      ]}
                    />
                  </Form.Item>
                </>
              )
            }}
            extraUploadObjKey={["ki_hoc", "is_dai_cuong"]}
            uploadType=" .xls,.xlsx"
            appcectType={[
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "application/vnd.ms-excel"
            ]}
            fileDownloadName="lop"
            translation="lop-Import"
            uploadformApi={importApi.importLop}
            downloadable={false}
            suggestType="lop"
          />
        </div>
        <div className="mx-1 my-2">
          <ImportExcelCompoment
            fieldName={[
              {
                name: "ten_hp"
              },
              {
                name: "ma_hp"
              },
              {
                name: "ma_lop"
              },
              {
                name: "sinh_vien_id"
              },
              {
                name: "sinh_vien_name"
              },
              {
                name: "sinh_vien_birthday"
              },
              {
                name: "sinh_vien_lop"
              },
              {
                name: "sinh_vien_nhom"
              }
            ]}
            extraFormItemCompoment={{
              position: "top",
              element: (
                <Form.Item
                  name={"ki_hoc"}
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập thông tin cho trường kì học"
                    }
                  ]}
                  label={t("field.ki_hoc")}
                >
                  <Select
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={kihoc.map((x) => ({ label: x, value: x }))}
                  />
                </Form.Item>
              )
            }}
            uploadType=" .xls,.xlsx"
            extraUploadObjKey={["ki_hoc"]}
            appcectType={[
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "application/vnd.ms-excel"
            ]}
            fileDownloadName="sinhVien"
            translation="sinh-Vien-Import"
            uploadformApi={importApi.importSinhVien}
            downloadable={false}
            suggestType="sinh-vien"
          />
        </div>
      </div>
      <Title style={{ margin: "0" }} level={2}>
        Thi
      </Title>
      <div className="flex flex-wrap md:flex-row">
        <div className="flex flex-wrap">
          <div className="mx-1 my-2">
            <ImportExcelCompoment
              fieldName={[
                {
                  name: "ma_lop"
                },
                {
                  name: "nhom"
                },
                {
                  name: "ma_lop_thi",
                  isRequired: false
                },
                { name: "ngay_thi" },
                { name: "kip_thi" },
                { name: "phong_thi" }
              ]}
              fileDownloadName="thi_giua_ky"
              extraFormItemCompoment={{
                position: "top",
                element: (
                  <>
                    <Form.Item
                      name={"ki_hoc"}
                      rules={[
                        {
                          required: true,
                          message: "Hãy nhập thông tin cho trường kì học"
                        }
                      ]}
                      label={t("field.ki_hoc")}
                    >
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={kihoc.map((x) => ({ label: x, value: x }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={"loai"}
                      rules={[
                        {
                          required: true,
                          message: "Hãy nhập thông tin cho trường kì học"
                        }
                      ]}
                      label={"Loại"}
                    >
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={dotThi.map((x) => ({
                          label: x.title,
                          value: x.value
                        }))}
                      />
                    </Form.Item>
                  </>
                )
              }}
              uploadType=" .xls,.xlsx"
              extraUploadObjKey={["ki_hoc", "loai"]}
              appcectType={[
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel"
              ]}
              translation="lop-thi-Import"
              uploadformApi={importApi.importLopThi}
              downloadable={false}
              suggestType="lop-thi"
            />
          </div>
          <div className="mx-1 my-2">
            <ImportExcelCompoment
              fieldName={[
                {
                  name: "mssv"
                },
                {
                  name: "ma_lop"
                },
                {
                  name: "nhom",
                  isRequired: false
                },
                {
                  name: "ma_lop_thi",
                  isRequired: false
                }
              ]}
              fileDownloadName="sinh_vien_thi"
              translation="sinh-vien-lop-thi-Import"
              extraFormItemCompoment={{
                position: "top",
                element: (
                  <>
                    <Form.Item
                      name={"ki_hoc"}
                      rules={[
                        {
                          required: true,
                          message: "Hãy nhập thông tin cho trường kì học"
                        }
                      ]}
                      label={t("field.ki_hoc")}
                    >
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={kihoc.map((x) => ({ label: x, value: x }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={"loai"}
                      rules={[
                        {
                          required: true,
                          message: "Hãy nhập thông tin cho trường kì học"
                        }
                      ]}
                      label={"Loại"}
                    >
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={dotThi.map((x) => ({
                          label: x.title,
                          value: x.value
                        }))}
                      />
                    </Form.Item>
                  </>
                )
              }}
              uploadType=" .xls,.xlsx"
              extraUploadObjKey={["ki_hoc", "loai"]}
              appcectType={[
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel"
              ]}
              uploadformApi={importApi.importSinhVienLopThi}
              downloadable={false}
              suggestType="lop-thi-sv"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;
