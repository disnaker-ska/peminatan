import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  BookOpen, 
  Filter, 
  Search, 
  User as UserIcon,
  MapPin,
  GraduationCap,
  Calendar,
  Phone,
  Target,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Dashboard({ data = [] }) {
  const [filterWilayah, setFilterWilayah] = useState('');
  const [filterKelurahan, setFilterKelurahan] = useState('');
  const [filterSekolah, setFilterSekolah] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pastikan data adalah array untuk menghindari crash
  const safeData = Array.isArray(data) ? data : [];

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterWilayah, filterKelurahan, filterSekolah, searchTerm]);

  // 1. Data Filtering Logic
  const filteredData = useMemo(() => {
    return safeData.filter(item => {
      if (!item) return false;
      const matchWilayah = !filterWilayah || item.kecamatan === filterWilayah;
      const matchKelurahan = !filterKelurahan || item.kelurahan === filterKelurahan;
      const matchSekolah = !filterSekolah || item.asalSekolah === filterSekolah;
      const matchSearch = !searchTerm || 
        (item.nama && item.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.nik && item.nik.includes(searchTerm));
      return matchWilayah && matchKelurahan && matchSekolah && matchSearch;
    });
  }, [safeData, filterWilayah, filterKelurahan, filterSekolah, searchTerm]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // 3. Calculations
  const totalPendaftar = filteredData.length;
  const maleCount = filteredData.filter(d => d.jk === 'Laki-laki').length;
  const femaleCount = filteredData.filter(d => d.jk === 'Perempuan').length;
  
  const statusKerjaCount = filteredData.reduce((acc, curr) => {
    if (curr.statusKerja) {
      acc[curr.statusKerja] = (acc[curr.statusKerja] || 0) + 1;
    }
    return acc;
  }, {});

  const pelatihanCount = filteredData.reduce((acc, curr) => {
    if(curr.pelatihan) acc[curr.pelatihan] = (acc[curr.pelatihan] || 0) + 1;
    return acc;
  }, {});

  // Options for filters
  const wilayahOptions = Array.from(new Set(safeData.map(d => d.kecamatan).filter(Boolean))).sort();
  const kelurahanOptions = Array.from(new Set(
    safeData
      .filter(d => !filterWilayah || d.kecamatan === filterWilayah)
      .map(d => d.kelurahan)
      .filter(Boolean)
  )).sort();
  const sekolahOptions = Array.from(new Set(safeData.map(d => d.asalSekolah).filter(Boolean))).sort();

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn space-y-8">
      {/* Header & Main Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Pemetaan</h2>
          <p className="text-slate-500 text-sm">Analisis data peminatan karir dan pelatihan tenaga kerja.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari Nama / NIK..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none w-full md:w-80 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Advance Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400 border-r pr-4 border-slate-100">
          <Filter size={18}/>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter</span>
        </div>
        
        {/* Filter Wilayah */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase px-1">Kecamatan</p>
          <select 
            value={filterWilayah} 
            onChange={(e) => {setFilterWilayah(e.target.value); setFilterKelurahan('')}}
            className="bg-slate-50 py-1.5 px-3 rounded-lg text-sm outline-none cursor-pointer font-medium text-slate-700 border border-slate-100 hover:border-amber-300 transition-colors"
          >
            <option value="">Semua Kecamatan</option>
            {wilayahOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* Filter Kelurahan */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase px-1">Kelurahan</p>
          <select 
            value={filterKelurahan} 
            onChange={(e) => setFilterKelurahan(e.target.value)}
            className="bg-slate-50 py-1.5 px-3 rounded-lg text-sm outline-none cursor-pointer font-medium text-slate-700 border border-slate-100 hover:border-amber-300 transition-colors"
          >
            <option value="">Semua Kelurahan</option>
            {kelurahanOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* Filter Sekolah */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase px-1">Asal Sekolah</p>
          <select 
            value={filterSekolah} 
            onChange={(e) => setFilterSekolah(e.target.value)}
            className="bg-slate-50 py-1.5 px-3 rounded-lg text-sm outline-none cursor-pointer font-medium text-slate-700 border border-slate-100 hover:border-amber-300 transition-colors"
          >
            <option value="">Semua Sekolah</option>
            {sekolahOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <button 
          onClick={() => {setFilterWilayah(''); setFilterKelurahan(''); setFilterSekolah(''); setSearchTerm('')}}
          className="ml-auto text-xs font-bold text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          Reset Filter
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-amber-100 p-4 rounded-2xl text-amber-600"><Users size={28}/></div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Data</p>
            <p className="text-2xl font-bold text-slate-900">{totalPendaftar}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><UserIcon size={28}/></div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Laki-Laki</p>
            <p className="text-2xl font-bold text-slate-900">{maleCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-pink-100 p-4 rounded-2xl text-pink-600"><UserIcon size={28}/></div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Perempuan</p>
            <p className="text-2xl font-bold text-slate-900">{femaleCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600"><Briefcase size={28}/></div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Siap Kerja</p>
            <p className="text-2xl font-bold text-slate-900">{statusKerjaCount['Sedang mencari kerja'] || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section - Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
             <div className="w-1 h-5 bg-slate-800 rounded-full"></div>
             Status Pekerjaan Saat Ini
          </h3>
          <div className="space-y-5">
            {Object.entries(statusKerjaCount).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">{status || 'Tidak diisi'}</span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">{count} orang</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-slate-800 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${totalPendaftar > 0 ? (count/totalPendaftar)*100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Section - Pelatihan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
             <div className="w-1 h-5 bg-amber-500 rounded-full"></div>
             Top Peminatan Pelatihan
          </h3>
          <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-5">
              {Object.entries(pelatihanCount)
                .sort((a,b) => b[1] - a[1])
                .map(([pelatihan, count]) => (
                <div key={pelatihan}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 font-medium">{pelatihan}</span>
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs">{count} Peminat</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${totalPendaftar > 0 ? (count/totalPendaftar)*100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {Object.keys(pelatihanCount).length === 0 && (
                <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl">Belum ada data pendaftar.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">Daftar Pengisi Data Lengkap</h3>
          <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded-full font-bold">
            {totalPendaftar} Data
          </span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {paginatedData.length > 0 ? (
            paginatedData.map((person, idx) => (
              <div key={person.id || idx} className="p-6 hover:bg-slate-50/80 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white">
                      {getInitials(person.nama)}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${person.jk === 'Laki-laki' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {person.jk === 'Laki-laki' ? 'LAKI-LAKI' : 'PEREMPUAN'}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{person.nama || 'Tanpa Nama'}</h4>
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1.5"><MapPin size={14}/> {person.kecamatan || '-'}, {person.kelurahan || '-'}</span>
                          <span className="flex items-center gap-1.5"><Calendar size={14}/> {person.usia || '?'} Thn</span>
                          <span className="flex items-center gap-1.5"><Phone size={14}/> {typeof person.noWa === 'string' ? person.noWa.replace("'", "") : person.noWa}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pendidikan</span>
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                          <GraduationCap size={16} className="text-amber-500"/>
                          {person.pendidikan || '-'} {person.jurusan && `- ${person.jurusan}`}
                        </div>
                        <p className="text-[10px] text-slate-500 italic font-medium">{person.asalSekolah || '-'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Award size={18} className="text-amber-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keahlian & Pengalaman</p>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              <span className="font-bold text-slate-900">Keahlian:</span> {person.keahlian || '-'}<br/>
                              <span className="font-bold text-slate-900">Pengalaman:</span> {person.pengalaman || 'Belum ada'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Target size={18} className="text-blue-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Minat Pelatihan & Karir</p>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              <span className="font-bold text-slate-900">Pelatihan:</span> {person.pelatihan || '-'} ({person.tujuanPelatihan || '-'})<br/>
                              <span className="font-bold text-slate-900">Status:</span> {person.statusKerja || '-'} - {person.lokasiKerja || '-'}
                            </p>
                            {person.alasanPelatihan && (
                               <p className="text-xs italic text-slate-500 mt-1 border-l-2 border-slate-200 pl-2">
                                 "{person.alasanPelatihan}"
                               </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-slate-400 flex flex-col items-center gap-4">
              <Users size={48} className="text-slate-200" />
              <p>Tidak ada data yang sesuai dengan filter.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, totalPendaftar)}</span> dari <span className="font-bold text-slate-900">{totalPendaftar}</span> data
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Only show 5 pages if total pages > 5
                  if (totalPages > 5) {
                    if (pageNum !== 1 && pageNum !== totalPages && (pageNum < currentPage - 1 || pageNum > currentPage + 1)) {
                      if (pageNum === currentPage - 2 || pageNum === currentPage + 2) return <span key={pageNum} className="px-1 text-slate-400">...</span>;
                      return null;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                        currentPage === pageNum 
                          ? 'bg-slate-900 text-white shadow-md' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
