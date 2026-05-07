import React, { useState } from 'react';
import { Sidebar, MobileNav, HeaderMobile } from './components/Layout';
import FormInput from './pages/FormInput';

export default function App() {
  const [dataPendaftar, setDataPendaftar] = useState([]);

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      <Sidebar activeTab="form" />
      <MobileNav activeTab="form" />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <HeaderMobile />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative">
          <FormInput onSubmit={(newData) => setDataPendaftar([...dataPendaftar, newData])} />
        </main>
      </div>
    </div>
  );
}