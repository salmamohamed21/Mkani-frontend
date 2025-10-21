import React, { useEffect, useState } from "react";
import { getWallet } from "../../api/payments";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";
import LoadingPage from "../../components/ui/LoadingPage";
import Card from "../../components/ui/Card";
import { FaWallet, FaArrowUp, FaArrowDown, FaExclamationTriangle } from "react-icons/fa";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await getWallet();
        setWallet(data);
      } catch (error) {
        console.error("Error fetching wallet:", error);
        setError("فشل في تحميل بيانات المحفظة. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  if (loading) return <LoadingPage />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <Card className="p-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">خطأ</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
            >
              إعادة المحاولة
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">المحفظة الإلكترونية</h1>
          <p className="text-lg font-medium text-gray-700">إدارة رصيدك ومعاملاتك المالية</p>
        </div>

        {/* Balance Card */}
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-50 p-2 rounded-full ml-2">
                <FaWallet className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">الرصيد الحالي</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {wallet?.current_balance || 0} <span className="text-lg text-gray-600">ج.م</span>
            </p>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
        </Card>

        {/* Notice about mobile app */}
        <Card className="p-6 bg-amber-50 border border-amber-200">
          <div className="flex items-start">
            <div className="bg-amber-100 p-2 rounded-full mr-4">
              <FaExclamationTriangle className="text-amber-600 text-lg" />
            </div>
            <div className="text-right flex-1">
              <h3 className="font-semibold text-amber-800 mb-2">إشعار مهم</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                شحن المحفظة والعمليات المالية متاحة الآن فقط عبر تطبيق "مكاني" على الهاتف المحمول.
                قم بتحميل التطبيق لإدارة محفظتك والمدفوعات.
              </p>
            </div>
          </div>
        </Card>

        {/* Transactions Card */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">سجل المعاملات</h3>
            <div className="text-sm text-gray-500">
              آخر {wallet?.recent_transactions?.length || 0} معاملة
            </div>
          </div>
          {wallet?.recent_transactions?.length ? (
            <div className="space-y-3">
              {wallet.recent_transactions.map((tx, index) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors duration-150"
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className={`p-2 rounded-full ${
                      tx.type === "credit" ? "bg-green-50" : "bg-red-50"
                    }`}>
                      {tx.type === "credit" ? (
                        <FaArrowDown className="text-green-600 text-sm" />
                      ) : (
                        <FaArrowUp className="text-red-600 text-sm" />
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.date || Date.now()).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span
                      className={`font-semibold ${
                        tx.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}{tx.amount} ج.م
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
                <FaWallet className="text-gray-400 text-2xl" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">لا توجد معاملات</h4>
              <p className="text-gray-500 text-sm">ستظهر معاملاتك هنا عند إجرائها</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Wallet;
