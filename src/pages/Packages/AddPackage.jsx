import React, { useState, useEffect } from "react";
import { addPackage } from "../../api/packages";
import { getMyBuildings } from "../../api/buildings.jsx";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import Tabs from "../../components/ui/Tabs";
import Button from "../../components/ui/Button";
import {
  FaBolt,
  FaTools,
  FaExclamationTriangle,
  FaHome,
  FaCoins,
  FaUserTie,
  FaReceipt,
  FaCheck
} from "react-icons/fa";

// Monthly Bills Form Component (Monthly Bills)
const MonthlyBillsForm = ({ onSubmit, loading, selectedBuildings }) => {
  const [form, setForm] = useState({
    type: "utilities",
    service_type: "",
    name: "",
    description: "",
    meter_type: "",
    manufacturer: "",
    meter_number: "",
    average_monthly_charge: "",
    buildings: selectedBuildings,
    details: ""
  });

  const [manufacturerOptions, setManufacturerOptions] = useState([]);

  useEffect(() => {
    if (form.service_type === "electricity") {
      setManufacturerOptions([
        { value: "شركة كهرباء مصر", label: "شركة كهرباء مصر" },
        { value: "شركة كهرباء الشمال", label: "شركة كهرباء الشمال" },
        { value: "شركة كهرباء الجنوب", label: "شركة كهرباء الجنوب" },
        { value: "شركة كهرباء القاهرة", label: "شركة كهرباء القاهرة" },
        { value: "أخرى", label: "أخرى" }
      ]);
    } else if (form.service_type === "water") {
      setManufacturerOptions([
        { value: "شركة مياه الشرب والصرف الصحي", label: "شركة مياه الشرب والصرف الصحي" },
        { value: "شركة مياه القاهرة", label: "شركة مياه القاهرة" },
        { value: "شركة مياه الإسكندرية", label: "شركة مياه الإسكندرية" },
        { value: "شركة مياه الجيزة", label: "شركة مياه الجيزة" },
        { value: "أخرى", label: "أخرى" }
      ]);
    } else {
      setManufacturerOptions([]);
    }
  }, [form.service_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceTypeSelect = (serviceType) => {
    const name = serviceType === "electricity" ? "باقه عداد الكهرباء المشتركه" : "باقه المياه المشتركه";
    const meter_type = serviceType;
    setForm(prev => ({ ...prev, name, meter_type, service_type: serviceType, manufacturer: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      package_type: "prepaid",
      name: form.name,
      description: form.description,
      is_recurring: true,
      start_date: new Date().toISOString().split('T')[0],
      prepaid_details: {
        meter_type: form.meter_type,
        manufacturer: form.manufacturer,
        meter_number: form.meter_number,
        average_monthly_charge: form.average_monthly_charge
      },
      buildings: selectedBuildings
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <FaHome className="text-3xl text-blue-500 mx-auto mb-2" />
        <h3 className="text-xl font-semibold text-gray-800">الفواتير الشهرية</h3>
        <p className="text-gray-600 text-sm">كهرباء، مياه</p>
      </div>

      <div className="space-y-6">
        {/* Service Type Selection */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-4">نوع الخدمة</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Electricity Card */}
            <div
              onClick={() => handleServiceTypeSelect("electricity")}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                form.service_type === "electricity"
                  ? "border-yellow-500 bg-yellow-50 shadow-md"
                  : "border-gray-200 hover:border-yellow-300 hover:bg-yellow-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <FaBolt className="text-3xl text-yellow-500" />
                <span className="text-lg font-semibold text-gray-800">كهرباء</span>
              </div>
              <p className="text-gray-600 text-sm">فواتير الكهرباء الشهرية</p>
              {form.service_type === "electricity" && (
                <div className="absolute top-3 right-3">
                  <FaCheck className="text-yellow-500 text-xl" />
                </div>
              )}
            </div>

            {/* Water Card */}
            <div
              onClick={() => handleServiceTypeSelect("water")}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                form.service_type === "water"
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <FaReceipt className="text-3xl text-blue-500" />
                <span className="text-lg font-semibold text-gray-800">مياه</span>
              </div>
              <p className="text-gray-600 text-sm">فواتير المياه الشهرية</p>
              {form.service_type === "water" && (
                <div className="absolute top-3 right-3">
                  <FaCheck className="text-blue-500 text-xl" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Meter and Billing Information */}
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-md font-semibold text-gray-800 mb-4">معلومات العداد والفاتورة</h4>
          <div className="grid gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الباقة</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="اسم الباقة"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                readOnly
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="وصف الباقة..."
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الشركة المصنعة</label>
              <select
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">اختر الشركة المصنعة</option>
                {manufacturerOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم العداد</label>
              <input
                type="text"
                name="meter_number"
                value={form.meter_number}
                onChange={handleChange}
                placeholder="أدخل رقم العداد"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">متوسط الاستهلاك الشهري</label>
              <input
                type="number"
                name="average_monthly_charge"
                value={form.average_monthly_charge}
                onChange={handleChange}
                placeholder="المبلغ بالجنيه"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">تفاصيل إضافية</label>
              <textarea
                name="details"
                value={form.details}
                onChange={handleChange}
                placeholder="أي تفاصيل إضافية..."
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mx-auto block"
      >
        {loading ? "جارٍ الحفظ..." : "حفظ الباقة"}
      </Button>
    </form>
  );
};



// Fixed Cost Form Component (Monthly Fixed Costs)
const FixedCostForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: "",
    type: "fixed",
    monthly_amount: "",
    payment_method: "union_head",
    national_id: "",
    beneficiary_name: "",
    beneficiary_phone: "",
    beneficiary_id: "",
    deduction_day: "",
    details: ""
  });

  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "payment_method" && value === "union_head") {
      setForm(prev => ({ ...prev, national_id: "", beneficiary_name: "", beneficiary_phone: "", beneficiary_id: "" }));
      setNotFound(false);
    }
  };

  const handleSearch = async () => {
    if (!form.national_id) return;
    setSearching(true);
    setNotFound(false);

    // إعادة تعيين بيانات المستفيد السابقة
    setForm(prev => ({
      ...prev,
      beneficiary_name: "",
      beneficiary_phone: "",
      beneficiary_id: ""
    }));

    try {
      const response = await fetch(`/api/accounts/search-by-national-id/${form.national_id}/`);
      if (response.ok) {
        const data = await response.json();
        setForm(prev => ({
          ...prev,
          beneficiary_name: data.full_name,
          beneficiary_phone: data.phone_number,
          beneficiary_id: data.id
        }));
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      package_type: "fixed",
      name: form.name,
      description: form.details,
      is_recurring: true,
      start_date: new Date().toISOString().split('T')[0],
      fixed_details: {
        monthly_amount: form.monthly_amount,
        deduction_day: form.deduction_day,
        payment_method: form.payment_method,
        beneficiary: form.beneficiary_id || null,
        beneficiary_name: form.beneficiary_name || null,
        beneficiary_phone: form.beneficiary_phone || null,
        national_id: form.national_id || null
      },
      buildings: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <FaTools className="text-3xl text-purple-500 mx-auto mb-2" />
        <h3 className="text-xl font-semibold text-gray-800">المصاريف الثابتة</h3>
        <p className="text-gray-600 text-sm">رواتب، نظافة، صيانة، خدمات شهرية</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المصروف</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="مثال: مرتب الحارس"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ الشهري</label>
          <input
            type="number"
            name="monthly_amount"
            value={form.monthly_amount}
            onChange={handleChange}
            placeholder="المبلغ بالجنيه"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">يوم الخصم الشهري</label>
          <input
            type="number"
            name="deduction_day"
            value={form.deduction_day}
            onChange={handleChange}
            placeholder="مثال: 1"
            min="1"
            max="31"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">طريقة التحويل</label>
          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="union_head">تحويل المبلغ لرئيس الاتحاد</option>
            <option value="direct_person">تحويل لشخص آخر</option>
          </select>
        </div>
      </div>

      {form.payment_method === "direct_person" && (
        <div className="space-y-3 mt-4 p-4 border rounded-lg bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">الرقم القومي للمستفيد</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="national_id"
              value={form.national_id}
              onChange={handleChange}
              placeholder="ادخل الرقم القومي"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button type="button" onClick={handleSearch} disabled={searching}>
              {searching ? "جارٍ البحث..." : "بحث"}
            </Button>
          </div>

          {form.beneficiary_name && (
            <div className="mt-3 p-3 border rounded-md bg-green-50 text-green-700">
              <p>الاسم: {form.beneficiary_name}</p>
              <p>رقم الهاتف: {form.beneficiary_phone}</p>
            </div>
          )}

          {notFound && (
            <div className="mt-3 p-3 border rounded-md bg-yellow-50 text-yellow-800">
              ⚠️ لم يتم العثور على مستخدم بهذا الرقم القومي.<br />
              يُرجى دعوة الشخص للانضمام إلى مجتمع "مكاني" وإنشاء حساب ليستقبل الدفعات بسهولة.
            </div>
          )}
        </div>
      )}

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">تفاصيل إضافية</label>
        <textarea
          name="details"
          value={form.details}
          onChange={handleChange}
          placeholder="أي تفاصيل إضافية..."
          rows="3"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mx-auto block"
      >
        {loading ? "جارٍ الحفظ..." : "حفظ الباقة"}
      </Button>
    </form>
  );
};

// Miscellaneous Form Component (One-time Expenses)
const MiscForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: "",
    type: "misc",
    total_amount: "",
    payment_date: "",
    deadline: "",
    details: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      package_type: "misc",
      name: form.name,
      description: form.details,
      is_recurring: false,
      start_date: new Date().toISOString().split('T')[0],
      misc_details: {
        total_amount: form.total_amount,
        payment_date: form.payment_date,
        deadline: form.deadline
      },
      buildings: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <FaExclamationTriangle className="text-3xl text-orange-500 mx-auto mb-2" />
        <h3 className="text-xl font-semibold text-gray-800">مصاريف متنوعة</h3>
        <p className="text-gray-600 text-sm">مصاريف مرة واحدة</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المصروف</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="مثال: دهان المبنى"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ الكلي</label>
          <input
            type="number"
            name="total_amount"
            value={form.total_amount}
            onChange={handleChange}
            placeholder="المبلغ بالجنيه"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الدفع</label>
          <input
            type="date"
            name="payment_date"
            value={form.payment_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الديدلاين (آخر يوم دفع للسكان)</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">الوصف والتفاصيل</label>
          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            placeholder="وصف المصروف وتفاصيله..."
            rows="3"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mx-auto block"
      >
        {loading ? "جارٍ الحفظ..." : "حفظ الباقة"}
      </Button>
    </form>
  );
};



const AddPackage = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [selectedBuildings, setSelectedBuildings] = useState([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await getMyBuildings();
        setBuildings(data);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };
    fetchBuildings();
  }, []);

  const handleBuildingChange = (buildingId, checked) => {
    if (checked) {
      setSelectedBuildings(prev => [...prev, buildingId]);
    } else {
      setSelectedBuildings(prev => prev.filter(id => id !== buildingId));
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        created_by: user.id,
        buildings: selectedBuildings
      };
      await addPackage(dataToSend);
      setLoading(false);
      alert('تم إضافة الباقة بنجاح');
      navigate("/packages");
    } catch (error) {
      console.error("Error adding package:", error);
      alert('حدث خطأ في إضافة الباقة');
      setLoading(false);
    }
  };

  const tabs = [
    {
      label: (
        <div className="flex flex-col items-center gap-1 text-center">
          <FaBolt className="text-2xl text-blue-500" />
          <span className="text-sm font-medium">الفواتير الشهرية</span>
        </div>
      ),
      content: <MonthlyBillsForm onSubmit={handleSubmit} loading={loading} selectedBuildings={selectedBuildings} />
    },
    {
      label: (
        <div className="flex flex-col items-center gap-1 text-center">
          <FaTools className="text-2xl text-purple-500" />
          <span className="text-sm font-medium">المصاريف الثابتة</span>
        </div>
      ),
      content: <FixedCostForm onSubmit={handleSubmit} loading={loading} />
    },
    {
      label: (
        <div className="flex flex-col items-center gap-1 text-center">
          <FaExclamationTriangle className="text-2xl text-orange-500" />
          <span className="text-sm font-medium">مصاريف متنوعة</span>
        </div>
      ),
      content: <MiscForm onSubmit={handleSubmit} loading={loading} />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg mb-6 text-center">
          <p className="font-semibold mb-2">⚠️ إشعار مهم</p>
          <p>لإدارة باقاتك بشكل أفضل قم بتحميل تطبيق مكاني</p>
        </div>

        {/* Building Selection Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FaHome className="text-2xl text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-800">العمارات المطبق عليها الباقة</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">اختر العمارات التي تريد تطبيق الباقة عليها</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildings.map(building => {
              const isSelected = selectedBuildings.includes(building.id);
              return (
                <label key={building.id} className={`relative flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`} onClick={() => handleBuildingChange(building.id, !isSelected)}>
                  <div className="relative">
                    <input
                      type="checkbox"
                      value={building.id}
                      checked={isSelected}
                      readOnly
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 opacity-0 absolute"
                    />
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <FaCheck className="text-white text-xs" />}
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

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
  );
};

export default AddPackage;
