import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient.jsx";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import LoadingPage from "../../components/ui/LoadingPage";
import Modal from "../../components/ui/Modal";

const ResidentRequests = () => {
  const { id } = useParams(); // building id from route
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (id) {
      // Fetch requests for specific building using authenticated axiosClient
      axiosClient.get(`/buildings/${id}/residents_requests/`)
        .then(res => setRequests(res.data))
        .catch(() => setRequests([]))
        .finally(() => setLoading(false));
    } else {
      // Fallback to general requests (though this should not happen for union_head)
      setRequests([]);
      setLoading(false);
    }
  }, [id]);

  const openModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setModalOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      const data = {
        requestId: selectedRequest.id,
        action: actionType,
        rejectionReason: actionType === 'reject' ? rejectionReason : null
      };
      await axiosClient.post(`/buildings/${id}/accept_request/`, data);
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
      alert(`تم ${actionType === 'accept' ? 'قبول' : 'رفض'} الطلب بنجاح`);
      setModalOpen(false);
      setSelectedRequest(null);
      setActionType(null);
      setRejectionReason('');
    } catch {
      alert("حدث خطأ أثناء تحديث الحالة ❌");
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">طلبات السكن</h2>
        <Button onClick={() => navigate(`/buildings/${id}/details`)} variant="secondary">
          رجوع للتفاصيل
        </Button>
      </div>
      {requests.length === 0 ? (
        <p className="text-gray-500">لا توجد طلبات حالياً.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{req.user__full_name}</h3>
                <p className="text-gray-600 text-sm">
                  الدور: {req.floor_number} | الشقة: {req.apartment_number} | النوع: {req.resident_type}
                </p>
                <p className="text-gray-400 text-xs">
                  تاريخ الطلب: {new Date(req.created_at).toLocaleString('ar-EG')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => openModal(req, "accept")}
                >
                  قبول
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => openModal(req, "reject")}
                >
                  رفض
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="تأكيد العملية">
        <div className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            actionType === 'accept' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <svg
              className={`w-8 h-8 ${actionType === 'accept' ? 'text-green-600' : 'text-red-600'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {actionType === 'accept' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
          </div>
          <p className="text-lg text-gray-700 mb-4">
            هل أنت متأكد من {actionType === 'accept' ? 'قبول' : 'رفض'} طلب {selectedRequest?.user__full_name}؟
          </p>
          {actionType === 'reject' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                سبب الرفض (اختياري)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="3"
                placeholder="أدخل سبب الرفض..."
                dir="rtl"
              />
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="px-6">
              إلغاء
            </Button>
            <Button
              variant={actionType === 'accept' ? 'success' : 'danger'}
              onClick={confirmAction}
              className="px-6"
            >
              {actionType === 'accept' ? 'قبول' : 'رفض'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResidentRequests;
