import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getPackages, updatePackage, getPackageTypes, deletePackage } from "../../api/packages";
import { getMyBuildings, getResidentBuilding } from "../../api/buildings.jsx";
import Spinner from "../../components/ui/Spinner";
import LoadingPage from "../../components/ui/LoadingPage";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import InputField from "../../components/forms/InputField";
import SelectField from "../../components/forms/SelectField";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import {
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaSave,
  FaTimes,
  FaLayerGroup,
  FaDollarSign,
  FaUsers,
  FaSearch,
  FaFilter,
  FaBolt,
  FaTint,
  FaGasPump,
  FaCreditCard,
  FaTools,
  FaExclamationTriangle,
  FaShieldAlt,
  FaWifi,
  FaCar,
  FaPlus,
  FaToggleOn,
  FaToggleOff,
  FaHome,
  FaEraser,
  FaTrash
} from "react-icons/fa";

// Helper function to extract amount based on package type
const getPackageAmount = (pkg) => {
  switch (pkg.package_type) {
    case 'utilities':
      return pkg.utility_details?.monthly_amount || 0;
    case 'prepaid':
      return pkg.prepaid_details?.average_monthly_charge || 0;
    case 'fixed':
      return pkg.fixed_details?.monthly_amount || 0;
    case 'misc':
      return pkg.misc_details?.total_amount || 0;
    default:
      return 0;
  }
};

