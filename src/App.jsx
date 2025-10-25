import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import RoutesConfig from './routes';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const showSidebar = isAuthenticated && location.pathname !== '/';

  return (
    <div className="min-h-screen flex flex-col">
      {showSidebar && <Sidebar />}
      <div className="flex-1">
        <Navbar />
        <main className="pt-20 px-6">
          <RoutesConfig />
        </main>
        <Footer />
      </div>
    </div>
  );
}
