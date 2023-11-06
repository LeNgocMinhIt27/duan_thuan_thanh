import { ConfigState } from "@/interface/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: ConfigState = {
  heightAuto: false,
  kiHienGio: "2023-1"
};
const authSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setHeightAuto(state: ConfigState, action: PayloadAction<boolean>) {
      state.heightAuto = action.payload;
      return state;
    },
    setKiHocHienGio(state: ConfigState, action: PayloadAction<string>) {
      state.kiHienGio = action.payload;
      return state;
    }
  },
  extraReducers: () => {}
});
const { actions, reducer } = authSlice;
// Extract and export each action creator by name
export const { setHeightAuto, setKiHocHienGio } = actions;
// Extract and export each action creator by name
// Export the reducer, either as a default or named export
export default reducer;
