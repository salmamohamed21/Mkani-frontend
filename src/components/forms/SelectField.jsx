import React from "react";

const SelectField = ({ label, value, onChange, options, placeholder, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-700 mb-2">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md ${error ? "border-red-500" : "border-gray-300"}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;
