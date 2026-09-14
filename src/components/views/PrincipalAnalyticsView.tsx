import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Users,
  Award,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Calendar,
  Clock,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PrincipalAnalyticsView: React.FC = () => {
  const { activeSchool, grades, sppBills, attendanceRecords, t } = useApp();
  const [timeRange, setTimeRange] = useState<'hari_ini' | 'bulan_ini' | 'semester'>('bulan_ini');

  // Distribution calculations
  const gradeCountA = grades.filter((g) => g.gradeLetter === 'A').length;
  const gradeCountB = grades.filter((g) => g.gradeLetter === 'B').length;
  const gradeCountC = grades.filter((g) => g.gradeLetter === 'C').length;
  const gradeCountD = grades.filter((g) => g.gradeLetter === 'D').length;

  const totalGrades = grades.length;
  const pctA = Math.round((gradeCountA / totalGrades) * 100);
  const pctB = Math.round((gradeCountB / totalGrades) * 100);
  const pctC = Math.round((gradeCountC / totalGrades) * 100);

  // Financial calculations
  const totalBilled = activeSchool.studentCount * 650000;
  const totalCollected = Math.round(totalBilled * 0.84);
  const totalOutstanding = totalBilled - totalCollected;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t.principal.title}</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {activeSchool.name} • Laporan Eksekutif Akademik, Absensi, & Keuangan
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTimeRange('hari_ini')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                timeRange === 'hari_ini' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setTimeRange('bulan_ini')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                timeRange === 'bulan_ini' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setTimeRange('semester')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                timeRange === 'semester' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Semester Ganjil
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Tingkat Kehadiran</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">98.4%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+1.2% dari minggu lalu</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Rata-Rata Akademik</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600">89.2</div>
          <div className="flex items-center gap-1 text-[11px] text-blue-700 font-semibold mt-1">
            <span>Predikat A (Sangat Baik)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Realisasi SPP Bulan Ini</span>
            <CreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-700">84.6%</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono mt-1">
            <span>Rp {totalCollected.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Kinerja Guru Pengajar</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700">100%</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
            <span>52 / 52 Guru Aktif Masuk</span>
          </div>
        </div>
      </div>

      {/* Analytical Visual Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Grade Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Distribusi Nilai Kurikulum Siswa</h3>
              <p className="text-xs text-slate-500">Berdasarkan data asesmen sumatif tengah semester</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Predikat A (Skor 88 - 100)</span>
                <span className="font-mono text-emerald-700">{pctA}% ({gradeCountA} Mapel)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pctA}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Predikat B (Skor 78 - 87)</span>
                <span className="font-mono text-blue-700">{pctB}% ({gradeCountB} Mapel)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pctB}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Predikat C (Skor 70 - 77)</span>
                <span className="font-mono text-amber-700">{pctC}% ({gradeCountC} Mapel)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pctC}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Predikat D (Di Bawah KKM &lt; 70)</span>
                <span className="font-mono text-rose-700">0% (0 Mapel)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Standar Penilaian Kemendikbudristek RI</span>
            <span className="font-bold text-emerald-600">100% Ketuntasan Belajar</span>
          </div>
        </div>

        {/* Attendance Trends (Weekly) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Tren Kehadiran Mingguan (Geofence + Biometrik)</h3>
              <p className="text-xs text-slate-500">Monitoring kehadiran siswa tepat waktu vs terlambat</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center pt-3">
            {[
              { day: 'Senin', hadir: 99.1, late: 0.9 },
              { day: 'Selasa', hadir: 98.4, late: 1.6 },
              { day: 'Rabu', hadir: 97.9, late: 2.1 },
              { day: 'Kamis', hadir: 98.8, late: 1.2 },
              { day: 'Jumat', hadir: 98.5, late: 1.5 },
            ].map((d, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-full h-32 bg-slate-50 rounded-xl p-1.5 flex flex-col justify-end gap-1 relative border border-slate-100">
                  <div
                    className="w-full bg-blue-600 rounded-lg transition-all"
                    style={{ height: `${d.hadir}%` }}
                    title={`Hadir: ${d.hadir}%`}
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2">{d.day}</span>
                <span className="text-[11px] font-mono text-emerald-600 font-semibold">{d.hadir}%</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span> Hadir Tepat Waktu
            </span>
            <span className="font-medium text-slate-600">Rata-rata Terlambat &lt; 1.5%</span>
          </div>
        </div>
      </div>

      {/* Financial Tuition Summary Table for Principal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Rekapitulasi Penerimaan SPP per Tingkat Kelas</h3>
            <p className="text-xs text-slate-500">Penerimaan kas online terverifikasi perbankan semester ganjil</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4">Tingkat Kelas</th>
                <th className="p-3.5 sm:p-4 text-center">Jumlah Siswa</th>
                <th className="p-3.5 sm:p-4">Target Penerimaan</th>
                <th className="p-3.5 sm:p-4">Realisasi Penerimaan</th>
                <th className="p-3.5 sm:p-4 text-center">Persentase</th>
                <th className="p-3.5 sm:p-4 text-right">Sisa Tunggakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { class: 'Kelas VII (Fase D)', count: 260, target: 169000000, collected: 147030000, pct: 87 },
                { class: 'Kelas VIII (Fase D)', count: 255, target: 165750000, collected: 139230000, pct: 84 },
                { class: 'Kelas IX (Fase D)', count: 265, target: 172250000, collected: 142967500, pct: 83 },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 sm:p-4 font-bold text-slate-900">{row.class}</td>
                  <td className="p-3.5 sm:p-4 text-center font-semibold text-slate-700">{row.count} Siswa</td>
                  <td className="p-3.5 sm:p-4 font-mono font-medium text-slate-700">
                    Rp {row.target.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 sm:p-4 font-mono font-bold text-emerald-700">
                    Rp {row.collected.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 sm:p-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {row.pct}%
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-right font-mono font-semibold text-rose-600">
                    Rp {(row.target - row.collected).toLocaleString('id-ID')}
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
