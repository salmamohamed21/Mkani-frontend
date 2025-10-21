import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white shadow-md hover:shadow-lg rounded-lg p-4 transition-all duration-300 hover:scale-105 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
