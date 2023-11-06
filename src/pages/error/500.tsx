import { Button, Result } from "antd";

import { useNavigate } from "react-router-dom";

const Page500: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="loading-container">
      <Result
        status="500"
        title="500"
        subTitle="Hệ thống gặp vấn đề"
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Trở về trang chủ
          </Button>
        }
      ></Result>
    </div>
  );
};

export default Page500;
export { Page500 };
