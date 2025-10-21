import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBuildingDetails, getBuildingResidents, getBuildingPackages, updateBuilding } from "../../api/buildings.jsx";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import LoadingPage from "../../components/ui/LoadingPage";
import Button from "../../components/ui/Button";
import InputField from "../../components/forms/InputField";
import { FaUser, FaLayerGroup, FaBuilding, FaHome, FaEdit, FaSave, FaTimes, FaMapMarker } from "react-icons/fa";

const BuildingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [building, setBuilding] = useState(null);
  const [residents, setResidents] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      getBuildingDetails(id),
      getBuildingResidents(id),
      getBuildingPackages(id),
    ])
      .then(([b, r, p]) => {
        setBuilding(b);
        setResidents(r);
        setPackages(p);
        setEditData({
          name: b.name || '',
          address: b.address || '',
          total_floors: b.total_floors || '',
          total_units: b.total_units || '',
        });
      })
      .catch(() => {
        setBuilding(null);
        setResidents([]);
        setPackages([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: building.name || '',
      address: building.address || '',
      total_floors: building.total_floors || '',
      total_units: building.total_units || '',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedBuilding = await updateBuilding(id, editData);
      setBuilding(updatedBuilding);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating building:', error);
      // You can add toast notification here
    } finally {
      setSaving(false);
    }
  };

  const canEdit = user?.roles?.includes('union_head') || user?.roles?.includes('admin');

  if (loading) return <LoadingPage />;

  if (!building)
    return (
      <div className="p-6 text-center text-gray-500">
        لم يتم العثور على بيانات العمارة المطلوبة.
      </div>
    );

  return (
    <div className="p-6 space-y-8" dir="rtl">
      {/* 🏢 بيانات العمارة */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBuilding /> {isEditing ? 'تعديل بيانات العمارة' : building.name}
          </h1>
          <div className="flex gap-2">
            {canEdit && !isEditing && (
              <Button onClick={handleEdit} variant="primary" className="flex items-center gap-2">
                <FaEdit className="text-sm" />
                تعديل
              </Button>
            )}
            <Button onClick={() => navigate("/buildings")} variant="secondary">
              رجوع
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <InputField
              label="اسم العمارة"
              value={editData.name}
              onChange={(value) => setEditData({ ...editData, name: value })}
              placeholder="أدخل اسم العمارة"
            />
            <InputField
              label="العنوان"
              value={editData.address}
              onChange={(value) => setEditData({ ...editData, address: value })}
              placeholder="أدخل العنوان"
            />
            <InputField
              label="عدد الأدوار"
              type="number"
              value={editData.total_floors}
              onChange={(value) => setEditData({ ...editData, total_floors: value })}
              placeholder="أدخل عدد الأدوار"
            />
            <InputField
              label="عدد الوحدات"
              type="number"
              value={editData.total_units}
              onChange={(value) => setEditData({ ...editData, total_units: value })}
              placeholder="أدخل عدد الوحدات"
            />
            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleSave}
                variant="primary"
                disabled={saving}
                className="flex items-center gap-2"
              >
                <FaSave className="text-sm" />
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <FaTimes className="text-sm" />
                إلغاء
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <FaBuilding className="text-2xl text-blue-600" />
              <div>
                <span className="text-gray-700 font-medium">اسم العمارة:</span>
                <span className="text-gray-800 mr-2">{building.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <FaMapMarker className="text-2xl text-green-600" />
              <div>
                <span className="text-gray-700 font-medium">العنوان:</span>
                <span className="text-gray-800 mr-2">{building.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
              <FaLayerGroup className="text-2xl text-purple-600" />
              <div>
                <span className="text-gray-700 font-medium">عدد الأدوار:</span>
                <span className="text-gray-800 mr-2">{building.total_floors || "غير محدد"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
              <FaHome className="text-2xl text-orange-600" />
              <div>
                <span className="text-gray-700 font-medium">عدد الوحدات:</span>
                <span className="text-gray-800 mr-2">{building.total_units || "غير محدد"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
              <FaUser className="text-2xl text-gray-600" />
              <div>
                <span className="text-gray-700 font-medium">أنشئت بواسطة:</span>
                <span className="text-gray-800 mr-2">{building.union_head_name || "غير معروف"}</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* 👨‍👩‍👧‍👦 السكان */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUser /> السكان المسجلين
        </h2>
        {residents.length === 0 ? (
          <p className="text-gray-500">لا يوجد سكان حالياً.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-right">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">الاسم</th>
                  <th className="p-3 border">رقم الهاتف</th>
                  <th className="p-3 border">الرقم القومي</th>
                  <th className="p-3 border">الدور</th>
                  <th className="p-3 border">الشقة</th>
                  <th className="p-3 border">النوع</th>
                  <th className="p-3 border">المدفوعات</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{r.user_name}</td>
                    <td className="p-3 border">{r.phone_number || "غير محدد"}</td>
                    <td className="p-3 border">{r.national_id || "غير محدد"}</td>
                    <td className="p-3 border">{r.floor_number}</td>
                    <td className="p-3 border">{r.apartment_number}</td>
                    <td className="p-3 border">{r.resident_type}</td>
                    <td className="p-3 border">
                      {r.payment_history && r.payment_history.length > 0 ? (
                        <div className="text-sm">
                          {r.payment_history.filter(p => p.status === 'paid').length} مدفوعة
                        </div>
                      ) : (
                        "لا توجد مدفوعات"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* 📦 الباقات الشهرية */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaLayerGroup /> ملخص الباقات الشهرية
        </h2>
        {packages.length === 0 ? (
          <p className="text-gray-500">لا توجد باقات حالياً.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-800 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-gray-600 mb-1">
                  💰 السعر الشهري: {pkg.price} جنيه
                </p>
                <p className="text-gray-600 mb-1">
                  🏠 عدد السكان المشتركين: {pkg.subscribers_count}
                </p>
                <p className="text-gray-600">
                  📅 آخر تحديث: {new Date(pkg.updated_at).toLocaleDateString("ar-EG")}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default BuildingDetails;
