import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  School,
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  Award,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const SchoolRegisterModal: React.FC = () => {
  const {
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    registerSchoolAndAdmin,
    setIsAuthModalOpen,
    appearance,
  } = useApp();

  const [schoolName, setSchoolName] = useState('');
  const [npsn, setNpsn] = useState('');
  const [level, setLevel] = useState<'SD' | 'SMP' | 'SMA' | 'SMK' | 'Madrasah'>('SMP');
  const [accreditation, setAccreditation] = useState<'A' | 'B' | 'C' | 'Belum Terakreditasi'>('A');
  const [address, setAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [principalName, setPrincipalName] = useState('');

  // Admin Credentials
  const [adminName, setAdminName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isRegisterModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!schoolName.trim() || !npsn.trim() || !adminName.trim() || !adminUsername.trim() || !adminPassword.trim()) {
      setErrorMsg('Harap lengkapi semua kolom wajib (*) Data Sekolah dan Akun Admin.');
      return;
    }

    if (adminPassword.length < 6) {
      setErrorMsg('Password administrator minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      await registerSchoolAndAdmin(
        {
          name: schoolName.trim(),
          npsn: npsn.trim(),
          level,
          accreditation,
          address: address.trim() || 'Indonesia',
          contactEmail: contactEmail.trim() || `${adminUsername.trim()}@${npsn.trim()}.sch.id`,
          phone: adminPhone.trim() || '+62 812-0000-1111',
          principalName: principalName.trim() || `Kepala Sekolah ${schoolName.trim()}`,
          totalStudents: 0,
          totalTeachers: 0,
          cloudSyncStatus: 'sinkron',
        },
        {
          name: adminName.trim(),
          username: adminUsername.trim(),
          password: adminPassword,
          email: adminEmail.trim() || contactEmail.trim(),
          phone: adminPhone.trim(),
        }
      );

      setIsLoading(false);
      setIsRegisterModalOpen(false);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Terjadi kesalahan saat mendaftarkan sekolah.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header with decorative brand color */}
        <div
          className="p-6 text-white relative"
          style={{ backgroundColor: appearance.primaryHex || '#1d4ed8' }}
        >
          <button
            onClick={() => setIsRegisterModalOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-400 text-slate-950 inline-block mb-1">
                Portal Pendaftaran Sekolah Baru
              </span>
              <h2 className="text-xl font-black">Daftarkan Sekolah & Akun Admin</h2>
            </div>
          </div>
          <p className="text-xs text-blue-100 max-w-xl">
            Lengkapi formulir di bawah ini untuk mengaktifkan portal SIAKAD sekolah Anda. Akun Admin Sekolah yang dibuat akan berwenang penuh mengelola akun Kepala Sekolah, Guru, Murid, dan Orang Tua.
          </p>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Data Sekolah */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <School className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">1. Data Profil Sekolah</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Resmi Sekolah <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SMA Teladan Bangsa"
                    value={schoolName}
                    onChange={(e) => {
                      setSchoolName(e.target.value);
                      if (!adminUsername && e.target.value) {
                        const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                        setAdminUsername(`admin.${slug.substring(0, 10)}`);
                      }
                    }}
                    className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NPSN (Nomor Pokok Sekolah Nasional) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="8 digit, misal: 20108877"
                  value={npsn}
                  onChange={(e) => setNpsn(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jenjang Pendidikan</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="SD">SD (Sekolah Dasar)</option>
                  <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                  <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                  <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                  <option value="Madrasah">Madrasah (MI / MTs / MA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Akreditasi</label>
                <select
                  value={accreditation}
                  onChange={(e) => setAccreditation(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="A">Akreditasi A (Unggul)</option>
                  <option value="B">Akreditasi B (Baik)</option>
                  <option value="C">Akreditasi C (Cukup)</option>
                  <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  placeholder="Contoh: Drs. H. Ahmad Dahlan, M.Pd"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap Sekolah</label>
                <input
                  type="text"
                  placeholder="Contoh: Jl. Merdeka No. 45, Kebayoran, Jakarta Selatan"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Akun Administrator Sekolah */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">2. Data Akun Administrator Sekolah</h3>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                Akun ini akan menjadi akun utama yang mengontrol sistem sekolah Anda. Anda dapat membuat dan mengatur akun Kepala Sekolah, Guru, Siswa, dan Orang Tua setelah pendaftaran ini.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Admin <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso, S.Kom"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username Login Admin <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: admin.teladan"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value.toLowerCase())}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password Login Admin <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp / Handphone</label>
                <input
                  type="tel"
                  placeholder="+62 812-xxxx-xxxx"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Administrator</label>
                <input
                  type="email"
                  placeholder="admin@sekolah.sch.id"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsRegisterModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              Sudah punya akun? Masuk di sini
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memproses Pendaftaran...</span>
              ) : (
                <>
                  <span>Daftarkan Sekolah & Masuk Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
