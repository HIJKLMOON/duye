import { request } from '../index';
import type { MenuItem } from '../../types';

export const menuApi = {
  list: () => request.get<MenuItem[]>('/menu/list'),
  add: (data: Partial<MenuItem>) => request.post('/menu', data),
  update: (data: Partial<MenuItem>) => request.put('/menu', data),
  delete: (id: string) => request.delete(`/menu/${id}`),
  detail: (id: string) => request.get<MenuItem>(`/menu/${id}`),
};