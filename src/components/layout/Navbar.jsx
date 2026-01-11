import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useNotifications } from "../../context/NotificationContext";
import { MENU_CONFIG } from "../../config/menuConfig";
import logo from "../../assets/logo.png";
import { LogOut, User, LogIn, Sun, Moon } from 'lucide-react'; // Using lucide-react for icons

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language: lang, toggleLanguage } = useLanguage();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  const userRoles = user?.roles || [];

  const filteredMenu = MENU_CONFIG.filter((item) =>
    item.roles.some((role) => userRoles.includes(role))
  );

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="مكاني" className="h-20 w-auto object-contain" />
            </Link>
          </div>

          {/* Centered Navigation for logged-in users */}
          {user && (
            <nav className="hidden md:flex flex-grow items-center justify-center">
              <ul className="flex items-center space-x-2 lg:space-x-4">
                {filteredMenu.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 ${
                        location.pathname === item.to
                          ? "bg-gray-100 text-gray-900"
                          : ""
                      }`}
                    >
                      <item.icon className="w-5 h-5 text-gray-500" />
                      <span>{item.label}</span>
                      {item.to === "/notifications" && unreadCount > 0 && (
                        <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="text-gray-600 hover:text-blue-600 font-semibold p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle Language"
            >
              {lang === "ar" ? "EN" : "AR"}
            </button>

            <div className="w-px h-6 bg-gray-200"></div>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center text-gray-700 font-medium hover:text-blue-600 transition-colors ml-4">
                  <User className="w-5 h-5 mr-2" />
                  <span>{user.full_name || user.email}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center bg-red-500 text-white rounded-lg px-4 py-2  font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <LogIn className="w-5 h-5 mr-2" />
                <span>تسجيل الدخول</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
