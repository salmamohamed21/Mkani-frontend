import React from "react";

const Spinner = ({ size = "md", centered = false }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinner = (
    <div className="flex items-center justify-center">
      <div className={`border-4 border-blue-600 border-t-transparent rounded-full animate-spin ${sizes[size]}`}></div>
    </div>
  );

  if (centered) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;
