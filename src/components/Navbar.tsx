import React, { useState } from 'react';
import {
  GraduationCap,
  Shield,
  Bell,
  Globe,
  Wifi,
  WifiOff,
  UserCheck,
  ChevronDown,
  Layers,
  Menu,
  X,
  School,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    activeSchool,
    currentRole,
    setCurrentRole,
    currentUser,
    language,
    setLanguage,
    t,
    isOnline,
    toggleNetworkStatus,
    offlineQueue,
    unreadNotifsCount,
    setIsNotifModalOpen,
    setIsSecurityModalOpen,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const rolesList: { id: Role; label: string; desc: string }[] = [
    { id: 'siswa', label: t.roles.siswa, desc: 'Rapor Digital, SPP Online, Absensi' },
    { id: 'guru', label: t.roles.guru, desc: 'Input Nilai Cloud, Absensi, Materi' },
    { id: 'kepala_sekolah', label: t.roles.kepala_sekolah, desc: 'Dashboard Analitik & Laporan' },
    { id: 'admin_sekolah', label: t.roles.admin_sekolah, desc: 'Dukcapil Sync, Data Siswa & Guru' },
    { id: 'super_admin', label: t.roles.super_admin, desc: 'Multi-Sekolah, Lisensi & Server' },
  ];

  const handleRoleSelect = (role: Role) => {
    setCurrentRole(role);
    setIsRoleDropdownOpen(false);
    // If switching to role with specific views, adjust default activeTab
    if (role === 'super_admin') {
      setActiveTab('superAdmin');
    } else if (role === 'kepala_sekolah') {
      setActiveTab('analitik');
    } else if (role === 'guru') {
      setActiveTab('akademik');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          {/* School Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setActiveTab('beranda')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-blue-700/20 group-hover:scale-105 transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                    {activeSchool.name}
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Akred. {activeSchool.accreditation}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium hidden xs:block">
                  SIAKAD Terpadu & Terenkripsi E2EE
                </span>
              </div>
            </button>
          </div>

          {/* Center / Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-tab-beranda"
              onClick={() => setActiveTab('beranda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'beranda'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.nav.beranda}
            </button>
            <button
              id="nav-tab-akademik"
              onClick={() => setActiveTab('akademik')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'akademik'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.nav.akademik}
            </button>
            <button
              id="nav-tab-absensi"
              onClick={() => setActiveTab('absensi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'absensi'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.nav.absensi}
            </button>
            <button
              id="nav-tab-spp"
              onClick={() => setActiveTab('spp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'spp'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.nav.spp}
            </button>
            <button
              id="nav-tab-dukcapil"
              onClick={() => setActiveTab('dukcapil')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'dukcapil'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.nav.dukcapil}
            </button>
            <button
              id="nav-tab-analitik"
              onClick={() => setActiveTab('analitik')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'analitik'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.nav.analitik}
            </button>
            {currentRole === 'super_admin' && (
              <button
                id="nav-tab-super-admin"
                onClick={() => setActiveTab('superAdmin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'superAdmin'
                    ? 'bg-purple-50 text-purple-700 font-bold ring-1 ring-purple-200'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                {t.nav.superAdmin}
              </button>
            )}
          </nav>

          {/* Right Action Tools: Role Switcher, Online/Offline Toggle, Security, Notif */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Online / Offline Simulator Toggle */}
            <button
              id="btn-toggle-offline"
              onClick={toggleNetworkStatus}
              title={
                isOnline
                  ? 'Koneksi Cloud Online (Klik untuk simulasikan mode offline)'
                  : 'Mode Offline Aktif (Klik untuk menyambungkan kembali)'
              }
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Offline ({offlineQueue.length})</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <button
              id="btn-switch-language"
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              title="Ganti Bahasa (ID / EN)"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Security Center Modal Trigger */}
            <button
              id="btn-open-security-center"
              onClick={() => setIsSecurityModalOpen(true)}
              className="p-2 rounded-lg text-slate-700 hover:text-purple-700 hover:bg-purple-50 border border-slate-200 transition relative cursor-pointer"
              title="Pusat Keamanan & Enkripsi E2EE"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </button>

            {/* Notification Bell with Badge */}
            <button
              id="btn-open-notification"
              onClick={() => setIsNotifModalOpen(true)}
              className="p-2 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition relative cursor-pointer"
              title="Notifikasi Sistem"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                id="btn-role-dropdown"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-700 shrink-0 border border-slate-600">
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col text-left leading-tight hidden xs:block">
                  <span className="text-[10px] text-slate-300 font-normal uppercase">{t.currentRole}</span>
                  <span className="font-bold truncate max-w-[90px] sm:max-w-[120px]">{t.roles[currentRole]}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-300 ml-0.5" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t.switchRole} (Mode Simulasi)
                    </p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.nipOrNisn}</p>
                  </div>
                  <div className="space-y-1">
                    {rolesList.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleRoleSelect(r.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition cursor-pointer flex flex-col ${
                          currentRole === r.id
                            ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-bold flex items-center justify-between">
                          {r.label}
                          {currentRole === r.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal mt-0.5">{r.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              id="btn-mobile-menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 lg:hidden rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Secondary) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200/80 space-y-1 animate-in slide-in-from-top duration-200">
            {[
              { id: 'beranda', label: t.nav.beranda },
              { id: 'akademik', label: t.nav.akademik },
              { id: 'absensi', label: t.nav.absensi },
              { id: 'spp', label: t.nav.spp },
              { id: 'dukcapil', label: t.nav.dukcapil },
              { id: 'analitik', label: t.nav.analitik },
              { id: 'superAdmin', label: t.nav.superAdmin },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveTab(m.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === m.id
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