const PackagesList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [editingCards, setEditingCards] = useState({});
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [packageTypes, setPackageTypes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // Fetch package types on mount
  useEffect(() => {
    const fetchPackageTypes = async () => {
      try {
        const typesResponse = await getPackageTypes();
        setPackageTypes(typesResponse.data || []);
      } catch (error) {
        console.error("Error fetching package types:", error);
      }
    };
    fetchPackageTypes();
  }, []);

  // Fetch buildings based on user
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        let buildingsData = [];
        if (user?.roles?.some(role => role.includes('resident'))) {
          const residentBuilding = await getResidentBuilding();
          buildingsData = residentBuilding ? [residentBuilding] : [];
          // Set selected building for residents
          if (residentBuilding) {
            setSelectedBuilding(residentBuilding.id.toString());
          }
        } else {
          const myBuildings = await getMyBuildings();
          buildingsData = myBuildings.data?.results || [];
        }
        setBuildings(buildingsData);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };
    if (user) {
      fetchBuildings();
    }
  }, [user]);

  // Set selected building based on buildings, location state, and user
  const selectedBuildingDeps = useMemo(() => [
    buildings,
    location.state?.selectedBuilding || null,
    user
  ], [buildings, location.state?.selectedBuilding, user]);

  useEffect(() => {
    if (location.state?.selectedBuilding) {
      setSelectedBuilding(location.state.selectedBuilding.toString());
    } else if (!user?.roles?.some(role => role.includes('resident')) && buildings.length > 0) {
      setSelectedBuilding(buildings[0].id.toString());
    }
  }, selectedBuildingDeps);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch packages based on user and selected building
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        let packagesData = [];
        const packagesResponse = await getPackages(selectedBuilding ? { building_id: selectedBuilding } : {});

        if (Array.isArray(packagesResponse.data)) {
          packagesData = packagesResponse.data;
        } else if (packagesResponse.data && packagesResponse.data.results && Array.isArray(packagesResponse.data.results)) {
          packagesData = packagesResponse.data.results;
        } else {
          console.error("Invalid data format for packages");
        }

        if (packagesData.length > 0) {
          // Map backend fields to expected frontend fields
          const mappedPackages = packagesData.map(pkg => ({
            ...pkg,
            type: pkg.package_type,
            base_amount: getPackageAmount(pkg),
            status: 'active', // Default status since not present in backend
            details: pkg.description || '',
          }));
          setPackages(mappedPackages);
        } else {
          setPackages([]);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    if (user && selectedBuilding) {
      fetchPackages();
    }
  }, [user, selectedBuilding]);

  // Memoized filtered packages
  const filteredPackages = useMemo(() => {
    let filtered = packages;

    if (debouncedSearchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        pkg.details?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(pkg => pkg.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(pkg => pkg.type === typeFilter);
    }

    return filtered;
  }, [packages, debouncedSearchTerm, statusFilter, typeFilter]);

  const getPackageIcon = (packageType) => {
    switch (packageType) {
      case 'utilities': return <FaBolt className="text-yellow-500" />;
      case 'prepaid': return <FaCreditCard className="text-blue-500" />;
      case 'fixed': return <FaTools className="text-green-500" />;
      case 'misc': return <FaExclamationTriangle className="text-red-500" />;
      default: return <FaLayerGroup className="text-gray-400" />;
    }
  };

  const toggleExpand = (packageId) => {
    setExpandedCards(prev => ({
      ...prev,
      [packageId]: !prev[packageId]
    }));
  };

  const handleEdit = (packageId, pkg) => {
    setEditingCards(prev => ({
      ...prev,
      [packageId]: true
    }));
    setEditData(prev => ({
      ...prev,
      [packageId]: {
        name: pkg.name || '',
        type: pkg.type || '',
        base_amount: pkg.base_amount || '',
        details: pkg.details || '',
      }
    }));
  };

  const handleCancelEdit = (packageId) => {
    setEditingCards(prev => ({
      ...prev,
      [packageId]: false
    }));
    setEditData(prev => ({
      ...prev,
      [packageId]: undefined
    }));
  };

  const handleSave = async (packageId) => {
    setSaving(prev => ({ ...prev, [packageId]: true }));
    try {
      const updatedPackage = await updatePackage(packageId, editData[packageId]);
      setPackages(prev => prev.map(pkg => pkg.id === packageId ? updatedPackage : pkg));
      setEditingCards(prev => ({ ...prev, [packageId]: false }));
      setEditData(prev => ({ ...prev, [packageId]: undefined }));
    } catch (error) {
      console.error('Error updating package:', error);
    } finally {
      setSaving(prev => ({ ...prev, [packageId]: false }));
    }
  };



  const handleDelete = async (pkgId) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الباقة؟")) {
      try {
        await deletePackage(pkgId);
        setPackages(packages.filter(pkg => pkg.id !== pkgId));
        addNotification("تم حذف الباقة بنجاح", "success");
      } catch (error) {
        console.error("Error deleting package:", error);
        addNotification("حدث خطأ أثناء حذف الباقة", "error");
      }
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">باقات العمارة</h2>
          <Button
            onClick={() => navigate("/packages/add")}
            className="flex items-center gap-2"
          >
            <FaPlus className="text-sm" />
            إضافة باقة
          </Button>
        </div>

        {/* Buildings Section */}
        {buildings.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <FaHome className="text-2xl text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-800">عماراتك</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">اختر العمارة لعرض الباقات الخاصة بها</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buildings.map(building => {
                const isSelected = selectedBuilding === building.id.toString();
                return (
                  <label key={building.id} className={`relative flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`} onClick={() => setSelectedBuilding(isSelected ? "" : building.id.toString())}>
                    <div className="relative">
                      <input
                        type="radio"
                        name="selectedBuilding"
                        value={building.id}
                        checked={isSelected}
                        readOnly
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 opacity-0 absolute"
                      />
                      <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className={`font-semibold transition-colors duration-200 ${
                        isSelected
                          ? 'text-blue-800'
                          : 'text-gray-800 group-hover:text-blue-700'
                      }`}>{building.name}</span>
                      {building.address && (
                        <p className={`text-sm transition-colors duration-200 ${
                          isSelected
                            ? 'text-blue-600'
                            : 'text-gray-500 group-hover:text-blue-600'
                        }`}>{building.address}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">البحث والفلترة</h3>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="flex items-center gap-2"
            >
              {filtersExpanded ? <FaChevronUp /> : <FaChevronDown />}
              {filtersExpanded ? 'إخفاء' : 'إظهار'}
            </Button>
          </div>
          {filtersExpanded && (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <InputField
                  placeholder="البحث في الباقات..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  className="pl-10"
                />
              </div>

              <SelectField
                placeholder="فلترة حسب النوع"
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  { label: "جميع الأنواع", value: "" },
                  ...packageTypes.map(type => ({
                    label: type.label,
                    value: type.value
                  }))
                ]}
              />
            </div>
          )}
          {(searchTerm || statusFilter || typeFilter) && (
            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setTypeFilter("");
                }}
                className="flex items-center gap-2"
              >
                <FaEraser className="text-sm" />
                مسح الفلاتر
              </Button>
            </div>
          )}
        </div>

        {filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <FaLayerGroup className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              {packages.length === 0 ? "لا توجد باقات حالياً." : "لا توجد باقات مطابقة للبحث."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredPackages.map((pkg) => {
              const isExpanded = expandedCards[pkg.id];
              const isEditing = editingCards[pkg.id];
              const isSaving = saving[pkg.id];

              return (
                <Card
                  key={pkg.id}
                  className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate(`/packages/${pkg.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getPackageIcon(pkg.type)}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{pkg.name}</h3>
                        <p className="text-gray-600 text-sm">
                          {pkg.type === 'utilities' ? 'المرافق' :
                           pkg.type === 'prepaid' ? 'المدفوعة مسبقاً' :
                           pkg.type === 'fixed' ? 'الثابتة' :
                           pkg.type === 'misc' ? (pkg.package_type === 'building' ? 'باقة العمارة' : pkg.package_type === 'personal' ? 'باقة شخصية' : 'متنوعة') : pkg.type}
                        </p>
                      </div>
                    </div>
                    {user?.roles?.includes('union_head') && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(pkg.id);
                          }}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          {isExpanded ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
                        </Button>
                        {isExpanded && !isEditing && (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(pkg.id, pkg);
                              }}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <FaEdit className="text-sm" />
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(pkg.id);
                              }}
                              className="p-2 hover:bg-red-100 transition-colors"
                            >
                              <FaTrash className="text-sm" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-green-500" />
                      <span className="text-gray-700 font-semibold">
                        {pkg.base_amount} ج.م / شهر
                      </span>
                    </div>

                  </div>

                  {isExpanded && (
                    <div className="space-y-3 mb-4 border-t pt-3 mt-3">
                      {isEditing ? (
                        <div className="space-y-3">
                          <InputField
                            label="اسم الباقة"
                            value={editData[pkg.id]?.name || ''}
                            onChange={(value) => setEditData(prev => ({
                              ...prev,
                              [pkg.id]: { ...prev[pkg.id], name: value }
                            }))}
                            placeholder="أدخل اسم الباقة"
                          />
                          <SelectField
                            label="النوع"
                            value={editData[pkg.id]?.type || ''}
                            onChange={(value) => setEditData(prev => ({
                              ...prev,
                              [pkg.id]: { ...prev[pkg.id], type: value }
                            }))}
                            options={[
                              { label: "المرافق", value: "utilities" },
                              { label: "المدفوعة مسبقاً", value: "prepaid" },
                              { label: "الثابتة", value: "fixed" },
                              { label: "متنوعة", value: "misc" },
                            ]}
                          />
                          <InputField
                            label="المبلغ الأساسي"
                            type="number"
                            value={editData[pkg.id]?.base_amount || ''}
                            onChange={(value) => setEditData(prev => ({
                              ...prev,
                              [pkg.id]: { ...prev[pkg.id], base_amount: value }
                            }))}
                            placeholder="أدخل المبلغ الأساسي"
                          />
                          <InputField
                            label="التفاصيل"
                            value={editData[pkg.id]?.details || ''}
                            onChange={(value) => setEditData(prev => ({
                              ...prev,
                              [pkg.id]: { ...prev[pkg.id], details: value }
                            }))}
                            placeholder="أدخل تفاصيل الباقة"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSave(pkg.id);
                              }}
                              disabled={isSaving}
                              className="flex items-center gap-1"
                            >
                              <FaSave className="text-xs" />
                              {isSaving ? 'جاري الحفظ...' : 'حفظ'}
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelEdit(pkg.id);
                              }}
                              className="flex items-center gap-1"
                            >
                              <FaTimes className="text-xs" />
                              إلغاء
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <FaDollarSign className="text-green-500" />
                            <span className="text-gray-700">المبلغ الأساسي:</span>
                            <span className="text-gray-600">{pkg.base_amount} ج.م</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FaLayerGroup className="text-purple-500" />
                            <span className="text-gray-700">التفاصيل:</span>
                            <span className="text-gray-600">{pkg.details || "غير محدد"}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}


                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesList;
