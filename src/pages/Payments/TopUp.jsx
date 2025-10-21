import React, { useState } from "react";
import { initiateTopUp } from "../../api/payments";
import InputField from "../../components/forms/InputField";
import Spinner from "../../components/ui/Spinner";

const TopUp = () => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("paymob");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await initiateTopUp({ amount, method });
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          شحن المحفظة
        </h2>

        <InputField
          label="المبلغ المطلوب شحنه"
          name="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            طريقة الدفع
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="paymob">Paymob</option>
            <option value="sahel">سهل</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90"
        >
          {loading ? "جارٍ التنفيذ..." : "شحن الآن"}
        </button>

        {loading && <Spinner />}
        {result && (
          <div className="mt-4 text-center text-green-600">
            <p>تم إرسال طلب الشحن.</p>
            <p>{result.payment_url ? "جارٍ تحويلك لبوابة الدفع..." : ""}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default TopUp;
