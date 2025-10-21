import React, { useState } from "react";

const FileUploader = ({ label, onChange, accept, error, ...props }) => {
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
    onChange(e);
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-gray-700 mb-2">{label}</label>}
      <input
        type="file"
        onChange={handleChange}
        accept={accept}
        className={`w-full px-3 py-2 border rounded-md ${error ? "border-red-500" : "border-gray-300"}`}
        {...props}
      />
      {fileName && <p className="text-gray-600 text-sm mt-1">Selected: {fileName}</p>}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FileUploader;
