import { Avatar } from "antd";
import { getAuthUser } from "@/stores/features/auth";
import { useState } from "react";
import ProfileDrawer from "@/Layout/MainLayout/profile";
import { useAppSelector } from "@/stores/hook";
// import { features } from "process";

const UserAction = () => {
  const authUser = useAppSelector(getAuthUser);
  const [openDawer, setOpenDawer] = useState(false);
  const userName = authUser?.username.split("")[0];
  return (
    <div>
      {authUser && (
        <div className="flex items-center">
          <Avatar
            onClick={() => {
              setOpenDawer(true);
            }}
            style={{
              verticalAlign: "middle",
              color: "#000",
              cursor: "pointer"
            }}
            className="flex items-center justify-center bg-blue-400"
            size={"large"}
            src={authUser?.avatar_url ? authUser.avatar_url : undefined}
          >
            {authUser?.avatar_url ? (
              <></>
            ) : (
              <span className="text-[24px] h-full w-full text-white uppercase">
                {userName}
              </span>
            )}
          </Avatar>
          <ProfileDrawer
            openState={openDawer}
            closefunct={() => {
              setOpenDawer(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UserAction;
