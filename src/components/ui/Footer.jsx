import React from 'react';
    export default function Footer(){
      return (
        <footer className="bg-white border-t mt-8">
          <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Mkani — كل ما يخص عقارك في مكان واحد.
          </div>
        </footer>
      );
    }
    