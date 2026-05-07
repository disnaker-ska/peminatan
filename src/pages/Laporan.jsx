import React from 'react';
import { Printer } from 'lucide-react';

export default function Laporan({ data }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <div className="flex justify-between items-end mb-6 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Rekap Data Pendaftar</h2>
          <p className="text-slate-500">Gunakan fitur ini untuk mencetak atau menyimpan sebagai PDF.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-amber-500 text-slate-900 font-bold py-2 px-4 rounded-lg shadow hover:bg-amber-600 flex items-center gap-2"
        >
          <Printer size={18} /> Cetak / PDF
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto print:shadow-none print:border-none print:p-0">
        <div className="hidden print:block mb-6 text-center">
          <h1 className="text-xl font-bold uppercase">Laporan Peminatan Kerja & Pelatihan</h1>
          <h2 className="text-lg">Dinas Tenaga Kerja Kota Surakarta</h2>
          <hr className="mt-4 border-slate-800 border-2" />
        </div>

        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100 print:bg-slate-200">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">No</th>
              <th className="px-4 py-3">Nama Lengkap</th>
              <th className="px-4 py-3">Kecamatan</th>
              <th className="px-4 py-3">Pendidikan</th>
              <th className="px-4 py-3">Minat Pelatihan</th>
              <th className="px-4 py-3">Status Kerja</th>
              <th className="px-4 py-3 rounded-tr-lg">Minat Lokasi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-400">Belum ada data pendaftar.</td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 print:border-slate-300">
                  <td className="px-4 py-3 font-medium text-slate-900">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">{row.nama}</div>
                    <div className="text-xs text-slate-400">NIK: {row.nik}</div>
                  </td>
                  <td className="px-4 py-3">{row.kecamatan}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{row.pendidikan} {row.jurusan && ` - ${row.jurusan}`}</div>
                    {row.asalSekolah && <div className="text-[10px] text-slate-400 font-medium italic uppercase">{row.asalSekolah}</div>}
                  </td>
                  <td className="px-4 py-3">{row.pelatihan || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      row.statusKerja === 'Belum bekerja' ? 'bg-red-100 text-red-700' :
                      row.statusKerja === 'Sedang mencari kerja' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {row.statusKerja || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.lokasiKerja || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}
