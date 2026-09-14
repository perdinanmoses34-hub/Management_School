import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  Plus,
  Power,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Server,
  Activity,
  Users,
  Award,
  Globe,
  X,
  Edit2,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SchoolEntity } from '../../types';

export const SuperAdminView: React.FC = () => {
  const {
    schools,
    addSchool,
    updateSchoolStatus,
    updateSchoolExpiry,
    open2FAModal,
    setActiveSchoolId,
    activeSchool,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState<SchoolEntity | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState('');

  // New School Form State
  const [formName, setFormName] = useState('');
  const [formNpsn, setFormNpsn] = useState('');
  const [formPackage, setFormPackage] = useState<'Enterprise' | 'Pro' | 'Standard'>('Enterprise');
  const [formHeadmaster, setFormHeadmaster] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formRadius, setFormRadius] = useState(150);
  const [formExpiry, setFormExpiry] = useState('2027-12-31');
  const [formAdminUsername, setFormAdminUsername] = useState('');
  const [formAdminPassword, setFormAdminPassword] = useState('');

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.npsn.includes(searchQuery) ||
      s.headmasterName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGlobalStudents = schools.reduce((acc, s) => acc + s.studentCount, 0);
  const totalGlobalTeachers = schools.reduce((acc, s) => acc + s.teacherCount, 0);
  const activeSchoolsCount = schools.filter((s) => s.status === 'aktif').length;
  const expiredSchoolsCount = schools.filter((s) => s.status === 'kadaluarsa').length;

  const handleToggleStatus = (school: SchoolEntity) => {
    const nextStatus = school.status === 'aktif' ? 'nonaktif' : 'aktif';
    open2FAModal(() => {
      updateSchoolStatus(school.id, nextStatus);
    }, `Konfirmasi Perubahan Status Sekolah [${school.name}] menjadi ${nextStatus.toUpperCase()}`);
  };

  const handleOpenExpiryModal = (school: SchoolEntity) => {
    setShowExpiryModal(school);
    setNewExpiryDate(school.expiredDate);
  };

  const handleSaveExpiry = () => {
    if (!showExpiryModal || !newExpiryDate) return;
    open2FAModal(() => {
      updateSchoolExpiry(showExpiryModal.id, newExpiryDate);
      setShowExpiryModal(null);
    }, `Perpanjang Masa Berlaku Lisensi Sekolah [${showExpiryModal.name}]`);
  };

  const handleCreateSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formNpsn) {
      alert('Harap lengkapi nama sekolah dan NPSN');
      return;
    }

    open2FAModal(() => {
      addSchool(
        {
          name: formName,
          npsn: formNpsn,
          status: 'aktif',
          packageType: formPackage,
          expiredDate: formExpiry,
          studentCount: 350,
          teacherCount: 28,
          latitude: -6.2,
          longitude: 106.8,
          geofenceRadiusMeters: formRadius,
          address: formAddress || 'Jl. Pendidikan Nasional',
          accreditation: 'A',
          contactEmail: formEmail || `admin@${formNpsn}.sch.id`,
          headmasterName: formHeadmaster || 'Kepala Sekolah',
        },
        formAdminUsername.trim() || undefined,
        formAdminPassword || undefined
      );
      setShowAddModal(false);
      // Reset form
      setFormName('');
      setFormNpsn('');
      setFormHeadmaster('');
      setFormEmail('');
      setFormAddress('');
      setFormAdminUsername('');
      setFormAdminPassword('');
    }, 'Otorisasi Pendaftaran Entitas Sekolah Baru (Super Admin)');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t.superAdmin.title}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  ROOT PLATFORM
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Kontrol multi-sekolah, manajemen lisensi, masa kadaluarsa, dan analitik performa global
              </p>
            </div>
          </div>
        </div>

        <button
          id="btn-add-school-modal"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun Sekolah Baru</span>
        </button>
      </div>

      {/* Global SaaS Platform Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Sekolah Terdaftar</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{schools.length}</span>
            <span className="text-xs font-semibold text-slate-500">Entitas Sekolah</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {activeSchoolsCount} Aktif • {expiredSchoolsCount} Kadaluarsa
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Siswa Terkoneksi</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-600">
              {totalGlobalStudents.toLocaleString('id-ID')}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Seluruh Tenant Sekolah</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Tenaga Pendidik</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-600">
              {totalGlobalTeachers.toLocaleString('id-ID')}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Guru Aktif Mengajar</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Kesehatan Infrastruktur</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">99.98%</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Server Cloud & API Normal
          </span>
        </div>
      </div>

      {/* Multi-Tenant Schools Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Daftar Entitas Sekolah & Status Lisensi</h3>
            <p className="text-xs text-slate-500">
              Pengaturan hak akses, masa aktif langganan, dan status operasional
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama sekolah atau NPSN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4">Nama Sekolah & NPSN</th>
                <th className="p-3.5 sm:p-4">Kepala Sekolah</th>
                <th className="p-3.5 sm:p-4 text-center">Paket</th>
                <th className="p-3.5 sm:p-4 text-center">Status</th>
                <th className="p-3.5 sm:p-4">Masa Berlaku Lisensi</th>
                <th className="p-3.5 sm:p-4 text-center">Siswa / Guru</th>
                <th className="p-3.5 sm:p-4 text-right">Aksi Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchools.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 sm:p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs border border-purple-100">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{sc.name}</span>
                          {sc.id === activeSchool.id && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-100 text-blue-800">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">NPSN: {sc.npsn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 sm:p-4 text-slate-700 whitespace-nowrap">{sc.headmasterName}</td>
                  <td className="p-3.5 sm:p-4 text-center whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      {sc.packageType}
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        sc.status === 'aktif'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : sc.status === 'kadaluarsa'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {sc.status === 'aktif' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Aktif
                        </>
                      ) : sc.status === 'kadaluarsa' ? (
                        <>
                          <Clock className="w-3 h-3" /> Kadaluarsa
                        </>
                      ) : (
                        <>
                          <Power className="w-3 h-3" /> Nonaktif
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-700 font-semibold">{sc.expiredDate}</span>
                      <button
                        onClick={() => handleOpenExpiryModal(sc)}
                        title="Perpanjang Lisensi"
                        className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50 transition cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="p-3.5 sm:p-4 text-center font-mono font-medium text-slate-600 whitespace-nowrap">
                    {sc.studentCount} / {sc.teacherCount}
                  </td>
                  <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {sc.id !== activeSchool.id && (
                        <button
                          onClick={() => setActiveSchoolId(sc.id)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition border border-blue-200 cursor-pointer"
                        >
                          Pilih Sekolah
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleStatus(sc)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                          sc.status === 'aktif'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {sc.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New School Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Daftarkan Entitas Sekolah Baru</h3>
                <p className="text-xs text-slate-500">Pemberian izin lisensi sistem informasi akademik sekolah</p>
              </div>
            </div>

            <form onSubmit={handleCreateSchoolSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Resmi Sekolah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMP Negeri 1 Harapan Bangsa"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Pokok (NPSN)</label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="8 digit angka..."
                    value={formNpsn}
                    onChange={(e) => setFormNpsn(e.target.value)}
                    className="w-full font-mono px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Paket Lisensi</label>
                  <select
                    value={formPackage}
                    onChange={(e) => setFormPackage(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-hidden"
                  >
                    <option value="Enterprise">Enterprise (Full E2EE)</option>
                    <option value="Pro">Pro (Standar Cloud)</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  placeholder="Nama lengkap beserta gelar..."
                  value={formHeadmaster}
                  onChange={(e) => setFormHeadmaster(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Kontak Resmi</label>
                  <input
                    type="email"
                    placeholder="kontak@sekolah.sch.id"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Masa Berlaku Lisensi</label>
                  <input
                    type="date"
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className="w-full font-mono px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Radius Geofence Absensi (Meter)</label>
                <input
                  type="number"
                  min={50}
                  max={500}
                  value={formRadius}
                  onChange={(e) => setFormRadius(Number(e.target.value))}
                  className="w-full font-mono px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Kampus Sekolah</label>
                <textarea
                  rows={2}
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Alamat lengkap lokasi sekolah..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              {/* Admin Account Credentials Configuration */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2.5">
                <p className="text-xs font-extrabold text-purple-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Akun Default Administrator Sekolah Ini
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Username Admin</label>
                    <input
                      type="text"
                      value={formAdminUsername}
                      onChange={(e) => setFormAdminUsername(e.target.value)}
                      placeholder={`misal: admin.${formNpsn || 'sekolah'}`}
                      className="w-full font-mono text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Kata Sandi Awal</label>
                    <input
                      type="text"
                      value={formAdminPassword}
                      onChange={(e) => setFormAdminPassword(e.target.value)}
                      placeholder="Default: Admin_<NPSN>!"
                      className="w-full font-mono text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-purple-700">
                  Admin sekolah dapat mengelola akun guru, siswa, orang tua, dan menyesuaikan tampilan sekolah mereka secara mandiri.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition cursor-pointer"
                >
                  Simpan & Buat Lisensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Expiry Modal Dialog */}
      {showExpiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowExpiryModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Atur Masa Berlaku Lisensi</h3>
                <p className="text-xs text-slate-500">{showExpiryModal.name}</p>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Kadaluarsa Baru
              </label>
              <input
                type="date"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                className="w-full font-mono text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowExpiryModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveExpiry}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
