import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithCredentials,
    setIsRegisterModalOpen,
    appearance,
  } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Harap masukkan username dan kata sandi.');
      return;
    }

    const result = loginWithCredentials(username, password);
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setUsername('');
        setPassword('');
        setSuccessMessage('');
      }, 700);
    } else {
      setErrorMessage(result.message);
    }
  };

  const fillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div
            className="w-12 h-12 rounded-2xl text-white flex items-center justify-center mx-auto shadow-md"
            style={{ backgroundColor: appearance.primaryHex }}
          >
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Masuk ke SIAKAD Cloud
            </h2>
            <p className="text-xs text-slate-500">
              Masukkan username dan password Anda untuk masuk ke sistem
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Username Pengguna
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="misal: admin.budimulia atau guru.siti"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer hover:opacity-95"
            style={{ backgroundColor: appearance.primaryHex }}
          >
            <span>Masuk Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Credentials Helper Buttons (Super Admin is completely hidden from public view) */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Contoh Akun Peran Demo:
          </p>

          <div className="grid grid-cols-2 gap-2 text-left">
            {/* Admin Sekolah */}
            <button
              type="button"
              onClick={() => fillCredentials('admin.budimulia', 'Admin_BudiMulia123!')}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100/70 border border-blue-200 text-blue-900 transition cursor-pointer"
            >
              <p className="text-[10px] font-extrabold flex items-center justify-between">
                <span>🏢 Admin Sekolah</span>
              </p>
              <p className="text-[10px] font-mono text-blue-700">admin.budimulia</p>
            </button>

            {/* Kepala Sekolah */}
            <button
              type="button"
              onClick={() => fillCredentials('kepsek.nurul', 'Kepsek_Nurul123!')}
              className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200 text-indigo-900 transition cursor-pointer"
            >
              <p className="text-[10px] font-extrabold flex items-center justify-between">
                <span>🎓 Kepala Sekolah</span>
              </p>
              <p className="text-[10px] font-mono text-indigo-700">kepsek.nurul</p>
            </button>

            {/* Guru */}
            <button
              type="button"
              onClick={() => fillCredentials('guru.siti', 'Guru_Siti123!')}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 text-emerald-900 transition cursor-pointer"
            >
              <p className="text-[10px] font-extrabold">👨‍🏫 Guru Pengajar</p>
              <p className="text-[10px] font-mono text-emerald-700">guru.siti</p>
            </button>

            {/* Orang Tua */}
            <button
              type="button"
              onClick={() => fillCredentials('ortu.rizky', 'Ortu_Rizky123!')}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100/70 border border-rose-200 text-rose-900 transition cursor-pointer"
            >
              <p className="text-[10px] font-extrabold">👨‍👩‍👧 Orang Tua Siswa</p>
              <p className="text-[10px] font-mono text-rose-700">ortu.rizky</p>
            </button>
          </div>

          {/* Registration Link */}
          <div className="pt-3 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsAuthModalOpen(false);
                setIsRegisterModalOpen(true);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer flex items-center justify-center gap-1 mx-auto"
            >
              <span>Belum punya akun sekolah?</span>
              <span className="underline font-bold">Daftarkan Sekolah Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
