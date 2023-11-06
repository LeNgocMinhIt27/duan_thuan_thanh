import { isNil } from "lodash";

function JsonToFormData(data: any) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (isNil(data[key])) {
      return;
    }
    if (data[key] instanceof File) {
      formData.append(key, data[key]);
    } else if (Array.isArray(data[key])) {
      data[key].forEach((item: any) => {
        formData.append(key + "[]", item);
      });
    } else if (typeof data[key] == "object") {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }
  });

  return formData;
}

export { JsonToFormData, JsonToFormDataV2 };
export default JsonToFormData;

function JsonToFormDataV2(object: any) {
  let form_data = new FormData();
  for (const key in object) {
    form_data = handleFormData(form_data, object[key], key, null);
  }
  return form_data;
}

function handleFormData(
  formData = new FormData(),
  value: any,
  key: string,
  keyArrayObject = null
) {
  if (checkArray(value)) {
    value.forEach((element: any, index: any) => {
      const key_in = `${key}[${index}]`;
      formData = hasKeyArrayObject(formData, element, key_in, keyArrayObject);
    });
    if (value.length == 0) {
      formData.append(key, [] as any);
    }
  } else if (checkObject(value)) {
    Object.keys(value).forEach((e_key) => {
      formData = hasKeyArrayObject(
        formData,
        value[e_key],
        `${key}[${e_key}]`,
        keyArrayObject
      );
    });
  } else if (checkNotEmpty(value)) {
    formData.append(key, value);
  }
  return formData;
}

function checkNotEmpty(value: any) {
  return value || value == 0;
}
function checkObject(value: any) {
  return (
    typeof value === "object" && value !== null && !(value instanceof File)
  );
}
function checkArray(value: any) {
  return Array.isArray(value);
}
function hasKeyArrayObject(
  formData: any,
  value: any,
  key: any,
  keyArrayObject: any
) {
  if (keyArrayObject) {
    formData = handleFormData(
      formData,
      value[keyArrayObject],
      key,
      keyArrayObject
    );
  }
  formData = handleFormData(formData, value, key, keyArrayObject);
  return formData;
}
