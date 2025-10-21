import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaSave,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

const EditProfile = () => {
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    date_of_birth: "",
    national_id: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const data = response.data;
        const profileData = {
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
          date_of_birth: data.date_of_birth || "",
          national_id: data.national_id || "",
        };
        setForm(profileData);
        setOriginalData(profileData);
      } catch (error) {
        setMessage({ type: "error", text: "فشل في تحميل البيانات" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setMessage({ type: "", text: "" }); // Clear message on change
  };

  const hasChanges = () => {
    return JSON.stringify(form) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges()) {
      setMessage({ type: "info", text: "لا توجد تغييرات للحفظ" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await updateProfile(form);
      setMessage({ type: "success", text: "تم حفظ التعديلات بنجاح!" });
      setOriginalData(form);
      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: "فشل في حفظ التعديلات. يرجى المحاولة مرة أخرى." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges()) {
      if (window.confirm("هل أنت متأكد من إلغاء التعديلات؟ ستفقد جميع التغييرات.")) {
        setForm(originalData);
        setMessage({ type: "", text: "" });
      }
    } else {
      navigate("/profile");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                  <FaUser className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">تعديل الملف الشخصي</h1>
                  <p className="text-blue-100 mt-1">قم بتحديث معلوماتك الشخصية</p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate("/profile")}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <FaArrowLeft className="ml-2" />
                العودة للملف الشخصي
              </Button>
            </div>
          </Card>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : message.type === "error"
              ? "bg-red-50 border border-red-200 text-red-800"
              : "bg-blue-50 border border-blue-200 text-blue-800"
          }`}>
            {message.type === "success" && <FaCheckCircle className="text-green-600" />}
            {message.type === "error" && <FaExclamationTriangle className="text-red-600" />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaUser className="text-2xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">المعلومات الشخصية</h2>
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUser className="text-blue-500" />
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                {/* Phone Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaPhone className="text-purple-500" />
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>

                {/* Date of Birth */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaCalendarAlt className="text-orange-500" />
                    تاريخ الميلاد
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                {/* National ID */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaIdCard className="text-green-500" />
                    الرقم القومي
                  </label>
                  <input
                    type="text"
                    name="national_id"
                    value={form.national_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="أدخل الرقم القومي"
                  />
                </div>
              </div>
            </Card>

            {/* Preview and Actions */}
            <div className="space-y-6">
              {/* Preview Card */}
              <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl border-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <FaUser className="text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">معاينة البيانات</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-600">الاسم الكامل:</span>
                    <span className="font-semibold text-gray-800">{form.full_name || "غير محدد"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-600">رقم الهاتف:</span>
                    <span className="font-semibold text-gray-800">{form.phone_number || "غير محدد"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-600">تاريخ الميلاد:</span>
                    <span className="font-semibold text-gray-800">
                      {form.date_of_birth ? new Date(form.date_of_birth).toLocaleDateString("ar-EG") : "غير محدد"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-600">الرقم القومي:</span>
                    <span className="font-semibold text-gray-800">{form.national_id || "غير محدد"}</span>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={saving || !hasChanges()}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <FaSave className="ml-2" />
                    {saving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-all duration-300"
                  >
                    إلغاء
                  </Button>
                </div>

                {hasChanges() && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 flex items-center gap-2">
                      <FaExclamationTriangle />
                      لديك تغييرات غير محفوظة
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
