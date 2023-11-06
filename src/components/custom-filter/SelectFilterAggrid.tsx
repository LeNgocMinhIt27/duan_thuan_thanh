import { Fragment, forwardRef, useImperativeHandle, useState } from "react";

import { IFloatingFilterParams } from "ag-grid-community";
import { Select } from "antd";

export interface SelectFloatingFilterParams extends IFloatingFilterParams {
  suppressFilterButton: boolean;
  width: string;
  placeholder: string;
  data: { value: string; label: string }[];
}

const SelectFilterAggrid = forwardRef(
  (props: SelectFloatingFilterParams, ref) => {
    const [values, setValues] = useState<string | null>(null);
    useImperativeHandle(ref, () => {
      return {
        onParentModelChanged(parentModel: any) {
          // note that the filter could be anything here, but our purposes we're assuming a greater than filter only,
          // so just read off the value and use that
          if (!parentModel) {
            setValues(null);
          } else {
            setValues(parentModel.filter);
          }
        }
      };
    });

    const onInputChanged = (value: string) => {
      props.parentFilterInstance((instance: any) => {
        setValues(value);
        instance.setValue(value);
      });
    };

    return (
      <Fragment>
        <div
          style={{
            display: "inline-flex",
            width: "100%",
            alignItems: "center"
          }}
        >
          <Select
            style={{ width: "100%" }}
            placeholder={props.placeholder}
            allowClear
            value={values}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={onInputChanged}
            options={props.data}
          />
        </div>
      </Fragment>
    );
  }
);

export default SelectFilterAggrid;
