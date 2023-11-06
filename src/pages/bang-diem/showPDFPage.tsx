import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageContainer from "@/Layout/PageContainer";
import { convertLinkToBackEnd } from "@/utils/url";
import { ROLE_CODE, getPrefix } from "@/constant";
import { useAppSelector } from "@/stores/hook";
import { getAuthUser } from "@/stores/features/auth";

const baseApi = convertLinkToBackEnd("/sohoa/api");
export default function ShowPDFPage() {
  const { t } = useTranslation("danh-sach-bang-diem");
  const { id } = useParams();
  const authUser = useAppSelector(getAuthUser);

  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="flex flex-wrap my-1">
        <Button
          onClick={() => {
            navigate(
              getPrefix() + authUser?.role_code != ROLE_CODE.TEACHER
                ? "/bang-diem-tro-ly"
                : "/danh-sach-bang-diem"
            );
          }}
        >
          {t("action.back")}
        </Button>
        <div className="flex-1"></div>
        {authUser?.role_code != ROLE_CODE.TEACHER && (
          <Button type="primary" className="mx-1">
            <Link to={`nhan-dien-diem/${id}`}>{t("action.class")}</Link>
          </Button>
        )}
        <Button type="primary" className="mx-1">
          <Link to={"danh-sach-lop-thi"}>{t("action.class")}</Link>
        </Button>
      </div>
      <div className="pdf">
        <iframe
          className="w-full"
          src={`${baseApi}/bang-diem/show-pdf/${id}`}
        />
      </div>
    </PageContainer>
  );
}
