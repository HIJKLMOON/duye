import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Button, Form, Input, Select, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { User } from "../../types";
import { SearchBar, StatusBadge } from "../../components/common";
import { ActionModal } from "../../components/form";
import { debounce } from "../../utils/throttle";

const UserManage: React.FC = () => {
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("新增用户");
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const fetchData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData: User[] = [
        {
          id: "1",
          username: "admin",
          nickname: "管理员",
          email: "admin@example.com",
          status: 1,
        },
        {
          id: "2",
          username: "user1",
          nickname: "用户1",
          email: "user1@example.com",
          status: 1,
        },
        {
          id: "3",
          username: "user2",
          nickname: "用户2",
          email: "user2@example.com",
          status: 0,
        },
      ];
      setDataSource(mockData);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        console.log("Searching:", value);
      }, 500),
    [],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchText(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  useEffect(() => {
    const headerContent = (
      <SearchBar
        value={searchText}
        onChange={handleSearchChange}
        placeholder="搜索用户名/昵称"
        onAdd={() => handleAdd()}
        onRefresh={() => fetchData()}
      />
    );
    (window as any).__headerExtra = headerContent;
    return () => {
      (window as any).__headerExtra = null;
    };
  }, [searchText, handleSearchChange, fetchData]);

  const handleAdd = () => {
    setModalTitle("新增用户");
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setModalTitle("编辑用户");
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setDataSource(dataSource.filter((item) => item.id !== id));
    message.success("删除成功");
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (modalTitle === "新增用户") {
        const newUser: User = { id: Date.now().toString(), ...values };
        setDataSource([...dataSource, newUser]);
        message.success("新增成功");
      } else {
        setDataSource(
          dataSource.map((item) =>
            item.id === values.id ? { ...item, ...values } : item,
          ),
        );
        message.success("编辑成功");
      }
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "昵称", dataIndex: "nickname", key: "nickname" },
    { title: "邮箱", dataIndex: "email", key: "email" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <StatusBadge status={status} trueText="正常" falseText="禁用" />
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      render: (_: unknown, record: User) => (
        <div className="flex gap-2">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredData = searchText
    ? dataSource.filter(
        (item) =>
          item.username?.includes(searchText) ||
          item.nickname?.includes(searchText),
      )
    : dataSource;

  return (
    <div className="bg-white p-4 rounded-lg">
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
      />
      <ActionModal
        open={modalVisible}
        title={modalTitle}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
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

export default UserManage;
