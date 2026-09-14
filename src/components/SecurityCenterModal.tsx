import React, { useState } from 'react';
import { Shield, Key, Lock, CheckCircle2, FileText, Search, Database, Smartphone, X, ShieldAlert, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SecurityCenterModal: React.FC = () => {
  const { isSecurityModalOpen, setIsSecurityModalOpen, auditLogs, e2eeSessionKey, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isSecurityModalOpen) return null;

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(e2eeSessionKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">Pusat Keamanan & Enkripsi Data E2EE</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Standar Militer AES-256
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kriptografi ujung-ke-ujung (E2EE), perlindungan NIK Dukcapil, & jejak audit SHA-256 tamper-evident.
              </p>
            </div>
          </div>
          <button
            id="btn-close-security-modal"
            onClick={() => setIsSecurityModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Enkripsi Nilai & Rapor</span>
                <Lock className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                AES-GCM 256-bit
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Tiap angka nilai dienkripsi dengan kunci asimetris sebelum disimpan ke cloud.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Privasi NIK & Siswa</span>
                <Database className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Data Masking Terlindungi
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Kerahasiaan NIK Dukcapil diproteksi dengan hashing satu arah SHA-256.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Verifikasi 2 Langkah</span>
                <Smartphone className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${currentUser.is2FAEnabled ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                {currentUser.is2FAEnabled ? 'Aktif (TOTP / SMS)' : 'Disarankan Diaktifkan'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Akses krusial dibentengi dengan OTP & otentikasi biometrik perangkat.
              </p>
            </div>
          </div>

          {/* Active Session E2EE Key Token Box */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-800 rounded-lg text-amber-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active E2EE Session Key</div>
                <div className="font-mono text-sm font-bold text-emerald-400 tracking-wide">{e2eeSessionKey}</div>
              </div>
            </div>
            <button
              id="btn-copy-e2ee-key"
              onClick={handleCopyKey}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition border border-slate-700 cursor-pointer"
            >
              {copiedKey ? 'Tersalin!' : 'Salin Kunci'}
            </button>
          </div>

          {/* SHA-256 Audit Trail Table */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Jejak Audit Terenkripsi SHA-256 (Tamper-Evident Trail)
                </h4>
                <p className="text-xs text-slate-500">
                  Setiap transaksi pembayaran, penginputan nilai, dan absensi tersimpan dengan tanda tangan kriptografis.
                </p>
              </div>
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari aksi atau pengguna..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-3">Waktu & IP</th>
                      <th className="p-3">Pengguna</th>
                      <th className="p-3">Aksi & Entitas</th>
                      <th className="p-3">Digest SHA-256</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3 whitespace-nowrap">
                          <div className="font-medium text-slate-800">{log.timestamp}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{log.ipAddress}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="font-semibold text-slate-800">{log.actorName}</div>
                          <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 capitalize">
                            {log.actorRole.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-blue-700 text-[11px]">{log.action}</div>
                          <div className="text-slate-600 text-[11px] truncate max-w-xs">{log.targetEntity}: {log.details}</div>
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-100 block max-w-[150px] truncate" title={log.sha256Digest}>
                            {log.sha256Digest.substring(0, 16)}...
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>Hardware Security Module & Web Crypto API Active</span>
          </div>
          <button
            onClick={() => setIsSecurityModalOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
