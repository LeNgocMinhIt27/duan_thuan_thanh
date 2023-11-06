import PageContainer from "@/Layout/PageContainer";
import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useLocation } from "react-router-dom";
import diemLopThiApi from "@/api/bangDiem/diemLopThi.api";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Modal, notification } from "antd";
import { DiemLopThi, IBangDiem } from "@/interface/bangdiem";
import "@/assets/styles/main.scss";
import moment from "moment";
import DiemNhapExcel from "./diem-nhap-excel";
import DiemNhanDien from "./bang-diem-nhan-dien";
import { getAuthUser } from "@/stores/features/auth";
import { useAppSelector } from "@/stores/hook";
import lopThiApi from "@/api/lop/lopThi.api";
import { LopThi } from "@/interface/lop";

const BangDiemMon = () => {
  const breadcrumbs = useMemo(() => {
    return [
      { router: "../", text: "Bảng điểm" },
      { router: "..", text: "Danh sách lớp thi môn" },
      { text: "Điểm chi tiết" }
    ];
  }, []);
  const [diem, monInfo] = useLoaderData() as [DiemLopThi[], IBangDiem];
  const loca = useLocation();
  const lopThiId = Number(loca.search.split("=")[1]);
  const path = loca.pathname.split("/");
  const [api, contextholder] = notification.useNotification();
  const [diemEdit, setDiemEdit] = useState<DiemLopThi[]>([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const authUser = useAppSelector(getAuthUser);
  const bangDiemId = Number(path[3]);
  const [lopThi, setLopThi] = useState<LopThi>();

  const [modalSave, setModalSave] = useState(false);

  const ngayCongKhai = monInfo.ngay_cong_khai;
  const is_cong_khai = monInfo.is_cong_khai;

  const luuDiem = async () => {
    setLoadingSave(true);
    try {
      await diemLopThiApi.save({
        diem: diemEdit,
        id: bangDiemId,
        user: authUser
      });
      api.success({
        message: "Thành Công",
        description: "Lưu điểm thành công"
      });
      setModalSave(false);
      setDiemEdit([]);
    } catch (error) {
      console.log(error);
      api.error({
        message: "Thất bại ",
        description: "Lưu điểm thất bại "
      });
    } finally {
      setLoadingSave(false);
    }
  };
  const getLopThi = async () => {
    try {
      const res = await lopThiApi.getDetail(lopThiId, {});
      setLopThi(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getLopThi();
  }, []);
  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      title={`Bảng điểm lớp thi ${lopThi?.ma || ""}`}
    >
      {contextholder}
      <>
        <div
          className="mb-2 flex justify-between"
          style={{ fontSize: "28px", color: "#000" }}
        >
          <Button type="primary">
            <Link to={`${location.origin}${path.slice(0, -2).join("/")}`}>
              Quay lại
            </Link>
          </Button>
          {!ngayCongKhai || is_cong_khai == false ? (
            <Button type="primary" onClick={() => setModalSave(true)}>
              Lưu điểm
            </Button>
          ) : (
            <span>
              Đã công khai lúc: {moment(ngayCongKhai).format("DD/MM/YYYY")}
            </span>
          )}
        </div>

        {monInfo?.loai === "nhap_tay" ? (
          <div className="col-span-2 score">
            <DiemNhapExcel setDiemEdit={setDiemEdit} diemData={diem[0]} />
          </div>
        ) : (
          <DiemNhanDien setDiemEdit={setDiemEdit} diemData={diem[0]} />
        )}
      </>
      <Modal
        open={modalSave}
        onOk={luuDiem}
        centered
        onCancel={() => setModalSave(false)}
        footer={
          <div className="flex gap-4">
            <Button block danger onClick={() => setModalSave(false)}>
              Huỷ
            </Button>
            <Button block loading={loadingSave} onClick={luuDiem}>
              Xác nhận
            </Button>
          </div>
        }
      >
        <div className="pt-4">
          <h2 className="pb-4 text-center">Lưu điểm</h2>
          <p>
            Bạn muốn lưu dữ liệu bảng điểm hiện tại, hãy chắc chắn mọi dữ liệu
            đều chính xác trước khi xác nhận lưu.
          </p>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default BangDiemMon;
