import { Dayjs } from "dayjs";

export interface User {
  id: string | number;
  avatar_url?: string;
  username: string;
  inactive: boolean;
  info?: any;
  is_sinh_vien: boolean;
  is_giao_vien: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface SinhVien {
  id: string | number;
  user?: {
    info?: {
      id?: number;
    };
  };

  name?: string;
  email: string;
  mssv: string;
  birthday?: string | Dayjs;
  group?: string;
  created_at: string;
  updated_at: string;
  nhom?: any;
  diem_y_thuc?: number | string;
  stt?: number;
  diem?: number;

  pivot?: {
    diem?: number;
    stt?: number;
    diem_y_thuc?: number;
    nhom?: string;
  };
}
export enum ROLE {
  student = "student",
  admin = "admin",
  teacher = "teacher",
  assistant = "assistant"
}

export interface UserTeacherInfo {
  name: string;
  email: string;
}
export interface UserStudentInfo {
  name: string;
  email: string;
  mssv: string;
  group: string;
}

export interface EmailForgotPassword {
  username: string | number;
}

export interface ResetPassword {
  token: any;
  password: string;
  "confirm-password": string;
}
