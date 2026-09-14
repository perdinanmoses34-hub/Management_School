export type Role = 'super_admin' | 'kepala_sekolah' | 'admin_sekolah' | 'guru' | 'siswa';

export type Language = 'id' | 'en';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  nipOrNisn: string;
  phone: string;
  schoolId: string;
  is2FAEnabled: boolean;
  lastLogin: string;
}

export interface SchoolEntity {
  id: string;
  name: string;
  npsn: string; // Nomor Pokok Sekolah Nasional
  status: 'aktif' | 'nonaktif' | 'kadaluarsa';
  packageType: 'Enterprise' | 'Pro' | 'Standard';
  expiredDate: string;
  studentCount: number;
  teacherCount: number;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
  address: string;
  accreditation: 'A' | 'B' | 'Unggul';
  contactEmail: string;
  headmasterName: string;
}

export interface Student {
  id: string;
  nisn: string;
  nik: string; // 16 digits
  name: string;
  class: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  parentName: string;
  parentPhone: string;
  address: string;
  dukcapilVerified: boolean;
  lastDukcapilSync?: string;
  sppStatus: 'Lunas' | 'Menunggak' | 'Sebagian';
  avatar: string;
}

export interface SubjectGrade {
  subjectId: string;
  subjectName: string;
  teacherName: string;
  kkm: number;
  tugas: number;
  uts: number;
  uas: number;
  finalScore: number;
  gradeLetter: 'A' | 'B' | 'C' | 'D';
  predicate: string;
  notes: string;
  encryptedHash: string;
  lastUpdated: string;
}

export interface ReportCard {
  studentId: string;
  semester: string;
  academicYear: string;
  grades: SubjectGrade[];
  averageScore: number;
  ranking: number;
  totalStudents: number;
  attendanceSummary: {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
  };
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  date: string;
  time: string;
  type: 'masuk' | 'pulang';
  status: 'hadir' | 'terlambat' | 'izin' | 'sakit';
  latitude: number;
  longitude: number;
  distanceFromSchool: number; // in meters
  isWithinRadius: boolean;
  biometricConfidence: number; // e.g. 98.7%
  biometricVerified: boolean;
  biometricPhotoUrl: string;
  syncedToCloud: boolean; // for offline support
  encryptedHash: string;
}

export interface SPPBill {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  nisn: string;
  month: string;
  academicYear: string;
  amount: number;
  dueDate: string;
  status: 'Lunas' | 'Belum_Bayar' | 'Menunggu_Verifikasi';
  paymentMethod?: 'qris' | 'va_bca' | 'va_mandiri' | 'va_bri' | 'gopay' | 'tunai';
  paidAt?: string;
  transactionRef?: string;
  receiptNumber?: string;
  downloadUrl?: string;
}

export interface DukcapilRecord {
  nik: string;
  nama: string;
  jenisKelamin: 'LAKI-LAKI' | 'PEREMPUAN';
  tempatLahir: string;
  tanggalLahir: string;
  nomorKK: string;
  namaIbuKandung: string;
  alamatKTP: string;
  statusKependudukan: 'AKTIF_VALID' | 'TIDAK_DITEMUKAN' | 'PERLU_UPDATE';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: Role;
  action: string;
  targetEntity: string;
  details: string;
  ipAddress: string;
  sha256Digest: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'akademik' | 'pembayaran' | 'absensi' | 'keamanan' | 'sistem';
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

export interface OfflineQueueItem {
  id: string;
  type: 'attendance' | 'grade_update' | 'spp_payment';
  payload: any;
  createdAt: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
}
