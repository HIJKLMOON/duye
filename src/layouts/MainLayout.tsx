import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Button, Dropdown, Spin } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  MenuOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardFilled,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/useAuth';
import { setCollapsed, setSelectedKeys, setOpenKeys, setMenuList } from '../store/slices/menuSlice';
import type { MenuItem } from '../types';

const { Sider, Header, Content } = Layout;

const iconMap: Record<string, React.FC<any>> = {
  DashboardOutlined: DashboardOutlined as any,
  UserOutlined: UserOutlined as any,
  TeamOutlined: TeamOutlined as any,
  MenuOutlined: MenuOutlined as any,
  SettingOutlined: SettingOutlined as any,
};

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, menus, token } = useAppSelector((state) => state.auth);
  const { collapsed, selectedKeys, openKeys, menuList } = useAppSelector((state) => state.menu);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (token && menus.length === 0) {
      setLoading(false);
    } else if (!token) {
      navigate('/login', { replace: true });
    }
    setLoading(false);
  }, [token, menus, navigate]);

  useEffect(() => {
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const selectedKey = pathSnippets.length > 0 ? `/${pathSnippets[0]}` : '/dashboard';
    const openKey = pathSnippets.length > 1 ? `/${pathSnippets[0]}` : '';
    dispatch(setSelectedKeys([selectedKey]));
    if (openKey) {
      dispatch(setOpenKeys([openKey]));
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (menus.length > 0) {
      dispatch(setMenuList(menus));
    }
  }, [menus, dispatch]);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleOpenChange = (keys: string[]) => {
    dispatch(setOpenKeys(keys));
  };

  const toggleCollapsed = () => {
    dispatch(setCollapsed(!collapsed));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const defaultMenus: MenuItem[] = [
    { id: '1', name: '首页', path: '/dashboard', icon: 'DashboardOutlined' },
    { id: '2', name: '用户管理', path: '/user', icon: 'UserOutlined' },
    { id: '3', name: '角色管理', path: '/role', icon: 'TeamOutlined' },
    { id: '4', name: '菜单管理', path: '/menu', icon: 'MenuOutlined' },
  ];

  const displayMenus = menuList.length > 0 ? menuList : defaultMenus;

  const renderMenuItems = (items: MenuItem[]): any[] => {
    return items.map((item) => {
      const Icon = item.icon ? iconMap[item.icon] : null;
      return {
        key: item.path,
        icon: Icon ? <Icon /> : null,
        label: item.name,
        children: item.children ? renderMenuItems(item.children) : undefined,
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className="h-screen flex flex-col overflow-hidden">
      <Header className="bg-white shadow-sm flex items-center px-4 h-14 flex-shrink-0" style={{ zIndex: 100 }}>
        <div className={`flex items-center ${collapsed ? 'w-20 -ml-4 pl-4' : 'w-60 -ml-4 pl-4'} transition-all`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <DashboardFilled className="text-white text-lg" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-none">
                  Duye
                </span>
                <span className="text-xs text-gray-400">管理平台</span>
              </div>
            )}
          </div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            className="text-lg ml-auto"
          />
        </div>
        <div className="flex items-center h-full ml-auto">
          {(window as any).__headerExtra}
        </div>
      </Header>
      <Layout className="flex-1 flex flex-row overflow-hidden">
        <Sider
          width={240}
          collapsedWidth={80}
          collapsed={collapsed}
          className="bg-white shadow-md flex flex-col overflow-hidden"
          style={{ height: 'calc(100vh - 56px)', position: 'relative' }}
        >
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onClick={handleMenuClick}
            onOpenChange={handleOpenChange}
            items={renderMenuItems(displayMenus)}
            className="border-none flex-1 overflow-auto pb-14"
          />
          <div className="border-t border-gray-200 absolute bottom-0 w-full bg-white">
            <Dropdown
              open={userMenuOpen}
              onOpenChange={setUserMenuOpen}
              dropdownRender={() => (
                <div className="bg-white rounded-lg shadow-lg py-2 min-w-[160px]">
                  <div
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      navigate('/profile');
                      setUserMenuOpen(false);
                    }}
                  >
                    <UserOutlined />
                    <span>个人中心</span>
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      navigate('/settings');
                      setUserMenuOpen(false);
                    }}
                  >
                    <SettingOutlined />
                    <span>系统设置</span>
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      navigate('/notifications');
                      setUserMenuOpen(false);
                    }}
                  >
                    <DashboardOutlined />
                    <span>用户通知</span>
                  </div>
                  <div className="border-t border-gray-200 my-1" />
                  <div
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-red-500"
                    onClick={handleLogout}
                  >
                    <LogoutOutlined />
                    <span>退出登录</span>
                  </div>
                </div>
              )}
              trigger={['click']}
              placement="top"
            >
              <div className={`h-14 flex items-center px-4 cursor-pointer hover:bg-gray-50 ${collapsed ? 'justify-center' : ''}`}>
                <Avatar src={user?.avatar} icon={!user?.avatar && <UserOutlined />} />
                {!collapsed && (
                  <div className="ml-3 flex flex-col">
                    <span className="text-sm">{user?.nickname || user?.username || '管理员'}</span>
                    <span className="text-xs text-gray-400">点击展开</span>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Sider>
        <Content className="p-6 overflow-auto flex-1 bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;