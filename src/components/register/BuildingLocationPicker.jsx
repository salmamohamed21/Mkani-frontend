import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

// أيقونة مخصصة للموقع المحدد
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// أيقونة مخصصة لموقع اليوزر الحالي
const userMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "hue-rotate-180", // لتغيير لون الأيقونة إلى أزرق أو شيء مشابه
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
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&countrycodes=eg&accept-language=ar,en&q=${encodeURIComponent(manualAddress)}`
    );
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      const coords = { lat: parseFloat(lat), lng: parseFloat(lon) };
      setPosition(coords);
      fetchAddress(coords, setAddress, onLocationSelect);
    } else {
      setWarningMessage("عذرًا، لم نتمكن من العثور على العنوان الذي أدخلته على الخريطة. يرجى التأكد من صحة العنوان أو كتابته بمزيد من التفاصيل للحصول على نتائج أفضل.");
      setPosition(null);
      setAddress("");
    }
  } catch (err) {
    console.error("❌ فشل في تحديد الإحداثيات من العنوان:", err);
    setWarningMessage("عذرًا، حدث خطأ أثناء البحث عن العنوان. يرجى المحاولة مرة أخرى لاحقًا.");
  }
};

const BuildingLocationPicker = ({ onLocationSelect, initialAddress = "" }) => {
  const [position, setPosition] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [manualAddress, setManualAddress] = useState(initialAddress);
  const [warningMessage, setWarningMessage] = useState("");
  const [mapCenter, setMapCenter] = useState([30.0444, 31.2357]); // Default to Cairo

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = { lat: latitude, lng: longitude };
          setMapCenter([latitude, longitude]);
          setUserPosition(coords);
          setPosition(coords);
          fetchAddress(coords, setAddress, onLocationSelect);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          // Keep default Cairo center and no marker
        }
      );
    }
  }, []);





  return (
    <div className="space-y-4 bg-white p-4 rounded-xl shadow-md">
      

      {/* عرض العنوان المستخرج */}
      {address && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-2 rounded-lg text-sm">
          <strong>العنوان المحدد:</strong> {address}
        </div>
      )}

      {/* خريطة OpenStreetMap */}
      <div className="h-72 rounded-xl overflow-hidden border border-gray-200 relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          dragging={true}
          zoomControl={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userPosition && <Marker position={userPosition} icon={userMarkerIcon} />}
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
    </div>
  );
};

export default BuildingLocationPicker;
