import {
  Card,
  Form,
  Input,
  Button,
  message,
  Avatar,
  Progress,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/useAuth";
import { setUser } from "../../store/slices/authSlice";
import { uploadApi } from "../../api";

const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (window as any).__headerExtra = null;
  }, []);

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
      setAvatar(user.avatar || "");
    }
  }, [user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setTimeout(() => {
        dispatch(setUser({ ...user, ...values, avatar } as any));
        message.success("保存成功");
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      message.error("只能上传 JPG、PNG、GIF、WebP 格式的图片");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      message.error("图片大小不能超过 10MB");
      return;
    }

    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const response: any = await uploadApi.upload(file, (percent) => {
        setUploadProgress(percent);
      });

      if (response.code === 200) {
        const newAvatar = response.data?.url || URL.createObjectURL(file);
        setAvatar(newAvatar);
        message.success("头像上传成功");
      } else {
        message.error(response.message || "上传失败");
      }
    } catch (error) {
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);
      message.warning("上传失败，已使用本地预览");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl">
      <Card title="个人信息">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar
              size={100}
              src={avatar}
              icon={!avatar && <UserOutlined />}
              className="cursor-pointer"
              onClick={triggerFileInput}
            />
            <div
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors"
              onClick={triggerFileInput}
              style={{ backgroundColor: "#0ea5e9" }}
            >
              {uploading ? (
                <Spin size="small" />
              ) : (
                <CameraOutlined className="text-white text-sm" />
              )}
            </div>
            {uploading && (
              <Progress
                type="circle"
                percent={uploadProgress}
                width={104}
                className="absolute top-0 left-0"
              />
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <div className="mt-2 text-sm text-gray-500">
            点击上传头像，支持 JPG、PNG、GIF、WebP，不超过 10MB
          </div>
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
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            保存修改
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
