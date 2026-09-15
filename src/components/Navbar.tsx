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
  MessageSquare,
  Palette,
  HardDrive,
  Users,
  LogIn,
  KeyRound,
  Radio,
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
    setIsAuthModalOpen,
    setIsRegisterModalOpen,
    appearance,
    chatMessages,
    isFirestoreConnected,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseRolesList: { id: Role; label: string; desc: string }[] = [
    { id: 'admin_sekolah', label: '🏢 ' + t.roles.admin_sekolah, desc: 'Kelola Akun Guru, Siswa & Ortu, Tampilan' },
    { id: 'kepala_sekolah', label: '🎓 ' + t.roles.kepala_sekolah, desc: 'Dashboard Analitik & Laporan' },
    { id: 'guru', label: '👨‍🏫 ' + t.roles.guru, desc: 'Input Nilai Cloud, Absensi, Materi' },
    { id: 'siswa', label: '🎒 ' + t.roles.siswa, desc: 'Rapor Digital, SPP Online, Absensi' },
    { id: 'orang_tua', label: '👨‍👩‍👧 ' + t.roles.orang_tua, desc: 'Pantau Anak, Tagihan SPP & Rapor' },
  ];

  // Super Admin role is hidden from the public role list and only visible if currently logged in as super_admin
  const rolesList = currentRole === 'super_admin'
    ? [{ id: 'super_admin' as Role, label: '👑 SIAKAD Pusat (Super Admin)', desc: 'Panel Kendali Pemilik Sistem' }, ...baseRolesList]
    : baseRolesList;

  const handleRoleSelect = (role: Role) => {
    setCurrentRole(role);
    setIsRoleDropdownOpen(false);
    if (role === 'super_admin') {
      setActiveTab('superAdmin');
    } else if (role === 'admin_sekolah') {
      setActiveTab('pengguna');
    } else if (role === 'kepala_sekolah') {
      setActiveTab('analitik');
    } else if (role === 'guru') {
      setActiveTab('akademik');
    } else if (role === 'orang_tua') {
      setActiveTab('spp');
    }
  };

  const navItems = [
    { id: 'beranda', label: t.nav.beranda, roles: ['all'] },
    { id: 'akademik', label: t.nav.akademik, roles: ['all'] },
    { id: 'absensi', label: t.nav.absensi, roles: ['all'] },
    { id: 'spp', label: t.nav.spp, roles: ['all'] },
    { id: 'chat', label: t.nav.chat, roles: ['all'], badge: chatMessages.length },
    { id: 'dukcapil', label: t.nav.dukcapil, roles: ['super_admin', 'admin_sekolah', 'kepala_sekolah'] },
    { id: 'analitik', label: t.nav.analitik, roles: ['super_admin', 'admin_sekolah', 'kepala_sekolah'] },
    { id: 'pengguna', label: t.nav.pengguna, roles: ['super_admin', 'admin_sekolah'] },
    { id: 'tampilan', label: t.nav.tampilan, roles: ['super_admin', 'admin_sekolah'] },
    { id: 'cloudBackup', label: t.nav.cloudBackup, roles: ['super_admin', 'admin_sekolah'] },
    { id: 'superAdmin', label: 'SIAKAD Pusat', roles: ['super_admin'] },
  ];

  const visibleNavItems = navItems.filter(
    (item) => item.roles.includes('all') || item.roles.includes(currentRole)
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Top Header Announcement Ticker (from Theme Customizer) */}
      {appearance.headerAnnouncement && (
        <div
          className="text-white text-[11px] font-semibold py-1 px-3 text-center transition flex items-center justify-center gap-2 overflow-hidden leading-snug"
          style={{ backgroundColor: appearance.primaryHex }}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-white shrink-0 animate-pulse"></span>
          <span className="truncate max-w-4xl">{appearance.headerAnnouncement}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 w-full">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-3 w-full">
          {/* School Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink sm:shrink-0">
            <button
              onClick={() => setActiveTab('beranda')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer min-w-0"
            >
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-white flex items-center justify-center shadow-md group-hover:scale-105 transition overflow-hidden shrink-0"
                style={{ backgroundColor: appearance.primaryHex }}
              >
                {appearance.logoUrl ? (
                  <img src={appearance.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>
              <div className="flex flex-col justify-center min-w-0 py-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-extrabold text-slate-900 text-sm sm:text-base lg:text-lg leading-snug tracking-tight truncate max-w-[135px] xs:max-w-[170px] sm:max-w-[200px] lg:max-w-[260px]">
                    {appearance.appName || activeSchool.name}
                  </span>
                  {appearance.showSchoolBadge && (
                    <span
                      className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-xs shrink-0 whitespace-nowrap"
                      style={{ backgroundColor: appearance.accentHex }}
                    >
                      Akred. {activeSchool.accreditation}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:block truncate max-w-[180px] lg:max-w-[260px] leading-normal">
                  {appearance.schoolMotto || 'SIAKAD Terpadu & Terenkripsi E2EE'}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 shrink-0">
            {visibleNavItems.slice(0, 5).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  style={isActive ? { backgroundColor: appearance.primaryHex } : {}}
                >
                  <span>{item.label}</span>
                  {item.id === 'chat' && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                        isActive ? 'bg-white text-blue-800' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Extra Menu items dropdown for remaining tabs */}
            {visibleNavItems.length > 5 && (
              <div className="relative group shrink-0">
                {(() => {
                  const hasActiveChild = visibleNavItems.slice(5).some((i) => i.id === activeTab);
                  return (
                    <>
                      <button
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                          hasActiveChild
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span>Menu Lainnya</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 hidden group-hover:block z-50 animate-in fade-in duration-150">
                        {visibleNavItems.slice(5).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between whitespace-nowrap ${
                              activeTab === item.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{item.label}</span>
                            {activeTab === item.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                          </button>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* School Registration Link Trigger */}
            <button
              id="btn-register-school"
              onClick={() => setIsRegisterModalOpen(true)}
              title="Daftarkan Sekolah & Akun Admin Baru"
              className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <School className="w-3.5 h-3.5 text-blue-600" />
              <span>Daftar Sekolah</span>
            </button>

            {/* Quick Login with Credentials Modal Trigger */}
            <button
              id="btn-login-credentials"
              onClick={() => setIsAuthModalOpen(true)}
              title="Masuk ke Akun SIAKAD"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Masuk Akun</span>
            </button>

            {/* Online / Offline Simulator Toggle */}
            <button
              id="btn-toggle-offline"
              onClick={toggleNetworkStatus}
              title={
                isOnline
                  ? 'Koneksi Cloud Online (Klik untuk simulasikan mode offline)'
                  : 'Mode Offline Aktif (Klik untuk menyambungkan kembali)'
              }
              className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer whitespace-nowrap shrink-0 ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden md:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="hidden md:inline">Offline</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <button
              id="btn-switch-language"
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer whitespace-nowrap shrink-0"
              title="Ganti Bahasa (ID / EN)"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Security Center Modal Trigger */}
            <button
              id="btn-open-security-center"
              onClick={() => setIsSecurityModalOpen(true)}
              className="hidden sm:flex p-2 rounded-xl text-slate-700 hover:text-purple-700 hover:bg-purple-50 border border-slate-200 transition relative cursor-pointer shrink-0"
              title="Pusat Keamanan & Enkripsi E2EE"
            >
              <Shield className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </button>

            {/* Notification Bell with Badge */}
            <button
              id="btn-open-notification"
              onClick={() => setIsNotifModalOpen(true)}
              className="p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition relative cursor-pointer shrink-0"
              title="Notifikasi Sistem"
            >
              <Bell className="w-4 h-4 text-slate-700 shrink-0" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative shrink-0">
              <button
                id="btn-role-dropdown"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-700 shrink-0 border border-slate-600">
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:flex flex-col text-left justify-center min-w-0 max-w-[85px] md:max-w-[110px]">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none truncate">
                    {t.currentRole}
                  </span>
                  <span className="font-bold text-xs text-white leading-tight truncate mt-0.5">
                    {t.roles[currentRole]}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t.switchRole} (Simulasi Peran Aktif)
                    </p>
                    <p className="text-xs font-extrabold text-slate-800 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">@{currentUser.username}</p>
                  </div>
                  <div className="space-y-1 max-h-72 overflow-y-auto">
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
              className="p-2 xl:hidden rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-slate-200/80 space-y-2 animate-in slide-in-from-top duration-200">
            {/* Quick Action Tools inside Drawer for Mobile */}
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Masuk Akun</span>
              </button>
              <button
                onClick={() => {
                  setIsRegisterModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition"
              >
                <School className="w-3.5 h-3.5 text-blue-600" />
                <span>Daftar Sekolah</span>
              </button>
              <button
                onClick={() => {
                  setIsSecurityModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition"
              >
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Pusat Keamanan</span>
              </button>
              <button
                onClick={() => {
                  setLanguage(language === 'id' ? 'en' : 'id');
                }}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Bahasa: {language.toUpperCase()}</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
              {visibleNavItems.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveTab(m.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                    activeTab === m.id
                      ? 'text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  style={activeTab === m.id ? { backgroundColor: appearance.primaryHex } : {}}
                >
                  <span>{m.label}</span>
                  {m.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 font-bold">
                      {m.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
