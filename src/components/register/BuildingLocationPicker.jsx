import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// أيقونة مخصصة للموقع
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ position, setPosition, setAddress, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchAddress(e.latlng, setAddress, onLocationSelect);
    },
  });
  return position ? <Marker position={position} icon={markerIcon} /> : null;
};

// دالة لتحليل العنوان إلى مكونات
const parseAddress = (address) => {
  return {
    province: address.state || address.region || '',
    city: address.city || address.town || address.village || '',
    district: address.suburb || address.neighbourhood || address.quarter || '',
    street: address.road || address.pedestrian || '',
  };
};

// دالة لتحويل الإحداثيات إلى عنوان نصي
const fetchAddress = async (latlng, setAddress, onLocationSelect) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
    );
    const data = await res.json();
    const address = data.display_name || "لم يتم العثور على عنوان";
    setAddress(address);
    const components = parseAddress(data.address || {});
    onLocationSelect({
      latitude: latlng.lat,
      longitude: latlng.lng,
      address,
      ...components
    });
  } catch (err) {
    console.error("❌ فشل في جلب العنوان:", err);
  }
};

// دالة لتحويل العنوان إلى إحداثيات
const fetchCoords = async (manualAddress, setPosition, setAddress, setWarningMessage, onLocationSelect) => {
  setWarningMessage(""); // مسح التحذير عند بدء البحث
  if (manualAddress.trim() === "") {
    return;
  }
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualAddress)}`
    );
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      const coords = { lat: parseFloat(lat), lng: parseFloat(lon) };
      setPosition(coords);
      fetchAddress(coords, setAddress, onLocationSelect);
    } else {
      setWarningMessage("العنوان المدخل غير موجود على الخريطة. يرجى التأكد من صحة العنوان أو اختيار موقع آخر.");
      setPosition(null);
      setAddress("");
    }
  } catch (err) {
    console.error("❌ فشل في تحديد الإحداثيات من العنوان:", err);
    setWarningMessage("حدث خطأ في البحث عن العنوان. يرجى المحاولة مرة أخرى.");
  }
};

const BuildingLocationPicker = ({ onLocationSelect, initialAddress = "" }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [manualAddress, setManualAddress] = useState(initialAddress);
  const [warningMessage, setWarningMessage] = useState("");

  // عند كتابة العنوان يدويًا، ابحث عنه على الخريطة
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCoords(manualAddress, setPosition, setAddress, setWarningMessage, onLocationSelect);
    }, 1000); // تأخير لتجنب الطلبات المتكررة
    return () => clearTimeout(timer);
  }, [manualAddress, onLocationSelect]);

  // تمرير النتيجة للفورم الرئيسي
  useEffect(() => {
    if (manualAddress) {
      onLocationSelect({ position, address: manualAddress, manualAddress });
    }
  }, [position, manualAddress, address]);

  return (
    <div className="space-y-4 bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        📍 حدد موقع العمارة
      </h2>

      {/* إدخال يدوي للعنوان */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          العنوان يدويًا:
        </label>
        <input
          type="text"
          placeholder="اكتب العنوان أو اسم المنطقة..."
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* خريطة OpenStreetMap */}
      <div className="h-72 rounded-xl overflow-hidden border border-gray-200 relative z-0">
        <MapContainer
          center={[30.0444, 31.2357]} // القاهرة كموقع افتراضي
          zoom={13}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            setAddress={setAddress}
            onLocationSelect={onLocationSelect}
          />
        </MapContainer>
      </div>

      {/* عرض رسالة التحذير */}
      {warningMessage && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-2 rounded-lg text-sm">
          <strong>تحذير:</strong> {warningMessage}
        </div>
      )}

      {/* عرض العنوان المستخرج */}
      {address && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-2 rounded-lg text-sm">
          <strong>العنوان المحدد:</strong> {address}
        </div>
      )}
    </div>
  );
};

export default BuildingLocationPicker;
