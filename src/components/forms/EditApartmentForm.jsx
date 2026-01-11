import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { FaLayerGroup, FaBuilding, FaHome, FaTh, FaSave, FaTimes } from 'react-icons/fa';

const EditApartmentForm = ({ apartment, onSave, onCancel, submitting }) => {
  const [formData, setFormData] = useState({
    floor_number: '',
    apartment_number: '',
    area: '',
    rooms_count: '',
  });

  useEffect(() => {
    if (apartment) {
      setFormData({
        floor_number: apartment.unit_details?.floor_number || apartment.floor_number || '',
        apartment_number: apartment.unit_details?.apartment_number || apartment.apartment_number || '',
        area: apartment.unit_details?.area || '',
        rooms_count: apartment.unit_details?.rooms_count || '',
      });
    }
  }, [apartment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass only the changed values, or all values if you prefer
    onSave(formData);
  };

  if (!apartment) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaBuilding className="text-blue-600" />
          تفاصيل المبنى (للعرض فقط)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><span className="font-semibold">اسم المبنى:</span> {apartment.building_name}</p>
          <p><span className="font-semibold">العنوان:</span> {apartment.address}</p>
        </div>
      </div>
      
      <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">تعديل تفاصيل الشقة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
              <FaLayerGroup className="text-blue-600" /> رقم الدور
            </label>
            <input type="number" name="floor_number" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={formData.floor_number} onChange={handleChange} required />
          </div>

          <div>
            <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
              <FaBuilding className="text-blue-600" /> رقم الشقة
            </label>
            <input type="number" name="apartment_number" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={formData.apartment_number} onChange={handleChange} required />
          </div>
        
          <div>
            <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
              <FaHome className="text-blue-600" /> مساحة الشقة (متر مربع)
            </label>
            <input type="number" name="area" step="0.01" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={formData.area} onChange={handleChange} required />
          </div>

          <div>
            <label className="block mb-3 font-semibold text-right flex items-center gap-2 text-gray-700">
              <FaTh className="text-blue-600" /> عدد الغرف
            </label>
            <input type="number" name="rooms_count" className="w-full p-3 border-2 border-gray-200 rounded-lg text-right focus:border-blue-400 focus:outline-none transition-colors" value={formData.rooms_count} onChange={handleChange} required />
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-4 pt-4 border-t mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex items-center gap-2">
          <FaTimes /> إلغاء
        </Button>
        <Button type="submit" disabled={submitting} className="flex items-center gap-2">
          {submitting ? 'جاري الحفظ...' : <><FaSave /> حفظ التعديلات</>}
        </Button>
      </div>
    </form>
  );
};

export default EditApartmentForm;
