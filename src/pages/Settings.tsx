import { Card, Form, Input, Switch, Button, message } from 'antd';
import { useState } from 'react';

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      setTimeout(() => {
        message.success('保存成功');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl">
      <Card title="系统设置">
        <Form form={form} layout="vertical">
          <Form.Item name="siteName" label="网站名称" initialValue="Duye Admin">
            <Input />
          </Form.Item>
          <Form.Item name="siteDesc" label="网站描述" initialValue="企业内部管理平台">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="maintain" label="维护模式" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
          <Form.Item name="allowRegister" label="允许注册" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            保存设置
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;