import React from 'react';
import logo from '../../assets/logo.png';

function Footer() {
  return (
    <footer dir="rtl" className="bg-gray-900 text-white py-8 sm:py-10 font-arabic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

        <div>
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">روابط سريعة</h4>
          <ul className="space-y-1 sm:space-y-2">
            <li><a href="/" className="hover:text-cyan-400 transition text-sm sm:text-base">الرئيسية</a></li>
            <li><a href="/register" className="hover:text-cyan-400 transition text-sm sm:text-base">انشاء حساب</a></li>
            <li><a href="/login" className="hover:text-cyan-400 transition text-sm sm:text-base">تسجيل الدخول</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">تواصل معنا</h4>
          <ul className="space-y-1 sm:space-y-2">
            <li><a href="https://facebook.com" className="hover:text-cyan-400 transition text-sm sm:text-base">فيسبوك</a></li>
            <li><a href="https://instagram.com" className="hover:text-cyan-400 transition text-sm sm:text-base">انستجرام</a></li>
            <li><a href="mailto:info@makani.com" className="hover:text-cyan-400 transition text-sm sm:text-base">البريد الإلكتروني</a></li>
            <li><a href="/contact" className="hover:text-cyan-400 transition text-sm sm:text-base">اتصل بنا</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">الشروط والسياسات</h4>
          <ul className="space-y-1 sm:space-y-2">
            <li><a href="/terms" className="hover:text-cyan-400 transition text-sm sm:text-base">شروط الاستخدام</a></li>
            <li><a href="/privacy" className="hover:text-cyan-400 transition text-sm sm:text-base">سياسة الخصوصية</a></li>
          </ul>
        </div>

        <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
          <img src={logo} alt="مكانى" className="w-24 sm:w-32 mx-auto sm:mx-0" />
          <p className="text-gray-300 text-sm sm:text-base">منصتك الذكية لإدارة العقارات، الإعلان، والخدمات بكل سهولة واحترافية.</p>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 border-t border-gray-700 pt-4 sm:pt-6 text-center text-gray-500 text-xs sm:text-sm">
        <p>© 2025 مكانى. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}

export default Footer;
