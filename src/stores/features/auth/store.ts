import { AuthState } from "@/interface/store/auth";
import { createSlice } from "@reduxjs/toolkit";
import {
  getInfoReduces,
  loginReduces,
  logoutReduces,
  logoutState
} from "./action";
const initialState: AuthState = {
  logged: localStorage.getItem("t") ? true : false,
  currentUser: undefined,
  loading: false,
  loadingInfo: false,
  errorMessage: ""
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: logoutState
  },
  extraReducers: (builder) => {
    loginReduces(builder);
    logoutReduces(builder);
    getInfoReduces(builder);
  }
});
const { actions, reducer } = authSlice;
// Extract and export each action creator by name
const { logout } = actions;
// Export the reducer, either as a default or named export
export default reducer;
export { logout };
