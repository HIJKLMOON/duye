export interface User {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  roleIds?: string[];
  status?: number;
  onlineStatus?: "online" | "offline";
  createTime?: string;
  updateTime?: string;
}

export interface Notification {
  id: string;
  userId?: string;
  type: "status" | "message" | "request" | "system";
  title: string;
  content: string;
  read?: boolean;
  createTime?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  status?: number;
  createTime?: string;
  updateTime?: string;
}

export interface MenuItem {
  id: string;
  parentId?: string;
  name: string;
  path: string;
  icon?: string;
  component?: string;
  redirect?: string;
  children?: MenuItem[];
  permission?: string;
  status?: number;
  hidden?: boolean;
  keepAlive?: boolean;
  orderNum?: number;
}

export interface LoginForm {
  username: string;
  password: string;
  captcha?: string;
  captchaId?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  menus: MenuItem[];
  permissions: string[];
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TableColumn {
  title: string;
  dataIndex: string;
  key?: string;
  width?: number;
  align?: "left" | "center" | "right";
  fixed?: "left" | "right";
  render?: (value: any, record: any, index: number) => React.ReactNode;
  ellipsis?: boolean;
}

export interface FormItem {
  name: string;
  label: string;
  type:
    | "input"
    | "select"
    | "date"
    | "datetime"
    | "textarea"
    | "password"
    | "number"
    | "switch"
    | "radio"
    | "checkbox"
    | "upload";
  rules?: any[];
  placeholder?: string;
  options?: { label: string; value: any }[];
  disabled?: boolean;
  showSearch?: boolean;
  mode?: "multiple" | "tags";
}
