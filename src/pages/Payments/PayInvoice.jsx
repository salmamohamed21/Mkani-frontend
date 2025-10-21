import React, { useState, useEffect } from "react";
import { getUnpaidInvoices, payInvoice } from "../../api/payments";
import Spinner from "../../components/ui/Spinner";
import LoadingPage from "../../components/ui/LoadingPage";
import Card from "../../components/ui/Card";

const PayInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      const data = await getUnpaidInvoices();
      setInvoices(data);
      setLoading(false);
    };
    fetchInvoices();
  }, []);

  const handlePay = async (invoiceId) => {
    await payInvoice(invoiceId);
    setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-primary mb-4">
            الفواتير غير المدفوعة
          </h2>
          {invoices.length === 0 ? (
            <p className="text-gray-500">لا توجد فواتير مستحقة حالياً.</p>
          ) : (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border-b py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{invoice.package_name}</p>
                  <p className="text-gray-600 text-sm">
                    {invoice.amount} ج.م - {invoice.due_date}
                  </p>
                </div>
                <button
                  onClick={() => handlePay(invoice.id)}
                  className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
                >
                  دفع الآن
                </button>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
};

export default PayInvoice;
