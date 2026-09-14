import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Save,
  RotateCcw,
  Check,
  Eye,
  Sliders,
  Type,
  Layout,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Bell,
  Sun,
  Laptop,
  LayoutGrid,
  Layers,
  CheckSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppearanceConfig, DashboardCardsConfig } from '../../types';

const COLOR_PRESETS = [
  {
    id: 'blue',
    name: 'Royal Blue (Klasik Edukasi)',
    primary: '#1d4ed8',
    accent: '#3b82f6',
    bgLight: 'bg-blue-50 text-blue-800 border-blue-200',
    swatch: 'bg-blue-600',
  },
  {
    id: 'emerald',
    name: 'Emerald Green (Prestasi & Alam)',
    primary: '#059669',
    accent: '#10b981',
    bgLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    swatch: 'bg-emerald-600',
  },
  {
    id: 'indigo',
    name: 'Indigo Modern (Modern Institusi)',
    primary: '#4338ca',
    accent: '#6366f1',
    bgLight: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    swatch: 'bg-indigo-600',
  },
  {
    id: 'purple',
    name: 'Violet Academic (Unggul & Kreatif)',
    primary: '#6d28d9',
    accent: '#8b5cf6',
    bgLight: 'bg-purple-50 text-purple-800 border-purple-200',
    swatch: 'bg-purple-600',
  },
  {
    id: 'rose',
    name: 'Crimson Rose (Semangat & Tegas)',
    primary: '#be123c',
    accent: '#f43f5e',
    bgLight: 'bg-rose-50 text-rose-800 border-rose-200',
    swatch: 'bg-rose-600',
  },
  {
    id: 'amber',
    name: 'Golden Amber (Kehangatan & Integritas)',
    primary: '#b45309',
    accent: '#f59e0b',
    bgLight: 'bg-amber-50 text-amber-800 border-amber-200',
    swatch: 'bg-amber-600',
  },
  {
    id: 'teal',
    name: 'Teal Oceanic (Kesejukan & Teknologi)',
    primary: '#0f766e',
    accent: '#14b8a6',
    bgLight: 'bg-teal-50 text-teal-800 border-teal-200',
    swatch: 'bg-teal-600',
  },
  {
    id: 'slate',
    name: 'Slate Minimalist (Monokrom Elegan)',
    primary: '#334155',
    accent: '#64748b',
    bgLight: 'bg-slate-100 text-slate-800 border-slate-300',
    swatch: 'bg-slate-700',
  },
];

const LOGO_PRESETS = [
  { id: 'cap', label: 'Topi Wisuda & Toga', icon: GraduationCap },
  { id: 'shield', label: 'Perisai Integritas', icon: ShieldCheck },
  { id: 'sun', label: 'Surya Prestasi', icon: Sun },
  { id: 'laptop', label: 'Teknologi Digital', icon: Laptop },
];

