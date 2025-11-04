import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import RoutesConfig from './routes';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="pt-20 px-6">
        <RoutesConfig />
      </main>
      <Footer />
    </div>
  );
}
