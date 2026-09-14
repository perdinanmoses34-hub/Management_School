import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { NotificationModal } from './components/NotificationModal';
import { SecurityCenterModal } from './components/SecurityCenterModal';
import { TwoFactorModal } from './components/TwoFactorModal';
import { AuthModal } from './components/AuthModal';
import { SchoolRegisterModal } from './components/SchoolRegisterModal';

import { SchoolPublicHomeView } from './components/views/SchoolPublicHomeView';
import { AcademicManagementView } from './components/views/AcademicManagementView';
import { AttendanceBiometricView } from './components/views/AttendanceBiometricView';
import { PaymentSPPView } from './components/views/PaymentSPPView';
import { DukcapilSyncView } from './components/views/DukcapilSyncView';
import { PrincipalAnalyticsView } from './components/views/PrincipalAnalyticsView';
import { SuperAdminView } from './components/views/SuperAdminView';
import { RealtimeChatView } from './components/views/RealtimeChatView';
import { ThemeCustomizerView } from './components/views/ThemeCustomizerView';
import { UserManagementView } from './components/views/UserManagementView';
import { GoogleDriveBackupView } from './components/views/GoogleDriveBackupView';
import { ShieldCheck, WifiOff, RefreshCw, Lock } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeSchool,
    isOnline,
    offlineQueue,
    syncOfflineQueue,
    isSyncing,
    appearance,
    setIsAuthModalOpen,
  } = useApp();

  return (
    <div
      className={`min-h-screen bg-slate-50 flex flex-col ${appearance.fontFamily || 'font-sans'} text-slate-900 antialiased selection:bg-blue-600 selection:text-white pb-16 lg:pb-0`}
    >
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Offline Alert Sticky Banner if offline or queue pending */}
      {(!isOnline || offlineQueue.length > 0) && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 border-b border-amber-600 text-xs font-bold flex items-center justify-between shadow-xs sticky top-16 sm:top-18 z-30">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 animate-pulse" />
              <span>
                {!isOnline
                  ? `Mode Offline Aktif — Anda tetap dapat mencatat absensi dan nilai (${offlineQueue.length} data dalam antrean lokal)`
                  : `${offlineQueue.length} transaksi lokal tertunda menunggu sinkronisasi cloud Firebase`}
              </span>
            </div>
            {isOnline && offlineQueue.length > 0 && (
              <button
                onClick={syncOfflineQueue}
                disabled={isSyncing}
                className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {activeTab === 'beranda' && <SchoolPublicHomeView setActiveTab={setActiveTab} />}
        {activeTab === 'akademik' && <AcademicManagementView />}
        {activeTab === 'absensi' && <AttendanceBiometricView />}
        {activeTab === 'spp' && <PaymentSPPView />}
        {activeTab === 'chat' && <RealtimeChatView />}
        {activeTab === 'dukcapil' && <DukcapilSyncView />}
        {activeTab === 'analitik' && <PrincipalAnalyticsView />}
        {activeTab === 'pengguna' && <UserManagementView />}
        {activeTab === 'tampilan' && <ThemeCustomizerView />}
        {activeTab === 'cloudBackup' && <GoogleDriveBackupView />}
        {activeTab === 'superAdmin' && <SuperAdminView />}
      </main>

      {/* Official Indonesian Education System Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-xs"
                style={{ backgroundColor: appearance.primaryHex }}
              >
                {appearance.logoUrl ? (
                  <img src={appearance.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  'SIA'
                )}
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">
                  {appearance.schoolName || activeSchool.name} • NPSN {activeSchool.npsn}
                </p>
                <p className="text-[11px] text-slate-500">
                  {activeSchool.address} • Akreditasi {activeSchool.accreditation} (Terintegrasi Cloud & Google Drive)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enkripsi E2EE AES-256 & SHA-256 Cloud Aktif</span>
              </span>
              <span>Terintegrasi API Kemendikbud & Dukcapil Kemendagri</span>
              <span>© {new Date().getFullYear()} {appearance.appName}</span>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                title="Akses Portal SIAKAD"
                className="text-slate-400 hover:text-slate-600 transition flex items-center gap-1 cursor-pointer ml-1"
              >
                <Lock className="w-3 h-3" />
                <span className="text-[10px]">Portal</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <NotificationModal />
      <SecurityCenterModal />
      <TwoFactorModal />
      <AuthModal />
      <SchoolRegisterModal />

      {/* Mobile Bottom Navigation Bar (Android & iOS Responsive) */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
