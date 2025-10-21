import React, { useState } from "react";
import { passwordReset } from "../../api/auth";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await passwordReset(email);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-primary">
          استعادة كلمة المرور
        </h1>

        {sent ? (
          <p className="text-center text-green-600">
            تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90"
            >
              إرسال الرابط
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
