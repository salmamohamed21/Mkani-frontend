import React, { useState } from "react";
import { createBuilding } from "../../api/buildings.jsx";
import InputField from "../../components/forms/InputField";
import Button from "../../components/ui/Button";
import BuildingLocationPicker from "../../components/register/BuildingLocationPicker";
import { useNavigate } from "react-router-dom";

const AddBuilding = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    total_units: "",
    total_floors: "",
    units_per_floor: "",
  });
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (location) => {
    setLocationData(location);
    if (location.address) {
      setFormData(prev => ({ ...prev, address: location.address }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const buildingData = {
        ...formData,
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
        province: locationData?.province,
        city: locationData?.city,
        district: locationData?.district,
        street: locationData?.street,
      };
      await createBuilding(buildingData);
      alert("تم إضافة العمارة بنجاح ✅");
      navigate("/profile");
    } catch (err) {
      alert("حدث خطأ أثناء إضافة العمارة ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">إضافة عمارة جديدة</h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Building Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">تفاصيل العمارة</h3>
            <InputField
              label="اسم العمارة"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Structural Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">التفاصيل الهيكلية</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="عدد الوحدات"
                type="number"
                name="total_units"
                value={formData.total_units}
                onChange={handleChange}
                required
              />
              <InputField
                label="عدد الأدوار"
                type="number"
                name="total_floors"
                value={formData.total_floors}
                onChange={handleChange}
                required
              />
              <InputField
                label="عدد الشقق في الدور الواحد"
                type="number"
                name="units_per_floor"
                value={formData.units_per_floor}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Location Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">تحديد الموقع</h3>
            <BuildingLocationPicker onLocationSelect={handleLocationSelect} />
          </div>

          <Button type="submit" loading={loading} className="w-full">
            حفظ
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddBuilding;
