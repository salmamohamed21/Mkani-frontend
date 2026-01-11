import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/ui/Spinner";
import { MdEmail, MdLock, MdLogin, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('session_expired')) {
      setError("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.");
    }
  }, [location.search]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "فشل تسجيل الدخول باستخدام Google");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError("فشل تسجيل الدخول باستخدام Google");
    }
  };

  const handleGoogleError = () => {
    setError("خطأ في تسجيل الدخول باستخدام Google");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login({ email: formData.email, password: formData.password });
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    } catch (err) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.3), rgba(255,255,255,0))' }}></div>
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4K)' }}></div>
        </div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 space-y-8 border border-blue-200 relative z-10 animate-fadeInUp">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-blue-600 text-sm">أدخل بياناتك للوصول إلى حسابك</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-center animate-shake">
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </div>
          )}

          <div className="space-y-6">
            {/* Google Login Button */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="400"
            />

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">أو</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-blue-700 font-medium text-sm">البريد الإلكتروني</label>
                <div className="relative">
                  <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
                  <input
                    name="email"
                    type="email"
                    className="w-full border-2 border-blue-300 rounded-xl px-12 py-4 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 bg-white text-blue-900 placeholder-blue-500"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-blue-700 font-medium text-sm">كلمة المرور</label>
                <div className="relative">
                  <MdLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full border-2 border-blue-300 rounded-xl px-12 pr-12 py-4 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 bg-white text-blue-900 placeholder-blue-500"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 space-x-reverse"
              >
                {loading ? (
                  <Spinner small />
                ) : (
                  <>
                    <MdLogin className="w-5 h-5" />
                    <span>تسجيل الدخول</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center text-sm">
            <a href="/forgot-password" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
              نسيت كلمة المرور؟
            </a>
          </div>

          <div className="text-center text-sm text-blue-500">
            ليس لديك حساب؟{" "}
            <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
              إنشاء حساب جديد
            </a>
          </div>
        </div>
      </div>

      <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          @keyframes logoPulse {
            0% {
              transform: scale(0.8);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
            100% {
              transform: scale(0.8);
              opacity: 0.7;
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out;
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
          .animate-logoPulse {
            animation: logoPulse 3s ease-in-out infinite;
          }
        `}</style>
    </GoogleOAuthProvider>
  );
};

export default Login;
    