import React from 'react';
import { Users, Briefcase, BookOpen } from 'lucide-react';

export default function Dashboard({ data }) {
  const totalPendaftar = data.length;
  
  const statusKerjaCount = data.reduce((acc, curr) => {
    acc[curr.statusKerja] = (acc[curr.statusKerja] || 0) + 1;
    return acc;
  }, {});

  const pelatihanCount = data.reduce((acc, curr) => {
    if(curr.pelatihan) acc[curr.pelatihan] = (acc[curr.pelatihan] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Pemetaan</h2>
        <p className="text-slate-500">Ringkasan data peminatan kerja dan pelatihan warga.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="bg-amber-100 p-4 rounded-full text-amber-600"><Users size={32}/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Pendaftar</p>
            <p className="text-3xl font-bold text-slate-900">{totalPendaftar}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="bg-slate-100 p-4 rounded-full text-slate-700"><Briefcase size={32}/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pencari Kerja Aktif</p>
            <p className="text-3xl font-bold text-slate-900">
              {statusKerjaCount['Sedang mencari kerja'] || 0}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600"><BookOpen size={32}/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Butuh Pelatihan</p>
            <p className="text-3xl font-bold text-slate-900">
               {data.filter(d => d.pelatihan).length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Status Pekerjaan Saat Ini</h3>
          <div className="space-y-4">
            {Object.entries(statusKerjaCount).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{status || 'Tidak diisi'}</span>
                  <span className="font-bold text-slate-900">{count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-slate-800 h-2.5 rounded-full" style={{ width: `${totalPendaftar > 0 ? (count/totalPendaftar)*100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Top Peminatan Pelatihan</h3>
          <div className="space-y-4">
            {Object.entries(pelatihanCount)
              .sort((a,b) => b[1] - a[1])
              .slice(0, 5)
              .map(([pelatihan, count]) => (
              <div key={pelatihan}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{pelatihan}</span>
                  <span className="font-bold text-slate-900">{count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${totalPendaftar > 0 ? (count/totalPendaftar)*100 : 0}%` }}></div>
                </div>
              </div>
            ))}
            {Object.keys(pelatihanCount).length === 0 && (
              <p className="text-sm text-slate-400 italic">Belum ada data pelatihan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
