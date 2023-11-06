import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { IFilterParams } from "ag-grid-community";
import { Select } from "antd";

interface rolefilterparams extends IFilterParams {
  data: { value: string; label: string }[];
  placeholder?: string;
}

const RoleFilter = forwardRef((props: rolefilterparams, ref) => {
  const [filter, setFilter] = useState<string | null>(null);
  useEffect(() => {
    props.filterChangedCallback();
  }, [filter, props]);

  const isFilterActive = () => {
    return filter;
  };

  // expose AG Grid Filter Lifecycle callbacks
  useImperativeHandle(ref, () => {
    return {
      isFilterActive,

      doesFilterPass() {
        if (!this.isFilterActive()) {
          return;
        }
      },
      getModel() {
        if (filter !== null && filter !== undefined) {
          return {
            filterType: "relationship",
            type: "contains",
            relationship: props.colDef.field,
            filter: filter
          };
        } else {
          return null;
        }
      },

      setModel(model: any) {
        return model;
      },

      setValue(value: string) {
        setFilter(value);
      }
    };
  });

  const onInputChanged = (value: string) => {
    if (value !== null) {
      setFilter(value);
    } else {
      setFilter(null);
    }
  };

  return (
    <div style={{ width: "100%", padding: 7 }}>
      <Select
        style={{ width: "100%" }}
        placeholder={props.placeholder}
        value={filter}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        onChange={onInputChanged}
        allowClear
        options={props.data}
      />
    </div>
  );
});

export default RoleFilter;
