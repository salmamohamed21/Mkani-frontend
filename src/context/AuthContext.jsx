import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, googleLogin as apiGoogleLogin, getProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // تسجيل الدخول بالبريد وكلمة المرور
  const login = async ({ email, password }) => {
    try {
      const response = await loginUser(email, password);
      // بمجرد تسجيل الدخول، الكوكي بيتخزن تلقائيًا في المتصفح
      // انتظر قليلاً للتأكد من أن الكوكي تم تعيينه
      await new Promise(resolve => setTimeout(resolve, 100));
      const profileResponse = await getProfile();
      setUser(profileResponse.data);
      return { success: true, user: profileResponse.data };
    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
      const errorData = error.response?.data;
      if (errorData) {
        return { success: false, error: errorData };
      }
      return { success: false, error: error.message };
    }
  };

  // تسجيل الدخول عبر Google
  const googleLogin = async (googleToken) => {
    try {
      console.log("Sending Google token to backend:", googleToken.substring(0, 50) + "...");
      const response = await apiGoogleLogin(googleToken);
      const profileResponse = await getProfile();
      setUser(profileResponse.data);
      return { success: true, user: profileResponse.data };
    } catch (error) {
      console.error("Google login failed:", error.response?.data || error);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  // تسجيل الخروج
  const logout = async () => {
    try {
      const response = await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUser(null);
    navigate("/");
  };

  // التأكد من استمرار الجلسة (لو الكوكي لسه صالح)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getProfile();
        setUser(response.data);
      } catch (error) {
        console.warn("Session check failed:", error.response?.status);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // إعادة التحقق من التوكن كل دقيقة للتأكد من صلاحيته
  useEffect(() => {
    const interval = setInterval(async () => {
      if (user) {
        try {
          await getProfile();
        } catch (error) {
          console.warn("Token refresh check failed:", error.response?.status);
          setUser(null);
        }
      }
    }, 60000); // كل دقيقة

    return () => clearInterval(interval);
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        googleLogin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
