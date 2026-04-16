import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { User } from '../types';

const UserManage: React.FC = () => {
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增用户');
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData: User[] = [
        { id: '1', username: 'admin', nickname: '管理员', email: 'admin@example.com', status: 1 },
        { id: '2', username: 'user1', nickname: '用户1', email: 'user1@example.com', status: 1 },
        { id: '3', username: 'user2', nickname: '用户2', email: 'user2@example.com', status: 0 },
      ];
      setDataSource(mockData);
      setLoading(false);
    }, 500);
  };

  const handleAdd = () => {
    setModalTitle('新增用户');
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setModalTitle('编辑用户');
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
      if (modalTitle === '新增用户') {
        const newUser: User = {
          id: Date.now().toString(),
          ...values,
        };
        setDataSource([...dataSource, newUser]);
        message.success('新增成功');
      } else {
        setDataSource(
          dataSource.map((item) => (item.id === values.id ? { ...item, ...values } : item))
        );
        message.success('编辑成功');
      }
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (status === 1 ? '正常' : '禁用'),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: User) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = searchText
    ? dataSource.filter(
        (item) =>
          item.username?.includes(searchText) || item.nickname?.includes(searchText)
      )
    : dataSource;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg">
        <Space className="mb-4">
          <Input
            placeholder="搜索用户���/昵称"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>
          <Button icon={<SearchOutlined />} onClick={fetchData}>
            刷新
          </Button>
        </Space>
        <Table columns={columns} dataSource={filteredData} loading={loading} rowKey="id" />
      </div>
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Select.Option value={1}>正常</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManage;