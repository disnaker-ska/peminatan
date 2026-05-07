import React from 'react';
import { Lock } from 'lucide-react';

export function AuthModal({ 
  passwordInput, 
  setPasswordInput, 
  onLogin, 
  onCancel, 
  authError 
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-fadeIn">
        <div className="flex justify-center mb-4 text-amber-500">
          <div className="bg-amber-50 p-3 rounded-full">
            <Lock size={32} />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 text-center mb-1">Akses Terkunci</h3>
        <p className="text-sm text-slate-500 text-center mb-6">Masukkan password khusus admin Disnaker Surakarta untuk melihat data.</p>
        
        <form onSubmit={onLogin}>
          <input 
            type="password" 
            autoFocus
            placeholder="Masukkan Password..." 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className={`w-full p-3 mb-2 bg-slate-50 border ${authError ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-amber-500'} rounded-lg focus:ring-2 outline-none transition-all text-center`}
          />
          {authError && <p className="text-xs text-red-500 text-center mb-4">Password salah! Silakan coba lagi.</p>}
          
          <div className="flex gap-2 mt-4">
            <button 
              type="button" 
              onClick={onCancel} 
              className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-amber-500 hover:text-slate-900 transition-colors"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
