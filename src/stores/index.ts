import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/auth/store.ts";
import configReducer from "./features/config/store.ts";

const rootReducer = combineReducers({
  auth: authReducer,
  config: configReducer
});
const store = configureStore({
  reducer: rootReducer
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
