import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../../api/auth";
import Spinner from "../../components/ui/Spinner";
import { MdEmail, MdArrowBack } from "react-icons/md";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await AuthAPI.resetPassword({ email });
      setMessage("تم إرسال كود التحقق إلى بريدك الإلكتروني");
      // Navigate to reset password page with email
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ أثناء إرسال الكود");
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 space-y-8 relative z-10 animate-fadeInUp">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            نسيت كلمة المرور
          </h1>
          <p className="text-blue-600 text-sm">أدخل بريدك الإلكتروني لإرسال كود التحقق</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-center animate-shake">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl text-center animate-fadeInUp">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-blue-700 font-medium text-sm">البريد الإلكتروني</label>
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-blue-300 rounded-xl px-12 py-4 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 bg-white text-blue-900 placeholder-blue-500"
                required
                placeholder="أدخل بريدك الإلكتروني"
              />
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
                <MdEmail className="w-5 h-5" />
                <span>إرسال كود التحقق</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 flex items-center justify-center space-x-2 space-x-reverse"
          >
            <MdArrowBack className="w-4 h-4" />
            <span>العودة لتسجيل الدخول</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
