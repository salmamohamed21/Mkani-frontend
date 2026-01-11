import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  getResidentProfileData,
  getUnionHeadProfileData,
  searchByPhoneNumber,
  addResidentApartment,
} from "../../api/auth";
import { getWallet, payRent } from "../../api/payments";
import { getMyBuildings, updateBuilding, getPublicBuildingNames, getAvailableUnits, updateApartment } from "../../api/buildings";
import { createRentalListing, getRentalListings } from "../../api/rentals.jsx";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import LoadingPage from "../../components/ui/LoadingPage";
import InputField from "../../components/forms/InputField";
import Modal from "../../components/ui/Modal";
import EditApartmentForm from '../../components/forms/EditApartmentForm';
import BuildingLocationPicker from "../../components/register/BuildingLocationPicker";
import {
  FaUser, FaEnvelope, FaPhone, FaIdCard, FaEdit, FaFileInvoice, FaStar,
  FaCheckCircle, FaCrown, FaBuilding, FaUsers, FaTools, FaCoins, FaMapMarker,
  FaLayerGroup, FaHome, FaClipboardList, FaChevronDown, FaChevronUp, FaSave,
  FaTimes, FaPlus, FaUserTie, FaCalendarAlt, FaMoneyBillWave, FaTh, FaClock, FaCheck, FaMapMarkerAlt, FaListAlt,
} from "react-icons/fa";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Profile and Data State
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [residentApartments, setResidentApartments] = useState([]);
  const [unionHeadData, setUnionHeadData] = useState(null);
  const [availableRentals, setAvailableRentals] = useState([]);

  // UI State
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [editingCards, setEditingCards] = useState({});
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState({});
  const [isAddApartmentModalOpen, setIsAddApartmentModalOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [selectedApartmentForRental, setSelectedApartmentForRental] = useState(null);
  const [isOtherFeaturesOpen, setIsOtherFeaturesOpen] = useState(false);
  const [isPayRentModalOpen, setIsPayRentModalOpen] = useState(false);
  const [selectedApartmentForPayment, setSelectedApartmentForPayment] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [rentAmount, setRentAmount] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [isEditApartmentModalOpen, setIsEditApartmentModalOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [editApartmentSubmitting, setEditApartmentSubmitting] = useState(false);


  // Add Apartment Form State
  const [publicBuildings, setPublicBuildings] = useState([]);
  const [extra, setExtra] = useState({
    building: "",
    is_other: false,
    manual_building_name: "",
    manual_address: "",
    floor_number: "",
    apartment_number: "",
    area: "",
    rooms_count: "",
    useSameAddressAsUnionHead: false,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [rentalForm, setRentalForm] = useState({ daily_price: "", monthly_price: "", yearly_price: "", description: "" });
  const [rentalSubmitting, setRentalSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await getProfile();
        setProfile(profileResponse.data);
        const userRoles = profileResponse.data?.roles || [];

        const fetchWalletData = getWallet().then(res => setWallet(res.data)).catch(err => {
          console.error("❌ Failed to fetch wallet data:", err);
          setErrors(prev => ({ ...prev, wallet: "فشل في تحميل بيانات المحفظة" }));
        });

        const dataPromises = [
          fetchWalletData,
          getRentalListings().then(res => setAvailableRentals(res)).catch(err => {
            console.error("❌ Failed to fetch rental listings:", err);
            setErrors(prev => ({ ...prev, rentalListings: "فشل في تحميل إعلانات الإيجار" }));
          })
        ];

        if (userRoles.includes('resident')) {
          dataPromises.push(
            getResidentProfileData().then(res => setResidentApartments(res.data)).catch(err => {
              console.error("❌ Failed to fetch resident profile data:", err);
              setErrors(prev => ({ ...prev, residentData: "فشل في تحميل بيانات السكن" }));
            })
          );
          dataPromises.push(
            getPublicBuildingNames().then(data => setPublicBuildings(data || [])).catch(err => {
              console.error('Error fetching public buildings:', err);
            })
          );
        }

        if (userRoles.includes('union_head')) {
          dataPromises.push(
            getUnionHeadProfileData().then(res => setUnionHeadData(res.data)).catch(err => {
              console.error("❌ Failed to fetch union head profile data:", err);
              setErrors(prev => ({ ...prev, unionHeadData: "فشل في تحميل بيانات رئيس الاتحاد" }));
            })
          );
        }

        await Promise.all(dataPromises);

      } catch (error) {
        console.error("❌ Failed to fetch profile data:", error);
        setErrors(prev => ({ ...prev, profile: "فشل في تحميل بيانات الملف الشخصي" }));
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const getRoleIcon = (role) => {
    // Simplified role mapping
    const roleName = String(role).replace(/\\['\\]/g, '');
    switch (roleName) {
      case 'union_head': return <FaCrown className="text-yellow-500" />;
      case 'resident': return <FaUsers className="text-green-500" />;
      default: return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleLabel = (role) => {
    const roleName = String(role).replace(/\\['\\]/g, '');
    switch (roleName) {
      case 'union_head': return 'رئيس الاتحاد';
      case 'resident': return 'ساكن';
      default: return roleName;
    }
  };

  // --- Building Card Handlers ---
  const toggleExpand = (buildingId) => setExpandedCards(prev => ({ ...prev, [buildingId]: !prev[buildingId] }));
  const handleEdit = (buildingId, building) => {
    setEditingCards({ ...editingCards, [buildingId]: true });
    setEditData({ ...editData, [buildingId]: { name: building.name, address: building.address, total_floors: building.total_floors, total_units: building.total_units } });
  };
  const handleCancelEdit = (buildingId) => {
    setEditingCards({ ...editingCards, [buildingId]: false });
    setEditData({ ...editData, [buildingId]: undefined });
  };
  const handleSave = async (buildingId) => {
    setSaving({ ...saving, [buildingId]: true });
    try {
      const updatedBuilding = await updateBuilding(buildingId, editData[buildingId]);
      setBuildings(prev => prev.map(b => b.id === buildingId ? updatedBuilding : b));
      handleCancelEdit(buildingId);
    } catch (error) {
      console.error('Error updating building:', error);
    } finally {
      setSaving({ ...saving, [buildingId]: false });
    }
  };
  const handleViewPackages = (building) => navigate('/packages', { state: { selectedBuilding: building.id } });

  // --- Add Apartment Form Handlers ---
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExtra(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === 'building' && { is_other: value === 'other' })
    }));
  };

  const handleFormFileChange = (e) => {
    const { name, files } = e.target;
    setExtra(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleAddApartmentSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    const formData = new FormData();
    const dataToSubmit = { ...extra, resident_type: 'owner' };

    delete dataToSubmit.unit; // unit is for tenants

    Object.keys(dataToSubmit).forEach(key => {
        if (dataToSubmit[key] !== null && dataToSubmit[key] !== undefined) {
            formData.append(key, dataToSubmit[key]);
        }
    });
    formData.append('user', profile.id);

    try {
        const newApartment = await addResidentApartment(formData);
        setResidentApartments(prev => [...prev, newApartment]);
        setIsAddApartmentModalOpen(false);
        setExtra({ building: "", is_other: false, manual_building_name: "", manual_address: "", floor_number: "", apartment_number: "", area: "", rooms_count: "" });
    } catch (error) {
        console.error("Failed to add apartment", error);
        setErrors(prev => ({ ...prev, form: error.response?.data?.message || "فشل في إضافة الشقة" }));
    } finally {
        setFormSubmitting(false);
    }
  };

  // --- Edit Apartment Handlers ---
  const handleOpenEditModal = (apartment) => {
    setEditingApartment(apartment);
    setIsEditApartmentModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingApartment(null);
    setIsEditApartmentModalOpen(false);
  };

  const handleUpdateApartment = async (updatedData) => {
    if (!editingApartment) return;
    setEditApartmentSubmitting(true);
    try {
      const updatedUnit = await updateApartment(editingApartment.unit, updatedData);
      
      // Update the state
      setResidentApartments(prev => prev.map(apt => 
        apt.unit === editingApartment.unit 
          ? { ...apt, unit_details: { ...apt.unit_details, ...updatedUnit } } 
          : apt
      ));

      handleCloseEditModal();
      alert("تم تحديث بيانات الشقة بنجاح!");

    } catch (error) {
      console.error("Failed to update apartment:", error);
      alert(error.response?.data?.message || "فشل في تحديث بيانات الشقة.");
    } finally {
      setEditApartmentSubmitting(false);
    }
  };

const handleOpenPayRentModal = async (apt) => {
    setSelectedApartmentForPayment(apt);
    setRentAmount(apt.rental_value);
    try {
      const owner = await searchByPhoneNumber(apt.owner_phone_number);
      setOwnerDetails(owner);
      setIsPayRentModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch owner details", error);
      if (error.response && error.response.status === 404) {
        alert("لا يمكن العثور على بيانات المالك. قد يكون قد تم حذف الحساب.");
      } else {
        alert("حدث خطأ أثناء تحميل بيانات المالك.");
      }
      setErrors(prev => ({ ...prev, payRent: "فشل في تحميل بيانات المالك" }));
    }
  };

  const handlePayRentSubmit = async (e) => {
    e.preventDefault();
    setPaymentSubmitting(true);
    try {
      await payRent({
        landlord_id: ownerDetails.id,
        amount: rentAmount,
        apartment_id: selectedApartmentForPayment.id
      });
      alert("تم دفع الإيجار بنجاح!");
      setIsPayRentModalOpen(false);
      setOwnerDetails(null);
      setSelectedApartmentForPayment(null);
      // Optionally, refresh wallet data
      getWallet().then(res => setWallet(res.data));
    } catch (error) {
      console.error("Failed to pay rent", error);
      alert(error.response?.data?.message || "فشل في إتمام عملية الدفع");
    } finally {
      setPaymentSubmitting(false);
    }
  };


  if (loading) return <LoadingPage />;

  const renderPayRentModal = () => (
    <Modal isOpen={isPayRentModalOpen} onClose={() => setIsPayRentModalOpen(false)} title="تأكيد دفع الإيجار" maxWidth="max-w-2xl">
      <form onSubmit={handlePayRentSubmit} className="space-y-6" dir="rtl">
        {/* Owner Details */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border-2 border-blue-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaUserTie className="text-blue-600 text-2xl" />
            بيانات المالك
          </h3>
          {ownerDetails ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl border border-blue-200">
                <FaUser className="text-2xl text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">الاسم الكامل</p>
                  <p className="font-bold text-gray-800 text-lg">{ownerDetails.full_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl border border-blue-200">
                <FaPhone className="text-2xl text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">رقم الهاتف</p>
                  <p className="font-bold text-gray-800 text-lg">{ownerDetails.phone_number}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">جاري تحميل بيانات المالك...</div>
          )}
        </div>

        {/* Payment Details */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border-2 border-green-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaMoneyBillWave className="text-green-600 text-2xl" />
            تفاصيل الدفع
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <FaBuilding className="text-green-600" />
                <span className="text-gray-700">شقة رقم <strong>{selectedApartmentForPayment?.unit_details?.apartment_number || selectedApartmentForPayment?.apartment_number}</strong> بعمارة</span>
                <span className="font-semibold">{selectedApartmentForPayment?.building_name}</span>
              </div>
            </div>
            <div>
              <label className="block mb-3 font-bold text-right flex items-center gap-2 text-gray-700 text-lg">
                <FaCoins className="text-yellow-500" /> مبلغ الإيجار
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="rent_amount"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                  placeholder="أدخل مبلغ الإيجار"
                  required
                  className="w-full p-4 pr-12 border-2 border-green-300 rounded-xl text-right focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-2xl font-bold bg-white shadow-md"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-lg">جنيه</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-6 pt-6 border-t-2 border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsPayRentModalOpen(false)}
            className="px-8 py-3 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
          >
            <FaTimes /> إلغاء
          </Button>
          <Button
            type="submit"
            disabled={paymentSubmitting}
            className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            {paymentSubmitting ? (
              <>
                <FaClock className="animate-spin" /> جاري الدفع...
              </>
            ) : (
              <>
                <FaCheck /> تأكيد الدفع
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );


  if (loading) return <LoadingPage />;

  const renderAddApartmentModal = () => (
    <Modal isOpen={isAddApartmentModalOpen} onClose={() => setIsAddApartmentModalOpen(false)} title="إضافة شقة جديدة" maxWidth="max-w-4xl">
      <div className="max-h-96 overflow-y-auto">
        <form onSubmit={handleAddApartmentSubmit} className="space-y-6" dir="rtl">
        <div className="p-4 bg-blue-50 border-r-4 border-blue-500 mb-6">
            <h3 className="font-bold text-blue-800">إضافة شقة تمليك</h3>
            <p className="text-sm text-gray-600">
                هذه الواجهة مخصصة لإضافة شقة تملكها. إذا كنت ترغب في استئجار شقة، يمكنك تصفح الشقق المتاحة للإيجار من <a href="/" className="text-blue-600 font-semibold hover:underline">الصفحة الرئيسية</a>.
            </p>
        </div>

        {!extra.useSameAddressAsUnionHead && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
                <FaBuilding className="text-blue-600" /> اختر العمارة
                </label>
                <div className="flex items-center gap-2">
                    <select name="building" value={extra.building} onChange={handleFormChange} required className="flex-grow p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors">
                        <option value="">اختر العمارة</option>
                        {publicBuildings.map(building => (
                            <option key={building.id} value={building.id}>{building.name}, {building.address}</option>
                        ))}
                        <option value="other">أخرى</option>
                    </select>
                </div>
                {extra.building === 'other' && (
                <div className="mt-4 space-y-4">
                    <div>
                    <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
                        <FaBuilding className="text-blue-600" /> اسم العمارة
                    </label>
                    <input type="text" name="manual_building_name" placeholder="اسم العمارة" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={extra.manual_building_name} onChange={handleFormChange} required />
                    </div>
                    <div>
                    <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
                        <FaMapMarkerAlt className="text-blue-600" /> العنوان
                    </label>
                    <BuildingLocationPicker
                        onLocationSelect={(locationData) => {
                        setExtra((prev) => ({
                            ...prev,
                            manual_address: locationData.address,
                        }));
                        }}
                        initialAddress={extra.manual_address}
                    />
                    </div>
                </div>
                )}
            </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
                    <FaLayerGroup className="text-blue-600" /> رقم الدور
                </label>
                <input type="number" name="floor_number" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={extra.floor_number} onChange={handleFormChange} required />
            </div>

            <div>
                <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
                    <FaBuilding className="text-blue-600" /> رقم الشقة
                </label>
                <input type="number" name="apartment_number" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={extra.apartment_number} onChange={handleFormChange} required />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
            <FaHome className="text-blue-600" /> مساحة الشقة (متر مربع)
            </label>
            <input type="number" name="area" step="0.01" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={extra.area} onChange={handleFormChange} required />
        </div>

        <div>
            <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
            <FaTh className="text-blue-600" /> عدد الغرف
            </label>
            <input type="number" name="rooms_count" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={extra.rooms_count} onChange={handleFormChange} required />
        </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsAddApartmentModalOpen(false)}>إلغاء</Button>
            <Button type="submit" disabled={formSubmitting}>
                {formSubmitting ? "جاري الحفظ..." : "حفظ الشقة"}
            </Button>
        </div>
      </form>
    </div>
  </Modal>
  );

  const renderRentalModal = () => (
    <Modal isOpen={isRentalModalOpen} onClose={() => setIsRentalModalOpen(false)} title="عرض الشقة للإيجار" maxWidth="max-w-3xl">
      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-6" dir="rtl">
          {/* Owner Details */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaUser className="text-blue-600" /> بيانات المالك
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FaUser className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">الاسم الكامل</p>
                  <p className="font-semibold">{profile?.full_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">رقم الهاتف</p>
                  <p className="font-semibold">{profile?.phone_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <FaIdCard className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">الرقم القومي</p>
                  <p className="font-semibold">{profile?.national_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Apartment Details */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaHome className="text-green-600" /> بيانات الشقة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FaBuilding className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">اسم العمارة</p>
                  <p className="font-semibold">{selectedApartmentForRental?.building_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarker className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">العنوان</p>
                  <p className="font-semibold">{selectedApartmentForRental?.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaLayerGroup className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">رقم الدور</p>
                  <p className="font-semibold">{selectedApartmentForRental?.unit_details?.floor_number || selectedApartmentForRental?.floor_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaHome className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">رقم الشقة</p>
                  <p className="font-semibold">{selectedApartmentForRental?.unit_details?.apartment_number || selectedApartmentForRental?.apartment_number}</p>
                </div>
              </div>
              {selectedApartmentForRental?.unit_details?.area && (
                <div className="flex items-center gap-3">
                  <FaHome className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">المساحة</p>
                    <p className="font-semibold">{selectedApartmentForRental.unit_details.area} م²</p>
                  </div>
                </div>
              )}
              {selectedApartmentForRental?.unit_details?.rooms_count && (
                <div className="flex items-center gap-3">
                  <FaTh className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">عدد الغرف</p>
                    <p className="font-semibold">{selectedApartmentForRental.unit_details.rooms_count}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rental Form */}
          <form onSubmit={async (e) => {
            e.preventDefault();
            setRentalSubmitting(true);
            try {
              const rentalData = {
                unit: selectedApartmentForRental.unit,
                building: selectedApartmentForRental.building,
                daily_price: rentalForm.daily_price || null,
                monthly_price: rentalForm.monthly_price || null,
                yearly_price: rentalForm.yearly_price || null,
                comment: rentalForm.description || "",
              };

              await createRentalListing(rentalData);
              alert("تم عرض الشقة للإيجار بنجاح!");
              setIsRentalModalOpen(false);
              setRentalForm({ daily_price: "", monthly_price: "", yearly_price: "", description: "" });
              setSelectedApartmentForRental(null);
            } catch (error) {
              console.error("Error listing apartment for rent:", error);
              const errorMessage = error.response?.data?.message || error.response?.data?.detail || "حدث خطأ أثناء عرض الشقة للإيجار";
              alert(errorMessage);
            } finally {
              setRentalSubmitting(false);
            }
          }} className="space-y-8">
            {/* Pricing Section */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaMoneyBillWave className="text-green-600 text-2xl" />
                أسعار الإيجار
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block mb-4 font-bold text-right flex items-center justify-end gap-3 text-gray-700 bg-gradient-to-l from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                    <span className="text-lg">السعر اليومي</span>
                    <FaClock className="text-blue-600 text-xl" />
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="daily_price"
                      placeholder="مثال: 500"
                      className="w-full p-4 border-2 border-blue-200 rounded-xl text-right focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg font-semibold bg-white shadow-md"
                      value={rentalForm.daily_price}
                      onChange={(e) => setRentalForm(prev => ({ ...prev, daily_price: e.target.value }))}
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">جنيه</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">اختياري - للإيجار اليومي</p>
                </div>

                <div className="group">
                  <label className="block mb-4 font-bold text-right flex items-center justify-end gap-3 text-gray-700 bg-gradient-to-l from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                    <span className="text-lg">السعر الشهري</span>
                    <FaCalendarAlt className="text-green-600 text-xl" />
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="monthly_price"
                      placeholder="مثال: 15000"
                      className="w-full p-4 border-2 border-green-200 rounded-xl text-right focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-lg font-semibold bg-white shadow-md"
                      value={rentalForm.monthly_price}
                      onChange={(e) => setRentalForm(prev => ({ ...prev, monthly_price: e.target.value }))}
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">جنيه</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">اختياري - للإيجار الشهري</p>
                </div>

                <div className="group">
                  <label className="block mb-4 font-bold text-right flex items-center justify-end gap-3 text-gray-700 bg-gradient-to-l from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                    <span className="text-lg">السعر السنوي</span>
                    <FaCalendarAlt className="text-purple-600 text-xl" />
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="yearly_price"
                      placeholder="مثال: 180000"
                      className="w-full p-4 border-2 border-purple-200 rounded-xl text-right focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg font-semibold bg-white shadow-md"
                      value={rentalForm.yearly_price}
                      onChange={(e) => setRentalForm(prev => ({ ...prev, yearly_price: e.target.value }))}
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">جنيه</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">اختياري - للإيجار السنوي</p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 shadow-lg">
              <label className="block mb-4 font-bold text-right flex items-center justify-end gap-3 text-gray-700">
                <span className="text-lg">وصف إضافي</span>
                <FaClipboardList className="text-orange-600 text-xl" />
              </label>
              <textarea
                name="description"
                placeholder="أضف أي تفاصيل إضافية عن الشقة، المرافق، القرب من وسائل النقل، إلخ..."
                className="w-full p-4 border-2 border-orange-200 rounded-xl text-right focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 text-base bg-white shadow-md resize-none"
                rows="4"
                value={rentalForm.description}
                onChange={(e) => setRentalForm(prev => ({ ...prev, description: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-2 text-right">اختياري - ساعد المستأجرين في اتخاذ قرار أفضل</p>
            </div>

            {/* Submit Section */}
            <div className="flex justify-center gap-6 pt-6 border-t-2 border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsRentalModalOpen(false)}
                className="px-8 py-3 text-lg font-semibold hover:bg-gray-100 transition-all duration-300"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={rentalSubmitting}
                className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {rentalSubmitting ? (
                  <span className="flex items-center gap-2">
                    <FaClock className="animate-spin" />
                    جاري الحفظ...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FaHome className="text-xl" />
                    عرض للإيجار
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );

  const renderEditApartmentModal = () => (
    <Modal isOpen={isEditApartmentModalOpen} onClose={handleCloseEditModal} title="تعديل بيانات الشقة" maxWidth="max-w-4xl">
      <EditApartmentForm
        apartment={editingApartment}
        onSave={handleUpdateApartment}
        onCancel={handleCloseEditModal}
        submitting={editApartmentSubmitting}
      />
    </Modal>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-gray-600 text-white shadow-2xl border-0 rounded-bl-3xl rounded-tr-3xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                  <FaUser className="text-4xl text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                  <FaCheckCircle className="text-white text-sm" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-right">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile?.full_name}</h1>
                <p className="text-xl opacity-90 mb-2">{profile?.email}</p>
                <div className="flex flex-wrap justify-center md:justify-end gap-2 mb-4">
                  {[...new Set(profile?.roles)]?.map((role, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {getRoleIcon(role)}
                      <span className="font-medium text-sm">{getRoleLabel(role)}</span>
                    </div>
                  ))}
                </div>
              </div>
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
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaUser className="text-2xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">المعلومات الشخصية</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3"><FaUser className="text-blue-600 text-lg" /><label className="text-sm font-semibold text-gray-700">الاسم الكامل</label></div>
                  <p className="text-lg font-bold text-gray-800">{profile?.full_name}</p>
                </div>
                <div className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3"><FaEnvelope className="text-green-600 text-lg" /><label className="text-sm font-semibold text-gray-700">البريد الإلكتروني</label></div>
                  <p className="text-lg font-bold text-gray-800">{profile?.email}</p>
                </div>
                <div className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3"><FaPhone className="text-purple-600 text-lg" /><label className="text-sm font-semibold text-gray-700">رقم الهاتف</label></div>
                  <p className="text-lg font-bold text-gray-800">{profile?.phone_number || "غير محدد"}</p>
                </div>
                <div className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3"><FaIdCard className="text-orange-600 text-lg" /><label className="text-sm font-semibold text-gray-700">الرقم القومى</label></div>
                  <p className="text-lg font-bold text-gray-800">{profile?.national_id || "غير محدد"}</p>
                </div>
              </div>
            </Card>

            {/* Apartments Section for Resident */}
            {profile?.roles?.includes('resident') && (
              <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-full"><FaHome className="text-2xl text-green-600" /></div>
                    <h3 className="text-xl font-bold text-gray-800">شققك السكنية</h3>
                  </div>
                  <Button onClick={() => setIsAddApartmentModalOpen(true)} className="flex items-center gap-2"><FaPlus /> إضافة شقة</Button>
                </div>
                {residentApartments.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {residentApartments.map((apt, index) => (
                      <Card key={index} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            {/* Left side: Icon, Name, Address */}
                            <div className="flex-shrink-0 w-full md:w-48 text-center md:text-right">
                                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                                    <div className="p-3 bg-green-500 rounded-full">
                                        <FaHome className="text-white text-2xl" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-800">{apt.building_name}</h4>
                                </div>
                                <p className="text-sm text-gray-600 flex items-center justify-center md:justify-start gap-1">
                                    <FaMapMarker className="text-red-500" />
                                    <span>{apt.address}</span>
                                </p>
                            </div>

                            {/* Right side: Details, Badges, Actions */}
                            <div className="flex-grow w-full">
                                {/* Badges */}
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      apt.resident_type === 'owner' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                    }`}>
                                      {apt.resident_type === 'owner' ? 'مالك' : 'مستأجر'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      apt.status === 'active' ? 'bg-green-100 text-green-800' :
                                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      apt.status === 'accepted' ? 'bg-blue-100 text-blue-400' :
                                      apt.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {apt.status === 'active' ? 'نشط' :
                                      apt.status === 'pending' ? 'معلق' :
                                      apt.status === 'accepted' ? 'معتمد' :
                                      apt.status === 'rejected' ? 'مرفوض' : apt.status}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      apt.unit_details?.status === 'available' ? 'bg-green-100 text-green-800' :
                                      apt.unit_details?.status === 'occupied' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {apt.unit_details?.status === 'available' ? 'متاحة' :
                                      apt.unit_details?.status === 'occupied' ? 'مشغولة' : 'غير محدد'}
                                    </span>
                                    <span className="flex-grow">
                                    {/* Action Buttons */}
                                {apt.resident_type === 'owner' && (
                                    <div className="flex items-center justify-end gap-4 ">
                                        <Button
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                            onClick={() => {
                                                setSelectedApartmentForRental(apt);
                                                setIsRentalModalOpen(true);
                                            }}
                                        >
                                            <FaHome className="text-xs" /> عرض للإيجار
                                        </Button>
                                        <Button size="sm" onClick={() => handleOpenEditModal(apt)} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                                            <FaEdit className="text-xs" /> تعديل
                                        </Button>
                                    </div>
                                )} 
                                </span>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 border-b border-t border-gray-200 py-4">
                                    <div className="flex items-center gap-2">
                                        <FaLayerGroup className="text-green-600" />
                                        <span className="text-sm text-gray-700">الدور: <strong>{apt.unit_details?.floor_number || apt.floor_number}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaBuilding className="text-blue-600" />
                                        <span className="text-sm text-gray-700">شقة: <strong>{apt.unit_details?.apartment_number || apt.apartment_number}</strong></span>
                                    </div>
                                    {apt.unit_details?.area && (
                                        <div className="flex items-center gap-2">
                                        <FaHome className="text-purple-600" />
                                        <span className="text-sm text-gray-700">المساحة: <strong>{apt.unit_details.area} م²</strong></span>
                                        </div>
                                    )}
                                    {apt.unit_details?.rooms_count && (
                                        <div className="flex items-center gap-2">
                                        <FaTh className="text-indigo-600" />
                                        <span className="text-sm text-gray-700">الغرف: <strong>{apt.unit_details.rooms_count}</strong></span>
                                        </div>
                                    )}
                                </div>

                                {/* Rental Details */}
                                                                     {apt.resident_type === 'tenant' && apt.rental_value && (
                                                                    <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <FaMoneyBillWave className="text-orange-600" />
                                                                        <span className="text-sm font-semibold text-gray-700">تفاصيل الإيجار</span>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                                                        <span>القيمة: <strong>{apt.rental_value} جنيه</strong></span>
                                                                        <span>من: <strong>{new Date(apt.rental_start_date).toLocaleDateString('ar-EG')}</strong></span>
                                                                        <span>إلى: <strong>{new Date(apt.rental_end_date).toLocaleDateString('ar-EG')}</strong></span>
                                                                    </div>
                                                                    <Button
                                                                      size="sm"
                                                                      className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                                                                      onClick={() => handleOpenPayRentModal(apt)}
                                                                    >
                                                                      <FaMoneyBillWave className="text-xs" /> دفع الايجار
                                                                    </Button>
                                                                    </div>
                                                                )}                                
                                
                            </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : <p className="text-center text-gray-500">لم تقم بإضافة أي شقق بعد.</p>}
              </Card>
            )}

            {/* Buildings Section for Union Head */}
            {profile?.roles?.includes('union_head') && (
              <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-full"><FaBuilding className="text-2xl text-blue-600" /></div>
                      <h3 className="text-xl font-bold text-gray-800">العمارات الخاصة بك</h3>
                    </div>
                    <Button size="sm" onClick={() => navigate('/buildings/add')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700"><FaBuilding className="text-sm" /> إضافة عمارة</Button>
                  </div>
                  {(!unionHeadData?.buildings || unionHeadData.buildings.length === 0) ? (
                    <div className="text-center py-8"><FaBuilding className="text-4xl text-gray-300 mx-auto mb-4" /><p className="text-gray-500">لا توجد عمارات بعد.</p></div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {unionHeadData.buildings.map((b) => (
                        <Card key={b.id} className="h-full">
                           <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center gap-2"><FaBuilding className="text-xl text-blue-600" /><h4 className="text-lg font-semibold text-gray-800">{b.name}</h4></div>
                             <div className="flex gap-2">
                               <button onClick={() => toggleExpand(b.id)} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">{expandedCards[b.id] ? <FaChevronUp /> : <FaChevronDown />}</button>
                               <button onClick={() => handleEdit(b.id, b)} className="p-2 text-gray-500 hover:text-blue-600 transition-colors"><FaEdit /></button>
                             </div>
                           </div>
                           <p className="text-sm text-gray-600 mb-4 flex items-center gap-2"><FaMapMarker className="text-red-500" />{b.address || "غير محدد"}</p>
                           {expandedCards[b.id] && (
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><FaLayerGroup className="text-lg text-green-500" /><span className="text-gray-700 font-medium">عدد الأدوار:</span><span className="text-gray-600">{b.total_floors || "غير محدد"}</span></div>
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><FaHome className="text-lg text-purple-500" /><span className="text-gray-700 font-medium">عدد الوحدات:</span><span className="text-gray-600">{b.total_units || "غير محدد"}</span></div>
                            </div>
                           )}
                          {editingCards[b.id] && (
                            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                               <div className="space-y-3">
                                <InputField label="اسم العمارة" value={editData[b.id]?.name || ''} onChange={(value) => setEditData(prev => ({...prev, [b.id]: { ...prev[b.id], name: value }}))} />
                                <InputField label="العنوان" value={editData[b.id]?.address || ''} onChange={(value) => setEditData(prev => ({...prev, [b.id]: { ...prev[b.id], address: value }}))} />
                                <InputField label="عدد الأدوار" type="number" value={editData[b.id]?.total_floors || ''} onChange={(value) => setEditData(prev => ({...prev, [b.id]: { ...prev[b.id], total_floors: value }}))} />
                                <InputField label="عدد الوحدات" type="number" value={editData[b.id]?.total_units || ''} onChange={(value) => setEditData(prev => ({...prev, [b.id]: { ...prev[b.id], total_units: value }}))} />
                                 <div className="flex gap-2 mt-4">
                                   <Button size="sm" onClick={() => handleSave(b.id)} disabled={saving[b.id]} className="flex items-center gap-2">{saving[b.id] ? <Spinner size="sm" /> : <FaSave />} حفظ</Button>
                                   <Button size="sm" variant="secondary" onClick={() => handleCancelEdit(b.id)} disabled={saving[b.id]} className="flex items-center gap-2"><FaTimes /> إلغاء</Button>
                                 </div>
                               </div>
                             </div>
                           )}
                           <div className="flex justify-center mt-auto">
                             <div className="flex gap-2">
                               <Button size="sm" variant="secondary" onClick={() => navigate(`/buildings/${b.id}/requests`)} className="flex items-center justify-center gap-1 px-4"><FaClipboardList className="text-xs" /> طلبات السكان</Button>
                               <Button size="sm" variant="secondary" onClick={() => handleViewPackages(b)} className="flex items-center justify-center gap-1 px-4 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"><FaLayerGroup className="text-xs" /> {b.packages?.length || 0} باقات</Button>
                             </div>
                           </div>
                        </Card>
                      ))}
                    </div>
                  )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-purple-100 rounded-full"><FaStar className="text-2xl text-purple-600" /></div><h3 className="text-xl font-bold text-gray-800">إجراءات سريعة</h3></div>
              <div className="space-y-3">
                <button onClick={() => navigate("/profile/edit")} className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3"><FaEdit className="text-lg" /> تعديل البيانات</button>
                {profile?.roles?.includes('technician') ? (
                  <button onClick={() => navigate("/maintenance/technician")} className="w-full p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3"><FaTools className="text-lg" /> إدارة طلبات الصيانة</button>
                ) : (
                  <button onClick={() => navigate("/profile/invoices")} className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3"><FaFileInvoice className="text-lg" /> سجل الفواتير</button>
                )}
                <button onClick={() => navigate("/payments/wallet")} className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3"><FaCoins className="text-lg" /> المحفظة والمعاملات</button>
                <div>
                  <button 
                      onClick={() => setIsOtherFeaturesOpen(!isOtherFeaturesOpen)} 
                      className="w-full p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-between gap-3"
                  >
                      <div className="flex items-center gap-3">
                          <FaStar className="text-lg" /> 
                          <span>مميزات اخرى</span>
                      </div>
                      {isOtherFeaturesOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {isOtherFeaturesOpen && (
                      <div className="space-y-2 mt-2">
                          <button onClick={() => navigate("/my-rentals")} className="w-full p-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-start gap-3 border">
                              <FaListAlt className="text-blue-500" />
                              <span>اعلاناتى للايجار</span>
                          </button>
                          <button onClick={() => navigate("/maintenance")} className="w-full p-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-start gap-3 border">
                              <FaTools className="text-orange-500" />
                              <span>خدمات الصيانه</span>
                          </button>
                          {availableRentals.length > 0 && (
                            <div className="w-full p-3 bg-white text-gray-700 font-semibold rounded-lg border">
                              <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2"><FaHome className="text-blue-500" /> إعلانات إيجار متاحة</h4>
                              <div className="space-y-3">
                                {availableRentals.slice(0, 3).map((rental) => ( // Display up to 3 listings
                                  <div key={rental.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                                    <p className="font-semibold text-sm text-gray-800">{rental.building_details?.name}</p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1"><FaMapMarkerAlt /> {rental.building_details?.address}</p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1">
                                      <FaBuilding /> شقة: {rental.unit_details?.unit_number} (الدور: {rental.unit_details?.floor})
                                    </p>
                                    {rental.monthly_price && (
                                      <p className="text-sm font-bold text-green-600 flex items-center gap-1 mt-1"><FaMoneyBillWave /> {rental.monthly_price} جنيه/شهرياً</p>
                                    )}
                                  </div>
                                ))}
                                {availableRentals.length > 3 && (
                                  <button onClick={() => navigate("/rentals")} className="w-full text-center text-sm text-blue-600 hover:underline mt-2">عرض المزيد...</button>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                  )}
              </div>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl border-0">
              <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-blue-200 rounded-full"><FaCheckCircle className="text-blue-600" /></div><h3 className="text-lg font-bold text-gray-800">حالة الحساب</h3></div>
              <div className="space-y-2">
                <div className="flex justify-between items-center"><span className="text-gray-600">الحالة:</span><span className="font-bold text-green-600">نشط</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600">آخر دخول:</span><span className="font-bold">{new Date().toLocaleDateString("ar-EG")}</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {renderAddApartmentModal()}
      {renderRentalModal()}
      {renderPayRentModal()}
      {renderEditApartmentModal()}
    </div>
  );
};

export default ProfilePage;
