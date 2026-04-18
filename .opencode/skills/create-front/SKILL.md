---
name: create-front
description: 实现一个前端项目时调用该 SKILL
license: MIT
compatibility: opencode
---

## What I do
- 根据需求设计并实现一个完整的 Web 应用
- 提供完整的技术架构和最佳实践

## Execution

### 1. 准备
- [ ] 网站使用技术栈：React、React-Router、Redux、Tailwind CSS、TypeScript、Ant Design、Vite
- [ ] 分析项目需求，设计网站架构和功能模块

### 2. 核心处理
- [ ] 项目结构：
  - [ ] 使用 Vite + TypeScript 创建项目
  - [ ] 使用 pnpm 作为包管理工具
  - [ ] 目录结构：src/{api,components,hooks,layouts,pages,router,store,types,utils}
- [ ] 布局设计：
  - [ ] 主布局采用左侧导航 + 顶部Header + 内容区模式
  - [ ] 导航区：左侧Sider，包含logo、菜单导航、个人中心入口
  - [ ] 内容区：独立滚动，响应式宽度
  - [ ] 支持侧边栏折叠展开
- [ ] 认证系统：
  - [ ] 登录页面：用户名/密码登录
  - [ ] Token管理：localStorage存储
  - [ ] 路由守卫：未登录跳转登录页
  - [ ] 401处理：弹窗提示重新登录
  - [ ] 动态菜单：根据用户权限渲染
- [ ] API层：
  - [ ] Axios封装：基础配置、请求/响应拦截
  - [ ] Token注入：自动添加Authorization头
  - [ ] 错误处理：统一message提示
  - [ ] 模块化API：按业务模块划分
- [ ] 组件封装：
  - [ ] SearchBar：搜索框 + 新增/刷新按钮
  - [ ] ActionModal：通用弹窗
  - [ ] StatusBadge：状态标签
  - [ ] 列表页模板：搜索 + 表格 + 分页
  - [ ] 表单页模板：表单 + 验证 + 提交
- [ ] 数据可视化：
  - [ ] 使用ECharts
  - [ ] 折线图：趋势展示
  - [ ] 饼图：占比展示
  - [ ] 统计卡片：关键指标展示
- [ ] 状态管理：
  - [ ] Redux Toolkit
  - [ ] authSlice：用户信息、Token、菜单、权限
  - [ ] menuSlice：菜单状态管理

### 3. 验证与输出
- [ ] 安装依赖：pnpm install
- [ ] 启动开发：pnpm dev
- [ ] 构建打包：pnpm build

## Rules

### Must do
- 必须使用规定的技术栈
- 必须遵循项目目录结构规范
- 必须实现认证和权限控制
- 必须封装通用组件提高复用性
- 必须处理网络请求错误

### Tips
- 使用Ant Design组件库提高开发效率
- 使用Tailwind CSS实现响应式布局
- 组件使用lazy加载优化首屏
- API接口统一使用Async/Await
