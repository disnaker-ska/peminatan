import React from 'react';
import { Briefcase, FileText, Lock, PieChart, Printer } from 'lucide-react';

export function Sidebar({ activeTab, onTabClick }) {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl hidden md:flex z-10">
      <div className="p-6 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-lg">
            <Briefcase size={24} className="text-slate-900" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Disnaker Solo</h1>
            <p className="text-xs text-slate-400">Peminatan Kerja & Pelatihan</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavItem 
          icon={<FileText size={20} />} 
          label="Form Input" 
          active={activeTab === 'form'} 
          onClick={() => window.location.href = '/'} 
        />
        <NavItem 
          icon={<Lock size={20} />} 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => window.location.href = '/dashboard.html'} 
        />
        <NavItem 
          icon={<Lock size={20} />} 
          label="Cetak Laporan" 
          active={activeTab === 'laporan'} 
          onClick={() => window.location.href = '/laporan.html'} 
        />
      </nav>
      <div className="p-4 text-xs text-slate-500 border-t border-slate-800 text-center">
        &copy; 2026 Pemerintah Kota Surakarta
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-amber-500 text-slate-900 font-semibold shadow-lg' 
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function MobileNav({ activeTab, onTabClick }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 text-white flex justify-around p-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <MobileNavItem 
        icon={<FileText size={20} />} 
        label="Form" 
        active={activeTab === 'form'} 
        onClick={() => window.location.href = '/'} 
      />
      <MobileNavItem 
        icon={<PieChart size={20} />} 
        label="Dashboard" 
        active={activeTab === 'dashboard'} 
        onClick={() => window.location.href = '/dashboard.html'} 
      />
      <MobileNavItem 
        icon={<Printer size={20} />} 
        label="Laporan" 
        active={activeTab === 'laporan'} 
        onClick={() => window.location.href = '/laporan.html'} 
      />
    </div>
  );
}

function MobileNavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 ${
        active ? 'text-amber-500' : 'text-slate-400'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

export function HeaderMobile() {
  return (
    <div className="md:hidden bg-slate-900 text-white p-4 flex items-center gap-3 shadow-md">
       <div className="bg-amber-500 p-1.5 rounded-lg">
          <Briefcase size={20} className="text-slate-900" />
        </div>
        <div>
          <h1 className="font-bold text-md leading-tight">Disnaker Solo</h1>
        </div>
    </div>
  );
}
