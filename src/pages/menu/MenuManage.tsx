import { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { MenuItem } from '../../types';
import { ActionModal } from '../../components/form';

const MenuManage: React.FC = () => {
  const [dataSource, setDataSource] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增菜单');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const headerContent = (
      <div className="flex items-center gap-3">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
          新增
        </Button>
        <Button icon={<ReloadOutlined />} onClick={() => fetchData()}>
          刷新
        </Button>
      </div>
    );
    (window as any).__headerExtra = headerContent;
    return () => {
      (window as any).__headerExtra = null;
    };
  }, []);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData: MenuItem[] = [
        { id: '1', name: '首页', path: '/dashboard', icon: 'DashboardOutlined', orderNum: 1 },
        { id: '2', name: '用户管理', path: '/user', icon: 'UserOutlined', orderNum: 2 },
        { id: '3', name: '角色管理', path: '/role', icon: 'TeamOutlined', orderNum: 3 },
        { id: '4', name: '菜单管理', path: '/menu', icon: 'MenuOutlined', orderNum: 4 },
        { id: '5', name: '系统设置', path: '/settings', icon: 'SettingOutlined', orderNum: 5 },
      ];
      setDataSource(mockData);
      setLoading(false);
    }, 500);
  };

  const handleAdd = () => {
    setModalTitle('新增菜单');
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: MenuItem) => {
    setModalTitle('编辑菜单');
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setDataSource(dataSource.filter((item) => item.id !== id));
    message.success('删除成功');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (modalTitle === '新增菜单') {
        const newMenu: MenuItem = { id: Date.now().toString(), ...values };
        setDataSource([...dataSource, newMenu]);
        message.success('新增成功');
      } else {
        setDataSource(dataSource.map((item) => (item.id === values.id ? { ...item, ...values } : item)));
        message.success('编辑成功');
      }
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { title: '菜单名称', dataIndex: 'name', key: 'name' },
    { title: '路径', dataIndex: 'path', key: 'path' },
    { title: '图标', dataIndex: 'icon', key: 'icon' },
    { title: '排序', dataIndex: 'orderNum', key: 'orderNum' },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: MenuItem) => (
        <div className="flex gap-2">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg">
      <Table columns={columns} dataSource={dataSource} loading={loading} rowKey="id" />
      <ActionModal open={modalVisible} title={modalTitle} onCancel={() => setModalVisible(false)} onOk={handleSubmit}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="菜单名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="path" label="路径" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input placeholder="图标名称如: DashboardOutlined" />
          </Form.Item>
          <Form.Item name="orderNum" label="排序">
            <Input type="number" />
          </Form.Item>
        </Form>
      </ActionModal>
    </div>
  );
};

export default MenuManage;