export const ThemeCustomizerView: React.FC = () => {
  const {
    appearance,
    updateAppearance,
    activeSchool,
    currentRole,
    currentUser,
    isFirestoreConnected,
  } = useApp();

  const isAuthorized = currentRole === 'super_admin' || currentRole === 'admin_sekolah';

  // Form local state
  const [formConfig, setFormConfig] = useState<AppearanceConfig>({
    ...appearance,
    dashboardCards: appearance.dashboardCards || {
      showQuickStats: true,
      showAcademicSummary: true,
      showAttendanceCard: true,
      showSppCard: true,
      showAnnouncementsCard: true,
      showQuickActions: true,
      cardStyle: 'bordered',
      cardDensity: 'normal',
      accentColor: appearance.primaryHex || '#1d4ed8',
    },
  });
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const handlePresetSelect = (preset: typeof COLOR_PRESETS[0]) => {
    setFormConfig((prev) => ({
      ...prev,
      colorPalette: preset.id as any,
      primaryHex: preset.primary,
      accentHex: preset.accent,
    }));
  };

  const handleSave = async () => {
    await updateAppearance(formConfig);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  const handleResetDefault = () => {
    setFormConfig({
      ...appearance,
      colorPalette: 'blue',
      primaryHex: '#1d4ed8',
      accentHex: '#3b82f6',
      appName: 'SIAKAD ' + activeSchool.name,
      schoolName: activeSchool.name,
      schoolMotto: 'Unggul dalam Budi Pekerti, Cerdas dalam Ilmu Pengetahuan',
      navbarStyle: 'gradient',
      fontFamily: 'font-sans',
      cardRadius: 'rounded-2xl',
      headerAnnouncement: 'Portal Pembelajaran Digital & Evaluasi Akademik Terintegrasi Cloud',
      showSchoolBadge: true,
      dashboardCards: {
        showQuickStats: true,
        showAcademicSummary: true,
        showAttendanceCard: true,
        showSppCard: true,
        showAnnouncementsCard: true,
        showQuickActions: true,
        cardStyle: 'bordered',
        cardDensity: 'normal',
        accentColor: '#1d4ed8',
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl text-white flex items-center justify-center shadow-md transition"
            style={{ backgroundColor: formConfig.primaryHex }}
          >
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Kustomisasi Tampilan & Identitas (Whitelabel)
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                ADMIN & SUPER ADMIN
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Ubah tema warna, nama aplikasi, logo, tipografi, dan gaya navbar untuk sekolah {activeSchool.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefault}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!isAuthorized}
            className="px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer hover:opacity-95"
            style={{ backgroundColor: formConfig.primaryHex }}
          >
            {isSavedRecently ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersimpan ke Cloud!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Terapkan & Simpan Tema</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!isAuthorized && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-medium">
          <Sliders className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Perhatian: Anda sedang melihat mode pratinjau. Hanya akun <strong>Admin Sekolah ({activeSchool.name})</strong> atau Pengelola Sistem yang memiliki izin menyimpan perubahan tema secara permanen ke server cloud.
          </span>
        </div>
      )}

      {/* Main 2-Column Layout: Controls on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Theme Color Palette Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600" />
                  Pilihan Palet Warna Utama
                </h3>
                <p className="text-xs text-slate-500">Pilih skema warna terakreditasi atau tentukan kode warna kustom</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = formConfig.primaryHex === preset.primary;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-blue-600 border-transparent bg-slate-50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-6 h-6 rounded-full ${preset.swatch} shadow-inner`}></div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{preset.name.split(' (')[0]}</p>
                      <p className="text-[10px] text-slate-500 truncate">{preset.primary}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Color Pickers */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Warna Primer Kustom (Hex)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formConfig.primaryHex}
                    onChange={(e) => setFormConfig({ ...formConfig, primaryHex: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-200 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formConfig.primaryHex}
                    onChange={(e) => setFormConfig({ ...formConfig, primaryHex: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-semibold uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Warna Aksen Kustom (Hex)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formConfig.accentHex}
                    onChange={(e) => setFormConfig({ ...formConfig, accentHex: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-200 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formConfig.accentHex}
                    onChange={(e) => setFormConfig({ ...formConfig, accentHex: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-semibold uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* School Identity & Branding */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Identitas Sekolah & Branding
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Portal Aplikasi
                </label>
                <input
                  type="text"
                  value={formConfig.appName}
                  onChange={(e) => setFormConfig({ ...formConfig, appName: e.target.value })}
                  placeholder="Contoh: SIAKAD Budi Mulia Terpadu"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Resmi Sekolah
                  </label>
                  <input
                    type="text"
                    value={formConfig.schoolName}
                    onChange={(e) => setFormConfig({ ...formConfig, schoolName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Slogan / Motto Sekolah
                  </label>
                  <input
                    type="text"
                    value={formConfig.schoolMotto}
                    onChange={(e) => setFormConfig({ ...formConfig, schoolMotto: e.target.value })}
                    placeholder="Contoh: Cerdas, Berkarakter, Berakhlak Mulia"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teks Pengumuman Header (Ticker Berjalan / Banner Atas)
                </label>
                <input
                  type="text"
                  value={formConfig.headerAnnouncement}
                  onChange={(e) => setFormConfig({ ...formConfig, headerAnnouncement: e.target.value })}
                  placeholder="Contoh: Penerimaan Rapor Semester Ganjil & Pembayaran SPP Online"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Logo Sekolah Kustom (Opsional)
                </label>
                <input
                  type="url"
                  value={formConfig.logoUrl}
                  onChange={(e) => setFormConfig({ ...formConfig, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo-sekolah.png"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Biarkan kosong untuk menggunakan lambang default akreditasi sekolah otomatis.
                </p>
              </div>
            </div>
          </div>

          {/* Layout & Typography Options */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layout className="w-4 h-4 text-emerald-600" />
              Gaya Tata Letak, Sudut Kartu & Tipografi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Navbar Style */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gaya Header Navbar
                </label>
                <select
                  value={formConfig.navbarStyle}
                  onChange={(e) => setFormConfig({ ...formConfig, navbarStyle: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                >
                  <option value="gradient">Gradien Mewah Modern</option>
                  <option value="solid">Warna Solid Bersih</option>
                  <option value="clean">Putih Minimalis & Border</option>
                  <option value="glass">Efek Kaca (Glassmorphism)</option>
                </select>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jenis Font Utama
                </label>
                <select
                  value={formConfig.fontFamily}
                  onChange={(e) => setFormConfig({ ...formConfig, fontFamily: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                >
                  <option value="font-sans">Sans-Serif (Modern & Terbaca)</option>
                  <option value="font-serif">Serif (Formal & Akademik)</option>
                  <option value="font-mono">Monospace (Tech & Data)</option>
                </select>
              </div>

              {/* Card Radius */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Lengkungan Sudut Kartu
                </label>
                <select
                  value={formConfig.cardRadius}
                  onChange={(e) => setFormConfig({ ...formConfig, cardRadius: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                >
                  <option value="rounded-xl">Kompak (12px)</option>
                  <option value="rounded-2xl">Modern Berimbang (16px)</option>
                  <option value="rounded-3xl">Pill Mewah (24px)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formConfig.showSchoolBadge}
                  onChange={(e) => setFormConfig({ ...formConfig, showSchoolBadge: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Tampilkan Lencana Akreditasi Resmi ({activeSchool.accreditation}) di Navbar
                </span>
              </label>
            </div>
          </div>

          {/* Dashboard Cards & Layout Customization */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-indigo-600" />
                Kustomisasi Kartu & Modul Dashboard (Admin)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Atur modul kartu yang tampil di beranda sekolah, gaya bayangan kartu, dan tingkat kerapatan visual
              </p>
            </div>

            {/* Card Style & Density */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gaya Desain Kartu (Card Style)
                </label>
                <select
                  value={formConfig.dashboardCards?.cardStyle || 'bordered'}
                  onChange={(e) =>
                    setFormConfig((prev) => ({
                      ...prev,
                      dashboardCards: {
                        ...(prev.dashboardCards || {
                          showQuickStats: true,
                          showAcademicSummary: true,
                          showAttendanceCard: true,
                          showSppCard: true,
                          showAnnouncementsCard: true,
                          showQuickActions: true,
                          cardDensity: 'normal',
                          accentColor: prev.primaryHex,
                        }),
                        cardStyle: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                >
                  <option value="bordered">Berbingkai Rapi (Bordered Minimalist)</option>
                  <option value="elevated">Bayangan Melayang (Elevated Shadow)</option>
                  <option value="flat">Datar Bersih (Flat Solid)</option>
                  <option value="gradient">Sentuhan Gradien Halus (Gradient Tint)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kerapatan Kartu (Density)
                </label>
                <select
                  value={formConfig.dashboardCards?.cardDensity || 'normal'}
                  onChange={(e) =>
                    setFormConfig((prev) => ({
                      ...prev,
                      dashboardCards: {
                        ...(prev.dashboardCards || {
                          showQuickStats: true,
                          showAcademicSummary: true,
                          showAttendanceCard: true,
                          showSppCard: true,
                          showAnnouncementsCard: true,
                          showQuickActions: true,
                          cardStyle: 'bordered',
                          accentColor: prev.primaryHex,
                        }),
                        cardDensity: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                >
                  <option value="compact">Kompak (Hemat Ruang Layar)</option>
                  <option value="normal">Normal (Standar Seimbang)</option>
                  <option value="spacious">Lapang (Spacious & Elegan)</option>
                </select>
              </div>
            </div>

            {/* Individual Card Toggles */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700">
                Pilih Kartu Modul yang Diaktifkan di Beranda:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    key: 'showQuickStats' as const,
                    label: 'Banner Identitas & Akreditasi',
                    desc: 'NPSN, akreditasi, nama kepala sekolah',
                  },
                  {
                    key: 'showQuickActions' as const,
                    label: 'Seksi Layanan Unggulan',
                    desc: 'Kontainer navigasi kartu interaktif',
                  },
                  {
                    key: 'showAcademicSummary' as const,
                    label: 'Kartu Nilai & Rapor Digital',
                    desc: 'Akses modul evaluasi akademik cloud',
                  },
                  {
                    key: 'showAttendanceCard' as const,
                    label: 'Kartu Absensi Geofence GPS',
                    desc: 'Akses pemindai biometrik kehadiran',
                  },
                  {
                    key: 'showSppCard' as const,
                    label: 'Kartu Pembayaran SPP Online',
                    desc: 'Akses QRIS & kuitansi tagihan',
                  },
                  {
                    key: 'showAnnouncementsCard' as const,
                    label: 'Papan Pengumuman & Agenda',
                    desc: 'Jadwal kalender pendidikan sekolah',
                  },
                ].map((card) => {
                  const currentCards = formConfig.dashboardCards || {
                    showQuickStats: true,
                    showAcademicSummary: true,
                    showAttendanceCard: true,
                    showSppCard: true,
                    showAnnouncementsCard: true,
                    showQuickActions: true,
                    cardStyle: 'bordered',
                    cardDensity: 'normal',
                    accentColor: formConfig.primaryHex,
                  };
                  const isChecked = !!currentCards[card.key];

                  return (
                    <div
                      key={card.key}
                      onClick={() =>
                        setFormConfig((prev) => ({
                          ...prev,
                          dashboardCards: {
                            ...(prev.dashboardCards || currentCards),
                            [card.key]: !isChecked,
                          },
                        }))
                      }
                      className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-blue-50/60 border-blue-200 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 pointer-events-none"
                      />
                      <div>
                        <p className="text-xs font-bold leading-tight">{card.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{card.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Real-Time Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-600" />
                Pratinjau Langsung (Live Preview)
              </span>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Respon Seketika
              </span>
            </div>

            {/* Simulated App Mockup */}
            <div className={`bg-slate-100 p-4 border border-slate-200 ${formConfig.cardRadius} shadow-sm space-y-3`}>
              {/* Simulated Header Announcement */}
              {formConfig.headerAnnouncement && (
                <div
                  className="text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 truncate shadow-xs"
                  style={{ backgroundColor: formConfig.primaryHex }}
                >
                  <Bell className="w-3 h-3 shrink-0" />
                  <span className="truncate">{formConfig.headerAnnouncement}</span>
                </div>
              )}

              {/* Simulated Navbar */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs shadow-xs"
                    style={{ backgroundColor: formConfig.primaryHex }}
                  >
                    {formConfig.logoUrl ? (
                      <img src={formConfig.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      'BM'
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 leading-tight">
                      {formConfig.appName || 'SIAKAD Sekolah'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[160px]">
                      {formConfig.schoolMotto || 'Motto Pendidikan'}
                    </p>
                  </div>
                </div>

                {formConfig.showSchoolBadge && (
                  <span
                    className="px-2 py-0.5 rounded-md text-[9px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: formConfig.accentHex }}
                  >
                    Akred. {activeSchool.accreditation}
                  </span>
                )}
              </div>

              {/* Simulated Card Content */}
              <div className={`bg-white p-4 border border-slate-200 ${formConfig.cardRadius} shadow-xs space-y-3`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">Kartu Rapor & Status Akademik</h4>
                  <span
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: formConfig.accentHex }}
                  ></span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Tampilan kartu ini menerapkan lengkungan <strong>{formConfig.cardRadius}</strong> dengan warna tema terpadu.
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs cursor-default"
                    style={{ backgroundColor: formConfig.primaryHex }}
                  >
                    Tombol Utama
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border cursor-default"
                    style={{
                      borderColor: formConfig.primaryHex,
                      color: formConfig.primaryHex,
                      backgroundColor: `${formConfig.primaryHex}10`,
                    }}
                  >
                    Tombol Sekunder
                  </button>
                </div>
              </div>

              {/* Theme Details Metadata */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Warna Primer:</span>
                  <span className="font-mono font-bold text-slate-800">{formConfig.primaryHex}</span>
                </div>
                <div className="flex justify-between">
                  <span>Warna Aksen:</span>
                  <span className="font-mono font-bold text-slate-800">{formConfig.accentHex}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sinkronisasi Cloud:</span>
                  <span className={isFirestoreConnected ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                    {isFirestoreConnected ? 'Firebase Firestore Terhubung' : 'Memori Lokal & Cloud Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
