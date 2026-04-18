import { Card, Form, Input, Button, message, Avatar } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useAppSelector } from '../../hooks/useAuth';

const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();

  useEffect(() => {
    (window as any).__headerExtra = null;
  }, []);

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      message.success('保存成功');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl">
      <Card title="个人信息">
        <div className="flex flex-col items-center mb-6">
          <Avatar size={80} src={user?.avatar} icon={<UserOutlined />} />
        </div>
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名">
            <Input prefix={<UserOutlined />} disabled />
          </Form.Item>
          <Form.Item name="nickname" label="昵称">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            保存修改
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;