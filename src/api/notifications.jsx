import axiosClient from "./axiosClient";

export const NotificationsAPI = {
  getAll: () => axiosClient.get("notifications/notification/"),
  markAsRead: (id) => axiosClient.post(`notifications/notification/${id}/mark_read/`),
  getUnreadCount: () => axiosClient.get("notifications/notification/unread_count/"),
};
