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
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{req.user__full_name}</h3>
                  <span className={`mt-1 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      req.resident_type === 'owner' ? 'bg-sky-100 text-sky-800' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {req.resident_type === 'owner' ? 'مالك' : 'مستأجر'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">تاريخ الطلب</p>
                  <p className="text-sm font-medium text-gray-700">{new Date(req.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 my-4 py-4 border-t border-b border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-600 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" /></svg>
                    معلومات الساكن
                  </h4>
                  <div className="space-y-2 text-sm pr-7">
                    <p><span className="font-medium text-gray-500">الرقم القومي:</span> {req.user__national_id}</p>
                    <p><span className="font-medium text-gray-500">رقم الهاتف:</span> <span dir="ltr" className="inline-block">{req.user__phone_number}</span></p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-600 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                    معلومات الوحدة
                  </h4>
                  <div className="space-y-2 text-sm pr-7">
                    <p><span className="font-medium text-gray-500">الدور:</span> {req.unit__floor_number}</p>
                    <p><span className="font-medium text-gray-500">الشقة:</span> {req.unit__apartment_number}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => openModal(req, "accept")}
                  className="flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  قبول
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => openModal(req, "reject")}
                  className="flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
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
