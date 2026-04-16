import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { Role } from '../types';

const RoleManage: React.FC = () => {
  const [dataSource, setDataSource] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增角色');
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData: Role[] = [
        { id: '1', name: '管理员', description: '拥有所有权限', status: 1 },
        { id: '2', name: '普通用户', description: '普通用户权限', status: 1 },
        { id: '3', name: '访客', description: '只读权限', status: 0 },
      ];
      setDataSource(mockData);
      setLoading(false);
    }, 500);
  };

  const handleAdd = () => {
    setModalTitle('新增角色');
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Role) => {
    setModalTitle('编辑角色');
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
      if (modalTitle === '新增角色') {
        const newRole: Role = {
          id: Date.now().toString(),
          ...values,
        };
        setDataSource([...dataSource, newRole]);
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
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
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
      render: (_: any, record: Role) => (
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
          item.name?.includes(searchText) || item.description?.includes(searchText)
      )
    : dataSource;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg">
        <Space className="mb-4">
          <Input
            placeholder="搜索角色名/描述"
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
          <Form.Item name="name" label="角色名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
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

export default RoleManage;