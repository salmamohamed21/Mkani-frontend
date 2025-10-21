import React from 'react';
import Spinner from './Spinner';

const LoadingPage = () => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <Spinner size="md" />
    </div>
  );
};

export default LoadingPage;
