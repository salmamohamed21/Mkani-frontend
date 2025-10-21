import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResidentDetails } from '../../api/buildings.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Card from '../../components/ui/Card.jsx';
import { FaArrowLeft, FaUser, FaPhone, FaIdCard, FaBuilding, FaCalendarAlt } from 'react-icons/fa';

const ResidentDetail = () => {
  const { buildingId, residentId } = useParams();
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResidentDetails = async () => {
      try {
        const data = await getResidentDetails(buildingId, residentId);
        setResident(data);
      } catch (error) {
        console.error('Error fetching resident details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResidentDetails();
  }, [buildingId, residentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" dir="rtl">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-xl">لم يتم العثور على الساكن</p>
          <Link to="/residents" className="text-blue-600 hover:underline mt-4 inline-block">
            العودة إلى قائمة السكان
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/residents"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft />
            <span>العودة إلى قائمة السكان</span>
          </Link>
        </div>

        <Card className="p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <FaUser className="text-4xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">تفاصيل الساكن</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaUser className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">الاسم</p>
                  <p className="font-semibold text-gray-800">{resident.user_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">رقم الهاتف</p>
                  <p className="font-semibold text-gray-800">{resident.phone_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaIdCard className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">الرقم القومي</p>
                  <p className="font-semibold text-gray-800">{resident.national_id}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaBuilding className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">الطابق والشقة</p>
                  <p className="font-semibold text-gray-800">طابق {resident.floor_number} - شقة {resident.apartment_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaUser className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">نوع الساكن</p>
                  <p className="font-semibold text-gray-800">{resident.resident_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">تاريخ الانضمام</p>
                  <p className="font-semibold text-gray-800">{new Date(resident.created_at).toLocaleDateString('ar-EG')}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">تاريخ المدفوعات</h2>

          {resident.payment_history && resident.payment_history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-center border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-3 px-4 border">الباقة</th>
                    <th className="py-3 px-4 border">المبلغ</th>
                    <th className="py-3 px-4 border">تاريخ الاستحقاق</th>
                    <th className="py-3 px-4 border">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {resident.payment_history.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{payment.package__name}</td>
                      <td className="py-3 px-4">{payment.amount} جنيه</td>
                      <td className="py-3 px-4">
                        {new Date(payment.due_date).toLocaleDateString('ar-EG')}
                      </td>
                      <td
                        className={`py-3 px-4 font-semibold ${
                          payment.status === 'paid'
                            ? 'text-green-600'
                            : payment.status === 'pending'
                            ? 'text-yellow-600'
                            : 'text-red-500'
                        }`}
                      >
                        {payment.status === 'paid' ? 'مدفوعة' :
                         payment.status === 'pending' ? 'معلقة' : 'غير مدفوعة'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center">لا توجد مدفوعات مسجلة لهذا الساكن</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResidentDetail;
