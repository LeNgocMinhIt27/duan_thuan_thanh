import { LopThi, Lop } from "@/interface/lop";
import { Button, Table, Typography, Space, Card } from "antd";
import { FC, useCallback, useEffect, useState } from "react";
import Column from "antd/es/table/Column";
import {
  // DeleteOutlined,
  OrderedListOutlined
} from "@ant-design/icons";
import lopThiApi from "@/api/lop/lopThi.api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useLoaiLopThi } from "@/hooks/useLoaiLopThi";

dayjs.extend(utc);
dayjs.extend(timezone);
const { Title } = Typography;

const ListLopThiPage: FC<{ lop: Lop }> = ({ lop }) => {
  const { format: formatDotThi } = useLoaiLopThi();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<LopThi[]>([]);
  const getData = useCallback(async () => {
    setLoading(true);
    let items: LopThi[] = [];
    try {
      const res = await lopThiApi.list({ lop_id: lop.id });
      items = res.data.list;
      setDataSource(items);
    } finally {
      setLoading(false);
    }
  }, [lop]);
  useEffect(() => {
    getData();
  }, []);

  const isMobile = useMediaQuery({ minWidth: 600 });

  const customTableStyle = {
    border: "1px solid #e8e8e8",
    borderRadius: "5px"
  };

  return (
    <>
      {isMobile ? (
        <>
          <div className="d-flex items-center justify-between">
            <Typography.Title level={3}>Danh sách lớp thi</Typography.Title>
          </div>
          <Table
            pagination={false}
            dataSource={dataSource}
            loading={loading}
            rowKey="id"
            style={customTableStyle}
          >
            <Column
              title="Lớp thi"
              dataIndex="ma"
              key="ma"
              align="center"
              width={200}
            />
            <Column
              title="Đợt thi"
              dataIndex="loai"
              key="loai"
              align="center"
              // width={120}
            />
            <Column
              title="Hành động"
              key="action"
              width={120}
              align="center"
              render={(_: any, record: LopThi) => (
                <Space size="middle">
                  <Link to={"bang-diem/" + record.id}>
                    <Button
                      shape="circle"
                      icon={<OrderedListOutlined />}
                      type="text"
                    />
                  </Link>
                </Space>
              )}
            />
          </Table>
        </>
      ) : (
        <>
          <div className="d-flex items-center justify-between">
            <Title level={3}>Danh sách lớp thi</Title>
          </div>
          <div className="card-container card-diem-danh">
            {dataSource.map((record: LopThi) => (
              <Card
                key={record.id}
                title={
                  <>
                    <strong className="card-diem-danh__title">Lớp thi: </strong>
                    <span className="card-diem-danh__sub">{record.ma}</span>
                  </>
                }
                actions={[
                  <Link to={"bang-diem/" + record.id}>
                    <OrderedListOutlined key="details" />
                  </Link>
                ]}
              >
                <p>
                  <strong>Đợt thi: </strong>
                  {formatDotThi(record.loai)}
                </p>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ListLopThiPage;
