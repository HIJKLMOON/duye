import { request } from "../index";
import type { LoginForm, LoginResponse, MenuItem } from "../../types";

export const authApi = {
  login: (data: LoginForm) => request.post<LoginResponse>("/auth/login", data),
  logout: () => request.post("/auth/logout"),
  getUserInfo: () =>
    request.get<{ user: any; menus: MenuItem[]; permissions: string[] }>(
      "/auth/userInfo",
    ),
  updateStatus: (onlineStatus: "online" | "offline") =>
    request.put("/auth/status", { onlineStatus }),
};
