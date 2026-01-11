import React, { useState, useEffect } from 'react';
import { getMaintenanceRequests, createMaintenanceRequest } from '../../api/maintenance';

const services = [
  { name: 'نجارة وتركيبات', icon: '/icons/wood.svg' },
  { name: 'دهانات', icon: '/icons/paint.svg' },
  { name: 'كهرباء', icon: '/icons/electric.svg' },
  { name: 'سباكة', icon: '/icons/plumber.svg' },
  { name: 'تكييف', icon: '/icons/ac.svg' },
  { name: 'تنظيف', icon: '/icons/clean.svg' },
  { name: 'مكافحة الحشرات', icon: '/icons/pest.svg' },
  { name: 'غرف التبريد', icon: '/icons/cold.svg' },
  { name: 'لياسة', icon: '/icons/tools.svg' },
  { name: 'عشب صناعي', icon: '/icons/grass.svg' },
  { name: 'مضلات المواقف', icon: '/icons/shadow.svg' },
  { name: 'باركية', icon: '/icons/wood-floor.svg' },
  { name: 'أعمال جبسية', icon: '/icons/roof.svg' },
  { name: 'حوض سباحة', icon: '/icons/pool.svg' },
  { name: 'أرضيات', icon: '/icons/floor.svg' },
];

const MaintenancePage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState({ description: '', priority: 'low' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getMaintenanceRequests();
      setRequests(data.data || []);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await createMaintenanceRequest(newRequest);
      setNewRequest({ description: '', priority: 'low' });
      fetchRequests();
    } catch (error) {
      console.error('Error creating maintenance request:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* Top Section: Join + Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Join Technicians Section */}
        <div className="bg-blue-50 p-5 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">هل أنت فني محترف؟</h2>
          <p className="text-sm text-gray-700 mb-4">
            انضم إلى مجتمع «مكاني» وابدأ في استقبال طلبات الصيانة من العملاء
            مباشرة مع نظام تقييم ودفعات آمنة.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            انضم إلينا
          </button>
        </div>

        {/* Services Grid */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">الخدمات</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            {services.map((service) => (
              <div key={service.name}
                className="bg-white shadow rounded-xl p-3 flex flex-col items-center text-center">
                <img src={service.icon} className="w-10 h-10 mb-2" />
                <span className="text-sm">{service.name}</span>
              </div>
            ))}

          </div>
        </div>

      </div>

      {/* Create Request Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">اطلب خدمة الصيانة الآن</h2>
        <form onSubmit={handleCreateRequest} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">الوصف</label>
            <textarea
              className="w-full p-2 border rounded"
              value={newRequest.description}
              onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
              required
              placeholder="اكتب تفاصيل المشكلة..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">الأولوية</label>
            <select
              className="w-full p-2 border rounded"
              value={newRequest.priority}
              onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
            >
              <option value="low">منخفضة</option>
              <option value="medium">متوسطة</option>
              <option value="high">عالية</option>
            </select>
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            اطلب الآن
          </button>
        </form>
      </div>

      {/* Requests List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">طلباتك السابقة</h2>
        {loading ? (
          <p>جاري التحميل...</p>
        ) : requests.length === 0 ? (
          <p>لا توجد طلبات صيانة.</p>
        ) : (
          <ul className="space-y-2">
            {requests.map((request) => (
              <li key={request.id} className="border p-2 rounded">
                <p><strong>الوصف:</strong> {request.description}</p>
                <p><strong>الأولوية:</strong> {request.priority}</p>
                <p><strong>الحالة:</strong> {request.status}</p>
                <p><strong>التاريخ:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default MaintenancePage;
