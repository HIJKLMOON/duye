import { request } from "../index";
import type { Role, PageResult } from "../../types";

export const roleApi = {
  list: (params?: { page?: number; pageSize?: number; keyword?: string }) =>
    request.get<PageResult<Role>>("/role/list", { params }),
  add: (data: Partial<Role>) => request.post("/role", data),
  update: (data: Partial<Role>) => request.put("/role", data),
  delete: (id: string) => request.delete(`/role/${id}`),
  detail: (id: string) => request.get<Role>(`/role/${id}`),
};
