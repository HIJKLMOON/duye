import { useState, useEffect } from 'react';
import { Table, Button, Space, Form, Input, Select, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Role } from '../../types';
import { SearchBar, StatusBadge } from '../../components/common';
import { ActionModal } from '../../components/form';

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

  useEffect(() => {
    const headerContent = (
      <SearchBar
        value={searchText}
        onChange={setSearchText}
        placeholder="搜索角色名/描述"
        onAdd={() => handleAdd()}
        onRefresh={() => fetchData()}
      />
    );
    (window as any).__headerExtra = headerContent;
    return () => {
      (window as any).__headerExtra = null;
    };
  }, [searchText]);

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
        const newRole: Role = { id: Date.now().toString(), ...values };
        setDataSource([...dataSource, newRole]);
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
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => <StatusBadge status={status} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: unknown, record: Role) => (
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
    ? dataSource.filter((item) => item.name?.includes(searchText) || item.description?.includes(searchText))
    : dataSource;

  const headerContent = (
    <SearchBar
      value={searchText}
      onChange={setSearchText}
      placeholder="搜索角色名/描述"
      onAdd={handleAdd}
      onRefresh={fetchData}
    />
  );
  (window as any).__headerExtra = headerContent;

  return (
    <div className="bg-white p-4 rounded-lg">
      <Table columns={columns} dataSource={filteredData} loading={loading} rowKey="id" />
      <ActionModal open={modalVisible} title={modalTitle} onCancel={() => setModalVisible(false)} onOk={handleSubmit}>
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
      </ActionModal>
    </div>
  );
};

export default RoleManage;