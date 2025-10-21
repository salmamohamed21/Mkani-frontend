import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { Bell } from "lucide-react";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language: lang, toggleLanguage } = useLanguage();

  return (
    <nav className="bg-white shadow-md fixed top-0 right-0 w-full z-50 px-2 py-1 flex items-center justify-between">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="مكاني" className="h-16 w-auto object-contain" />
      </Link>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleLanguage}
          className="text-gray-600 hover:text-blue-600 font-semibold"
        >
          {lang === "ar" ? "EN" : "عربي"}
        </button>

        <Link to="/notifications">
          <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600" />
        </Link>

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
