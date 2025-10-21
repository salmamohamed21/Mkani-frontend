import React from 'react';
    import logo from '../../assets/logo.svg';

    export default function HeroSection(){
      return (
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <img src={logo} alt="Mkani" className="mx-auto h-20 mb-6"/>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">عقار أفضل لحياة أسعد</h1>
            <p className="max-w-2xl mx-auto text-gray-600 mb-6">كل ما يخص عقارك في مكان واحد!</p>
            <div className="flex items-center justify-center gap-3">
              <a href="/register" className="bg-[color:var(--mk-primary)] text-white px-6 py-3 rounded-lg shadow hover:opacity-95">إنشاء حساب</a>
              <a href="/login" className="border border-gray-300 px-6 py-3 rounded-lg text-gray-700">تسجيل الدخول</a>
            </div>
          </div>
        </section>
      );
    }
    