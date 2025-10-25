import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaPhone, FaIdCard, FaBirthdayCake, FaEnvelope, FaLock,
  FaHome, FaUsers, FaUserTie, FaMapMarkerAlt, FaBuilding, FaLayerGroup, FaTh,
  FaFileContract,
  FaArrowRight, FaCheck, FaStepBackward, FaStepForward,
  FaCloudUploadAlt
} from "react-icons/fa";
import { registerUserWithFiles } from "../../api/auth";
import { getPublicBuildingNames } from "../../api/buildings";
import BuildingLocationPicker from "../../components/register/BuildingLocationPicker";
import Modal from "../../components/ui/Modal";

const rolesList = [
  { value: "union_head", label: "مالك أو رئيس اتحاد", icon: <FaHome />, color: "from-orange-50 to-orange-100", borderColor: "border-orange-300", textColor: "text-orange-700" },
  { value: "resident", label: "ساكن", icon: <FaUsers />, color: "from-blue-50 to-blue-100", borderColor: "border-blue-300", textColor: "text-blue-700" },
];

const subscriptions = [
  { value: "basic", label: "شهري", price: "50 ج.م" },
  { value: "quarterly", label: "ربع سنوي", price: "100 ج.م" },
  { value: "semi_annual", label: "نصف سنوي", price: "180 ج.م" },
  { value: "annual", label: "سنوي", price: "300 ج.م" },
];

