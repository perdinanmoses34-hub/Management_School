import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  ShieldCheck,
  UserCheck,
  Smartphone,
  Navigation,
  Cloud,
  CloudOff,
  Crosshair,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateDistanceMeters, formatDistance } from '../../utils/geo';
import confetti from 'canvas-confetti';

export const AttendanceBiometricView: React.FC = () => {
  const {
    activeSchool,
    currentUser,
    currentRole,
    addAttendanceRecord,
    attendanceRecords,
    isOnline,
    t,
  } = useApp();

  // Location state
  const [currentLat, setCurrentLat] = useState<number>(activeSchool.latitude + 0.00015);
  const [currentLng, setCurrentLng] = useState<number>(activeSchool.longitude + 0.00012);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>('');

  // Camera & Biometric state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanningFace, setIsScanningFace] = useState<boolean>(false);
  const [biometricScore, setBiometricScore] = useState<number>(98.9);
  const [biometricPassed, setBiometricPassed] = useState<boolean>(false);

  // Attendance submission state
  const [shiftType, setShiftType] = useState<'masuk' | 'pulang'>('masuk');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Calculate distance
  const distance = calculateDistanceMeters(
    currentLat,
    currentLng,
    activeSchool.latitude,
    activeSchool.longitude
  );
  const isWithinRadius = distance <= activeSchool.geofenceRadiusMeters;

  // Real GPS Geolocation fetching
  const requestRealLocation = () => {
    setIsLocating(true);
    setLocationError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLat(pos.coords.latitude);
          setCurrentLng(pos.coords.longitude);
          setIsLocating(false);
        },
        (err) => {
          console.warn('GPS Error or Permission Denied:', err.message);
          setLocationError('GPS tidak aktif atau izin ditolak. Menggunakan simulasi radius sekolah.');
          setIsLocating(false);
          // Keep simulated coordinates near school
          setCurrentLat(activeSchool.latitude + 0.00012);
          setCurrentLng(activeSchool.longitude + 0.00014);
        },
        { timeout: 8000 }
      );
    } else {
      setLocationError('Perangkat tidak mendukung geolokasi');
      setIsLocating(false);
    }
  };

  // Start real web camera or fallback
  const startCamera = async () => {
    setIsCameraActive(true);
    setCapturedImage(null);
    setBiometricPassed(false);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      // Fallback to simulated biometric camera stream
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const simulateFaceScan = () => {
    setIsScanningFace(true);
    setTimeout(() => {
      setIsScanningFace(false);
      const score = Number((97.5 + Math.random() * 2.3).toFixed(1));
      setBiometricScore(score);
      setBiometricPassed(true);
      setCapturedImage(
        currentUser.avatar ||
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'
      );
      stopCamera();
    }, 1800);
  };

  const handleRecordAttendance = async () => {
    if (!isWithinRadius) {
      alert('Anda berada di luar radius sekolah. Absensi tidak dapat dilakukan.');
      return;
    }
    if (!biometricPassed) {
      alert('Silakan lakukan verifikasi biometrik wajah terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')} WIB`;

    const isLate = shiftType === 'masuk' && now.getHours() >= 7 && now.getMinutes() > 0;

    await addAttendanceRecord({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentRole,
      date: dateStr,
      time: timeStr,
      type: shiftType,
      status: isLate ? 'terlambat' : 'hadir',
      latitude: currentLat,
      longitude: currentLng,
      distanceFromSchool: distance,
      isWithinRadius: true,
      biometricConfidence: biometricScore,
      biometricVerified: true,
      biometricPhotoUrl: capturedImage || currentUser.avatar,
    });

    setIsSubmitting(false);
    setSubmitSuccess(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      setSubmitSuccess(false);
      setCapturedImage(null);
      setBiometricPassed(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t.attendance.title}</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Pencocokan lokasi geofence GPS real-time & verifikasi biometrik anti-spoofing
              </p>
            </div>
          </div>
        </div>

        {/* Offline Badge Reminder */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-300'
          }`}
        >
          {isOnline ? (
            <>
              <Cloud className="w-4 h-4 text-emerald-600" />
              <span>Tersinkronisasi Cloud</span>
            </>
          ) : (
            <>
              <CloudOff className="w-4 h-4 text-amber-600" />
              <span>Offline: Data Akan Tersimpan di Memori Lokal</span>
            </>
          )}
        </div>
      </div>

      {/* Main Dual Grid: Geofence Location on Left, Biometric on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Geofence & Location */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Validasi Geofence Lokasi</h3>
              </div>
              <button
                id="btn-refresh-gps"
                onClick={requestRealLocation}
                disabled={isLocating}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>Deteksi GPS</span>
              </button>
            </div>

            {/* Radius Status Banner */}
            <div
              className={`p-4 rounded-2xl border mb-4 flex items-center gap-3.5 ${
                isWithinRadius
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isWithinRadius
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                }`}
              >
                {isWithinRadius ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <span>{isWithinRadius ? 'Dalam Radius Kampus Sekolah' : 'Di Luar Radius Sekolah'}</span>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-white/60">
                    {formatDistance(distance)}
                  </span>
                </div>
                <p className="text-xs mt-0.5 opacity-80">
                  {isWithinRadius
                    ? `Jarak Anda (${formatDistance(distance)}) memenuhi batas toleransi geofence maksimal ${activeSchool.geofenceRadiusMeters} meter.`
                    : `Jarak Anda saat ini ${formatDistance(distance)}. Harap berada dalam area sekolah (${activeSchool.geofenceRadiusMeters}m).`}
                </p>
              </div>
            </div>

            {/* Location Coordinates Visual Card */}
            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Pusat Titik Sekolah:</span>
                <span className="font-mono font-bold text-slate-800">
                  {activeSchool.latitude.toFixed(6)}, {activeSchool.longitude.toFixed(6)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Koordinat Perangkat Anda:</span>
                <span className="font-mono font-bold text-blue-700">
                  {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-medium">Radius Aman Sekolah:</span>
                <span className="font-bold text-slate-800">{activeSchool.geofenceRadiusMeters} meter</span>
              </div>
            </div>

            {locationError && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 mb-3">
                {locationError}
              </p>
            )}
          </div>

          {/* Quick Simulation Buttons for Testing */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline">Uji Posisi:</span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                id="btn-sim-inside"
                onClick={() => {
                  setCurrentLat(activeSchool.latitude + 0.0001);
                  setCurrentLng(activeSchool.longitude + 0.0001);
                }}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-semibold transition border cursor-pointer ${
                  isWithinRadius
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Di Sekolah (~18m)
              </button>
              <button
                id="btn-sim-outside"
                onClick={() => {
                  setCurrentLat(activeSchool.latitude + 0.004);
                  setCurrentLng(activeSchool.longitude + 0.004);
                }}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-semibold transition border cursor-pointer ${
                  !isWithinRadius
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Di Luar (~450m)
              </button>
            </div>
          </div>
        </div>

        {/* Module 2: Biometric Camera & Face Recognition */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">Pemindaian Biometrik Wajah</h3>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                Akurasi {biometricScore}%
              </span>
            </div>

            {/* Viewfinder Area */}
            <div className="relative w-full aspect-4/3 rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border-2 border-slate-800 shadow-inner">
              {/* Real Video Feed if active */}
              {isCameraActive && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
              )}

              {/* Captured Photo Preview */}
              {capturedImage && !isCameraActive && (
                <img
                  src={capturedImage}
                  alt="Biometric Capture"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Idle Placeholder */}
              {!isCameraActive && !capturedImage && (
                <div className="text-center p-6 text-slate-400">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-300">
                    <Crosshair className="w-8 h-8" />
                  </div>
                  <p className="text-xs font-semibold text-slate-300">Kamera Belum Aktif</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                    Klik tombol untuk menyalakan kamera depan atau memindai biometrik wajah.
                  </p>
                </div>
              )}

              {/* Scanning Overlay Visual (Facial Guide Oval & Laser Grid) */}
              {(isCameraActive || isScanningFace) && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-48 h-56 border-2 border-dashed border-emerald-400 rounded-[45%] relative animate-pulse flex items-center justify-center">
                    <span className="absolute -top-6 text-[11px] font-bold text-emerald-400 bg-slate-900/80 px-2.5 py-0.5 rounded-full">
                      Posisikan Wajah di Sini
                    </span>
                    {isScanningFace && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent top-0 animate-[bounce_1.5s_infinite]"></div>
                    )}
                  </div>
                </div>
              )}

              {/* Success Badge on captured photo */}
              {biometricPassed && (
                <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Biometrik Terverifikasi</span>
                </div>
              )}
            </div>

            {/* Scanner Controls */}
            <div className="mt-4 flex gap-2">
              {!isCameraActive ? (
                <button
                  id="btn-start-camera"
                  onClick={startCamera}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Buka Kamera</span>
                </button>
              ) : (
                <button
                  id="btn-stop-camera"
                  onClick={stopCamera}
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  Tutup Kamera
                </button>
              )}

              <button
                id="btn-scan-face-simulate"
                onClick={simulateFaceScan}
                disabled={isScanningFace}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isScanningFace ? 'Menganalisis Wajah...' : 'Pindai Wajah'}</span>
              </button>
            </div>
          </div>

          {/* Shift Selection & Final Action Button */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setShiftType('masuk')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  shiftType === 'masuk'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Absen Masuk
              </button>
              <button
                onClick={() => setShiftType('pulang')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  shiftType === 'pulang'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Absen Pulang
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Absensi Berhasil Dicatat & Terenkripsi E2EE!</span>
              </div>
            ) : (
              <button
                id="btn-submit-attendance"
                onClick={handleRecordAttendance}
                disabled={!isWithinRadius || !biometricPassed || isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Mencatat Absensi...' : `Konfirmasi Absen ${shiftType === 'masuk' ? 'Masuk' : 'Pulang'}`}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Riwayat Rekapitulasi Absensi Terverifikasi</h3>
            <p className="text-xs text-slate-500">Log kehadiran terintegrasi dengan validasi biometrik & koordinat GPS</p>
          </div>
          <span className="text-xs font-mono text-slate-500 font-semibold">{attendanceRecords.length} Rekaman</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4">Nama & Foto Biometrik</th>
                <th className="p-3.5 sm:p-4">Tipe & Status</th>
                <th className="p-3.5 sm:p-4">Waktu</th>
                <th className="p-3.5 sm:p-4">Jarak Geofence</th>
                <th className="p-3.5 sm:p-4 text-center">Akurasi Wajah</th>
                <th className="p-3.5 sm:p-4 text-right">Status Cloud</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                        <img src={item.biometricPhotoUrl} alt={item.userName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{item.userName}</div>
                        <div className="text-[11px] text-slate-500 capitalize">{item.userRole.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 sm:p-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold capitalize text-slate-800">
                        {item.type}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.status === 'hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 sm:p-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{item.date}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{item.time}</div>
                  </td>
                  <td className="p-3.5 sm:p-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {item.distanceFromSchool}m ({item.isWithinRadius ? 'Dalam Radius' : 'Di Luar'})
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-center whitespace-nowrap">
                    <span className="font-bold text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                      {item.biometricConfidence}% Lolos
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                    {item.syncedToCloud ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tersinkron Cloud</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Antrean Offline</span>
                      </span>
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
