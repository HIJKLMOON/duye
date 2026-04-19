import { useState, useEffect, useMemo } from "react";
import { Card, List, Badge, Button, Tabs } from "antd";
import {
  BellOutlined,
  UserOutlined,
  MessageOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { Notification } from "../../types";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    (window as any).__headerExtra = null;
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    const mockData: Notification[] = [
      {
        id: "1",
        type: "status",
        title: "用户状态变更",
        content: "用户 zhangsan 已上线",
        read: false,
        createTime: new Date().toISOString(),
      },
      {
        id: "2",
        type: "message",
        title: "新消息",
        content: "您有一条新消息来自管理员",
        read: false,
        createTime: new Date().toISOString(),
      },
      {
        id: "3",
        type: "request",
        title: "新请求",
        content: "用户 lisi 申请加入项目",
        read: true,
        createTime: new Date().toISOString(),
      },
      {
        id: "4",
        type: "system",
        title: "系统通知",
        content: "系统将在今晚22:00进行维护",
        read: false,
        createTime: new Date().toISOString(),
      },
    ];
    setNotifications(mockData);
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") {
      return notifications;
    }
    if (activeTab === "unread") {
      return notifications.filter((n) => !n.read);
    }
    return notifications.filter((n) => n.type === activeTab);
  }, [notifications, activeTab]);

  const handleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleReadAll = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "status":
        return <UserOutlined style={{ color: "#52c41a" }} />;
      case "message":
        return <MessageOutlined style={{ color: "#1890ff" }} />;
      case "request":
        return <CheckCircleOutlined style={{ color: "#faad14" }} />;
      default:
        return <BellOutlined style={{ color: "#722ed1" }} />;
    }
  };

  const tabItems = [
    {
      key: "all",
      label: (
        <Badge count={notifications.length} offset={[10, 0]}>
          全部
        </Badge>
      ),
    },
    {
      key: "unread",
      label: (
        <Badge count={unreadCount} offset={[10, 0]}>
          未读
        </Badge>
      ),
    },
    {
      key: "status",
      label: "状态",
    },
    {
      key: "message",
      label: "消息",
    },
    {
      key: "request",
      label: "请求",
    },
    {
      key: "system",
      label: "系统",
    },
  ];

  return (
    <div className="space-y-4">
      <Card
        title={
          <div className="flex items-center gap-2">
            <BellOutlined />
            <span>通知中心</span>
            {unreadCount > 0 && (
              <Badge count={unreadCount} style={{ marginLeft: 8 }} />
            )}
          </div>
        }
        extra={
          <Button
            type="link"
            onClick={handleReadAll}
            disabled={unreadCount === 0}
          >
            全部已读
          </Button>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
        <List
          dataSource={filteredNotifications}
          locale={{ emptyText: "暂无通知" }}
          renderItem={(item) => (
            <List.Item
              className={`cursor-pointer hover:bg-gray-50 ${!item.read ? "bg-blue-50" : ""}`}
              onClick={() => handleRead(item.id)}
            >
              <List.Item.Meta
                avatar={getIcon(item.type)}
                title={item.title}
                description={
                  <div>
                    <div>{item.content}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {item.createTime}
                    </div>
                  </div>
                }
              />
              {!item.read && <Badge dot color="blue" />}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Notifications;
