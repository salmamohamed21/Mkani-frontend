import React, { useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import Card from '../../components/ui/Card';
import { Bell, Circle } from 'lucide-react';

const Notifications = () => {
  const { notifications, markAsRead } = useNotifications();

  useEffect(() => {
    // Mark all as read when viewing the page, but only for real notifications (not local ones)
    notifications.forEach(notification => {
      if (!notification.is_read && !notification.isLocal) {
        markAsRead(notification.id);
      }
    });
  }, [notifications, markAsRead]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="flex items-center mb-8">
        <Bell className="ml-3 h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">الإشعارات</h1>
      </div>
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg text-gray-500">لا توجد إشعارات</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {notifications.map(notification => (
            <Card
              key={notification.id}
              className={`transition-all duration-300 hover:shadow-xl cursor-pointer ${
                !notification.is_read
                  ? 'bg-blue-50 border-r-4 border-blue-500 shadow-md'
                  : 'bg-white shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3 space-x-reverse">
                {!notification.is_read && (
                  <Circle className="h-3 w-3 text-blue-500 mt-2 flex-shrink-0" fill="currentColor" />
                )}
                <div className="flex-1">
                  <h3 className={`font-bold text-xl ${!notification.is_read ? 'text-blue-900' : 'text-gray-900'}`}>
                    {notification.title}
                  </h3>
                  <p className={`mt-2 text-base leading-relaxed ${!notification.is_read ? 'text-gray-800' : 'text-gray-600'}`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    {new Date(notification.created_at).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
