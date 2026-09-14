import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Smartphone, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TwoFactorModal: React.FC = () => {
  const { is2FAModalOpen, close2FAModal, twoFactorCallback, twoFactorPurpose, t } = useApp();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Demo generated valid OTP code
  const [mockOtp, setMockOtp] = useState('842190');

  useEffect(() => {
    if (is2FAModalOpen) {
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOtp(generated);
      setCode(['', '', '', '', '', '']);
      setError('');
      setIsSuccess(false);
      setCountdown(60);
    }
  }, [is2FAModalOpen]);

  useEffect(() => {
    if (!is2FAModalOpen || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [is2FAModalOpen, countdown]);

  if (!is2FAModalOpen) return null;

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const entered = code.join('');
    if (entered.length < 6) {
      setError('Masukkan 6 digit kode verifikasi');
      return;
    }

    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      // In demo mode, accept correct OTP or any code ending with valid length
      if (entered === mockOtp || entered.length === 6) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsVerifying(false);
          close2FAModal();
          if (twoFactorCallback) {
            twoFactorCallback();
          }
        }, 800);
      } else {
        setIsVerifying(false);
        setError('Kode verifikasi salah atau telah kadaluarsa');
      }
    }, 600);
  };

  const autoFillDemoCode = () => {
    setCode(mockOtp.split(''));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          id="btn-close-2fa-modal"
          onClick={close2FAModal}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3.5 ring-8 ring-blue-50/50">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{t.security.verify2FA}</h3>
          <p className="text-xs text-slate-500 mt-1">{twoFactorPurpose || 'Autentikasi Dua Langkah Diperlukan'}</p>
        </div>

        {/* Demo OTP Helper Box */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 mb-5 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Kode SMS / Authenticator simulasi: <strong className="font-mono text-sm tracking-wider text-blue-700">{mockOtp}</strong>
            </span>
          </div>
          <button
            id="btn-autofill-otp"
            onClick={autoFillDemoCode}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-white px-2.5 py-1 rounded-md border border-blue-200 shadow-xs cursor-pointer"
          >
            Isi Otomatis
          </button>
        </div>

        {/* 6 Digit Input boxes */}
        <div className="flex justify-center gap-1.5 sm:gap-2.5 mb-5 w-full max-w-full overflow-hidden">
          {code.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-9 h-11 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-bold font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition"
            />
          ))}
        </div>

        {error && <p className="text-xs text-rose-600 text-center mb-4 font-medium">{error}</p>}

        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
          <span>Kirim ulang kode dalam {countdown}s</span>
          <button
            disabled={countdown > 0}
            onClick={() => {
              const fresh = Math.floor(100000 + Math.random() * 900000).toString();
              setMockOtp(fresh);
              setCountdown(60);
            }}
            className="flex items-center gap-1 text-blue-600 disabled:text-slate-400 hover:underline font-medium cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Kirim Ulang
          </button>
        </div>

        <button
          id="btn-verify-2fa-submit"
          onClick={handleVerify}
          disabled={isVerifying || isSuccess}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>Verifikasi Sukses</span>
            </>
          ) : isVerifying ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Memverifikasi Token...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Konfirmasi & Lanjutkan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
