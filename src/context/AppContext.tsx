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
  AppearanceConfig,
  ChatMessage,
  GoogleDriveBackupRecord,
} from '../types';
import {
  INITIAL_SCHOOLS,
  INITIAL_USERS,
  INITIAL_USER_DIRECTORY,
  INITIAL_STUDENTS,
  INITIAL_GRADES,
  INITIAL_SPP_BILLS,
  INITIAL_ATTENDANCE,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_APPEARANCE,
  INITIAL_CHAT_MESSAGES,
  INITIAL_DRIVE_BACKUPS,
} from '../data/initialData';
import { generateSha256Digest } from '../utils/crypto';
import { translations } from '../utils/i18n';
import { db, verifyFirestoreConnection, doc, onSnapshot, setDoc, collection, query, orderBy, limit } from '../lib/firebase';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['id'];
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: UserAccount;
  setCurrentUser: (user: UserAccount) => void;
  allUsers: UserAccount[];
  addUser: (user: Omit<UserAccount, 'id' | 'lastLogin'>) => Promise<void>;
  updateUser: (id: string, data: Partial<UserAccount>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  resetUserPassword: (id: string, newPass: string) => Promise<void>;
  loginWithCredentials: (username: string, pass: string) => { success: boolean; message: string; user?: UserAccount };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  registerSchoolAndAdmin: (
    schoolData: Omit<SchoolEntity, 'id'>,
    adminData: { name: string; username: string; password: string; email: string; phone: string }
  ) => Promise<{ success: boolean; school: SchoolEntity; admin: UserAccount }>;
  schools: SchoolEntity[];
  activeSchool: SchoolEntity;
  setActiveSchoolId: (id: string) => void;
  addSchool: (school: Omit<SchoolEntity, 'id'>, adminUsername?: string, adminPassword?: string) => Promise<void>;
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
  isSyncing: boolean;
  is2FAModalOpen: boolean;
  open2FAModal: (onSuccess: () => void, purposeText?: string) => void;
  close2FAModal: () => void;
  twoFactorCallback: (() => void) | null;
  twoFactorPurpose: string;
  isSecurityModalOpen: boolean;
  setIsSecurityModalOpen: (open: boolean) => void;
  isNotifModalOpen: boolean;
  setIsNotifModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  e2eeSessionKey: string;
  appearance: AppearanceConfig;
  updateAppearance: (config: Partial<AppearanceConfig>) => Promise<void>;
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string, channelId: string) => Promise<void>;
  addMessageReaction: (messageId: string, emoji: string) => Promise<void>;
  connectedDriveAccount: string;
  driveBackups: GoogleDriveBackupRecord[];
  performDriveBackup: () => Promise<GoogleDriveBackupRecord>;
  downloadDatabaseSnapshot: () => void;
  restoreDatabaseFromSnapshot: (jsonData: string) => { success: boolean; message: string };
  isFirestoreConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');
  const [currentRole, setCurrentRoleState] = useState<Role>('admin_sekolah');
  const [activeTab, setActiveTabState] = useState<string>('beranda');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);

  // Auto detect registration parameter in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('register') === 'school' || params.get('daftar') === 'sekolah' || params.get('daftar') === '1') {
        setIsRegisterModalOpen(true);
      }
    }
  }, []);

  // Schools state
  const [schools, setSchools] = useState<SchoolEntity[]>(() => {
    const saved = localStorage.getItem('siakad_schools');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOLS;
  });
  const [activeSchoolId, setActiveSchoolIdState] = useState<string>('sch_bm_01');

  // User directory state
  const [allUsers, setAllUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('siakad_all_users');
    return saved ? JSON.parse(saved) : INITIAL_USER_DIRECTORY;
  });

  // Current logged in user (defaults to School Admin Bagus Prasetyo, S.Kom)
  const [currentUser, setCurrentUserState] = useState<UserAccount>(() => {
    return INITIAL_USERS.admin_sekolah;
  });

  // Academic & Student state
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

  // Appearance / Whitelabel Customization State
  const [appearance, setAppearance] = useState<AppearanceConfig>(() => {
    const saved = localStorage.getItem('siakad_appearance');
    return saved ? JSON.parse(saved) : DEFAULT_APPEARANCE;
  });

  // Realtime Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('siakad_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  // Google Drive Cloud Backup State
  const connectedDriveAccount = 'pusat.drive@siakad.id';
  const [driveBackups, setDriveBackups] = useState<GoogleDriveBackupRecord[]>(() => {
    const saved = localStorage.getItem('siakad_drive_backups');
    return saved ? JSON.parse(saved) : INITIAL_DRIVE_BACKUPS;
  });

  // Network & Sync State
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>(() => {
    const saved = localStorage.getItem('siakad_offline_queue');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals
  const [is2FAModalOpen, setIs2FAModalOpen] = useState<boolean>(false);
  const [twoFactorCallback, setTwoFactorCallback] = useState<(() => void) | null>(null);
  const [twoFactorPurpose, setTwoFactorPurpose] = useState<string>('');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // E2EE Key
  const [e2eeSessionKey] = useState<string>(() => 'E2EE-AES256-GCM-' + Math.random().toString(36).substring(2, 10).toUpperCase());

  // Test and initialize Firebase on boot
  useEffect(() => {
    verifyFirestoreConnection().then((connected) => {
      setIsFirestoreConnected(connected);
    });
  }, []);

  // Listen to Firestore real-time chats
  useEffect(() => {
    try {
      const chatCol = collection(db, 'chats');
      const q = query(chatCol, orderBy('createdAt', 'asc'), limit(60));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: ChatMessage[] = [];
            snapshot.forEach((d) => list.push(d.data() as ChatMessage));
            setChatMessages((prev) => {
              const map = new Map<string, ChatMessage>();
              prev.forEach((m) => map.set(m.id, m));
              list.forEach((m) => map.set(m.id, m));
              return Array.from(map.values()).sort((a, b) => a.createdAt - b.createdAt);
            });
          }
        },
        (error) => {
          console.warn('Firestore realtime chats fallback:', error);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore listener setup error:', e);
    }
  }, []);

  // Listen to Firestore appearance config for active school
  useEffect(() => {
    try {
      const docRef = doc(db, 'schools', activeSchoolId, 'config', 'appearance');
      const unsub = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as AppearanceConfig;
            setAppearance(data);
          }
        },
        (err) => console.warn('Firestore appearance fallback:', err)
      );
      return () => unsub();
    } catch (e) {
      console.warn('Firestore appearance hook error:', e);
    }
  }, [activeSchoolId]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('siakad_schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('siakad_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

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
    localStorage.setItem('siakad_appearance', JSON.stringify(appearance));
  }, [appearance]);

  useEffect(() => {
    localStorage.setItem('siakad_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('siakad_drive_backups', JSON.stringify(driveBackups));
  }, [driveBackups]);

  useEffect(() => {
    localStorage.setItem('siakad_offline_queue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Online / offline event listener
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

  const activeSchool = schools.find((s) => s.id === activeSchoolId) || schools[0];
  const t = translations[language];
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const setCurrentRole = (role: Role) => {
    setCurrentRoleState(role);
    // Find matching user for this role
    const matchedUser = allUsers.find(
      (u) => u.role === role && (role === 'super_admin' || u.schoolId === activeSchoolId)
    ) || INITIAL_USERS[role] || allUsers[0];
    setCurrentUserState(matchedUser);
  };

  const setCurrentUser = (user: UserAccount) => {
    setCurrentUserState(user);
    setCurrentRoleState(user.role);
  };

  // Login with Username & Password - redirects directly to role-specific dashboard page
  const loginWithCredentials = (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase();
    
    // Check default tn.timbu credentials explicitly (Super Admin)
    if (cleanUser === 'tn.timbu' && (pass === 'Eklesia_030918.' || pass === INITIAL_USERS.super_admin.password)) {
      const superAdminUser = INITIAL_USERS.super_admin;
      setCurrentUser(superAdminUser);
      setActiveTabState('superAdmin'); // Immediately redirects to SIAKAD Super Admin Dashboard
      appendAuditLog(
        'SUPER_ADMIN_LOGIN',
        'Tn. Timbu',
        'Super Administrator login via username: tn.timbu.'
      );
      addNotification({
        title: 'Login Berhasil - SIAKAD Pusat',
        message: 'Akses penuh pemilik sistem diaktifkan (tn.timbu). Mengarahkan ke Dashboard SIAKAD.',
        category: 'keamanan',
      });
      return { success: true, message: 'Selamat datang di SIAKAD Pusat', user: superAdminUser };
    }

    // Check in allUsers (including dynamically registered admins, teachers, parents, students)
    const user = allUsers.find(
      (u) => u.username.toLowerCase() === cleanUser && u.password === pass
    );

    if (user) {
      setCurrentUser(user);
      if (user.schoolId && user.schoolId !== 'sch_global') {
        setActiveSchoolIdState(user.schoolId);
      }
      
      // Directly direct user to their respective role dashboard:
      if (user.role === 'super_admin') {
        setActiveTabState('superAdmin');
      } else if (user.role === 'admin_sekolah') {
        setActiveTabState('pengguna');
      } else if (user.role === 'kepala_sekolah') {
        setActiveTabState('analitik');
      } else if (user.role === 'guru') {
        setActiveTabState('akademik');
      } else if (user.role === 'siswa') {
        setActiveTabState('akademik');
      } else if (user.role === 'orang_tua') {
        setActiveTabState('spp');
      } else {
        setActiveTabState('beranda');
      }

      appendAuditLog(
        'USER_LOGIN_SUCCESS',
        user.name,
        `Login berhasil sebagai ${user.role.toUpperCase()} (${user.username}).`
      );
      addNotification({
        title: 'Login Berhasil',
        message: `Selamat datang, ${user.name}! Mengarahkan ke panel ${user.role.replace('_', ' ').toUpperCase()}.`,
        category: 'keamanan',
      });
      return { success: true, message: `Login berhasil sebagai ${user.name}`, user };
    }

    return { success: false, message: 'Username atau Password salah. Periksa kembali data Anda.' };
  };

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
    setIsSyncing(true);
    const count = offlineQueue.length;
    // Simulate brief network batching
    await new Promise((r) => setTimeout(r, 600));
    setOfflineQueue([]);
    setIsSyncing(false);
    addNotification({
      title: 'Sinkronisasi Cloud Berhasil',
      message: `${count} rekaman data lokal (absensi/nilai) berhasil disinkronkan ke server Firebase.`,
      category: 'sistem',
    });
    await appendAuditLog('OFFLINE_SYNC_COMPLETE', 'Firebase Firestore', `Berhasil sinkronisasi ${count} rekaman offline.`);
  };

  // User Management
  const addUser = async (userData: Omit<UserAccount, 'id' | 'lastLogin'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: 'usr_' + Date.now(),
      lastLogin: 'Belum pernah login',
      status: userData.status || 'aktif',
    };
    setAllUsers((prev) => [...prev, newUser]);
    await appendAuditLog(
      'USER_ACCOUNT_CREATED',
      newUser.name,
      `Akun baru dibuat [${newUser.role.toUpperCase()}]: ${newUser.username} untuk ${newUser.schoolName || activeSchool.name}`
    );
    addNotification({
      title: 'Akun Pengguna Dibuat',
      message: `Akun ${newUser.name} (${newUser.role}) berhasil ditambahkan ke database.`,
      category: 'sistem',
    });
  };

  const updateUser = async (id: string, data: Partial<UserAccount>) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    );
    const target = allUsers.find((u) => u.id === id);
    await appendAuditLog(
      'USER_ACCOUNT_UPDATED',
      target?.name || 'User',
      `Data akun diperbarui: ${Object.keys(data).join(', ')}`
    );
  };

  const deleteUser = async (id: string) => {
    const target = allUsers.find((u) => u.id === id);
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
    await appendAuditLog(
      'USER_ACCOUNT_DELETED',
      target?.name || 'User',
      `Akun ${target?.username} (${target?.role}) dihapus dari sistem.`
    );
    addNotification({
      title: 'Akun Dihapus',
      message: `Akun ${target?.name} telah dihapus dari sistem.`,
      category: 'keamanan',
    });
  };

  const resetUserPassword = async (id: string, newPass: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, password: newPass } : u))
    );
    const target = allUsers.find((u) => u.id === id);
    await appendAuditLog(
      'USER_PASSWORD_RESET',
      target?.name || 'User',
      `Password untuk username ${target?.username} berhasil diatur ulang.`
    );
    addNotification({
      title: 'Reset Password Berhasil',
      message: `Password untuk akun ${target?.name} (${target?.username}) telah direset.`,
      category: 'keamanan',
    });
  };

  // Super Admin: Add School + Auto Create School Admin Account
  const addSchool = async (
    schoolData: Omit<SchoolEntity, 'id'>,
    adminUsername?: string,
    adminPassword?: string
  ) => {
    const newSchoolId = 'sch_' + Date.now();
    const newSchool: SchoolEntity = {
      ...schoolData,
      id: newSchoolId,
    };
    setSchools((prev) => [...prev, newSchool]);

    // Create the School Admin account for this school so they can manage their own users
    const generatedUsername = adminUsername || `admin.${newSchool.npsn}`;
    const generatedPassword = adminPassword || 'AdminSekolah_123!';
    const adminUser: UserAccount = {
      id: 'usr_adm_' + Date.now(),
      username: generatedUsername,
      password: generatedPassword,
      name: `Admin ${newSchool.name}`,
      email: newSchool.contactEmail || `admin@${newSchool.npsn}.sch.id`,
      role: 'admin_sekolah',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      nipOrNisn: `NIP-${newSchool.npsn}-01`,
      phone: '+62 812-0000-1111',
      schoolId: newSchoolId,
      schoolName: newSchool.name,
      is2FAEnabled: true,
      lastLogin: 'Belum pernah login',
      status: 'aktif',
    };
    setAllUsers((prev) => [...prev, adminUser]);

    await appendAuditLog(
      'SUPER_ADMIN_ADD_SCHOOL',
      newSchool.name,
      `Entitas sekolah baru didaftarkan oleh Tn. Timbu. Akun Admin Sekolah: ${generatedUsername} / ${generatedPassword}`
    );
    addNotification({
      title: 'Sekolah & Akun Admin Berhasil Dibuat',
      message: `${newSchool.name} terdaftar. Akun Admin: ${generatedUsername} dapat langsung mengelola akun guru, siswa, dan orang tua.`,
      category: 'sistem',
    });
  };

  // Registration System: User registers a new school & admin via shared invitation link
  const registerSchoolAndAdmin = async (
    schoolData: Omit<SchoolEntity, 'id'>,
    adminData: { name: string; username: string; password: string; email: string; phone: string }
  ) => {
    const newSchoolId = 'sch_' + Date.now();
    const newSchool: SchoolEntity = {
      ...schoolData,
      id: newSchoolId,
      status: 'aktif',
      packageType: schoolData.packageType || 'Pro',
      registeredAt: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      expiredDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setSchools((prev) => [...prev, newSchool]);

    const newAdmin: UserAccount = {
      id: 'usr_adm_' + Date.now(),
      username: adminData.username.trim().toLowerCase(),
      password: adminData.password,
      name: adminData.name,
      email: adminData.email || `${adminData.username}@${newSchool.npsn || 'sekolah'}.sch.id`,
      role: 'admin_sekolah',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      nipOrNisn: `NIP-${newSchool.npsn || 'ADM'}-01`,
      phone: adminData.phone || '+62 812-0000-2222',
      schoolId: newSchoolId,
      schoolName: newSchool.name,
      is2FAEnabled: false,
      lastLogin: 'Baru saja terdaftar',
      status: 'aktif',
    };

    setAllUsers((prev) => [...prev, newAdmin]);
    setActiveSchoolIdState(newSchoolId);
    setCurrentUserState(newAdmin);
    setCurrentRoleState('admin_sekolah');
    setActiveTabState('pengguna'); // Automatically route to User Management so admin can immediately add Kepsek, Guru, Ortu, Siswa

    // Set custom appearance for this newly registered school
    const customAppearance: AppearanceConfig = {
      ...DEFAULT_APPEARANCE,
      id: 'appr_' + newSchoolId,
      schoolId: newSchoolId,
      appName: 'SIAKAD ' + newSchool.name,
      schoolName: newSchool.name,
      updatedBy: newAdmin.name,
      updatedAt: 'Baru saja',
    };
    setAppearance(customAppearance);

    await appendAuditLog(
      'SCHOOL_SELF_REGISTRATION',
      newSchool.name,
      `Pendaftaran mandiri sekolah baru berhasil: ${newSchool.name} (NPSN: ${newSchool.npsn}). Admin: ${newAdmin.username}`
    );

    addNotification({
      title: 'Pendaftaran Sekolah Sukses! 🎉',
      message: `Selamat datang ${newAdmin.name}! Sekolah ${newSchool.name} siap digunakan. Silakan mulai buat akun Kepala Sekolah, Guru, Siswa, dan Orang Tua.`,
      category: 'sistem',
    });

    return { success: true, school: newSchool, admin: newAdmin };
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

  // Whitelabel / Appearance Customizer
  const updateAppearance = async (config: Partial<AppearanceConfig>) => {
    const updated: AppearanceConfig = {
      ...appearance,
      ...config,
      updatedAt: 'Baru saja',
      updatedBy: `${currentUser.username} (${currentUser.name})`,
    };
    setAppearance(updated);
    localStorage.setItem('siakad_appearance', JSON.stringify(updated));

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'schools', activeSchoolId, 'config', 'appearance'), updated);
    } catch (e) {
      console.warn('Firestore appearance save fallback:', e);
    }

    await appendAuditLog(
      'THEME_CUSTOMIZED',
      activeSchool.name,
      `Tampilan diperbarui: Warna Utama ${updated.primaryHex}, Navbar ${updated.navbarStyle}, Judul "${updated.appName}"`
    );

    addNotification({
      title: 'Tampilan Aplikasi Diperbarui',
      message: 'Kustomisasi tema, logo, dan tata letak berhasil disimpan secara real-time.',
      category: 'sistem',
    });
  };

  // Realtime Chat
  const sendChatMessage = async (content: string, channelId: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')} WIB`;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      channelId,
      schoolId: activeSchoolId,
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: timeStr,
      createdAt: Date.now(),
      reactions: {},
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Send to Firestore
    try {
      await setDoc(doc(db, 'chats', newMsg.id), newMsg);
    } catch (err) {
      console.warn('Saved message to local, Firestore sync failed:', err);
    }
  };

  const addMessageReaction = async (messageId: string, emoji: string) => {
    const target = chatMessages.find((m) => m.id === messageId);
    if (!target) return;

    const currentReactions = { ...(target.reactions || {}) };
    const userList = currentReactions[emoji] || [];
    const hasReacted = userList.includes(currentUser.username);

    if (hasReacted) {
      currentReactions[emoji] = userList.filter((u) => u !== currentUser.username);
      if (currentReactions[emoji].length === 0) {
        delete currentReactions[emoji];
      }
    } else {
      currentReactions[emoji] = [...userList, currentUser.username];
    }

    const updated = { ...target, reactions: currentReactions };
    setChatMessages((prev) => prev.map((m) => (m.id === messageId ? updated : m)));

    try {
      await setDoc(doc(db, 'chats', messageId), updated);
    } catch (err) {
      console.warn('Reaction Firestore update fallback:', err);
    }
  };

  // Google Drive Database Backup System
  const performDriveBackup = async (): Promise<GoogleDriveBackupRecord> => {
    const now = new Date();
    const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 16);
    const fileName = `SIAKAD_BACKUP_${activeSchool.npsn}_${dateStr}.json`;

    const fullSnapshot = {
      version: '2.4.0',
      exportedAt: now.toISOString(),
      account: connectedDriveAccount,
      school: activeSchool,
      schools,
      users: allUsers,
      students,
      grades,
      sppBills,
      attendanceRecords,
      appearance,
      chatMessages,
    };

    const jsonString = JSON.stringify(fullSnapshot, null, 2);
    const sizeKb = Number((new Blob([jsonString]).size / 1024).toFixed(1));

    const newRecord: GoogleDriveBackupRecord = {
      id: 'bak_' + Date.now(),
      accountEmail: connectedDriveAccount,
      fileName,
      fileSizeKb: sizeKb,
      timestamp: 'Hari ini, ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      totalSchools: schools.length,
      totalUsers: allUsers.length,
      totalChats: chatMessages.length,
      status: 'sukses',
      googleDrivePath: `Google Drive/SIAKAD_BACKUP/${fileName}`,
    };

    setDriveBackups((prev) => [newRecord, ...prev]);

    // Save backup record to Firestore
    try {
      await setDoc(doc(db, 'backups', newRecord.id), newRecord);
    } catch (e) {
      console.warn('Backup doc Firestore write:', e);
    }

    await appendAuditLog(
      'GOOGLE_DRIVE_BACKUP_SUCCESS',
      `Google Drive (${connectedDriveAccount})`,
      `Database snapshot ${fileName} (${sizeKb} KB) tersimpan di Google Drive.`
    );

    addNotification({
      title: 'Pencadangan Google Drive Berhasil',
      message: `Snapshot database ${fileName} berhasil diunggah ke Google Drive (${connectedDriveAccount}).`,
      category: 'sistem',
    });

    return newRecord;
  };

  const downloadDatabaseSnapshot = () => {
    const now = new Date();
    const fullSnapshot = {
      version: '2.4.0',
      exportedAt: now.toISOString(),
      account: connectedDriveAccount,
      school: activeSchool,
      schools,
      users: allUsers,
      students,
      grades,
      sppBills,
      attendanceRecords,
      appearance,
      chatMessages,
    };
    const jsonString = JSON.stringify(fullSnapshot, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIAKAD_DATABASE_BACKUP_${now.toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const restoreDatabaseFromSnapshot = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.schools && Array.isArray(parsed.schools)) setSchools(parsed.schools);
      if (parsed.users && Array.isArray(parsed.users)) setAllUsers(parsed.users);
      if (parsed.students && Array.isArray(parsed.students)) setStudents(parsed.students);
      if (parsed.grades && Array.isArray(parsed.grades)) setGrades(parsed.grades);
      if (parsed.sppBills && Array.isArray(parsed.sppBills)) setSppBills(parsed.sppBills);
      if (parsed.attendanceRecords && Array.isArray(parsed.attendanceRecords)) setAttendanceRecords(parsed.attendanceRecords);
      if (parsed.appearance) setAppearance(parsed.appearance);
      if (parsed.chatMessages && Array.isArray(parsed.chatMessages)) setChatMessages(parsed.chatMessages);

      addNotification({
        title: 'Database Berhasil Dipulihkan',
        message: 'Seluruh struktur data sekolah, akun pengguna, nilai, dan absensi berhasil dimuat dari cadangan.',
        category: 'sistem',
      });
      return { success: true, message: 'Pemulihan data sukses dilakukan.' };
    } catch (e: any) {
      return { success: false, message: 'Format file JSON cadangan tidak valid: ' + (e.message || '') };
    }
  };

  // Academic Grade Update
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
      message: `Nilai ${subject} telah diperbarui (${gradeLetter} - Skor: ${finalScore}).`,
      category: 'akademik',
    });
  };

  // SPP Payment Settlement
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

  // Biometric Attendance
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
      `Lokasi: ${data.latitude.toFixed(5)}, ${data.longitude.toFixed(5)} (${data.distanceFromSchool}m). Akurasi: ${data.biometricConfidence}%.`
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
        setCurrentUser,
        allUsers: currentRole === 'super_admin' ? allUsers : allUsers.filter((u) => u.role !== 'super_admin'),
        addUser,
        updateUser,
        deleteUser,
        resetUserPassword,
        loginWithCredentials,
        activeTab,
        setActiveTab: (tab: string) => setActiveTabState(tab),
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        registerSchoolAndAdmin,
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
        isSyncing,
        is2FAModalOpen,
        open2FAModal,
        close2FAModal,
        twoFactorCallback,
        twoFactorPurpose,
        isSecurityModalOpen,
        setIsSecurityModalOpen,
        isNotifModalOpen,
        setIsNotifModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        e2eeSessionKey,
        appearance,
        updateAppearance,
        chatMessages,
        sendChatMessage,
        addMessageReaction,
        connectedDriveAccount,
        driveBackups,
        performDriveBackup,
        downloadDatabaseSnapshot,
        restoreDatabaseFromSnapshot,
        isFirestoreConnected,
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
