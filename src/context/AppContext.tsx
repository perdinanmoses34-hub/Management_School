import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Language,
  SchoolEntity,
  UserAccount,
  Student,
  SubjectGrade,
  SPPBill,
  AttendanceRecord,
  AuditLog,
  AppNotification,
  OfflineQueueItem,
} from '../types';
import {
  INITIAL_SCHOOLS,
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_GRADES,
  INITIAL_SPP_BILLS,
  INITIAL_ATTENDANCE,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import { generateSha256Digest } from '../utils/crypto';
import { translations } from '../utils/i18n';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['id'];
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: UserAccount;
  schools: SchoolEntity[];
  activeSchool: SchoolEntity;
  setActiveSchoolId: (id: string) => void;
  addSchool: (school: Omit<SchoolEntity, 'id'>) => void;
  updateSchoolStatus: (id: string, status: 'aktif' | 'nonaktif' | 'kadaluarsa') => void;
  updateSchoolExpiry: (id: string, newDate: string) => void;
  students: Student[];
  updateStudentDukcapil: (id: string, verified: boolean) => void;
  grades: SubjectGrade[];
  updateGrade: (subjectId: string, tugas: number, uts: number, uas: number, notes: string) => Promise<void>;
  sppBills: SPPBill[];
  paySPPBill: (billId: string, method: 'qris' | 'va_bca' | 'va_mandiri' | 'va_bri' | 'gopay') => Promise<void>;
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id' | 'encryptedHash' | 'syncedToCloud'>) => Promise<AttendanceRecord>;
  auditLogs: AuditLog[];
  notifications: AppNotification[];
  unreadNotifsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  toggleNetworkStatus: () => void;
  offlineQueue: OfflineQueueItem[];
  syncOfflineQueue: () => Promise<void>;
  is2FAModalOpen: boolean;
  open2FAModal: (onSuccess: () => void, purposeText?: string) => void;
  close2FAModal: () => void;
  twoFactorCallback: (() => void) | null;
  twoFactorPurpose: string;
  isSecurityModalOpen: boolean;
  setIsSecurityModalOpen: (open: boolean) => void;
  isNotifModalOpen: boolean;
  setIsNotifModalOpen: (open: boolean) => void;
  e2eeSessionKey: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');
  const [currentRole, setCurrentRole] = useState<Role>('siswa');
  const [schools, setSchools] = useState<SchoolEntity[]>(() => {
    const saved = localStorage.getItem('siakad_schools');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOLS;
  });
  const [activeSchoolId, setActiveSchoolIdState] = useState<string>('sch_bm_01');
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('siakad_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [grades, setGrades] = useState<SubjectGrade[]>(() => {
    const saved = localStorage.getItem('siakad_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });
  const [sppBills, setSppBills] = useState<SPPBill[]>(() => {
    const saved = localStorage.getItem('siakad_spp');
    return saved ? JSON.parse(saved) : INITIAL_SPP_BILLS;
  });
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('siakad_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('siakad_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('siakad_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Offline capability state
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>(() => {
    const saved = localStorage.getItem('siakad_offline_queue');
    return saved ? JSON.parse(saved) : [];
  });

  // 2FA modal state
  const [is2FAModalOpen, setIs2FAModalOpen] = useState<boolean>(false);
  const [twoFactorCallback, setTwoFactorCallback] = useState<(() => void) | null>(null);
  const [twoFactorPurpose, setTwoFactorPurpose] = useState<string>('');

  // Security Center & Notifications Modal
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);

  // E2EE session key
  const [e2eeSessionKey] = useState<string>(() => 'E2EE-AES256-GCM-' + Math.random().toString(36).substring(2, 10).toUpperCase());

  // Listen to browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('siakad_schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('siakad_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('siakad_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('siakad_spp', JSON.stringify(sppBills));
  }, [sppBills]);

  useEffect(() => {
    localStorage.setItem('siakad_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('siakad_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('siakad_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('siakad_offline_queue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  const activeSchool = schools.find((s) => s.id === activeSchoolId) || schools[0];
  const currentUser = INITIAL_USERS[currentRole] || INITIAL_USERS.siswa;

  const t = translations[language];

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')} WIB`;
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif_' + Date.now(),
      timestamp: `Hari ini, ${timeStr}`,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const appendAuditLog = async (action: string, target: string, details: string) => {
    const timestamp = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + ' WIB';
    const rawData = `${currentUser.name}|${action}|${target}|${timestamp}|${details}`;
    const digest = await generateSha256Digest(rawData);

    const log: AuditLog = {
      id: 'log_' + Date.now(),
      timestamp,
      actorName: currentUser.name,
      actorRole: currentRole,
      action,
      targetEntity: target,
      details,
      ipAddress: '180.252.164.' + Math.floor(Math.random() * 200 + 10),
      sha256Digest: digest,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const toggleNetworkStatus = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      syncOfflineQueue();
    }
  };

  const syncOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;
    const count = offlineQueue.length;
    // Process items
    setOfflineQueue([]);
    addNotification({
      title: 'Sinkronisasi Cloud Berhasil',
      message: `${count} rekaman data lokal (absensi/nilai) berhasil disinkronkan ke server pusat.`,
      category: 'sistem',
    });
    await appendAuditLog('OFFLINE_SYNC_COMPLETE', 'Cloud Database', `Berhasil sinkronisasi ${count} rekaman offline.`);
  };

  const updateGrade = async (
    subjectId: string,
    tugas: number,
    uts: number,
    uas: number,
    notes: string
  ) => {
    const finalScore = Math.round(tugas * 0.3 + uts * 0.35 + uas * 0.35);
    let gradeLetter: 'A' | 'B' | 'C' | 'D' = 'D';
    let predicate = 'Perlu Pendampingan Khusus';

    if (finalScore >= 88) {
      gradeLetter = 'A';
      predicate = 'Sangat Baik (Capaian Optimal)';
    } else if (finalScore >= 78) {
      gradeLetter = 'B';
      predicate = 'Baik (Mencapai Tujuan)';
    } else if (finalScore >= 70) {
      gradeLetter = 'C';
      predicate = 'Cukup (Perlu Pemantapan)';
    }

    const digest = await generateSha256Digest(`grade_${subjectId}_${finalScore}_${Date.now()}`);

    const updated = grades.map((g) => {
      if (g.subjectId === subjectId) {
        return {
          ...g,
          tugas,
          uts,
          uas,
          finalScore,
          gradeLetter,
          predicate,
          notes,
          encryptedHash: digest.substring(0, 24),
          lastUpdated: 'Baru saja',
        };
      }
      return g;
    });

    setGrades(updated);

    if (!isOnline) {
      const queueItem: OfflineQueueItem = {
        id: 'q_grade_' + Date.now(),
        type: 'grade_update',
        payload: { subjectId, finalScore },
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      setOfflineQueue((prev) => [...prev, queueItem]);
    }

    const subject = grades.find((g) => g.subjectId === subjectId)?.subjectName || 'Mata Pelajaran';
    await appendAuditLog(
      'GRADE_MODIFIED_CLOUD_ENCRYPTED',
      subject,
      `Nilai diubah: Tugas=${tugas}, UTS=${uts}, UAS=${uas}, Nilai Akhir=${finalScore} (${gradeLetter})`
    );

    addNotification({
      title: 'Nilai Akademik Diperbarui',
      message: `Nilai ${subject} telah diperbarui oleh guru pengampu (${gradeLetter} - Skor: ${finalScore}).`,
      category: 'akademik',
    });
  };

  const paySPPBill = async (
    billId: string,
    method: 'qris' | 'va_bca' | 'va_mandiri' | 'va_bri' | 'gopay'
  ) => {
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
    const refCode = 'TRX-' + method.toUpperCase() + '-' + Date.now().toString().slice(-8);
    const receiptNum = 'INV/BM/' + now.getFullYear() + '/' + (now.getMonth() + 1).toString().padStart(2, '0') + '/' + Math.floor(1000 + Math.random() * 9000);

    const updatedBills = sppBills.map((b) => {
      if (b.id === billId) {
        return {
          ...b,
          status: 'Lunas' as const,
          paymentMethod: method,
          paidAt: `${dateStr} ${timeStr}`,
          transactionRef: refCode,
          receiptNumber: receiptNum,
        };
      }
      return b;
    });

    setSppBills(updatedBills);

    const targetBill = sppBills.find((b) => b.id === billId);
    await appendAuditLog(
      'SPP_PAYMENT_SETTLED',
      `SPP ${targetBill?.month}`,
      `Nominal Rp ${targetBill?.amount.toLocaleString('id-ID')} lunas via ${method.toUpperCase()}. Ref: ${refCode}`
    );

    addNotification({
      title: 'Pembayaran SPP Lunas!',
      message: `Tagihan SPP ${targetBill?.month} sebesar Rp ${targetBill?.amount.toLocaleString('id-ID')} telah sukses diverifikasi.`,
      category: 'pembayaran',
    });
  };

  const addAttendanceRecord = async (
    data: Omit<AttendanceRecord, 'id' | 'encryptedHash' | 'syncedToCloud'>
  ): Promise<AttendanceRecord> => {
    const digest = await generateSha256Digest(
      `att_${data.userId}_${data.date}_${data.time}_${data.latitude}_${data.longitude}`
    );

    const newRecord: AttendanceRecord = {
      ...data,
      id: 'att_' + Date.now(),
      syncedToCloud: isOnline,
      encryptedHash: digest.substring(0, 24),
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);

    if (!isOnline) {
      const qItem: OfflineQueueItem = {
        id: 'q_att_' + Date.now(),
        type: 'attendance',
        payload: newRecord,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      setOfflineQueue((prev) => [...prev, qItem]);
    }

    await appendAuditLog(
      'BIOMETRIC_ATTENDANCE_RECORDED',
      `${data.userName} (${data.type.toUpperCase()})`,
      `Lokasi: ${data.latitude.toFixed(5)}, ${data.longitude.toFixed(5)} (${data.distanceFromSchool}m). Akurasi Biometrik: ${data.biometricConfidence}%. Status Cloud: ${isOnline ? 'Synced' : 'Queued Offline'}`
    );

    addNotification({
      title: `Absensi ${data.type === 'masuk' ? 'Masuk' : 'Pulang'} Sukses`,
      message: `Terverifikasi biometrik (${data.biometricConfidence}%) pada ${data.time} dalam radius geofence.`,
      category: 'absensi',
    });

    return newRecord;
  };

  const updateStudentDukcapil = (id: string, verified: boolean) => {
    const now = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, dukcapilVerified: verified, lastDukcapilSync: now } : s))
    );
  };

  // Super Admin actions
  const addSchool = (schoolData: Omit<SchoolEntity, 'id'>) => {
    const newSchool: SchoolEntity = {
      ...schoolData,
      id: 'sch_' + Date.now(),
    };
    setSchools((prev) => [...prev, newSchool]);
    appendAuditLog(
      'SUPER_ADMIN_ADD_SCHOOL',
      newSchool.name,
      `Entitas sekolah baru ditambahkan. NPSN: ${newSchool.npsn}, Paket: ${newSchool.packageType}, Exp: ${newSchool.expiredDate}`
    );
    addNotification({
      title: 'Sekolah Baru Didaftarkan',
      message: `${newSchool.name} berhasil ditambahkan ke platform oleh Super Admin.`,
      category: 'sistem',
    });
  };

  const updateSchoolStatus = (id: string, status: 'aktif' | 'nonaktif' | 'kadaluarsa') => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    const sc = schools.find((s) => s.id === id);
    appendAuditLog(
      'SUPER_ADMIN_TOGGLE_STATUS',
      sc?.name || 'Sekolah',
      `Status operasional diubah menjadi [${status.toUpperCase()}].`
    );
  };

  const updateSchoolExpiry = (id: string, newDate: string) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, expiredDate: newDate, status: 'aktif' } : s))
    );
    const sc = schools.find((s) => s.id === id);
    appendAuditLog(
      'SUPER_ADMIN_EXTEND_LICENSE',
      sc?.name || 'Sekolah',
      `Masa berlaku lisensi diperpanjang hingga ${newDate}.`
    );
  };

  const open2FAModal = (onSuccess: () => void, purposeText: string = 'Konfirmasi Tindakan Sensitif') => {
    setTwoFactorCallback(() => onSuccess);
    setTwoFactorPurpose(purposeText);
    setIs2FAModalOpen(true);
  };

  const close2FAModal = () => {
    setIs2FAModalOpen(false);
    setTwoFactorCallback(null);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentRole,
        setCurrentRole,
        currentUser,
        schools,
        activeSchool,
        setActiveSchoolId: (id) => setActiveSchoolIdState(id),
        addSchool,
        updateSchoolStatus,
        updateSchoolExpiry,
        students,
        updateStudentDukcapil,
        grades,
        updateGrade,
        sppBills,
        paySPPBill,
        attendanceRecords,
        addAttendanceRecord,
        auditLogs,
        notifications,
        unreadNotifsCount,
        markNotificationAsRead,
        markAllNotificationsRead,
        addNotification,
        isOnline,
        setIsOnline,
        toggleNetworkStatus,
        offlineQueue,
        syncOfflineQueue,
        is2FAModalOpen,
        open2FAModal,
        close2FAModal,
        twoFactorCallback,
        twoFactorPurpose,
        isSecurityModalOpen,
        setIsSecurityModalOpen,
        isNotifModalOpen,
        setIsNotifModalOpen,
        e2eeSessionKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
