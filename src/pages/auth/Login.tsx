import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../hooks/useAuth";
import { loginSuccess } from "../../store/slices/authSlice";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockUser = {
          id: "1",
          username: values.username,
          nickname: "管理员",
        };
        const mockMenus = [
          {
            id: "1",
            name: "首页",
            path: "/dashboard",
            icon: "DashboardOutlined",
          },
          { id: "2", name: "用户管理", path: "/user", icon: "UserOutlined" },
          { id: "3", name: "角色管理", path: "/role", icon: "TeamOutlined" },
          { id: "4", name: "菜单管理", path: "/menu", icon: "MenuOutlined" },
          {
            id: "5",
            name: "系统设置",
            path: "/settings",
            icon: "SettingOutlined",
          },
        ];
        const mockPermissions = [
          "user:list",
          "user:add",
          "user:edit",
          "user:delete",
        ];

        dispatch(
          loginSuccess({
            token: "mock-token-" + Date.now(),
            user: mockUser,
            menus: mockMenus,
            permissions: mockPermissions,
          }),
        );
        message.success("登录成功");
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      message.error("登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-96 shadow-xl" bordered={false}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Duye Admin</h1>
          <p className="text-gray-500 mt-2">企业内部管理平台</p>
        </div>
        <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名: admin" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码: admin123"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
