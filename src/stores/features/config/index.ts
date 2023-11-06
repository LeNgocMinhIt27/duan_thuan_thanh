import { RootState } from "@/stores";

export { setHeightAuto, setKiHocHienGio } from "./store";

export const getKiHienGio = (state: RootState) => state.config.kiHienGio;
