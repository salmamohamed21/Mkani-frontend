import React from 'react';
    export default function ErrorAlert({message}) {
      if(!message) return null;
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
          {message}
        </div>
      );
    }
    