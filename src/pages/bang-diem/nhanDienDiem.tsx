import { Link, useNavigate, useParams } from "react-router-dom";
import { App, Button, Form, Select, Spin } from "antd";
import { useTranslation } from "react-i18next";
import PageContainer from "@/Layout/PageContainer";
import { useEffect, useState } from "react";
import bangDiemApi from "@/api/bangDiem/bangDiem.api";
import { convertLinkToBackEnd } from "@/utils/url";
import { LoadingOutlined } from "@ant-design/icons";
import { LopThi } from "@/interface/lop";
import { useAppSelector } from "@/stores/hook";
import { getAuthUser } from "@/stores/features/auth";

const baseApi = convertLinkToBackEnd("/sohoa/api");
export default function NhanDienDiemPage() {
  const { t } = useTranslation("danh-sach-bang-diem");
  const { id } = useParams();
  const { notification } = App.useApp();
  const [key, setKey] = useState(0);
  const [page, setPage] = useState("01");
  const navigate = useNavigate();
  const [loadingTab, setLoadingTab] = useState(true);
  const [trangChuaNhanDienDiem, setTrangChuaNhanDienDiem] = useState<string[]>(
    []
  );
  const [lopthi, getLopThi] = useState<LopThi[]>();
  const [formRef] = Form.useForm();
  const authUser = useAppSelector(getAuthUser);

  const onSelect = (value: number) => {
    if (value == 1) {
      setPage("false");
    } else {
      setPage(value.toString());
    }
    setKey(Math.random());
  };

  useEffect(() => {
    const getdata = async () => {
      setLoadingTab(true);
      try {
        const TrangChuaNhanDien = await bangDiemApi
          .layTrangChuaNhanDien(id)
          .then((x) => x.data);
        const getlopthi = await bangDiemApi.getLopthiThuocBangdiem(
          id as string
        );
        setTrangChuaNhanDienDiem(TrangChuaNhanDien);
        getLopThi(getlopthi.data);
      } finally {
        setLoadingTab(false);
      }
    };
    getdata();
  }, []);

  const onFinish = async (values: any) => {
    const lopthiname = lopthi?.filter((x) => x.id === values.lop_thi_id);

    try {
      await bangDiemApi.nhanDien({ ...values, user_id: authUser?.id }, id);
      notification.success({
        message: "Thành công",
        description: `Cập nhập pdf lớp thi ${lopthiname?.[0].ma} thành công`
      });
      formRef.resetFields();
    } catch (err) {
      notification.error({
        message: "Thất bại",
        description: `Cập nhập pdf lớp lớp thi ${lopthiname?.[0].ma} thất bại`
      });
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-wrap my-1">
        <div className="flex justify-between w-full">
          <Button
            onClick={() => {
              navigate("/sohoa/bang-diem-tro-ly");
            }}
          >
            {t("action.back")}
          </Button>
          <Button type="primary" className="mx-1">
            <Link to={"danh-sach-lop-thi"}>{t("action.class")}</Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row h-full w-full justify-between">
        <div key={key} className="pdf flex-1">
          <iframe
            className="w-full"
            loading="lazy"
            src={`${baseApi}/bang-diem/show-pdf/${id}#page=${page}`}
          ></iframe>
        </div>
        <div className="flex-1">
          {loadingTab ? (
            <div className="w-full h-full flex justify-center items-center">
              <Spin
                indicator={
                  <LoadingOutlined style={{ fontSize: "3rem" }} spin />
                }
                size="large"
              />
            </div>
          ) : (
            <div className="ms-4 me-1">
              <h2 className="mb-4">Cập nhập lại trang pdf lớp thi</h2>
              <Form form={formRef} layout="vertical" onFinish={onFinish}>
                <Form.Item
                  name="pages"
                  label="Trang"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập thông tin cho trường trang"
                    }
                  ]}
                >
                  <Select
                    placeholder="Trang"
                    mode="multiple"
                    showSearch
                    allowClear
                    onSelect={onSelect}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={trangChuaNhanDienDiem.map((x: string) => ({
                      value: x,
                      label: "Trang: " + x
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  name="lop_thi_id"
                  label="Lớp thi"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập thông tin cho trường lớp thi"
                    }
                  ]}
                >
                  <Select
                    placeholder="Lớp thi"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={lopthi?.map((x) => ({
                      label: x.ma,
                      value: x.id
                    }))}
                  />
                </Form.Item>
                <Form.Item>
                  <Button className="mx-1" htmlType="reset">
                    Đặt lại
                  </Button>
                  <Button className="mx-1" type="primary" htmlType="submit">
                    Xác nhận
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
