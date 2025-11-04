import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useNotifications } from "../../context/NotificationContext";
import { MENU_CONFIG } from "../../config/menuConfig";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language: lang, toggleLanguage } = useLanguage();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  const userRoles = user?.roles || [];

  // Filter menu items based on user roles
  const filteredMenu = MENU_CONFIG.filter((item) =>
    item.roles.some((role) => userRoles.includes(role))
  );

  return (
    <nav className="bg-white shadow-md fixed top-0 right-0 w-full z-50 px-2 py-1 flex items-center justify-between">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="مكاني" className="h-16 w-auto object-contain" />
      </Link>

      <div className="flex items-center gap-6">
        {user && (
          <div className="flex items-center gap-4">
            {filteredMenu.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.to
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:text-blue-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.to === "/notifications" && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}

        <button
          onClick={toggleLanguage}
          className="text-gray-600 hover:text-blue-600 font-semibold"
        >
          {lang === "ar" ? "EN" : "عربي"}
        </button>

        {user ? (
          <>
            <Link to="/profile" className="text-gray-700 font-medium">
              {user.full_name || user.email}
            </Link>
            <button
              onClick={logout}
              className="bg-blue-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-blue-700"
            >
              تسجيل خروج
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-blue-700"
          >
            تسجيل الدخول
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
