import { request } from "../index";
import type { Notification, PageResult } from "../../types";

export const notificationApi = {
  list: (params?: {
    page?: number;
    pageSize?: number;
    type?: "status" | "message" | "request" | "system";
    read?: boolean;
  }) => request.get<PageResult<Notification>>("/notification/list", { params }),
  read: (id: string) => request.put(`/notification/${id}/read`),
  readAll: () => request.put("/notification/readAll"),
  delete: (id: string) => request.delete(`/notification/${id}`),
};
