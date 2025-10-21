import React, { useEffect, useState, useContext } from "react";
import { getMaintenanceRequests, updateMaintenanceStatus } from "../../api/maintenance";
import Spinner from "../../components/ui/Spinner";
import LoadingPage from "../../components/ui/LoadingPage";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMaintenanceRequests();
      setRequests(data.results || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateMaintenanceStatus(id, { status });
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-primary mb-4">
            قائمة طلبات الصيانة
          </h2>
          {requests.length === 0 ? (
            <p className="text-gray-500">لا توجد طلبات حالياً.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {requests.map((req) => (
                <li
                  key={req.id}
                  className="flex justify-between items-center py-3"
                >
                  <div>
                    <p className="font-semibold">{req.building_name}</p>
                    <p className="text-gray-600 text-sm">{req.description}</p>
                    <p className="text-xs text-gray-400">
                      الحالة: {req.status_display}
                    </p>
                  </div>

                  {user?.role === "union_head" && req.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(req.id, "in_progress")}
                        className="bg-green-500 text-white px-3 py-1 rounded-md"
                      >
                        قبول
                      </button>
                      <button
                        onClick={() => handleStatusChange(req.id, "rejected")}
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                      >
                        رفض
                      </button>
                    </div>
                  )}

                  {user?.role === "technician" && req.status === "in_progress" && (
                    <button
                      onClick={() => handleStatusChange(req.id, "completed")}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md"
                    >
                      إنهاء الطلب
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RequestList;
