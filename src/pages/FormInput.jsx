import React, { useState } from 'react';
import { 
  Save, 
  User, 
  BookOpen, 
  AlertCircle, 
  Briefcase, 
  MessageSquare, 
  Loader2, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { dataWilayah } from '../constants/wilayah';
import { dataSekolah } from '../constants/sekolah';
import { GOOGLE_SCRIPT_URL } from '../constants/config';
import { SearchableSelect } from '../components/SearchableSelect';

export default function FormInput({ onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const initialForm = {
    nama: '', nik: '', kecamatan: '', kelurahan: '', noWa: '', usia: '', jk: '',
    pendidikan: '', asalSekolah: '', jurusan: '', keahlian: [], keahlianLain: '', pengalaman: '',
    pelatihan: '', pelatihanLainnya: '', tujuanPelatihan: '',
    statusKerja: '', lokasiKerja: '', gaji: '', industri: '', industriLainnya: '', saran: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      let newKeahlian = [...formData.keahlian];
      if (checked) newKeahlian.push(value);
      else newKeahlian = newKeahlian.filter(k => k !== value);
      setFormData({ ...formData, keahlian: newKeahlian });
    } else if (name === 'kecamatan') {
      setFormData({ ...formData, kecamatan: value, kelurahan: '' });
    } else if (name === 'nik') {
      if (value === '' || (/^[0-9]+$/.test(value) && value.length <= 16)) {
         setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(formData.nik.length !== 16) {
      alert("NIK harus tepat 16 digit sesuai aturan Dukcapil.");
      return;
    }

    setIsSubmitting(true);
    setShowError(false);

    const dataToSubmit = {
      ...formData,
      id: Date.now(),
      keahlian: formData.keahlian.join(', ') + (formData.keahlianLain ? `, ${formData.keahlianLain}` : ''),
      pelatihan: formData.pelatihan === 'Lainnya' ? formData.pelatihanLainnya : formData.pelatihan,
      industri: formData.industri === 'Lainnya' ? formData.industriLainnya : formData.industri
    };

    try {
      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "MASUKKAN_URL_GAS_DISINI") {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSubmit)
        });
      }

      onSubmit(dataToSubmit);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessModal(true);
        setFormData(initialForm);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);

    } catch (error) {
      console.error("Error saving to GAS:", error);
      setTimeout(() => {
        setIsSubmitting(false);
        setShowError(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setShowError(false), 6000);
      }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn relative">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center animate-fadeIn">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-amber-500">
                <Save size={24} className="animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Menyimpan Data...</h3>
            <p className="text-sm text-slate-500 mb-6">Mohon tunggu sebentar, data sedang dienkripsi dan dikirim ke server Disnaker Surakarta.</p>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-500 h-2 rounded-full w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center">
            <div className="bg-green-100 p-4 rounded-full text-green-500 mb-4">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Berhasil Disimpan!</h3>
            <p className="text-sm text-slate-500 mb-6">Terima kasih atas partisipasinya. Data Anda telah masuk dengan aman ke sistem Disnaker Surakarta.</p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
            >
              Tutup & Kembali
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Pendaftaran Program</h2>
        <p className="text-slate-500">Isi data di bawah ini dengan valid dan sesuai KTP Surakarta.</p>
      </div>

      {showError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-fadeIn">
          <XCircle className="text-red-500 shrink-0" />
          <div>
            <p className="font-bold">Gagal menyimpan data.</p>
            <p className="text-sm mt-0.5">Mohon periksa koneksi internet Anda atau coba beberapa saat lagi.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={isSubmitting} className={`space-y-8 transition-opacity duration-300 ${isSubmitting ? 'opacity-60 pointer-events-none' : ''}`}>
          
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><User size={20}/></div>
              <h3 className="text-lg font-bold text-slate-800">1. Profil Dasar (Identitas)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
                <input required type="text" name="nama" value={formData.nama} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all disabled:bg-slate-200" placeholder="Sesuai KTP" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">NIK (16 Digit) <span className="text-red-500">*</span></label>
                <input required type="text" name="nik" value={formData.nik} onChange={handleChange} className={`w-full p-2.5 bg-slate-50 border ${formData.nik && formData.nik.length !== 16 ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-amber-500'} rounded-lg focus:ring-2 outline-none transition-all disabled:bg-slate-200`} placeholder="Contoh: 33720..." />
                {formData.nik && formData.nik.length !== 16 && (
                  <p className="text-xs text-red-500 mt-1">NIK harus persis 16 digit angka (kurang {16 - formData.nik.length} digit).</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Kecamatan <span className="text-red-500">*</span></label>
                <select required name="kecamatan" value={formData.kecamatan} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200">
                  <option value="">Pilih Kecamatan</option>
                  {Object.keys(dataWilayah).map(kec => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Kelurahan <span className="text-red-500">*</span></label>
                <select required name="kelurahan" value={formData.kelurahan} onChange={handleChange} disabled={!formData.kecamatan || isSubmitting} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200 disabled:cursor-not-allowed">
                  <option value="">{formData.kecamatan ? 'Pilih Kelurahan' : 'Pilih Kecamatan Dulu'}</option>
                  {formData.kecamatan && dataWilayah[formData.kecamatan].map(kel => (
                    <option key={kel} value={kel}>{kel}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nomor WhatsApp <span className="text-red-500">*</span></label>
                <input required type="number" name="noWa" value={formData.noWa} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200" placeholder="Contoh: 0812..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Usia <span className="text-red-500">*</span></label>
                  <input required type="number" name="usia" value={formData.usia} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200" placeholder="Tahun" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Jenis Kelamin <span className="text-red-500">*</span></label>
                  <select required name="jk" value={formData.jk} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200">
                    <option value="">Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><BookOpen size={20}/></div>
              <h3 className="text-lg font-bold text-slate-800">2. Riwayat Pendidikan & Keahlian</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Pendidikan Terakhir <span className="text-red-500">*</span></label>
                <select required name="pendidikan" value={formData.pendidikan} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200">
                  <option value="">Pilih Pendidikan</option>
                  <option value="SD">SD Sederajat</option>
                  <option value="SMP">SMP Sederajat</option>
                  <option value="SMA">SMA</option>
                  <option value="SMK">SMK</option>
                  <option value="Diploma">Diploma (D1-D4)</option>
                  <option value="S1">S1</option>
                  <option value="S2/S3">S2/S3</option>
                </select>
              </div>
              
              {!['', 'SD', 'SMP', 'SMA'].includes(formData.pendidikan) ? (
                <SearchableSelect 
                  label="Asal Sekolah / Instansi"
                  required={true}
                  options={dataSekolah}
                  value={formData.asalSekolah}
                  onChange={(val) => setFormData({ ...formData, asalSekolah: val })}
                  placeholder="Cari SMK/Universitas..."
                />
              ) : (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Jurusan</label>
                  <input type="text" name="jurusan" value={formData.jurusan} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200" placeholder="Kosongi jika tidak relevan" />
                </div>
              )}
            </div>

            {/* Jika pendidikan > SMA, maka Jurusan dipindah ke baris baru agar layout tetap rapi */}
            {!['', 'SD', 'SMP', 'SMA'].includes(formData.pendidikan) && (
              <div className="space-y-1 mb-6">
                <label className="text-sm font-medium text-slate-700">Jurusan</label>
                <input type="text" name="jurusan" value={formData.jurusan} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200" placeholder="Contoh: Akuntansi, Teknik Mesin..." />
              </div>
            )}

            <div className="space-y-3 mb-6">
              <label className="text-sm font-medium text-slate-700">Keahlian yang Dimiliki</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Menjahit', 'IT / Coding', 'Memasak', 'Las / Welding', 'Administrasi', 'Desain Grafis', 'Otomotif'].map(skill => (
                  <label key={skill} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input type="checkbox" name="keahlian" value={skill} checked={formData.keahlian.includes(skill)} onChange={handleChange} className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500 disabled:cursor-not-allowed" />
                    {skill}
                  </label>
                ))}
              </div>
              <input type="text" name="keahlianLain" value={formData.keahlianLain} onChange={handleChange} className="w-full p-2.5 mt-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm disabled:bg-slate-200" placeholder="Keahlian lainnya..." />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Pengalaman Kerja (Jika ada)</label>
              <textarea name="pengalaman" value={formData.pengalaman} onChange={handleChange} rows="2" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200" placeholder="Sebutkan nama perusahaan dan posisi terakhir"></textarea>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><AlertCircle size={20}/></div>
              <h3 className="text-lg font-bold text-slate-800">3. Peminatan Pelatihan (Upgrade Skill)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Jenis Pelatihan yang Diinginkan</label>
                <select name="pelatihan" value={formData.pelatihan} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200">
                  <option value="">Pilih Pelatihan</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Barista">Barista</option>
                  <option value="Desain Grafis">Desain Grafis</option>
                  <option value="Perbengkelan">Perbengkelan</option>
                  <option value="Tata Rias / Salon">Tata Rias / Salon</option>
                  <option value="Garmen / Menjahit">Garmen / Menjahit</option>
                  <option value="Lainnya">Lainnya (Sebutkan di bawah)</option>
                </select>
                {formData.pelatihan === 'Lainnya' && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg animate-fadeIn">
                    <label className="text-sm font-medium text-slate-700 block mb-1">Sebutkan Pelatihan yang Diinginkan <span className="text-red-500">*</span></label>
                    <input required type="text" name="pelatihanLainnya" value={formData.pelatihanLainnya} onChange={handleChange} className="w-full p-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 outline-none text-sm disabled:bg-slate-200" placeholder="Contoh: Video Editor, Sablon..." />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Tujuan Pelatihan</label>
                <select name="tujuanPelatihan" value={formData.tujuanPelatihan} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200">
                  <option value="">Pilih Tujuan</option>
                  <option value="Bekerja di Perusahaan">Ingin bekerja di perusahaan</option>
                  <option value="Buka Usaha">Ingin buka usaha sendiri/UMKM</option>
                  <option value="Hobi">Sekadar hobi/tambah ilmu</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><Briefcase size={20}/></div>
              <h3 className="text-lg font-bold text-slate-800">4. Peminatan Kerja</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Status Saat Ini <span className="text-red-500">*</span></label>
                <select required name="statusKerja" value={formData.statusKerja} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200">
                  <option value="">Pilih Status</option>
                  <option value="Belum bekerja">Belum bekerja</option>
                  <option value="Sedang mencari kerja">Sedang mencari kerja aktif</option>
                  <option value="Sudah bekerja ingin pindah">Sudah bekerja tapi ingin pindah</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Lokasi Kerja yang Diinginkan</label>
                <select name="lokasiKerja" value={formData.lokasiKerja} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200">
                  <option value="">Pilih Lokasi</option>
                  <option value="Dalam Kota Solo">Hanya di dalam Kota Solo</option>
                  <option value="Solo Raya">Solo Raya (Sukoharjo, Boyolali, dll)</option>
                  <option value="Luar Kota">Luar Kota / Nasional</option>
                  <option value="Luar Negeri">Bersedia di Luar Negeri</option>
                </select>
              </div>
               <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Sektor Industri yang Diminati</label>
                <select name="industri" value={formData.industri} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200">
                  <option value="">Pilih Sektor</option>
                  <option value="Manufaktur / Pabrik">Manufaktur / Pabrik</option>
                  <option value="Perbankan / Keuangan">Perbankan / Keuangan</option>
                  <option value="Teknologi Informasi (IT) & Digital">Teknologi Informasi (IT) & Digital</option>
                  <option value="Pendidikan / Riset">Pendidikan / Riset</option>
                  <option value="Kesehatan / Farmasi">Kesehatan / Farmasi</option>
                  <option value="Pertambangan & Energi">Pertambangan & Energi</option>
                  <option value="Pertanian / Perkebunan / Perikanan">Pertanian / Perkebunan / Perikanan</option>
                  <option value="Konstruksi & Properti">Konstruksi & Properti</option>
                  <option value="Ritel / Perdagangan">Ritel / Perdagangan</option>
                  <option value="Logistik & Transportasi">Logistik & Transportasi</option>
                  <option value="Perhotelan / Pariwisata">Perhotelan / Pariwisata</option>
                  <option value="Industri Kreatif & Media">Industri Kreatif & Media</option>
                  <option value="Jasa Profesional (Hukum, Konsultan, dll)">Jasa Profesional (Hukum, Konsultan, dll)</option>
                  <option value="Lainnya">Lainnya (Sebutkan di bawah)</option>
                </select>
                {formData.industri === 'Lainnya' && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg animate-fadeIn">
                    <label className="text-sm font-medium text-slate-700 block mb-1">Sebutkan Industri yang Diminati <span className="text-red-500">*</span></label>
                    <input required type="text" name="industriLainnya" value={formData.industriLainnya} onChange={handleChange} className="w-full p-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 outline-none text-sm disabled:bg-slate-200" placeholder="Contoh: Event Organizer, Pertanian..." />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Ekspektasi Gaji (Opsional)</label>
                <select name="gaji" value={formData.gaji} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200">
                  <option value="">Pilih Range Gaji</option>
                  <option value="UMK">Sesuai UMK Surakarta</option>
                  <option value="Rp 2.000.000 - Rp 4.000.000">Rp 2.000.000 - Rp 4.000.000</option>
                  <option value="> Rp 4.000.000">&gt; Rp 4.000.000</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><MessageSquare size={20}/></div>
              <h3 className="text-lg font-bold text-slate-800">5. Masukan & Saran</h3>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Masukan / Saran untuk Disnaker (Opsional)</label>
              <textarea name="saran" value={formData.saran} onChange={handleChange} rows="3" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:bg-slate-200" placeholder="Tuliskan harapan atau usulan Anda untuk program ketenagakerjaan dan pelatihan di Kota Surakarta ke depannya..."></textarea>
            </div>
          </div>

          <button 
            disabled={isSubmitting}
            type="submit" 
            className={`w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2 ${isSubmitting ? 'bg-slate-700 cursor-wait' : 'hover:bg-amber-500 hover:text-slate-900'}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Sedang Menyimpan...
              </>
            ) : (
              <>
                <Save size={20} /> Simpan Data Pendaftaran
              </>
            )}
          </button>
        </fieldset>
      </form>
    </div>
  );
}
