import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Sidebar, MobileNav, HeaderMobile } from './components/Layout';
import { AuthModal } from './components/AuthModal';
import Laporan from './pages/Laporan';
import { GOOGLE_SCRIPT_URL, ADMIN_PASSWORD } from './constants/config';

function LaporanApp() {
  const [dataPendaftar, setDataPendaftar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const result = await response.json();
      if (Array.isArray(result)) setDataPendaftar(result);
    } catch (error) {
      console.error("Gagal menarik data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      <Sidebar activeTab="laporan" />
      <MobileNav activeTab="laporan" />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <HeaderMobile />
        
        {!isAuthenticated && (
          <AuthModal 
            passwordInput={passwordInput}
            setPasswordInput={setPasswordInput}
            onLogin={handleLogin}
            onCancel={() => window.location.href = '/'}
            authError={authError}
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative">
          {isLoading && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-lg text-sm flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-700"></span>
              Sinkronisasi data...
            </div>
          )}
          {isAuthenticated && <Laporan data={dataPendaftar} />}
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LaporanApp />
  </React.StrictMode>
);
