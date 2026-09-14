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
      }, 900);
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
              Masukkan username dan kata sandi akun Anda yang terdaftar
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
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="misal: tn.timbu atau admin.budimulia"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kata Sandi
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

        {/* Quick Credentials Helper Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Masuk Cepat dengan Akun Bawaan (Default):
          </p>

          <div className="grid grid-cols-2 gap-2 text-left">
            {/* Super Admin tn.timbu */}
            <button
              type="button"
              onClick={() => fillCredentials('tn.timbu', 'Eklesia_030918.')}
              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100/70 border border-purple-200 text-purple-900 transition cursor-pointer"
            >
              <p className="text-[10px] font-extrabold flex items-center justify-between">
                <span>👑 Super Admin</span>
                <span className="text-[9px] bg-purple-200 px-1 rounded font-mono">ROOT</span>
              </p>
              <p className="text-[10px] font-mono text-purple-700">tn.timbu</p>
            </button>

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
        </div>
      </div>
    </div>
  );
};
