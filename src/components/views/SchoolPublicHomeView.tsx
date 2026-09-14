import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Award,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Database,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  setActiveTab: (tab: string) => void;
}

export const SchoolPublicHomeView: React.FC<Props> = ({ setActiveTab }) => {
  const { activeSchool, currentUser, currentRole, t } = useApp();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl border border-blue-900/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative p-6 sm:p-10 lg:p-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tahun Ajaran 2026/2027 • Kurikulum Merdeka Nasional</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Selamat Datang di Portal Terpadu <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200">
              {activeSchool.name}
            </span>
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Sistem Informasi Akademik Sekolah (SIAKAD) modern dengan manajemen nilai cloud, absensi biometrik & geofencing GPS, portal pembayaran SPP instan, sinkronisasi Dukcapil, serta perlindungan privasi enkripsi E2EE.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
            <button
              id="btn-hero-akademik"
              onClick={() => setActiveTab('akademik')}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Sistem Akademik</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              id="btn-hero-spp"
              onClick={() => setActiveTab('spp')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Bayar SPP Online</span>
            </button>
            <button
              id="btn-hero-absensi"
              onClick={() => setActiveTab('absensi')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Absensi Biometrik</span>
            </button>
          </div>
        </div>

        {/* Floating School Identity Stats Badge */}
        <div className="border-t border-white/10 bg-black/25 backdrop-blur-md px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Akreditasi Sekolah</span>
            <span className="font-bold text-white text-sm">Predikat {activeSchool.accreditation}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Nomor Pokok (NPSN)</span>
            <span className="font-mono font-bold text-white text-sm">{activeSchool.npsn}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Kepala Sekolah</span>
            <span className="font-bold text-white text-sm truncate block">{activeSchool.headmasterName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Enkripsi Keamanan</span>
            <span className="font-bold text-emerald-400 text-sm flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> AES-256 E2EE
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Interactive Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Layanan Unggulan Terintegrasi</h2>
            <p className="text-xs sm:text-sm text-slate-500">Akses cepat seluruh modul akademik dan administrasi sekolah</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Rapor & Nilai Cloud */}
          <div
            onClick={() => setActiveTab('akademik')}
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
                Manajemen Nilai & Rapor
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Penilaian komprehensif tugas, UTS, dan UAS berbasis cloud dengan tanda tangan digital & predikat KKM.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Buka Nilai Siswa</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: Absensi Biometrik & GPS */}
          <div
            onClick={() => setActiveTab('absensi')}
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-400 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition">
                Absensi Geofence & Wajah
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Validasi kehadiran berbasis radius GPS sekolah dengan pencocokan biometrik kamera akurasi tinggi.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Pindai Kehadiran</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: SPP Online & QRIS */}
          <div
            onClick={() => setActiveTab('spp')}
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-400 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition">
                Portal Pembayaran SPP
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Pembayaran SPP online otomatis via QRIS nasional, VA bank BCA/Mandiri/BRI, dan unduh kuitansi resmi.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Cek Tagihan SPP</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4: Dukcapil & Dapodik Sync */}
          <div
            onClick={() => setActiveTab('dukcapil')}
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-400 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-600 transition">
                Sinkronisasi Dukcapil
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Integrasi API otomatis data kependudukan nasional untuk validasi NIK siswa & sinkronisasi Dapodik.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
              <span>Validasi NIK Siswa</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: School Announcements & Vision / Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: School Announcements */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">Papan Pengumuman & Agenda Akademik</h3>
            </div>
            <span className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer">Lihat Semua</span>
          </div>

          <div className="space-y-3.5">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white mb-1">
                  AKADEMIK
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Pelaksanaan Asesmen Sumatif Tengah Semester (ASTS) Ganjil
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Dimulai pada tanggal 21 - 26 September 2026. Seluruh siswa diharapkan mengecek kartu ujian di Rapor Digital.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono whitespace-nowrap">21-26 Sep 2026</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white mb-1">
                  KEUANGAN
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Batas Akhir Pembayaran SPP Bulan September 2026
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pembayaran SPP jatuh tempo pada 15 September 2026. Pembayaran dapat dilakukan 24 jam via QRIS & Virtual Account.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono whitespace-nowrap">15 Sep 2026</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600 text-white mb-1">
                  PRESTASI
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Juara 1 Olimpiade Sains & Komputasi Nasional Tingkat Provinsi
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Selamat kepada tim robotika dan komputasi SMPTK Budi Mulia atas raihan medali emas.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono whitespace-nowrap">12 Sep 2026</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: School Profile, Location & Contact */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Profil & Kontak Resmi
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{activeSchool.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{activeSchool.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>(021) 720-9988 / 0811-2345-6789</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 text-xs mb-2">Visi Pendidikan</h4>
              <p className="text-xs text-slate-600 leading-relaxed italic bg-blue-50/40 p-3 rounded-xl border border-blue-100/60">
                &ldquo;Mewujudkan insan berkarakter mulia, unggul dalam sains dan teknologi, serta berdaya saing global berlandaskan integritas.&rdquo;
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Status Geofence Sekolah</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Radius {activeSchool.geofenceRadiusMeters}m Aktif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
