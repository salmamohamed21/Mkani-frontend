import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { MENU_CONFIG } from "../../config/menuConfig";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  if (!user) {
    return (
      <aside className="bg-white shadow-md w-64 h-screen fixed top-0 right-0 pt-16 flex items-center justify-center text-gray-400">
        جاري التحميل...
      </aside>
    );
  }

  const userRoles = user.roles || [];

  // Debug logs to check roles and filtered menu
  console.log("User roles:", userRoles);
  const filteredMenu = MENU_CONFIG.filter((item) =>
    item.roles.some((role) => userRoles.includes(role)) && item.to !== "/payments/wallet"
  );
  console.log("Filtered menu:", filteredMenu);

  return (
    <aside className="bg-white shadow-xl w-20 h-screen fixed top-0 right-0 pt-16 border-l border-gray-100 transition-all duration-300">
      <ul className="p-2 space-y-4 flex flex-col">
        {filteredMenu.map((item) => (
          <li key={item.to} className="relative group">
            <Link
              to={item.to}
              className={`relative flex items-center justify-start p-3 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:scale-105 ${
                location.pathname === item.to
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:text-blue-700"
              }`}
            >
              <span className="text-blue-600 text-xl ml-2 relative">
                <item.icon />
                {item.to === "/notifications" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </span>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap bg-white px-2 py-1 rounded shadow-md border z-50 pointer-events-none">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