function RegisterStep1({ onNext, form, setForm }) {
  const [buildings, setBuildings] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      validatePassword(value);
    }
  };
  const handleRoleToggle = (value) => {
    setForm({
      ...form,
      roles: form.roles.includes(value)
        ? form.roles.filter((r) => r !== value)
        : [...form.roles, value],
    });
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("كلمة المرور يجب أن تكون على الأقل 8 أحرف.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("كلمة المرور يجب أن تحتوي على حرف صغير.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("كلمة المرور يجب أن تحتوي على حرف كبير.");
    }
    if (!/\d/.test(password)) {
      errors.push("كلمة المرور يجب أن تحتوي على رقم.");
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("كلمة المرور يجب أن تحتوي على رمز خاص (@$!%*?&).");
    }
    setPasswordErrors(errors);
  };

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await getPublicBuildingNames();
        setBuildings(data || []);
      } catch (error) {
        console.error('Error fetching buildings:', error);
      }
    };
    fetchBuildings();
  }, []);

  const isFormValid = form.full_name && form.phone_number && form.national_id && form.date_of_birth && form.email && form.password && form.confirm_password && passwordErrors.length === 0 && form.password === form.confirm_password && form.roles.length > 0 && agreedToTerms;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.full_name || !form.phone_number || !form.national_id || !form.date_of_birth || !form.email || !form.password) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    if (passwordErrors.length > 0) {
      alert("يرجى إصلاح أخطاء كلمة المرور");
      return;
    }
    if (form.password !== form.confirm_password) {
      alert("كلمة المرور وتأكيدها غير متطابقة");
      return;
    }
    if (form.roles.length === 0) {
      alert("اختر دور واحد على الأقل");
      return;
    }
    if (!agreedToTerms) {
      alert("يرجى الموافقة على الشروط والأحكام");
      return;
    }
    onNext();
  };

  return (
    <div>
      <form
        className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 border border-gray-200"
        dir="rtl"
        onSubmit={handleSubmit}
      >
      <h2 className="text-2xl font-bold mb-6 text-center">إنشاء حساب جديد</h2>
      <div className="space-y-4">
        {[
          { name: "full_name", type: "text", placeholder: "الاسم بالكامل", icon: <FaUser />, label: "الاسم بالكامل", autocomplete: "name" },
          { name: "phone_number", type: "tel", placeholder: "رقم الهاتف", icon: <FaPhone />, label: "رقم الهاتف", autocomplete: "tel" },
          { name: "national_id", type: "text", placeholder: "الرقم القومي", icon: <FaIdCard />, label: "الرقم القومي", autocomplete: "off" },
          { name: "date_of_birth", type: "date", placeholder: "", icon: <FaBirthdayCake />, label: "تاريخ الميلاد", autocomplete: "bday" },
          { name: "email", type: "email", placeholder: "البريد الإلكتروني", icon: <FaEnvelope />, label: "البريد الإلكتروني", autocomplete: "email" },
          { name: "password", type: "password", placeholder: "كلمة المرور", icon: <FaLock />, label: "كلمة المرور", autocomplete: "new-password" },
          { name: "confirm_password", type: "password", placeholder: "تأكيد كلمة المرور", icon: <FaLock />, label: "تأكيد كلمة المرور", autocomplete: "new-password" },
        ].map((field, idx) => (
          <div key={idx} className="flex items-center border-b flex-row-reverse">
            <label htmlFor={field.name} className="sr-only">{field.label}</label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              autoComplete={field.autocomplete}
              className="w-full p-2 outline-none text-right"
              value={form[field.name]}
              onChange={handleChange}
              required
            />
            <span className="text-cyan-900 ml-2">{field.icon}</span>
          </div>
        ))}
        {passwordErrors.length > 0 && (
          <div className="mt-2">
            <ul className="text-red-500 text-sm list-disc list-inside">
              {passwordErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-6">
        <label className="block mb-2 font-semibold text-right">
          اختر الدور (يمكن اختيار أكثر من دور):
        </label>
        <div className="flex flex-col gap-3">
          {rolesList.map((r) => (
            <button
              type="button"
              key={r.value}
              className={`flex items-center gap-2 px-4 py-2 rounded border text-right transition flex-row-reverse justify-between
                ${form.roles.includes(r.value)
                  ? "bg-cyan-100 border-cyan-600 font-bold"
                  : "bg-gray-100 border-gray-300"}`}
              onClick={() => handleRoleToggle(r.value)}
            >
              <span className="text-right flex-grow">{r.label}</span> {r.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            required
          />
          <span>أوافق على <button type="button" onClick={() => setIsModalOpen(true)} className="text-cyan-600 underline">الشروط والأحكام</button></span>
        </label>
      </div>
      <button disabled={!isFormValid} className="w-full bg-cyan-700 text-white py-2 rounded mt-8 hover:bg-cyan-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
        التالي
      </button>
    </form>
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <h2 className="text-xl font-bold mb-4">الشروط والأحكام</h2>
      <p>هنا نص الشروط والأحكام...</p>
      <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded">إغلاق</button>
    </Modal>
  </div>
  );
}

function RegisterStep2({ form, setForm, onSubmit, loading, onBack }) {
  const { roles } = form;
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [buildings, setBuildings] = useState([]);
  const [extra, setExtra] = useState({
    name: "",
    province: "", city: "", district: "", street: "",
    total_units: "", total_floors: "", units_per_floor: "",
    subscription_plan: "",

    resident_type: "owner",
    building: form.building, is_other: false, manual_building_name: "", manual_address: "",
    address: "",
    floor_number: "", apartment_number: "",

    rental_contract: null,
    rental_contract_dragOver: false,
    rental_contract_fileName: "",
  });

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await getPublicBuildingNames();
        setBuildings(data || []);
      } catch (error) {
        console.error('Error fetching buildings:', error);
      }
    };
    fetchBuildings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'building') {
      setExtra((prev) => ({ ...prev, [name]: value, is_other: value === 'other' }));
    } else {
      setExtra((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    setExtra((prev) => ({
      ...prev,
      [name]: files[0],
      ...(name === "rental_contract" && { rental_contract_fileName: files[0].name }),
      ...(name === "profile_image" && { profile_image_fileName: files[0].name }),
      ...(name === "national_id_front" && { national_id_front_fileName: files[0].name }),
      ...(name === "national_id_back" && { national_id_back_fileName: files[0].name }),
      ...(name === "selfie_with_id" && { selfie_with_id_fileName: files[0].name }),
      ...(name === "experience_certificates" && { experience_certificates_fileName: files[0].name }),
      ...(name === "criminal_record" && { criminal_record_fileName: files[0].name }),
    }));
  };

  const handleRentalDragOver = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, rental_contract_dragOver: true }));
  };

  const handleRentalDragLeave = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, rental_contract_dragOver: false }));
  };

  const handleRentalDrop = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, rental_contract_dragOver: false }));
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setExtra((prev) => ({
        ...prev,
        rental_contract: files[0],
        rental_contract_fileName: files[0].name,
      }));
    }
  };

  const handleProfileImageDragOver = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, profile_image_dragOver: true }));
  };

  const handleProfileImageDragLeave = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, profile_image_dragOver: false }));
  };

  const handleProfileImageDrop = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, profile_image_dragOver: false }));
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setExtra((prev) => ({
        ...prev,
        profile_image: files[0],
        profile_image_fileName: files[0].name,
      }));
    }
  };

  const handleNationalIdFrontDragOver = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, national_id_front_dragOver: true }));
  };

  const handleNationalIdFrontDragLeave = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, national_id_front_dragOver: false }));
  };

  const handleNationalIdFrontDrop = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, national_id_front_dragOver: false }));
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setExtra((prev) => ({
        ...prev,
        national_id_front: files[0],
        national_id_front_fileName: files[0].name,
      }));
    }
  };

  const handleNationalIdBackDragOver = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, national_id_back_dragOver: true }));
  };

  const handleNationalIdBackDragLeave = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, national_id_back_dragOver: false }));
  };

  const handleNationalIdBackDrop = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, national_id_back_dragOver: false }));
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setExtra((prev) => ({
        ...prev,
        national_id_back: files[0],
        national_id_back_fileName: files[0].name,
      }));
    }
  };

  const handleSelfieWithIdDragOver = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, selfie_with_id_dragOver: true }));
  };

  const handleSelfieWithIdDragLeave = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, selfie_with_id_dragOver: false }));
  };

  const handleSelfieWithIdDrop = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, selfie_with_id_dragOver: false }));
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setExtra((prev) => ({
        ...prev,
        selfie_with_id: files[0],
        selfie_with_id_fileName: files[0].name,
      }));
    }
  };

  const handleExperienceCertificatesDragOver = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, experience_certificates_dragOver: true }));
  };

  const handleExperienceCertificatesDragLeave = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, experience_certificates_dragOver: false }));
  };

  const handleExperienceCertificatesDrop = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, experience_certificates_dragOver: false }));
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setExtra((prev) => ({
        ...prev,
        experience_certificates: files[0],
        experience_certificates_fileName: files[0].name,
      }));
    }
  };

  const handleCriminalRecordDragOver = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, criminal_record_dragOver: true }));
  };

  const handleCriminalRecordDragLeave = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, criminal_record_dragOver: false }));
  };

  const handleCriminalRecordDrop = (e) => {
    e.preventDefault();
    setExtra((prev) => ({ ...prev, criminal_record_dragOver: false }));
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setExtra((prev) => ({
        ...prev,
        criminal_record: files[0],
        criminal_record_fileName: files[0].name,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, ...extra };

    if (!data.phone_number || !data.phone_number.trim()) {
      alert("يرجى إدخال رقم الهاتف");
      return;
    }

    if (!data.email || !data.email.trim()) {
      alert("يرجى إدخال البريد الإلكتروني");
      return;
    }

    if (!data.password || !data.password.trim()) {
      alert("يرجى إدخال كلمة المرور");
      return;
    }

    if (data.password !== data.confirm_password) {
      alert("كلمات المرور غير متطابقة");
      return;
    }

    if (currentRole === 'resident') {
      if (!extra.building) {
        alert("يرجى اختيار عمارة.");
        return;
      }
    }

    let updatedExtra = { ...extra };

    if (currentRole === 'resident') {
      updatedExtra.building_id = extra.building !== 'other' ? extra.building : null;
      delete updatedExtra.manual_building_name;
      delete updatedExtra.manual_address;
      delete updatedExtra.is_other;
    }

    if (currentRole === 'resident') {
      if (extra.building !== 'other') {
        const building = buildings.find(b => b.id === extra.building);
        if (building) {
          updatedExtra.building_name = building.name;
          updatedExtra.address = `${building.province}, ${building.city}, ${building.district}, ${building.street}`;
        }
      } else {
        updatedExtra.building_name = extra.manual_building_name;
        updatedExtra.address = extra.manual_address;
      }
    }

    if (currentRole === 'union_head') {
      updatedExtra.address = `${updatedExtra.province}, ${updatedExtra.city}, ${updatedExtra.district}, ${updatedExtra.street}`;
    }

    if (currentRole === 'resident') {
      updatedExtra.resident_type = extra.resident_type;
    }

    onSubmit({ ...form, ...updatedExtra });
  };

  const nextRole = () => {
    if (currentRoleIndex < roles.length - 1) {
      setCurrentRoleIndex(currentRoleIndex + 1);
    }
  };

  const prevRole = () => {
    if (currentRoleIndex > 0) {
      setCurrentRoleIndex(currentRoleIndex - 1);
    }
  };

  const currentRole = roles[currentRoleIndex];
  const progress = ((currentRoleIndex + 1) / roles.length) * 100;

  // Render owner form
  const renderOwnerForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
          <FaBuilding className="text-orange-600" /> اسم أو رقم العمارة
        </label>
        <input type="text" name="name" placeholder="اسم أو رقم العمارة" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-orange-400 focus:outline-none transition-colors" value={extra.name} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-orange-600" /> عنوان العقار
          </label>
          <BuildingLocationPicker
            onLocationSelect={(locationData) => {
              setExtra((prev) => ({
                ...prev,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                address: locationData.address,
                province: locationData.province || '',
                city: locationData.city || '',
                district: locationData.district || '',
                street: locationData.street || '',
              }));
            }}
            initialAddress={`${extra.province} ${extra.city} ${extra.district} ${extra.street}`.trim()}
          />
        </div>

        <div>
          <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
            <FaBuilding className="text-orange-600" /> عدد الشقق
          </label>
          <input type="number" name="total_units" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-orange-400 focus:outline-none transition-colors" value={extra.total_units} onChange={handleChange} required />
        </div>

        <div>
          <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
            <FaLayerGroup className="text-orange-600" /> عدد الأدوار
          </label>
          <input type="number" name="total_floors" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-orange-400 focus:outline-none transition-colors" value={extra.total_floors} onChange={handleChange} required />
        </div>

        <div>
          <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
            <FaTh className="text-orange-600" /> عدد الشقق في الدور الواحد
          </label>
          <input type="number" name="units_per_floor" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-orange-400 focus:outline-none transition-colors" value={extra.units_per_floor} onChange={handleChange} required />
        </div>
      </div>

      <div>
        <label className="block mb-4 font-semibold text-right text-gray-700">اختر نوع الاشتراك</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscriptions.map((sub) => (
            <label key={sub.value} className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${extra.subscription_plan === sub.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
              <input type="radio" name="subscription_plan" value={sub.value} checked={extra.subscription_plan === sub.value} onChange={handleChange} className="sr-only" />
              <div className="text-center">
                <div className="font-semibold text-gray-800">{sub.label}</div>
                <div className="text-orange-600 font-bold">{sub.price}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Render resident form
  const renderResidentForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
          <FaUserTie className="text-blue-600" /> نوع السكن
        </label>
        <select name="resident_type" value={extra.resident_type} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" required>
          <option value="owner">مالك</option>
          <option value="tenant">مستأجر</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
            <FaBuilding className="text-blue-600" /> اختر العمارة
          </label>
          <select name="building" value={extra.building} onChange={handleChange} required className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors">
            <option value="">اختر العمارة</option>
            {buildings.map(building => (
              <option key={building.id} value={building.id}>{building.name} - {building.address}</option>
            ))}
            <option value="other">أخرى</option>
          </select>
          {extra.building === 'other' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
                  <FaBuilding className="text-blue-600" /> اسم العمارة
                </label>
                <input type="text" name="manual_building_name" placeholder="اسم العمارة" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={extra.manual_building_name} onChange={handleChange} required />
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

        <div>
          <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
            <FaLayerGroup className="text-blue-600" /> رقم الدور
          </label>
          <input type="number" name="floor_number" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={extra.floor_number} onChange={handleChange} required />
        </div>

        <div>
          <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
            <FaBuilding className="text-blue-600" /> رقم الشقة
          </label>
          <input type="number" name="apartment_number" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={extra.apartment_number} onChange={handleChange} required />
        </div>
      </div>

      {extra.resident_type === 'tenant' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
              <FaFileContract className="text-blue-600" /> عقد الإيجار
            </label>
            <div
              onDragOver={handleRentalDragOver}
              onDragLeave={handleRentalDragLeave}
              onDrop={handleRentalDrop}
              onClick={() => document.getElementById("rentalContractInput").click()}
              className={`w-full p-6 border-2 rounded-lg text-right cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors
                ${extra.rental_contract_dragOver ? "border-cyan-600 bg-cyan-50" : "border-gray-200 bg-white hover:border-blue-400"}`}
            >
              <FaCloudUploadAlt className="text-cyan-600 text-4xl" />
              <p className="text-gray-600">اسحب الملف هنا أو اضغط للاختيار</p>
              {extra.rental_contract_fileName && (
                <p className="text-cyan-700 font-semibold truncate max-w-full">{extra.rental_contract_fileName}</p>
              )}
              <input
                type="file"
                id="rentalContractInput"
                name="rental_contract"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFile}
                className="hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
              <FaIdCard className="text-blue-600" /> الرقم القومي للمالك
            </label>
            <input type="text" name="owner_national_id" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={extra.owner_national_id} onChange={handleChange} required />
          </div>
        </div>
      )}
    </div>
  );

  
  return (
    <div className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8" dir="rtl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              <FaArrowRight className="text-sm" />
            </button>
            <h3 className="text-xl font-bold">استكمال بيانات: {rolesList.find(r => r.value === currentRole)?.label}</h3>
          </div>
          <span className="text-sm text-gray-500">{currentRoleIndex + 1} من {roles.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-cyan-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentRole === 'union_head' && renderOwnerForm()}
        {currentRole === 'resident' && renderResidentForm()}

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevRole}
            disabled={currentRoleIndex === 0}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FaStepBackward className="inline ml-2" /> السابق
          </button>
          <button
            type="button"
            onClick={nextRole}
            disabled={currentRoleIndex === roles.length - 1}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            التالي <FaStepForward className="inline mr-2" />
          </button>
          {currentRoleIndex === roles.length - 1 && (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'جاري الإرسال...' : 'إنهاء التسجيل'} <FaCheck className="inline mr-2" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    national_id: '',
    date_of_birth: '',
    email: '',
    password: '',
    confirm_password: '',
    roles: [],
    building: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async (data) => {
      setLoading(true);
      setError('');
      try {
        const formData = new FormData();
        formData.append('full_name', data.full_name);
        formData.append('phone_number', data.phone_number);
        formData.append('national_id', data.national_id);
        formData.append('date_of_birth', data.date_of_birth);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('confirm_password', data.confirm_password);
        formData.append('roles', data.roles.join(','));

        if (data.roles.includes('union_head')) {
          formData.append('name', data.name);
          formData.append('province', data.province);
          formData.append('city', data.city);
          formData.append('district', data.district);
          formData.append('street', data.street);
          formData.append('total_units', data.total_units);
          formData.append('total_floors', data.total_floors);
          formData.append('units_per_floor', data.units_per_floor);
          formData.append('subscription_plan', data.subscription_plan);
        }

        if (data.roles.includes('resident')) {
          formData.append('resident_type', data.resident_type);
          formData.append('floor_number', data.floor_number);
          formData.append('apartment_number', data.apartment_number);
          formData.append('building_id', data.building_id);
          formData.append('building_name', data.building_name);
          formData.append('address', data.address);
          if (data.resident_type === 'tenant') {
            formData.append('owner_national_id', data.owner_national_id);
            formData.append('rental_contract', data.rental_contract);
          }
        }

        
        const response = await registerUserWithFiles(formData);

        setSuccess('تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول و التوجهه لصفحه تسجيل الدخول');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.3), rgba(255,255,255,0))' }}></div>
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4K)' }}></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto py-8 px-4 relative z-10">
        {step === 1 && (
          <RegisterStep1 onNext={handleNext} form={form} setForm={setForm} />
        )}
        {step === 2 && (
          <RegisterStep2
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            loading={loading}
            onBack={handleBack}
          />
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-center animate-shake backdrop-blur-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 text-green-300 rounded-xl text-center animate-fadeInUp backdrop-blur-sm">
            {success}
          </div>
        )}
      </div>
    </div>

    <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
}
