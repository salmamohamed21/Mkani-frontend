import React, { createContext, useContext, useEffect, useState } from "react";
import { NotificationsAPI } from "../api/notifications";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchNotifications();
      connectWebSocket();
    }
    // Cleanup
    return () => {
      if (socket) socket.close();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await NotificationsAPI.getAll();
      const notificationsData = Array.isArray(data) ? data : data.results || [];
      setNotifications((prev) => {
        const localOnes = prev.filter((n) => n.isLocal);
        const merged = [...notificationsData, ...localOnes];
        const unread = merged.filter((n) => !n.is_read).length;
        setUnreadCount(unread);
        return merged;
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?token=${token}`);
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setNotifications((prev) => [message, ...prev]);
      setUnreadCount((count) => count + 1);
    };
    ws.onclose = () => console.log("🔌 WebSocket closed");
    setSocket(ws);
  };

  const markAsRead = async (id) => {
    try {
      await NotificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString(),
      isLocal: true,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((count) => count + 1);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
