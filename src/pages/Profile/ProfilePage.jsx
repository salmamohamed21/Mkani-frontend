import React, { useEffect, useState } from "react";
import { getProfile, getResidentProfileData, getTechnicianProfileData, getUnionHeadProfileData } from "../../api/auth";
import { getWallet } from "../../api/payments";
import { getMyBuildings, updateBuilding } from "../../api/buildings.jsx";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import LoadingPage from "../../components/ui/LoadingPage";
import InputField from "../../components/forms/InputField";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserTag,
  FaIdCard,
  FaEdit,
  FaFileInvoice,
  FaStar,
  FaCheckCircle,
  FaCrown,
  FaBuilding,
  FaUsers,
  FaTools,
  FaCoins,
  FaMapMarker,
  FaLayerGroup,
  FaHome,
  FaClipboardList,
  FaChevronDown,
  FaChevronUp,
  FaSave,
  FaTimes
} from "react-icons/fa";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [residentData, setResidentData] = useState(null);
  const [technicianData, setTechnicianData] = useState(null);
  const [unionHeadData, setUnionHeadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [editingCards, setEditingCards] = useState({});
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await getProfile();
        setProfile(profileResponse.data);
        const walletResponse = await getWallet();
        setWallet(walletResponse.data);

        // جلب البيانات حسب الأدوار
        if (profileResponse.data?.roles?.includes('resident')) {
          const residentResponse = await getResidentProfileData();
          setResidentData(residentResponse.data);
        }
        if (profileResponse.data?.roles?.includes('technician')) {
          const technicianResponse = await getTechnicianProfileData();
          setTechnicianData(technicianResponse.data);
        }
        if (profileResponse.data?.roles?.includes('union_head')) {
          const unionHeadResponse = await getUnionHeadProfileData();
          setUnionHeadData(unionHeadResponse.data);
          const buildingsData = await getMyBuildings();
          setBuildings(buildingsData);
        }
      } catch (error) {
        console.error("❌ خطأ في جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <LoadingPage />;

  const getRoleIcon = (role) => {
    switch (role) {
      case 'union_head':
      case "['union_head']":
        return <FaCrown className="text-yellow-500" />;
      case 'building_manager':
        return <FaBuilding className="text-blue-500" />;
      case 'technician':
        return <FaTools className="text-orange-500" />;
      case 'resident':
        return <FaUsers className="text-green-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'union_head':
      case "['union_head']":
        return 'رئيس الاتحاد';
      case 'building_manager':
        return 'مدير العمارة';
      case 'technician':
        return 'فني صيانة';
      case 'resident':
        return 'ساكن';
      default:
        return role;
    }
  };

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

  const handleViewPackages = (building) => {
    navigate('/packages', { state: { selectedBuilding: building.id } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl border-0">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                  <FaUser className="text-4xl text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                  <FaCheckCircle className="text-white text-sm" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-right">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile?.full_name}</h1>
                <p className="text-xl opacity-90 mb-2">{profile?.email}</p>
                <div className="flex flex-wrap justify-center md:justify-end gap-2 mb-4">
                  {[...new Set(profile?.roles?.map(role => role === "['union_head']" ? 'union_head' : role))]?.map((role, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {getRoleIcon(role)}
                      <span className="font-medium text-sm">{getRoleLabel(role)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{wallet?.current_balance || 0}</div>
                  <div className="text-sm opacity-80">رصيد المحفظة</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaUser className="text-2xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">المعلومات الشخصية</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <FaUser className="text-blue-600 text-lg" />
                    <label className="text-sm font-semibold text-gray-700">الاسم الكامل</label>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{profile?.full_name}</p>
                </div>

                {/* Email */}
                <div className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <FaEnvelope className="text-green-600 text-lg" />
                    <label className="text-sm font-semibold text-gray-700">البريد الإلكتروني</label>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{profile?.email}</p>
                </div>

                {/* Phone */}
                <div className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <FaPhone className="text-purple-600 text-lg" />
                    <label className="text-sm font-semibold text-gray-700">رقم الهاتف</label>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{profile?.phone_number || "غير محدد"}</p>
                </div>

                {/* National ID */}
                <div className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <FaIdCard className="text-orange-600 text-lg" />
                    <label className="text-sm font-semibold text-gray-700">الرقم القومى</label>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {profile?.national_id || "غير محدد"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Roles and Permissions */}
            <Card className="p-8 mt-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                
                
              </div>

              

              {/* Resident Profile Data */}
              {profile?.roles?.includes('resident') && residentData && (
                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 rounded-full">
                      <FaHome className="text-2xl text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">بيانات السكن</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <FaBuilding className="text-green-600 text-lg" />
                        <label className="text-sm font-semibold text-gray-700">اسم العمارة</label>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{residentData.building_name}</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <FaMapMarker className="text-blue-600 text-lg" />
                        <label className="text-sm font-semibold text-gray-700">العنوان</label>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{residentData.address}</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                      <div className="flex items-center gap-3 mb-3">
                        <FaLayerGroup className="text-purple-600 text-lg" />
                        <label className="text-sm font-semibold text-gray-700">الدور</label>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{residentData.floor_number}</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                      <div className="flex items-center gap-3 mb-3">
                        <FaHome className="text-orange-600 text-lg" />
                        <label className="text-sm font-semibold text-gray-700">رقم الشقة</label>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{residentData.apartment_number}</p>
                    </div>
                  </div>

                  {/* Packages */}
                  <div className="mt-8">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">الباقات المشتركة</h4>
                    <div className="space-y-4">
                      {residentData.building_packages?.map((pkg) => (
                        <Card key={pkg.id} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-bold text-gray-800">{pkg.name}</h5>
                              <p className="text-sm text-gray-600">{pkg.description}</p>
                              <p className="text-sm text-gray-600">الحالة: {pkg.status === 'paid' ? 'مدفوع' : 'معلق'}</p>
                              <p className="text-sm text-gray-600">المبلغ: {pkg.amount} جنيه</p>
                              <p className="text-sm text-gray-600">تاريخ الاستحقاق: {new Date(pkg.due_date).toLocaleDateString('ar-EG')}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                pkg.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {pkg.status === 'paid' ? 'مدفوع' : 'معلق'}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {residentData.personal_packages?.map((pkg) => (
                        <Card key={pkg.id} className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-bold text-gray-800">{pkg.name}</h5>
                              <p className="text-sm text-gray-600">{pkg.description}</p>
                              <p className="text-sm text-gray-600">الحالة: {pkg.status === 'paid' ? 'مدفوع' : 'معلق'}</p>
                              <p className="text-sm text-gray-600">المبلغ: {pkg.amount} جنيه</p>
                              <p className="text-sm text-gray-600">تاريخ الاستحقاق: {new Date(pkg.due_date).toLocaleDateString('ar-EG')}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                pkg.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {pkg.status === 'paid' ? 'مدفوع' : 'معلق'}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Technician Profile Data */}
              {profile?.roles?.includes('technician') && technicianData && (
                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <FaTools className="text-2xl text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">بيانات الفني</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                      <div className="flex items-center gap-3 mb-3">
                        <FaTools className="text-orange-600 text-lg" />
                        <label className="text-sm font-semibold text-gray-700">التخصص</label>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{technicianData.specialization}</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200">
                      <div className="flex items-center gap-3 mb-3">
                        <FaMapMarker className="text-red-600 text-lg" />
                        <label className="text-sm font-semibold text-gray-700">منطقة العمل</label>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{technicianData.work_area}</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
                      <div className="flex items-center gap-3 mb-3">
                        <FaUserTag className="text-yellow-600 text-lg" />
                        <label className="text-sm font-semibold text-gray-700">حالة التوظيف</label>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{technicianData.employment_status}</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200">
                      <div className="flex items-center gap-3 mb-3">
                        <FaCoins className="text-indigo-600 text-lg" />
                        <label className="text-sm font-semibold text-gray-700">السعر</label>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{technicianData.rate} جنيه</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <FaClipboardList className="text-gray-600 text-lg" />
                        <label className="text-sm font-semibold text-gray-700">وصف الخدمات</label>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{technicianData.services_description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buildings Section for Union Head */}
              {profile?.roles?.includes('union_head') && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <FaBuilding className="text-2xl text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">العمارات الخاصة بك</h3>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate('/buildings/add')}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <FaBuilding className="text-sm" />
                      إضافة عمارة
                    </Button>
                  </div>

                  {buildings.length === 0 ? (
                    <div className="text-center py-8">
                      <FaBuilding className="text-4xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">لا توجد عمارات بعد.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                      {buildings.map((b) => (
                        <Card key={b.id} className="h-full">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FaBuilding className="text-xl text-blue-600" />
                              <h4 className="text-lg font-semibold text-gray-800">{b.name}</h4>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleExpand(b.id)}
                                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                              >
                                {expandedCards[b.id] ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                              <button
                                onClick={() => handleEdit(b.id, b)}
                                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                              >
                                <FaEdit />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                            <FaMapMarker className="text-red-500" />
                            {b.address || "غير محدد"}
                          </p>

                          {expandedCards[b.id] && (
                            <div className="space-y-3 mb-4">
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
                            </div>
                          )}

                          {editingCards[b.id] && (
                            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="space-y-3">
                                <InputField
                                  label="اسم العمارة"
                                  value={editData[b.id]?.name || ''}
                                  onChange={(value) => setEditData(prev => ({
                                    ...prev,
                                    [b.id]: { ...prev[b.id], name: value }
                                  }))}
                                />
                                <InputField
                                  label="العنوان"
                                  value={editData[b.id]?.address || ''}
                                  onChange={(value) => setEditData(prev => ({
                                    ...prev,
                                    [b.id]: { ...prev[b.id], address: value }
                                  }))}
                                />
                                <InputField
                                  label="عدد الأدوار"
                                  type="number"
                                  value={editData[b.id]?.total_floors || ''}
                                  onChange={(value) => setEditData(prev => ({
                                    ...prev,
                                    [b.id]: { ...prev[b.id], total_floors: value }
                                  }))}
                                />
                                <InputField
                                  label="عدد الوحدات"
                                  type="number"
                                  value={editData[b.id]?.total_units || ''}
                                  onChange={(value) => setEditData(prev => ({
                                    ...prev,
                                    [b.id]: { ...prev[b.id], total_units: value }
                                  }))}
                                />
                                <div className="flex gap-2 mt-4">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSave(b.id)}
                                    disabled={saving[b.id]}
                                    className="flex items-center gap-2"
                                  >
                                    {saving[b.id] ? <Spinner size="sm" /> : <FaSave />}
                                    حفظ
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleCancelEdit(b.id)}
                                    disabled={saving[b.id]}
                                    className="flex items-center gap-2"
                                  >
                                    <FaTimes />
                                    إلغاء
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-center mt-auto">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => navigate(`/buildings/${b.id}/requests`)}
                                className="flex items-center justify-center gap-1 px-4"
                              >
                                <FaClipboardList className="text-xs" />
                                طلبات السكان
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleViewPackages(b)}
                                className="flex items-center justify-center gap-1 px-4 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                              >
                                <FaLayerGroup className="text-xs" />
                                {b.packages_count || 0} باقات
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaStar className="text-2xl text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">إجراءات سريعة</h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <FaEdit className="text-lg" />
                  تعديل البيانات
                </button>

                {profile?.roles?.includes('technician') ? (
                  <button
                    onClick={() => navigate("/maintenance/technician")}
                    className="w-full p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                    <FaTools className="text-lg" />
                    إدارة طلبات الصيانة
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/profile/invoices")}
                    className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                    <FaFileInvoice className="text-lg" />
                    سجل الفواتير
                  </button>
                )}

                <button
                  onClick={() => navigate("/payments/wallet")}
                  className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <FaCoins className="text-lg" />
                  المحفظة والمعاملات
                </button>
              </div>
            </Card>

            {/* Account Status */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl border-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-200 rounded-full">
                  <FaCheckCircle className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">حالة الحساب</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الحالة:</span>
                  <span className="font-bold text-green-600">نشط</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">آخر دخول:</span>
                  <span className="font-bold">{new Date().toLocaleDateString("ar-EG")}</span>
                </div>

              </div>
            </Card>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ProfilePage;
