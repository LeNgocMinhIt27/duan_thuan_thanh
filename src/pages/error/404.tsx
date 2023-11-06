import { Button, Result } from "antd";

import { useNavigate } from "react-router-dom";

const Page404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="loading-container">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Trở về trang chủ
          </Button>
        }
      ></Result>
    </div>
  );
};

export default Page404;
export { Page404 };
