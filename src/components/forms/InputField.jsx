import React from "react";
import { FaBuilding, FaMapMarker, FaLayerGroup, FaHome } from "react-icons/fa";

const InputField = ({ label, type = "text", value, onChange, placeholder, error, icon, ...props }) => {
  const getIcon = () => {
    switch (icon) {
      case 'building':
        return <FaBuilding className="text-blue-500" />;
      case 'map':
        return <FaMapMarker className="text-red-500" />;
      case 'floors':
        return <FaLayerGroup className="text-green-500" />;
      case 'units':
        return <FaHome className="text-purple-500" />;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    onChange(e);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 mb-2 flex items-center gap-2">
          {getIcon()}
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md ${error ? "border-red-500" : "border-gray-300"}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
