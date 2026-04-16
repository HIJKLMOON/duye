import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Spin } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  MenuOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/useAuth';
import { setCollapsed, setSelectedKeys, setOpenKeys, setMenuList } from '../store/slices/menuSlice';
import { logout } from '../store/slices/authSlice';
import type { MenuItem } from '../types';

const { Sider, Header, Content } = Layout;

const iconMap: Record<string, any> = {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  MenuOutlined,
  SettingOutlined,
};

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, menus, token } = useAppSelector((state) => state.auth);
  const { collapsed, selectedKeys, openKeys, menuList } = useAppSelector((state) => state.menu);
  const [loading, setLoading] = useState(true);

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
    dispatch(logout());
    navigate('/login');
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人中心',
        onClick: () => navigate('/profile'),
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '系统设置',
        onClick: () => navigate('/settings'),
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
  };

  const defaultMenus: MenuItem[] = [
    {
      id: '1',
      name: '首页',
      path: '/dashboard',
      icon: 'DashboardOutlined',
    },
    {
      id: '2',
      name: '用户管理',
      path: '/user',
      icon: 'UserOutlined',
    },
    {
      id: '3',
      name: '角色管理',
      path: '/role',
      icon: 'TeamOutlined',
    },
    {
      id: '4',
      name: '菜单管理',
      path: '/menu',
      icon: 'MenuOutlined',
    },
    {
      id: '5',
      name: '系统设置',
      path: '/settings',
      icon: 'SettingOutlined',
    },
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
    <Layout className="min-h-screen">
      <Sider
        width={240}
        collapsedWidth={80}
        collapsed={collapsed}
        className="bg-white shadow-md"
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          {collapsed ? (
            <span className="text-xl font-bold text-primary-600">D</span>
          ) : (
            <span className="text-xl font-bold text-primary-600">Duye Admin</span>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onClick={handleMenuClick}
          onOpenChange={handleOpenChange}
          items={renderMenuItems(displayMenus)}
          className="border-none h-[calc(100vh-64px)]"
        />
        <div className="absolute bottom-0 w-full border-t border-gray-200">
          <Dropdown
            menu={userMenu}
            placement="topLeft"
            trigger={['click']}
          >
            <div className="h-16 flex items-center px-4 cursor-pointer hover:bg-gray-50">
              <Avatar src={user?.avatar} icon={!user?.avatar && <UserOutlined />} />
              {!collapsed && (
                <span className="ml-3 text-sm">{user?.nickname || user?.username || '管理员'}</span>
              )}
            </div>
          </Dropdown>
        </div>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Header className="bg-white shadow-sm px-6 flex items-center justify-between" style={{ position: 'sticky', top: 0, zIndex: 99 }}>
          <div className="flex items-center">
            <button onClick={toggleCollapsed} className="text-xl">
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          </div>
          <Dropdown menu={userMenu}>
            <Avatar src={user?.avatar} icon={!user?.avatar && <UserOutlined />} className="cursor-pointer" />
          </Dropdown>
        </Header>
        <Content className="p-6 overflow-auto" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;