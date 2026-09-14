import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Building2,
  FileCheck,
  User,
  Users,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_DUKCAPIL_DATABASE } from '../../data/initialData';
import { maskNik } from '../../utils/crypto';
import { Student } from '../../types';

export const DukcapilSyncView: React.FC = () => {
  const { students, updateStudentDukcapil, addNotification, t, open2FAModal } = useApp();

  const [inputNik, setInputNik] = useState('3174051208080003');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isBatchSyncing, setIsBatchSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    'Sistem terhubung ke API Gateway Kependudukan Nasional (Kemendagri / Dukcapil)',
    'Protokol enkripsi TLS 1.3 & sertifikat x509 aktif',
    'Sinkronisasi terjadwal aktif setiap 24 jam sekali',
  ]);

  const verifiedCount = students.filter((s) => s.dukcapilVerified).length;
  const pendingCount = students.length - verifiedCount;

  const handleSearchNik = () => {
    if (!inputNik || inputNik.length < 16) {
      alert('Masukkan 16 digit NIK yang valid');
      return;
    }

    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setIsSearching(false);
      const record = INITIAL_DUKCAPIL_DATABASE[inputNik];
      if (record) {
        setSearchResult({
          found: true,
          data: record,
        });
        setSyncLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] Query NIK ${maskNik(inputNik)}: Ditemukan status AKTIF_VALID`,
          ...prev,
        ]);
      } else {
        setSearchResult({
          found: false,
          message: 'NIK tidak ditemukan di database server Dukcapil Kemendagri',
        });
      }
    }, 600);
  };

  const handleSyncAllStudents = () => {
    open2FAModal(() => {
      setIsBatchSyncing(true);
      setSyncProgress(10);
      setSyncLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Memulai sinkronisasi otomatis batch data seluruh siswa...`,
        ...prev,
      ]);

      const interval = setInterval(() => {
        setSyncProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setIsBatchSyncing(false);
            // Verify all students
            students.forEach((s) => {
              updateStudentDukcapil(s.id, true);
            });
            addNotification({
              title: 'Sinkronisasi Dukcapil Sukses',
              message: 'Semua data NIK & Dapodik siswa telah berhasil disinkronkan secara otomatis.',
              category: 'sistem',
            });
            setSyncLogs((prev) => [
              `[${new Date().toLocaleTimeString()}] Selesai! 5 dari 5 data siswa terverifikasi valid dengan Dukcapil & Dapodik.`,
              ...prev,
            ]);
            return 100;
          }
          return p + 25;
        });
      }, 500);
    }, 'Otorisasi Sinkronisasi Massal Basis Data Kependudukan Nasional');
  };

  const handleSyncSingle = (student: Student) => {
    updateStudentDukcapil(student.id, true);
    setSyncLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Siswa ${student.name} (NIK: ${maskNik(student.nik)}) berhasil disinkronkan.`,
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t.dukcapil.title}</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Integrasi otomatis data kependudukan nasional (Dukcapil) & sinkronisasi Dapodik Kemendikbud
              </p>
            </div>
          </div>
        </div>

        <button
          id="btn-sync-all-dukcapil"
          onClick={handleSyncAllStudents}
          disabled={isBatchSyncing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 transition cursor-pointer disabled:opacity-75"
        >
          <RefreshCw className={`w-4 h-4 ${isBatchSyncing ? 'animate-spin' : ''}`} />
          <span>{isBatchSyncing ? `Sinkronisasi (${syncProgress}%)...` : 'Sinkronisasi Otomatis Semua'}</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Status Sinkronisasi Siswa</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {verifiedCount} / {students.length}
            </span>
            <span className="text-xs font-bold text-slate-600">Siswa Terverifikasi</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Tervalidasi NIK & No KK Kemendagri</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Perlu Pembaruan Data</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black ${pendingCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
              {pendingCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">Siswa Tertunda</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Dapat disinkronkan dengan 1 klik</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Keamanan Data Dukcapil</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-purple-700 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-purple-600" /> E2EE Masked
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Standar UU Perlindungan Data Pribadi (PDP)</span>
        </div>
      </div>

      {/* NIK Query Tester & Live Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NIK Search Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Pengecekan Langsung NIK Kependudukan</h3>
            <p className="text-xs text-slate-500 mb-4">
              Uji coba kueri API langsung ke server kependudukan nasional untuk memverifikasi keabsahan identitas siswa.
            </p>

            <div className="flex gap-2 mb-4">
              <input
                id="input-check-nik"
                type="text"
                maxLength={16}
                value={inputNik}
                onChange={(e) => setInputNik(e.target.value)}
                placeholder="Masukkan 16 digit NIK..."
                className="flex-1 px-3.5 py-2.5 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-hidden"
              />
              <button
                id="btn-submit-check-nik"
                onClick={handleSearchNik}
                disabled={isSearching}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
              >
                <Search className="w-4 h-4" />
                <span>{isSearching ? 'Memeriksa...' : 'Validasi'}</span>
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
              <span>Contoh NIK:</span>
              <button
                onClick={() => setInputNik('3174051208080003')}
                className="font-mono text-purple-700 hover:underline cursor-pointer bg-purple-50 px-2 py-0.5 rounded"
              >
                3174051208080003
              </button>
              <button
                onClick={() => setInputNik('3174062005080004')}
                className="font-mono text-purple-700 hover:underline cursor-pointer bg-purple-50 px-2 py-0.5 rounded"
              >
                3174062005080004
              </button>
            </div>

            {/* Search Result Card */}
            {searchResult && (
              <div className="border border-purple-100 bg-purple-50/50 rounded-xl p-4 animate-in fade-in">
                {searchResult.found ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                      <span className="font-bold text-slate-900 text-sm">{searchResult.data.nama}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        AKTIF VALID
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>NIK: <strong className="font-mono text-slate-800">{searchResult.data.nik}</strong></div>
                      <div>No. KK: <strong className="font-mono text-slate-800">{searchResult.data.nomorKK}</strong></div>
                      <div>TTL: <strong className="text-slate-800">{searchResult.data.tempatLahir}, {searchResult.data.tanggalLahir}</strong></div>
                      <div>Ibu Kandung: <strong className="text-slate-800">{searchResult.data.namaIbuKandung}</strong></div>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1">
                      Alamat: {searchResult.data.alamatKTP}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{searchResult.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Protokol API Kemendagri Dukcapil v2.4</span>
            <span className="font-mono">STATUS_CONNECTED</span>
          </div>
        </div>

        {/* Live API Console Logs */}
        <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-emerald-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Terminal Sinkronisasi API Kependudukan
              </span>
              <span className="text-[10px] text-slate-500">Auto-Refresh 1s</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-2 text-[11px] leading-relaxed">
              {syncLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-purple-400 select-none">&gt;</span>
                  <span className={index === 0 ? 'text-emerald-300 font-semibold' : 'text-slate-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
            <span>Kemendikbudristek Dapodik Connector</span>
            <span>Latency: 42ms</span>
          </div>
        </div>
      </div>

      {/* Student Dukcapil Status Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Daftar Status Sinkronisasi NIK Siswa</h3>
            <p className="text-xs text-slate-500">Pencocokan data siswa lokal dengan basis data nasional</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4">Nama Siswa</th>
                <th className="p-3.5 sm:p-4">Kelas</th>
                <th className="p-3.5 sm:p-4">NIK (Masked E2EE)</th>
                <th className="p-3.5 sm:p-4">NISN</th>
                <th className="p-3.5 sm:p-4 text-center">Status Dukcapil</th>
                <th className="p-3.5 sm:p-4">Terakhir Disinkronkan</th>
                <th className="p-3.5 sm:p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 sm:p-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                        <img src={st.avatar} alt={st.name} className="w-full h-full object-cover" />
                      </div>
                      <span>{st.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 sm:p-4 font-medium text-slate-700">{st.class}</td>
                  <td className="p-3.5 sm:p-4 font-mono text-slate-700 font-semibold">
                    {maskNik(st.nik)}
                  </td>
                  <td className="p-3.5 sm:p-4 font-mono text-slate-600">{st.nisn}</td>
                  <td className="p-3.5 sm:p-4 text-center whitespace-nowrap">
                    {st.dukcapilVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Valid Dukcapil</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Belum Sinkron</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs text-slate-500 whitespace-nowrap">
                    {st.lastDukcapilSync || 'Belum Pernah'}
                  </td>
                  <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                    {!st.dukcapilVerified ? (
                      <button
                        onClick={() => handleSyncSingle(st)}
                        className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition border border-purple-200 cursor-pointer"
                      >
                        Sinkronkan
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">Tersinkronisasi</span>
                    )}
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
