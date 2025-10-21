import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBuildings, getPublicBuildingNames, getResidentBuilding, getMyBuildings, updateBuilding } from "../../api/buildings.jsx";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import LoadingPage from "../../components/ui/LoadingPage";
import InputField from "../../components/forms/InputField";
import Modal from "../../components/ui/Modal";
import { FaBuilding, FaMapMarker, FaLayerGroup, FaHome, FaUser, FaEye, FaClipboardList, FaPlus, FaChevronDown, FaChevronUp, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const BuildingsList = () => {
  const [buildings, setBuildings] = useState([]);
  const [residentBuilding, setResidentBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [editingCards, setEditingCards] = useState({});
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (user?.roles?.includes('resident')) {
      getResidentBuilding()
        .then((data) => setResidentBuilding(data))
        .catch(() => setResidentBuilding(null))
        .finally(() => setLoading(false));
    } else if (user?.roles?.includes('union_head')) {
      getMyBuildings()
        .then((data) => setBuildings(data))
        .catch(() => setBuildings([]))
        .finally(() => setLoading(false));
    } else {
      Promise.all([getBuildings(), getPublicBuildingNames()])
        .then(([buildingsData]) => setBuildings(buildingsData.results || []))
        .catch(() => setBuildings([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const toggleExpand = (buildingId) => {
    setExpandedCards(prev => ({
      ...prev,
      [buildingId]: !prev[buildingId]
    }));
  };

  const handleEdit = (buildingId, building) => {
    setEditingCards(prev => ({
      ...prev,
      [buildingId]: true
    }));
    setEditData(prev => ({
      ...prev,
      [buildingId]: {
        name: building.name || '',
        address: building.address || '',
        total_floors: building.total_floors || '',
        total_units: building.total_units || '',
      }
    }));
  };

  const handleCancelEdit = (buildingId) => {
    setEditingCards(prev => ({
      ...prev,
      [buildingId]: false
    }));
    setEditData(prev => ({
      ...prev,
      [buildingId]: undefined
    }));
  };

  const handleSave = async (buildingId) => {
    setSaving(prev => ({ ...prev, [buildingId]: true }));
    try {
      const updatedBuilding = await updateBuilding(buildingId, editData[buildingId]);
      setBuildings(prev => prev.map(b => b.id === buildingId ? updatedBuilding : b));
      setEditingCards(prev => ({ ...prev, [buildingId]: false }));
      setEditData(prev => ({ ...prev, [buildingId]: undefined }));
    } catch (error) {
      console.error('Error updating building:', error);
    } finally {
      setSaving(prev => ({ ...prev, [buildingId]: false }));
    }
  };

  if (loading) return <LoadingPage />;

  if (user?.roles?.includes('resident')) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen" dir="rtl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">تفاصيل العمارة</h1>
        {residentBuilding ? (
          <Card className="max-w-2xl mx-auto shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <FaBuilding className="text-3xl text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-800">{residentBuilding.name}</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaMapMarker className="text-lg text-red-500" />
                <span className="text-gray-700 font-medium">العنوان:</span>
                <span className="text-gray-600">{residentBuilding.address}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaLayerGroup className="text-lg text-green-500" />
                <span className="text-gray-700 font-medium">عدد الأدوار:</span>
                <span className="text-gray-600">{residentBuilding.total_floors || "غير محدد"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaHome className="text-lg text-purple-500" />
                <span className="text-gray-700 font-medium">عدد الوحدات:</span>
                <span className="text-gray-600">{residentBuilding.total_units || "غير محدد"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaUser className="text-lg text-orange-500" />
                <span className="text-gray-700 font-medium">رئيس الاتحاد:</span>
                <span className="text-gray-600">{residentBuilding.union_head_name || "غير معروف"}</span>
              </div>
            </div>
          </Card>
        ) : (
          <div className="text-center">
            <p className="text-gray-500 text-lg">لم يتم العثور على بيانات العمارة.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <FaBuilding className="text-4xl text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">العمارات الخاصة بك</h1>
          </div>
          <Button onClick={() => navigate("/buildings/add")} variant="primary" className="flex items-center gap-2">
            <FaPlus className="text-sm" />
            إضافة عمارة جديدة
          </Button>
        </div>

        {buildings.length === 0 ? (
          <div className="text-center py-12">
            <FaBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl">لا توجد عمارات بعد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {buildings.map((b) => {
              const isExpanded = expandedCards[b.id];
              const isEditing = editingCards[b.id];
              const isSaving = saving[b.id];

              return (
                <Card key={b.id} className="h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="text-xl text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-800">{b.name}</h3>
                    </div>
                    {user?.roles?.includes('union_head') && (
                      <div className="flex gap-1">
                        {isExpanded && isEditing ? (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleCancelEdit(b.id)}
                              className="p-1"
                              title="إلغاء"
                            >
                              <FaTimes className="text-xs" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSave(b.id)}
                              disabled={isSaving}
                              className="p-1 bg-blue-600 hover:bg-blue-700 text-white"
                              title={isSaving ? 'جاري الحفظ...' : 'حفظ'}
                            >
                              <FaSave className="text-xs" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => toggleExpand(b.id)}
                              className="p-1"
                            >
                              {isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                            </Button>
                            {isExpanded && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleEdit(b.id, b)}
                                className="p-1"
                              >
                                <FaEdit className="text-xs" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                    <FaMapMarker className="text-red-500" />
                    {b.address || "غير محدد"}
                  </p>

                  {isExpanded && (
                    <div className="space-y-4 mb-4">
                      {isEditing ? (
                        <>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FaBuilding className="text-lg text-blue-600" />
                            <InputField
                              label=""
                              value={editData[b.id]?.name || ''}
                              onChange={(value) => setEditData(prev => ({
                                ...prev,
                                [b.id]: { ...prev[b.id], name: value }
                              }))}
                              placeholder="أدخل اسم العمارة"
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FaMapMarker className="text-lg text-red-500" />
                            <InputField
                              label=""
                              value={editData[b.id]?.address || ''}
                              onChange={(value) => setEditData(prev => ({
                                ...prev,
                                [b.id]: { ...prev[b.id], address: value }
                              }))}
                              placeholder="أدخل العنوان"
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FaLayerGroup className="text-lg text-green-500" />
                            <InputField
                              label=""
                              type="number"
                              value={editData[b.id]?.total_floors || ''}
                              onChange={(value) => setEditData(prev => ({
                                ...prev,
                                [b.id]: { ...prev[b.id], total_floors: value }
                              }))}
                              placeholder="أدخل عدد الأدوار"
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FaHome className="text-lg text-purple-500" />
                            <InputField
                              label=""
                              type="number"
                              value={editData[b.id]?.total_units || ''}
                              onChange={(value) => setEditData(prev => ({
                                ...prev,
                                [b.id]: { ...prev[b.id], total_units: value }
                              }))}
                              placeholder="أدخل عدد الوحدات"
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FaUser className="text-lg text-orange-500" />
                            <span className="text-gray-700 font-medium">رئيس الاتحاد:</span>
                            <span className="text-gray-600">{b.union_head_name || "غير معروف"}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FaLayerGroup className="text-lg text-green-500" />
                            <span className="text-gray-700 font-medium">عدد الأدوار:</span>
                            <span className="text-gray-600">{b.total_floors || "غير محدد"}</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FaHome className="text-lg text-purple-500" />
                            <span className="text-gray-700 font-medium">عدد الوحدات:</span>
                            <span className="text-gray-600">{b.total_units || "غير محدد"}</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FaUser className="text-lg text-orange-500" />
                            <span className="text-gray-700 font-medium">رئيس الاتحاد:</span>
                            <span className="text-gray-600">{b.union_head_name || "غير معروف"}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex justify-center mt-auto">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/buildings/${b.id}/requests`)}
                      className="flex items-center justify-center gap-1 px-4"
                    >
                      <FaClipboardList className="text-xs" />
                      طلبات السكن
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingsList;
