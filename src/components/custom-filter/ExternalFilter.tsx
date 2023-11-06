import { forwardRef, useCallback, useImperativeHandle } from "react";
import { GridApi } from "ag-grid-community";
import { Col, Row, Input, Space, Select } from "antd";

const { Search } = Input;

export interface ExternalFilterParams {
  gridref?: { current: GridApi };
}

const ExternalFilter = forwardRef(({ gridref }: ExternalFilterParams, ref) => {
  const stateoption = [
    { value: "true", label: "Chặn" },
    { value: "false", label: "Hoạt động" }
  ];
  const groupoption = [{ value: 1, label: "temp" }];

  const externalFilterChanged = useCallback(
    (newValue: string) => {
      const filterInstance = gridref?.current.getFilterInstance("name");

      // Set the filter model
      filterInstance!.setModel({
        filterType: "text",
        type: "startsWith",
        filter: newValue
      });
      gridref?.current.onFilterChanged();
    },
    [gridref]
  );

  const avtiveFilterChanged = useCallback(
    (newValue: string) => {
      const filterInstance: any =
        gridref?.current.getFilterInstance("inactive");

      // Set the filter model
      filterInstance!.setValue(newValue);
      gridref?.current.onFilterChanged();
    },
    [gridref]
  );

  const groupFilterChanged = useCallback(
    (newValue: string) => {
      const filterInstance = gridref?.current.getFilterInstance("nhom");

      // Set the filter model
      filterInstance!.setModel({
        filterType: "text",
        type: "contains",
        filter: newValue
      });
      gridref?.current.onFilterChanged();
    },
    [gridref]
  );

  useImperativeHandle(ref, () => ({
    doesExternalFilterPass: () => {
      return true;
    },
    isExternalFilterPresent: (): boolean => {
      // if ageType is not everyone, then we are filtering
      //   console.log(searchValue !== "");
      return true;
    }
  }));

  return (
    <Row style={{ padding: "0.5rem 0 2rem 0" }} gutter={[26, 0]}>
      <Col>
        <Space direction="vertical">
          <p style={{ fontSize: "1.2rem" }}>Lọc tài khoản</p>
          <Search
            size="large"
            placeholder="Tìm theo tên"
            onSearch={externalFilterChanged}
          />
        </Space>
      </Col>
      <Col>
        <Space direction="vertical">
          <p style={{ fontSize: "1.2rem" }}>Lọc theo nhóm tài khoản</p>
          <Select
            size="large"
            placeholder="Chọn nhóm tài khoản"
            options={groupoption}
            onChange={groupFilterChanged}
          />
        </Space>
      </Col>
      <Col>
        <Space direction="vertical">
          <p style={{ fontSize: "1.2rem" }}>lọc theo trạng thái</p>
          <Select
            size="large"
            placeholder="Tất cả trạng thái"
            allowClear
            options={stateoption}
            onChange={avtiveFilterChanged}
          />
        </Space>
      </Col>
    </Row>
  );
});

export default ExternalFilter;
