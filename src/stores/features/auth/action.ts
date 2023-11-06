import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetMe,
  apiLogin,
  apiLogout,
  apiLoginMicrosoft
} from "@/api/auth/auth.api";
import { getToken, setToken } from "@/api/auth/helper";

import { AuthState } from "@/interface/store/auth";
import { LoginParams } from "@/interface/user/login";
import { setDataToken } from "@/api/auth";
import { convertErrorAxios } from "@/api/axios/error";
import { Laravel400ErrorResponse } from "@/interface/axios/laravel";
import { createAuthUser } from "@/interface/user/auth";

export const loginAction = createAsyncThunk(
  "auth/login",
  async (data: LoginParams, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiLogin(data);
      setDataToken(response);
      dispatch(getInfoAction());
      return response;
    } catch (err: any) {
      const res = convertErrorAxios<Laravel400ErrorResponse>(err);
      if (res.type === "axios-error") {
        //type is available here
        const { response } = res.error;
        if (response) return rejectWithValue(response.data);
      }
      return rejectWithValue(err);
    }
  }
);
export const loginMicrosoftAction = createAsyncThunk(
  "auth/loginMicrosoft",
  async (code: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiLoginMicrosoft(code);
      setDataToken(response);
      dispatch(getInfoAction());
      return response;
    } catch (err: any) {
      const res = convertErrorAxios<Laravel400ErrorResponse>(err);
      if (res.type === "axios-error") {
        //type is available here
        const { response } = res.error;
        if (response) return rejectWithValue(response.data);
      }
      return rejectWithValue(err);
    }
  }
);
export const logoutAction = createAsyncThunk("auth/logout", async () => {
  const response = await apiLogout();
  return response;
});
export const getInfoAction = createAsyncThunk("auth/me", async () => {
  const response = await apiGetMe();
  return response;
});
export const getInitData = createAsyncThunk(
  "auth/init",
  async (_, { dispatch }) => {
    if (getToken()) dispatch(getInfoAction());
  }
);

export const loginReduces = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(loginAction.pending, (state) => {
      state.loading = true;
      state.errorMessage = "";
    })
    .addCase(loginAction.fulfilled, (state) => {
      state.loading = false;
      state.logged = true;
    })
    .addCase(loginAction.rejected, (state, action: any) => {
      state.loading = false;
      state.logged = false;
      if (action.error) state.errorMessage = action.payload.message;
    })
    .addCase(loginMicrosoftAction.pending, (state) => {
      state.loading = true;
      state.errorMessage = "";
    })
    .addCase(loginMicrosoftAction.fulfilled, (state) => {
      state.loading = false;
      state.logged = true;
    })
    .addCase(loginMicrosoftAction.rejected, (state, action: any) => {
      state.loading = false;
      state.logged = false;
      if (action.error) state.errorMessage = action.payload.message;
    });
};
export const getInfoReduces = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(getInfoAction.pending, (state) => {
      state.loadingInfo = true;
    })
    .addCase(getInfoAction.fulfilled, (state, action) => {
      state.loadingInfo = false;
      state.currentUser = createAuthUser(action.payload.user);
    })
    .addCase(getInfoAction.rejected, (state) => {
      state.loadingInfo = false;
      state.logged = false;
      state.currentUser = undefined;
      setToken("");
    });
};
export const logoutReduces = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(logoutAction.rejected, (state) => {
      logoutState(state);
    })
    .addCase(logoutAction.fulfilled, (state) => {
      logoutState(state);
    });
};

export function logoutState(state: AuthState) {
  state.currentUser = undefined;
  state.errorMessage = "";
  state.logged = false;
  state.loading = false;
  setToken("");
}
