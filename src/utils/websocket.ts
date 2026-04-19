import { message } from "antd";
import type { Notification } from "../types";

type EventCallback = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string = "";
  private reconnectInterval: number = 3000;
  private reconnectTimer: number | null = null;
  private eventListeners: Map<string, EventCallback[]> = new Map();
  private isConnected: boolean = false;
  private messageQueue: any[] = [];

  connect(url: string) {
    this.url = url;
    this.doConnect();
  }

  private doConnect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.isConnected = true;
        this.clearReconnectTimer();
        this.flushMessageQueue();
        this.emitEvent("connect", {});
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.isConnected = false;
        this.emitEvent("disconnect", {});
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.emitEvent("error", { error });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.scheduleReconnect();
    }
  }

  private handleMessage(data: any) {
    const { type, payload } = data;

    switch (type) {
      case "status_change":
        message.info({
          content: `用户 ${payload.username} ${payload.status === "online" ? "上线" : "下线"}`,
          duration: 3,
        });
        this.emitEvent("status_change", payload);
        break;

      case "user_update":
        message.success({
          content: payload.message || "用户信息已更新",
          duration: 3,
        });
        this.emitEvent("user_update", payload);
        break;

      case "request":
        message.warning({
          content: payload.message || "收到新请求",
          duration: 3,
        });
        this.emitEvent("request", payload);
        break;

      case "notification":
        this.showNotificationMessage(payload);
        this.emitEvent("notification", payload);
        break;

      default:
        this.emitEvent(type, payload);
    }
  }

  private showNotificationMessage(notification: Notification) {
    const config: any = {
      content: notification.content,
      duration: notification.type === "system" ? 5 : 3,
    };

    switch (notification.type) {
      case "status":
        message.info(config);
        break;
      case "request":
        message.warning(config);
        break;
      case "system":
        message.info(config);
        break;
      default:
        message.info(config);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      return;
    }
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.doConnect();
    }, this.reconnectInterval);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const data = this.messageQueue.shift();
      this.send(data);
    }
  }

  send(data: any) {
    if (!this.isConnected || !this.ws) {
      this.messageQueue.push(data);
      return;
    }

    try {
      this.ws.send(JSON.stringify(data));
    } catch (error) {
      console.error("Failed to send WebSocket message:", error);
    }
  }

  private emitEvent(event: string, data: any) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });

    const allListeners = this.eventListeners.get("*") || [];
    allListeners.forEach((callback) => {
      try {
        callback({ event, data });
      } catch (error) {
        console.error("Error in wildcard event listener:", error);
      }
    });
  }

  on(event: string, callback: EventCallback) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(callback);
    this.eventListeners.set(event, listeners);
  }

  off(event: string, callback: EventCallback) {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
      this.eventListeners.set(event, listeners);
    }
  }

  disconnect() {
    this.clearReconnectTimer();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export const wsService = new WebSocketService();

export const connectWebSocket = (url: string) => {
  wsService.connect(url);
};

export const disconnectWebSocket = () => {
  wsService.disconnect();
};

export const sendWebSocket = (data: any) => {
  wsService.send(data);
};

export const onWebSocketEvent = (event: string, callback: EventCallback) => {
  wsService.on(event, callback);
};

export const offWebSocketEvent = (event: string, callback: EventCallback) => {
  wsService.off(event, callback);
};
