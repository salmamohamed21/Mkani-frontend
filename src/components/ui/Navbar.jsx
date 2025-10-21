import React from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import logo from '../../assets/logo.svg';

    export default function Navbar(){
      const navigate = useNavigate();
      const name = localStorage.getItem('user_name') || 'Guest';
      const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        navigate('/login');
      };

      return (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                <img src={logo} alt="Mkani" className="h-10 w-auto"/>
                <div>
                  <div className="text-xl font-bold text-gray-800">Mkani</div>
                  <div className="text-xs text-gray-500">عقار أفضل لحياة أسعد</div>
                </div>
              </div>

              <nav className="flex items-center gap-4">
                <Link to="/" className="text-gray-700 hover:text-blue-600">الرئيسية</Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-600">إنشاء حساب</Link>
                {localStorage.getItem('access_token') ? (
                  <>
                    <span className="text-gray-600">Hi, {name}</span>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">خروج</button>
                  </>
                ) : (
                  <Link to="/login" className="text-white bg-blue-600 px-3 py-1 rounded">دخول</Link>
                )}
              </nav>
            </div>
          </div>
        </header>
      );
    }
    