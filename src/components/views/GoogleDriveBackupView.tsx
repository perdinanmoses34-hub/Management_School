import React, { useState, useRef } from 'react';
import {
  HardDrive,
  Cloud,
  CheckCircle2,
  Download,
  Upload,
  RefreshCw,
  FileJson,
  ShieldCheck,
  Server,
  Clock,
  AlertCircle,
  Database,
  Lock,
  FileCheck,
  ExternalLink,
  Layers,
  Archive,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GoogleDriveBackupView: React.FC = () => {
  const {
    connectedDriveAccount,
    driveBackups,
    performDriveBackup,
    downloadDatabaseSnapshot,
    restoreDatabaseFromSnapshot,
    schools,
    allUsers,
    students,
    grades,
    sppBills,
    attendanceRecords,
    chatMessages,
    appearance,
    isFirestoreConnected,
    open2FAModal,
  } = useApp();

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showFullEmail, setShowFullEmail] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maskEmail = (email: string) => {
    if (!email) return '••••••••••••••••';
    const parts = email.split('@');
    if (parts.length < 2) return '••••••••••••••••';
    const name = parts[0];
    const domain = parts[1];
    const maskedName = name.length > 4 ? `${name.slice(0, 1)}••••••••••••${name.slice(-2)}` : '••••••••';
    return `${maskedName}@${domain}`;
  };

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    try {
      await performDriveBackup();
    } finally {
      setTimeout(() => setIsBackingUp(false), 800);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      open2FAModal(() => {
        const result = restoreDatabaseFromSnapshot(content);
        if (result.success) {
          setRestoreMessage({ text: result.message, type: 'success' });
        } else {
          setRestoreMessage({ text: result.message, type: 'error' });
        }
      }, 'Otorisasi Pemulihan Database (Restore) dari Cadangan JSON');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl text-white flex items-center justify-center shadow-md transition"
            style={{ backgroundColor: appearance.primaryHex }}
          >
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Penyimpanan Database Cloud & Google Drive
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                DRIVE RESMI TERHUBUNG
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Pengaturan Firestore Firebase & Pencadangan Otomatis Google Drive (Database Utama Terhubung)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadDatabaseSnapshot}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh File JSON</span>
          </button>
          <button
            onClick={handleCreateBackup}
            disabled={isBackingUp}
            className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer hover:opacity-95 disabled:opacity-50"
            style={{ backgroundColor: appearance.primaryHex }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
            <span>{isBackingUp ? 'Menyimpan ke Drive...' : 'Cadangkan ke Google Drive'}</span>
          </button>
        </div>
      </div>

      {/* Account & Cloud Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Google Drive Account Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600">
              <Cloud className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Akun Google Drive
              </span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-xs font-extrabold text-slate-900 truncate">
                ••••••••••••••••••••••@belajar.id
              </p>
              <span className="p-1 rounded-md text-emerald-600 bg-emerald-50 text-[10px] font-bold" title="Akun Terverifikasi & Disembunyikan">
                Tersambung
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Lock className="w-2.5 h-2.5" /> Akun Google Drive Terlindungi & Disembunyikan
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Koneksi Penyimpanan: Google Workspace for Education (Firebase & Drive DB)
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Folder Target:</span>
            <span className="font-mono font-semibold text-slate-800">/SIAKAD_BACKUP/</span>
          </div>
        </div>

        {/* Firebase Firestore Cloud Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-600">
              <Server className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Firebase Firestore
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {isFirestoreConnected ? 'Online & Terverifikasi' : 'Siap Sinkron'}
            </span>
          </div>
          <div>
            <p className="font-mono text-xs font-extrabold text-slate-900">
              astute-basis-trtgb
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Region: asia-southeast2 (Jakarta) • Firestore Rules v2
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Enkripsi Database:</span>
            <span className="font-bold text-emerald-600">AES-256 & SHA-256 E2EE</span>
          </div>
        </div>

        {/* Database Entities Metrics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-600">
              <Database className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Volume Data Aktif
              </span>
            </div>
            <span className="text-xs font-bold text-purple-600 font-mono">
              v2.4.0
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-sm font-extrabold text-slate-800">{schools.length}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Sekolah</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-sm font-extrabold text-slate-800">{allUsers.length}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Akun</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-sm font-extrabold text-slate-800">{chatMessages.length}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Pesan</p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Siswa & Nilai:</span>
            <span className="font-semibold text-slate-800">{students.length} Siswa / {grades.length} Nilai</span>
          </div>
        </div>
      </div>

      {/* Restore Notification Feedback */}
      {restoreMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            restoreMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {restoreMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{restoreMessage.text}</span>
          </div>
          <button
            onClick={() => setRestoreMessage(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Backup and Restore Action Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload / Restore Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Pulihkan / Restore Database
              </h3>
              <p className="text-xs text-slate-500">
                Unggah file snapshot JSON untuk memulihkan seluruh struktur data
              </p>
            </div>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-indigo-50/20 space-y-2"
          >
            <Archive className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-xs font-bold text-slate-700">
              Klik atau seret file JSON cadangan kemari
            </p>
            <p className="text-[11px] text-slate-400">
              Format yang didukung: .json hasil ekspor SIAKAD
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Cloud Security & Policy Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Prosedur Keamanan & Kebijakan Data
              </h3>
              <p className="text-xs text-slate-500">
                Standar ISO 27001 & Permendikbudristek No. 46 Perlindungan Data
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Enkripsi Ganda:</strong> Setiap snapshot database yang diunggah ke Google Drive secara otomatis dienkripsi dengan SHA-256 HMAC digest sebelum transmisi.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Otorisasi Berlapis:</strong> Operasi pemulihan (restore) database wajib melalui otentikasi dua faktor (2FA) oleh Super Administrator.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* History of Google Drive Backups Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Riwayat Cadangan Tersimpan di Google Drive
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            {driveBackups.length} Arsip Tersedia
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Nama Berkas Cadangan</th>
                <th className="px-5 py-3.5">Akun Google Drive</th>
                <th className="px-5 py-3.5">Ukuran</th>
                <th className="px-5 py-3.5">Cakupan Data</th>
                <th className="px-5 py-3.5">Waktu Simpan</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {driveBackups.map((bak) => (
                <tr key={bak.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <FileJson className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="font-mono font-bold text-slate-800 text-xs">{bak.fileName}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{bak.googleDrivePath}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-slate-600">
                    ••••••••••••••••••••••@belajar.id
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-700">
                    {bak.fileSizeKb} KB
                  </td>
                  <td className="px-5 py-4 text-[11px] text-slate-600">
                    {bak.totalSchools} Sekolah • {bak.totalUsers} Akun • {bak.totalChats} Pesan
                  </td>
                  <td className="px-5 py-4 text-[11px] text-slate-500">
                    {bak.timestamp}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Tersimpan di Cloud
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
