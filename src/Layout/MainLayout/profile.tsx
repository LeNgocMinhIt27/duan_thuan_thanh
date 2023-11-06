import { Form, Button, Input, notification, Drawer, Tabs } from "antd";
import { apiUpdatePassword } from "@/api/auth";
import { useSelector } from "react-redux";
import {
  getAuthUser,
  getInfoAction,
  getInitData,
  logoutAction
} from "@/stores/features/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// import ColorButton from "@/components/Button";
// import { Lop } from "@/interface/lop";
// import { User } from "@/interface/user";
// import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { User } from "@/interface/user";
import { sdk } from "@/api/axios";
// import { apiEditProfile } from "@/api/profile.api";
import { JsonToFormData } from "@/utils/JsonToFormData";
import userApi from "@/api/admin/user.api";
import { useAppDispatch } from "@/stores/hook";
import { dealsWith } from "@/api/axios/error-handle";
import {
  LaravelValidationResponse,
  Laravel400ErrorResponse
} from "@/interface/axios/laravel";
import { AxiosError } from "axios";
import { t } from "i18next";

interface ProfileDrawerProps {
  openState: boolean;
  closefunct: () => void;
}

export default function ProfileDrawer({
  openState,
  closefunct
}: ProfileDrawerProps) {
  const [api, contextholder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authUser = useSelector(getAuthUser);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [errorMessage, setErrorMessage] = useState<
    LaravelValidationResponse | undefined
  >();
  const handleError = useCallback((err: any) => {
    return dealsWith({
      "422": (e: any) => {
        const error = e as AxiosError<LaravelValidationResponse>;
        if (error.response) setErrorMessage(error.response.data);
      },
      "400": (e: any) => {
        const error = e as AxiosError<Laravel400ErrorResponse>;
        if (error.response) {
          api.error({
            message: t("message.error_add"),
            description: error.response.data.message
          });
        }
      }
    })(err);
  }, []);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (activeTab && authUser) {
      form.setFieldsValue(authUser.info);
    }
  }, [activeTab, authUser, form]);

  useEffect(() => {
    if (activeTab && authUser) {
      form.setFieldsValue(authUser);
    }
  }, [activeTab, authUser, form]);

  //Key Tabs
  const handleTabClick = (key: any) => {
    setActiveTab(key);
  };
  //End Key Tabs

  //Call Api Change PassWord
  const passwordFormOnFinish = async (value: any) => {
    setLoading(true);
    try {
      await apiUpdatePassword(value);
      api.success({
        message: "Thành Công",
        description: "Thay đổi mật khẩu thành công"
      });

      closefunct();
    } catch (err: any) {
      const is_handle = handleError(err);
      if (is_handle) {
        api.error({
          message: "Thất bại",
          description:
            err.response.data?.errors?.password[0] ||
            "Thay đổi mật khẩu thất bại"
        });
      }
    } finally {
      setLoading(false);
    }
  };
  //End Call Api Change PassWord

  const validateForm = (option: any) => {
    if (errorMessage && errorMessage.errors?.[option]?.length) {
      return "error";
    }
  };

  //LogOut
  const logoutHanlder = async () => {
    await dispatch(logoutAction());
    closefunct();
    navigate("/");
  };

  // End LogOut

  //Call api EditProfile User
  const editProfile = async (value: any) => {
    value = { ...value, avatar: avatar };
    const data = JsonToFormData(value);
    setLoading(true);
    try {
      await sdk.post(`edit/profile`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      api.success({
        message: "Thành công",
        description: "Cập nhật thông tin thành công"
      });
      dispatch(getInitData());
    } catch (error) {
      api.error({
        message: "Thất bại",
        description: "Cập nhật thông tin thất bại "
      });
    } finally {
      setLoading(false);
    }
  };
  //End Call Api EditProfile User

  //Call api EditProfile Admin
  const editProfileAdmin = async (value: any) => {
    value = { ...value, avatar: avatar };
    const data = JsonToFormData(value);
    setLoading(true);
    try {
      await userApi.editAdmin(data);
      api.success({
        message: "Thành công",
        description: "Cập nhật thông tin thành công"
      });
      dispatch(getInfoAction());
    } catch (error) {
      api.error({
        message: "Thất bại",
        description: "Cập nhật thông tin thất bại "
      });
    } finally {
      setLoading(false);
    }
  };

  //End Call Api EditProfile Admin
  //Change Button
  const buttonChange = () => {
    return (
      <>
        {activeTab === "2" ? (
          <Button
            title="submit"
            loading={loading}
            type="default"
            htmlType="submit"
            className="w-full"
            //
          >
            Đổi mật khẩu
          </Button>
        ) : (
          <Button
            title="submit"
            loading={loading}
            type="default"
            htmlType="submit"
            block
            className="w-full"
          >
            Thay đổi
          </Button>
        )}
      </>
    );
  };
  const formEdit = useMemo(() => {
    // element Image
    const element = (authUser: User) => {
      return (
        <Form.Item
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Input
            onChange={setImageUpload}
            name={`${authUser.avatar_url}`}
            accept="/public/images/avatar/*"
            type="file"
            style={{
              position: "absolute",
              opacity: "0",
              height: "150px",
              width: "150px"
            }}
            id="avatar_url"
          />

          {thumbnail || authUser.avatar_url ? (
            <div
              style={{
                height: "150px",
                width: "150px",
                border: "2px solid #b1b1b1",
                borderRadius: "50%"
              }}
            >
              <img
                src={`${thumbnail || authUser.avatar_url}`}
                style={{ height: "150px", width: "150px", borderRadius: "50%" }}
                alt="avatar"
              />
            </div>
          ) : thumbnail || authUser.avatar_url == null ? (
            <>
              <div
                style={{
                  height: "150px",
                  width: "150px",
                  border: "2px dashed #b1b1b1",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center"
                }}
              ></div>
            </>
          ) : (
            <div
              style={{
                height: "150px",
                width: "150px",
                border: "2px dashed #b1b1b1",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center"
              }}
            >
              <div style={{ margin: "auto" }}>
                <p style={{ fontSize: "40px", color: "#b1b1b1" }}>+</p>
              </div>
            </div>
          )}
        </Form.Item>
      );
    };
    //End element Image
    // Upload Image
    const setImageUpload = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        setAvatar(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          setThumbnail(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    // End Upload Image
    let formEdit = <></>;
    if (authUser) {
      formEdit = (
        <Form
          encType="multipart/form-data"
          form={form}
          onFinish={editProfileAdmin}
          layout="vertical"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%"
          }}
        >
          <div>
            {element(authUser)}
            <Form.Item
              label="Tên tài khoản"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng điền tên "
                }
              ]}
            >
              <Input type="text" />
            </Form.Item>
          </div>
          <div> {buttonChange()}</div>
        </Form>
      );
      if (authUser.is_sinh_vien) {
        formEdit = (
          <Form
            encType="multipart/form-data"
            form={form}
            onFinish={editProfile}
            layout="vertical"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%"
            }}
          >
            <div>
              {element(authUser)}
              <Form.Item
                label="Tên sinh viên  "
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền tên "
                  }
                ]}
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item
                label="Tên lớp"
                name="group"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền tên lớp "
                  }
                ]}
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item label="Mã số sinh viên " name={"mssv"}>
                <Input type="text" disabled />
              </Form.Item>
              <Form.Item label="Địa chỉ Email" name={"email"}>
                <Input type="text" disabled />
              </Form.Item>
            </div>
            {buttonChange()}
          </Form>
        );
      } else if (authUser.is_giao_vien) {
        formEdit = (
          <Form
            encType="multipart/form-data"
            form={form}
            onFinish={editProfile}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%"
            }}
            layout="vertical"
          >
            <div>
              {element(authUser)}
              <Form.Item
                label="Tên"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền tên"
                  }
                ]}
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item
                label="Địa chỉ Email "
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền địa chỉ Email"
                  }
                ]}
              >
                <Input type="text" />
              </Form.Item>
            </div>

            {buttonChange()}
          </Form>
        );
      }
    }
    return formEdit;
  }, [authUser, thumbnail, avatar]);
  //End Change Button

  const tabs = [
    {
      key: "1",
      style: { height: "100%" },
      label: "Cập nhật thông tin",
      children: formEdit
    },
    {
      key: "2",
      label: "Đổi Mật khẩu",
      style: { height: "100%" },
      children: (
        <Form
          onFinish={passwordFormOnFinish}
          layout="vertical"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%"
          }}
        >
          <div>
            <Form.Item
              label="Mật khẩu Cũ"
              name="old_password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng mật khẩu"
                }
              ]}
              validateStatus={validateForm("old_password")}
              help={
                errorMessage?.errors?.["old_password"]
                  ? errorMessage?.errors?.["old_password"][0]
                  : undefined
              }
            >
              <Input.Password type="password" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mới"
              name={"password"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu"
                }
              ]}
              validateStatus={validateForm("password")}
              help={
                errorMessage?.errors?.["password"]
                  ? errorMessage?.errors?.["password"][0]
                  : undefined
              }
            >
              <Input.Password type="password" />
            </Form.Item>
            <Form.Item
              label="Xác nhận lại mật khẩu mới"
              name="password_confirmation"
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận lại mật khẩu"
                },
                ({ getFieldValue }: any) => ({
                  validator(_: any, value: any) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu nhập vào không khớp")
                    );
                  }
                })
              ]}
              validateStatus={validateForm("password")}
              help={
                errorMessage?.errors?.["password"]
                  ? errorMessage?.errors?.["password"][0]
                  : undefined
              }
            >
              <Input.Password type="password" />
            </Form.Item>
          </div>
          {buttonChange()}
        </Form>
      )
    }
  ];

  return (
    <>
      {contextholder}
      <Drawer
        forceRender
        open={openState}
        destroyOnClose={true}
        onClose={closefunct}
        // styles={{
        //   body: { padding: "24px 24px 8px 24px" },
        //   footer: { padding: "0px 24px 8px" }
        // }}
        footer={
          <>
            <Button danger onClick={logoutHanlder} block type="primary">
              Đăng xuất
            </Button>
          </>
        }
      >
        <Tabs
          activeKey={activeTab}
          onTabClick={handleTabClick}
          style={{ height: "100%" }}
          items={tabs}
        ></Tabs>
        {/* Cập  nhập thông tin cá nhân  */}
      </Drawer>
    </>
  );
}
