import React, { useEffect, useState } from "react";
import { getTransactions } from "../../api/payments";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTransactions();
      setTransactions(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-primary mb-4">
            سجل المعاملات المالية
          </h2>
          <ul className="divide-y divide-gray-200">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex justify-between py-3 text-gray-700">
                <span>{tx.description}</span>
                <span
                  className={`${
                    tx.type === "credit" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {tx.amount} ج.م
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default TransactionHistory;
