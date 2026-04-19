import { request } from "../index";
import type { User, PageResult } from "../../types";

export const userApi = {
  list: (params?: { page?: number; pageSize?: number; keyword?: string }) =>
    request.get<PageResult<User>>("/user/list", { params }),
  add: (data: Partial<User>) => request.post("/user", data),
  update: (data: Partial<User>) => request.put("/user", data),
  delete: (id: string) => request.delete(`/user/${id}`),
  detail: (id: string) => request.get<User>(`/user/${id}`),
  updateStatus: (id: string, onlineStatus: "online" | "offline") =>
    request.put(`/user/${id}/status`, { onlineStatus }),
};
