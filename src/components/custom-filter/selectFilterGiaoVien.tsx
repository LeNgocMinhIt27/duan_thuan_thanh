import { forwardRef, useImperativeHandle, useState } from "react";

import { IFloatingFilterParams } from "ag-grid-community";
import { Select } from "antd";

export interface Props extends IFloatingFilterParams {
  suppressFilterButton: boolean;
  placeholder?: string;
  data: { value: string; label: string }[];
}
const { Option } = Select;
const selectFilterGiaoVien = forwardRef((props: Props, ref) => {
  const [values, setValues] = useState<string[]>([]);

  useImperativeHandle(ref, () => {
    return {
      onParentModelChanged(parentModel: any) {
        // note that the filter could be anything here, but our purposes we're assuming a greater than filter only,
        // so just read off the value and use that
        if (!parentModel) {
          setValues([]);
        } else {
          setValues(parentModel.filter);
        }
      }
    };
  });

  const onInputChanged = (value: any) => {
    props.parentFilterInstance((instance: any) => {
      setValues(value);
      if (instance && instance.setValue) instance.setValue(value);
    });
  };

  return (
    <div
      style={{
        display: "inline-flex",
        width: "100%",
        alignItems: "center"
      }}
    >
      <Select
        mode="multiple"
        showSearch
        placeholder={props.placeholder}
        allowClear
        value={values}
        className="select_filter w-full"
        onChange={onInputChanged}
        filterOption={(input, option) => {
          const searchText = input.toLowerCase();
          const label = String(option?.label).toLowerCase();
          return label?.includes(searchText);
        }}
      >
        {renderOption(props.data)}
      </Select>
    </div>
  );
});
const renderOption = (data: any) => {
  if (!Array.isArray(data)) return <></>;
  if (!data || !data.length) return <></>;

  return (
    <>
      {data.map((item, index) => (
        <Option
          key={index}
          value={item.id}
          label={`${item.name} (${item.email})`}
        >
          <p>{item.name}</p>
          <p>{item.email}</p>
        </Option>
      ))}
    </>
  );
};
export default selectFilterGiaoVien;
