# Duye Admin API 文档

## 基础信息

- **基础URL**: `/api`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token

## 通用响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 响应码说明

| code | 说明 |
|------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录/令牌过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 认证接口

### 登录

```
POST /api/auth/login
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |
| captcha | string | 否 | 验证码 |
| captchaId | string | 否 | 验证码ID |

**响应示例:**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "admin",
      "nickname": "管理员",
      "avatar": "",
      "email": "admin@example.com",
      "onlineStatus": "online"
    },
    "menus": [],
    "permissions": []
  }
}
```

---

### 获取用户信息

```
GET /api/auth/userInfo
```

**请求头:**

| 参数 | 说明 |
|------|------|
| Authorization | Bearer {token} |

---

### 登出

```
POST /api/auth/logout
```

---

## 用户管理

### 用户列表

```
GET /api/user/list
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认10 |
| keyword | string | 否 | 搜索关键词 |

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "username": "admin",
        "nickname": "管理员",
        "email": "admin@example.com",
        "onlineStatus": "online",
        "status": 1,
        "createTime": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 新增用户

```
POST /api/user
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| nickname | string | 是 | 昵称 |
| email | string | 是 | 邮箱 |
| password | string | 否 | 密码 |
| status | number | 否 | 状态，1正常 0禁用 |
| roleIds | array | 否 | 角色ID数组 |
| onlineStatus | string | 否 | 在线状态，online/offline |

---

### 编辑用户

```
PUT /api/user
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 用户ID |
| username | string | 否 | 用户名 |
| nickname | string | 否 | 昵称 |
| email | string | 否 | 邮箱 |
| status | number | 否 | 状态 |
| onlineStatus | string | 否 | 在线状态 |
| roleIds | array | 否 | 角色ID数组 |

---

### 删除用户

```
DELETE /api/user/{id}
```

---

### 用户详情

```
GET /api/user/{id}
```

---

### 更新用户状态

```
PUT /api/user/{id}/status
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| onlineStatus | string | 是 | 在线状态，online/offline |

---

## 角色管理

### 角色列表

```
GET /api/role/list
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页条数 |
| keyword | string | 否 | 搜索关键词 |

---

### 新增角色

```
POST /api/role
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 角色名称 |
| description | string | 否 | 描述 |
| status | number | 否 | 状态 |
| permissionIds | array | 否 | 权限ID数组 |

---

### 编辑角色

```
PUT /api/role
```

---

### 删除角色

```
DELETE /api/role/{id}
```

---

### 角色详情

```
GET /api/role/{id}
```

---

## 菜单管理

### 菜单列表

```
GET /api/menu/list
```

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": "1",
      "parentId": "",
      "name": "首页",
      "path": "/dashboard",
      "icon": "DashboardOutlined",
      "orderNum": 1,
      "children": []
    }
  ]
}
```

---

### 新增菜单

```
POST /api/menu
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 菜单名称 |
| parentId | string | 否 | 父菜单ID |
| path | string | 否 | 路由路径 |
| icon | string | 否 | 图标 |
| component | string | 否 | 组件路径 |
| orderNum | number | 否 | 排序 |
| status | number | 否 | 状态 |
| hidden | boolean | 否 | 是否隐藏 |

---

### 编辑菜单

```
PUT /api/menu
```

---

### 删除菜单

```
DELETE /api/menu/{id}
```

---

## 通知管理

### 通知列表

```
GET /api/notification/list
```

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页条数 |
| type | string | 否 | 通知类型：status/message/request/system |
| read | boolean | 否 | 已读状态 |

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "type": "status",
        "title": "用户状态变更",
        "content": "用户 zhangsan 已上线",
        "read": false,
        "createTime": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 标记通知已读

```
PUT /api/notification/{id}/read
```

---

### 全部标记已读

```
PUT /api/notification/readAll
```

---

### 删除通知

```
DELETE /api/notification/{id}
```

---

## WebSocket 接口

### 连接 WebSocket

```
ws://{ws_url}
```

**连接地址:** `ws://{base_url}/ws`

**认证:** 通过 URL 参数或 WebSocket 子协议传递 Token

**示例:**
```
ws://localhost:8080/ws?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 消息格式

**客户端发送:**
```json
{
  "type": "ping"
}
```

**服务端推送:**
```json
{
  "type": "status_change",
  "payload": {
    "userId": "1",
    "username": "zhangsan",
    "status": "online"
  }
}
```

### 消息类型

| type | 说明 | payload |
|------|------|--------|
| status_change | 用户状态变更 | {userId, username, status} |
| user_update | 用户信息更新 | {userId, message} |
| request | 收到新请求 | {userId, message} |
| notification | 系统通知 | {id, type, title, content} |
| ping | 心跳 | - |
| pong | 心跳响应 | - |

---

### 前端使用示例

```typescript
import { connectWebSocket, onWebSocketEvent, sendWebSocket } from './utils/websocket';

// 连接
connectWebSocket('ws://localhost:8080/ws?token=xxx');

// 监听事件
onWebSocketEvent('status_change', (data) => {
  console.log('用户状态变更:', data);
});

onWebSocketEvent('notification', (data) => {
  console.log('收到通知:', data);
});

// 发送消息
sendWebSocket({ type: 'ping' });
```

---

## 错误码对照表

| code | message | 说明 |
|------|---------|------|
| 200 | success | 成功 |
| 400 | 请求参数错误 | 参数格式或值不正确 |
| 401 | 未登录 | 需要登录 |
| 403 | 无权限 | 权限不足 |
| 404 | 资源不存在 | 数据不存在 |
| 500 | 服务器错误 | 服务器异常 |

---

## 认证流程

1. 用户登录获取 token
2. 后续请求在请求头携带 `Authorization: Bearer {token}`
3. token 过期后返回 401，前端跳转登录页
4. WebSocket 连接通过 URL 参数传递 token

---

## 通知类型说明

| type | 说明 | 前端提示方式 |
|------|------|-----------|
| status | 用户状态变更 | info (绿色) |
| message | 新消息 | info (蓝色) |
| request | 新请求 | warning (橙色) |
| system | 系统通知 | info (紫色) |

---

## 用户在线状态

| status | 说明 |
|--------|------|
| online | 在线 |
| offline | 离线 |

用户状态变更时，系统通过 WebSocket 推送 `status_change` 消息，前端自动展示通知。