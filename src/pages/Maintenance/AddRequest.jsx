import React from "react";
import Card from "../../components/ui/Card";
import { FaTools } from "react-icons/fa";

const AddRequest = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <FaTools className="text-4xl text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">طلبات الصيانة</h1>

          {/* Notice about mobile app */}
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-6 rounded-lg mb-6">
            <p className="font-semibold text-lg mb-3">⚠️ إشعار مهم</p>
            <p className="text-base mb-3">إرسال طلبات الصيانة متاح الآن فقط عبر تطبيق "مكاني" على الهاتف المحمول.</p>
            <p className="text-sm">📱 قم بتحميل التطبيق لإرسال طلبات الصيانة والمتابعة مع الفنيين.</p>
          </div>

          <div className="text-gray-600">
            <p className="mb-2">يمكنك الآن:</p>
            <ul className="text-right list-disc list-inside space-y-1">
              <li>إرسال طلبات الصيانة بسهولة</li>
              <li>إرفاق صور للمشاكل</li>
              <li>متابعة حالة الطلبات</li>
              <li>التواصل المباشر مع الفنيين</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddRequest;
