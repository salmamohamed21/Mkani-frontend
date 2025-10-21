import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import RoutesConfig from './routes';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && <Sidebar />}
      <div className={`flex-1 ${isAuthenticated ? 'mr-20' : ''}`}>
        <Navbar />
        <main className="pt-20 px-6">
          <RoutesConfig />
        </main>
        <Footer />
      </div>
    </div>
  );
}
