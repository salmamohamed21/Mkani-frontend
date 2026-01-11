import React from "react";

const Modal = ({ isOpen, onClose, children, title, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} relative transform transition-all duration-300 scale-100`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
