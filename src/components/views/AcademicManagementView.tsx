import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Edit3,
  Save,
  CheckCircle2,
  FileDown,
  Printer,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  Search,
  Sparkles,
  Lock,
  Cloud,
  CloudOff,
  QrCode,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SubjectGrade } from '../../types';

export const AcademicManagementView: React.FC = () => {
  const {
    currentRole,
    currentUser,
    grades,
    updateGrade,
    students,
    isOnline,
    t,
    open2FAModal,
    activeSchool,
  } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<SubjectGrade | null>(null);
  const [tugasInput, setTugasInput] = useState<number>(0);
  const [utsInput, setUtsInput] = useState<number>(0);
  const [uasInput, setUasInput] = useState<number>(0);
  const [notesInput, setNotesInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showRaporPrintModal, setShowRaporPrintModal] = useState(false);
  const [filterClass, setFilterClass] = useState('IX-A');

  const currentStudent = students[0]; // Muhammad Rizky Pratama

  const averageScore = Math.round(
    grades.reduce((sum, g) => sum + g.finalScore, 0) / grades.length
  );

  const passingRate = Math.round(
    (grades.filter((g) => g.finalScore >= g.kkm).length / grades.length) * 100
  );

  const handleEditGrade = (grade: SubjectGrade) => {
    setSelectedSubject(grade);
    setTugasInput(grade.tugas);
    setUtsInput(grade.uts);
    setUasInput(grade.uas);
    setNotesInput(grade.notes);
    setSaveSuccess(false);
  };

  const handleSaveGradeSubmit = async () => {
    if (!selectedSubject) return;

    // Trigger 2FA if sensitive role or high score update
    const executeSave = async () => {
      setIsSaving(true);
      await updateGrade(selectedSubject.subjectId, tugasInput, utsInput, uasInput, notesInput);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSelectedSubject(null);
      }, 1000);
    };

    if (currentUser.is2FAEnabled) {
      open2FAModal(executeSave, `Konfirmasi Penginputan Nilai ${selectedSubject.subjectName}`);
    } else {
      await executeSave();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header & Role Notice */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t.academic.title}</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {currentRole === 'guru' || currentRole === 'admin_sekolah'
                  ? 'Portal Penginputan Nilai Guru & Evaluasi Capaian Pembelajaran'
                  : 'Rapor Digital Siswa & Catatan Akademik Terpadu'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Cloud Sync Status Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}
          >
            {isOnline ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cloud Sync Real-Time</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Penyimpanan Offline Lokal</span>
              </>
            )}
          </div>

          <button
            id="btn-print-rapor"
            onClick={() => setShowRaporPrintModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rapor Digital</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Rata-Rata Nilai</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{averageScore}</span>
            <span className="text-xs font-bold text-emerald-600">Predikat A</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Dari 6 Mata Pelajaran</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Ketuntasan Belajar</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-600">{passingRate}%</span>
            <span className="text-xs font-semibold text-slate-500">Lolos KKM</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">KKM Standar: 75</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Peringkat Kelas</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-600">2</span>
            <span className="text-xs font-semibold text-slate-500">dari 32 Siswa</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Kelas IX-A Reguler</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Kehadiran KBM</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">98.5%</span>
            <span className="text-xs font-semibold text-slate-500">Sangat Rajin</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Absensi Biometrik</span>
        </div>
      </div>

      {/* Student Profile Ribbon (For Student View) */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-700 shrink-0 border-2 border-white/30 shadow-md">
            <img src={currentStudent.avatar} alt={currentStudent.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-white">{currentStudent.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                {currentStudent.class}
              </span>
            </div>
            <div className="text-xs text-blue-200 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 font-mono">
              <span>NISN: {currentStudent.nisn}</span>
              <span>NIK: 3174**********0003 (Terenkripsi)</span>
              <span>Wali: {currentStudent.parentName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div className="text-right sm:block hidden">
            <span className="text-[10px] text-blue-300 block">Status Keamanan Rapor</span>
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 justify-end">
              <ShieldCheck className="w-3.5 h-3.5" /> Terproteksi E2EE
            </span>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Tabel Nilai Rapor Semester Ganjil T.A 2026/2027</h3>
            <p className="text-xs text-slate-500">Bobot penilaian: Tugas (30%), UTS (35%), UAS (35%)</p>
          </div>

          {(currentRole === 'guru' || currentRole === 'admin_sekolah') && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Filter Kelas:</span>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
              >
                <option value="IX-A">Kelas IX-A</option>
                <option value="IX-B">Kelas IX-B</option>
                <option value="VIII-A">Kelas VIII-A</option>
              </select>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4">Mata Pelajaran</th>
                <th className="p-3.5 sm:p-4">Guru Pengampu</th>
                <th className="p-3.5 sm:p-4 text-center">KKM</th>
                <th className="p-3.5 sm:p-4 text-center">Tugas (30%)</th>
                <th className="p-3.5 sm:p-4 text-center">UTS (35%)</th>
                <th className="p-3.5 sm:p-4 text-center">UAS (35%)</th>
                <th className="p-3.5 sm:p-4 text-center">Nilai Akhir</th>
                <th className="p-3.5 sm:p-4 text-center">Predikat</th>
                <th className="p-3.5 sm:p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((item) => (
                <tr key={item.subjectId} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 sm:p-4 font-bold text-slate-900">
                    {item.subjectName}
                    <div className="text-[11px] text-slate-400 font-normal mt-0.5 line-clamp-1">
                      {item.notes}
                    </div>
                  </td>
                  <td className="p-3.5 sm:p-4 text-slate-600 whitespace-nowrap">
                    {item.teacherName}
                  </td>
                  <td className="p-3.5 sm:p-4 text-center font-mono font-medium text-slate-500">
                    {item.kkm}
                  </td>
                  <td className="p-3.5 sm:p-4 text-center font-mono font-semibold text-slate-700">
                    {item.tugas}
                  </td>
                  <td className="p-3.5 sm:p-4 text-center font-mono font-semibold text-slate-700">
                    {item.uts}
                  </td>
                  <td className="p-3.5 sm:p-4 text-center font-mono font-semibold text-slate-700">
                    {item.uas}
                  </td>
                  <td className="p-3.5 sm:p-4 text-center">
                    <span className="font-mono text-base font-extrabold text-blue-700">
                      {item.finalScore}
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.gradeLetter === 'A'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : item.gradeLetter === 'B'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      Predikat {item.gradeLetter}
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                    {currentRole === 'guru' || currentRole === 'admin_sekolah' ? (
                      <button
                        id={`btn-edit-grade-${item.subjectId}`}
                        onClick={() => handleEditGrade(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs transition cursor-pointer border border-slate-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Input Nilai</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">Tervalidasi Cloud</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Grade Modal Dialog (For Teachers) */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedSubject(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Input Nilai: {selectedSubject.subjectName}</h3>
                <p className="text-xs text-slate-500">Siswa: {currentStudent.name} (Kelas {currentStudent.class})</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tugas (30%)</label>
                <input
                  id="input-grade-tugas"
                  type="number"
                  min={0}
                  max={100}
                  value={tugasInput}
                  onChange={(e) => setTugasInput(Number(e.target.value))}
                  className="w-full font-mono text-center font-bold text-base p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">UTS (35%)</label>
                <input
                  id="input-grade-uts"
                  type="number"
                  min={0}
                  max={100}
                  value={utsInput}
                  onChange={(e) => setUtsInput(Number(e.target.value))}
                  className="w-full font-mono text-center font-bold text-base p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">UAS (35%)</label>
                <input
                  id="input-grade-uas"
                  type="number"
                  min={0}
                  max={100}
                  value={uasInput}
                  onChange={(e) => setUasInput(Number(e.target.value))}
                  className="w-full font-mono text-center font-bold text-base p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Calculated Final Score Preview */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-900 block">Kalkulasi Otomatis Nilai Akhir</span>
                <span className="text-[11px] text-blue-700">Rumus: (Tugas × 0.3) + (UTS × 0.35) + (UAS × 0.35)</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-blue-800">
                  {Math.round(tugasInput * 0.3 + utsInput * 0.35 + uasInput * 0.35)}
                </span>
                <span className="text-xs font-bold text-blue-700 block">
                  {Math.round(tugasInput * 0.3 + utsInput * 0.35 + uasInput * 0.35) >= selectedSubject.kkm
                    ? 'Tuntas'
                    : 'Belum Tuntas'}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Catatan Capaian Kompetensi / Guru</label>
              <textarea
                rows={2}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Catatan perkembangan belajar siswa..."
              />
            </div>

            {saveSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Nilai Terenkripsi & Berhasil Disimpan ke Cloud!</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubject(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="btn-save-grade-cloud"
                  type="button"
                  onClick={handleSaveGradeSubmit}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan ke Cloud...' : 'Simpan ke Cloud'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Digital Report Card Print / PDF Preview Modal */}
      {showRaporPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col relative">
            <button
              onClick={() => setShowRaporPrintModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Document Paper */}
            <div className="overflow-y-auto p-4 border border-slate-200 rounded-xl bg-slate-50/40">
              {/* Document Letterhead */}
              <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide">
                  PEMERINTAH PROVINSI DKI JAKARTA • DINAS PENDIDIKAN
                </h2>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase">
                  {activeSchool.name}
                </h1>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  NPSN: {activeSchool.npsn} • Akreditasi: {activeSchool.accreditation} • {activeSchool.address}
                </p>
                <div className="mt-2 text-xs font-bold uppercase tracking-widest text-blue-900 border-t border-slate-300 pt-1">
                  LAPORAN HASIL BELAJAR PESERTA DIDIK (RAPOR DIGITAL)
                </div>
              </div>

              {/* Student Identity Grid */}
              <div className="grid grid-cols-2 text-xs text-slate-700 gap-y-1 gap-x-4 mb-4 bg-white p-3 rounded-lg border border-slate-200">
                <div>Nama Siswa: <strong className="text-slate-900">{currentStudent.name}</strong></div>
                <div>Kelas / Fase: <strong className="text-slate-900">IX-A / Fase D</strong></div>
                <div>NISN / NIK: <strong className="text-slate-900">{currentStudent.nisn} / {currentStudent.nik}</strong></div>
                <div>Semester / T.A: <strong className="text-slate-900">Ganjil / 2026-2027</strong></div>
              </div>

              {/* Grades Table Mini */}
              <div className="overflow-x-auto w-full max-w-full my-4">
                <table className="w-full text-left text-xs border border-slate-300 min-w-[340px]">
                  <thead className="bg-slate-200 text-slate-800 font-bold">
                    <tr>
                      <th className="p-2 border border-slate-300">Mata Pelajaran</th>
                      <th className="p-2 border border-slate-300 text-center">Nilai</th>
                      <th className="p-2 border border-slate-300 text-center">Predikat</th>
                      <th className="p-2 border border-slate-300">Capaian Kompetensi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g) => (
                      <tr key={g.subjectId} className="border border-slate-300">
                        <td className="p-2 border border-slate-300 font-semibold">{g.subjectName}</td>
                        <td className="p-2 border border-slate-300 text-center font-bold font-mono">{g.finalScore}</td>
                        <td className="p-2 border border-slate-300 text-center font-bold">{g.gradeLetter}</td>
                        <td className="p-2 border border-slate-300 text-[11px] text-slate-600">{g.predicate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Signatures with QR verification code */}
              <div className="flex items-center justify-between mt-6 text-xs text-slate-700 pt-3 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-[11px] text-slate-500 mb-1">Verifikasi Digital Kemendikbud</p>
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center mx-auto shadow-xs">
                    <QrCode className="w-12 h-12" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 block mt-1">E2EE_SEC_88921</span>
                </div>

                <div className="text-center">
                  <p className="text-[11px] text-slate-500">Jakarta, 14 September 2026</p>
                  <p className="font-bold text-slate-900 mt-1">Kepala Sekolah,</p>
                  <div className="h-10"></div>
                  <p className="font-bold text-slate-900 underline">{activeSchool.headmasterName}</p>
                  <p className="text-[10px] text-slate-500">NIP: 19680415 199412 2 001</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() => setShowRaporPrintModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
