import React from 'react';
import logo from '../../assets/logo.png';

function Footer() {
  return (
    <footer dir="rtl" className="bg-gray-900 text-white py-10 font-arabic">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div>
          <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-cyan-400 transition">الرئيسية</a></li>
            <li><a href="/register" className="hover:text-cyan-400 transition">انشاء حساب</a></li>
            <li><a href="/login" className="hover:text-cyan-400 transition">تسجيل الدخول</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
          <ul className="space-y-2">
            <li><a href="https://facebook.com" className="hover:text-cyan-400 transition">فيسبوك</a></li>
            <li><a href="https://instagram.com" className="hover:text-cyan-400 transition">انستجرام</a></li>
            <li><a href="mailto:info@makani.com" className="hover:text-cyan-400 transition">البريد الإلكتروني</a></li>
            <li><a href="/contact" className="hover:text-cyan-400 transition">اتصل بنا</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">الشروط والسياسات</h4>
          <ul className="space-y-2">
            <li><a href="/terms" className="hover:text-cyan-400 transition">شروط الاستخدام</a></li>
            <li><a href="/privacy" className="hover:text-cyan-400 transition">سياسة الخصوصية</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <img src={logo} alt="مكانى" className="w-32" />
          <p className="text-gray-300">منصتك الذكية لإدارة العقارات، الإعلان، والخدمات بكل سهولة واحترافية.</p>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        <p>© 2025 مكانى. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}

export default Footer;
