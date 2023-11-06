import { Link } from "react-router-dom";
import imgLogoUrl from "@/assets/static/logoEn.png";

const AdminHeader = () => {
  return (
    <Link to="/" style={{ display: "block", width: "fit-content" }}>
      <img alt="logo" src={imgLogoUrl} className="thumnail-logo-img" />
    </Link>
  );
};
export default AdminHeader;
