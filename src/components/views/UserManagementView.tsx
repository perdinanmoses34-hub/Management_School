import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Key,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Building2,
  GraduationCap,
  Heart,
  Shield,
  Phone,
  Mail,
  Lock,
  X,
  UserCheck,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserAccount, Role } from '../../types';

export const UserManagementView: React.FC = () => {
  const {
    allUsers,
    addUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    currentUser,
    currentRole,
    schools,
    activeSchool,
    setActiveSchoolId,
    students,
    open2FAModal,
    appearance,
  } = useApp();

  const isSuperAdmin = currentRole === 'super_admin';
  const isAdminSekolah = currentRole === 'admin_sekolah';
  const canManage = isSuperAdmin || isAdminSekolah;

  // Selected school filter (for super admin to view specific school's users)
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>(
    isSuperAdmin ? 'all' : activeSchool.id
  );
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState<UserAccount | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<UserAccount | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Add User Form State
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<Role>('orang_tua');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formNipNisn, setFormNipNisn] = useState('');
  const [formStudentNisn, setFormStudentNisn] = useState('');
  const [formSchoolId, setFormSchoolId] = useState(activeSchool.id);

  // Filter users based on scope
  const filteredUsers = allUsers.filter((user) => {
    // School filter
    if (selectedSchoolFilter !== 'all' && user.schoolId !== selectedSchoolFilter) {
      return false;
    }
    // If not super admin, restrict strictly to activeSchool.id
    if (!isSuperAdmin && user.schoolId !== activeSchool.id) {
      return false;
    }
    // Role filter
    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }
    // Search query
    const matchQuery =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nipOrNisn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchQuery;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formUsername || !formPassword) {
      alert('Mohon isi nama lengkap, username, dan password.');
      return;
    }

    const schoolObj = schools.find((s) => s.id === formSchoolId) || activeSchool;

    open2FAModal(async () => {
      await addUser({
        username: formUsername.trim().toLowerCase(),
        password: formPassword,
        name: formName,
        email: formEmail || `${formUsername}@${schoolObj.npsn}.sch.id`,
        role: formRole,
        avatar:
          formRole === 'orang_tua'
            ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
            : formRole === 'guru'
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
            : formRole === 'siswa'
            ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        nipOrNisn: formNipNisn || 'ID-' + Math.floor(100000 + Math.random() * 900000),
        phone: formPhone || '+62 812-0000-2222',
        schoolId: schoolObj.id,
        schoolName: schoolObj.name,
        studentNisn: formRole === 'orang_tua' ? formStudentNisn : undefined,
        is2FAEnabled: formRole === 'admin_sekolah' || formRole === 'kepala_sekolah',
        status: 'aktif',
      });

      setShowAddModal(false);
      // Reset form
      setFormName('');
      setFormUsername('');
      setFormPassword('');
      setFormEmail('');
      setFormPhone('');
      setFormNipNisn('');
      setFormStudentNisn('');
    }, `Pembuatan Akun Baru [${formRole.toUpperCase()}] untuk ${formName}`);
  };

  const handleConfirmResetPassword = () => {
    if (!showResetModal || !newPasswordInput) return;
    open2FAModal(async () => {
      await resetUserPassword(showResetModal.id, newPasswordInput);
      setShowResetModal(null);
      setNewPasswordInput('');
    }, `Reset Kata Sandi Akun ${showResetModal.username}`);
  };

  const handleConfirmDeleteUser = () => {
    if (!showDeleteModal) return;
    open2FAModal(async () => {
      await deleteUser(showDeleteModal.id);
      setShowDeleteModal(null);
    }, `Hapus Akun Pengguna ${showDeleteModal.name}`);
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800">Super Admin</span>;
      case 'admin_sekolah':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">Admin Sekolah</span>;
      case 'kepala_sekolah':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">Kepala Sekolah</span>;
      case 'guru':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">Guru</span>;
      case 'siswa':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800">Siswa</span>;
      case 'orang_tua':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">Orang Tua</span>;
      default:
        return null;
    }
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
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Manajemen Akun Pengguna & Hierarki Sekolah
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                MULTI-TENANT RBAC
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              {isSuperAdmin
                ? 'Akses Super Admin: Mengatur akun semua sekolah, admin sekolah, guru, siswa, dan orang tua.'
                : `Akses Admin Sekolah: Mengelola akun guru, kepala sekolah, siswa, dan orang tua untuk ${activeSchool.name}.`}
            </p>
          </div>
        </div>

        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer hover:opacity-95"
            style={{ backgroundColor: appearance.primaryHex }}
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Akun Baru</span>
          </button>
        )}
      </div>

      {/* Permission Notice if not Admin */}
      {!canManage && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Mode Peninjauan: Hanya <strong>Super Admin (tn.timbu)</strong> atau <strong>Admin Sekolah ({activeSchool.name})</strong> yang dapat membuat akun, mereset password, atau menghapus pengguna.
          </span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* School Selector (Visible for Super Admin) */}
          {isSuperAdmin && (
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <select
                value={selectedSchoolFilter}
                onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white text-slate-700 cursor-pointer"
              >
                <option value="all">Semua Sekolah (Global)</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.npsn})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Peran</option>
              <option value="orang_tua">Orang Tua / Wali</option>
              <option value="siswa">Siswa</option>
              <option value="guru">Guru Pengajar</option>
              <option value="kepala_sekolah">Kepala Sekolah</option>
              <option value="admin_sekolah">Admin Sekolah</option>
              {isSuperAdmin && <option value="super_admin">Super Admin</option>}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, username, NISN/NIP..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Pengguna</th>
                <th className="px-5 py-3.5">Peran & Sekolah</th>
                <th className="px-5 py-3.5">Kredensial & NIP/NISN</th>
                <th className="px-5 py-3.5">Kontak</th>
                <th className="px-5 py-3.5">Status & 2FA</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Tidak ditemukan data pengguna sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    {/* User Profile */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs">{u.name}</p>
                          <p className="text-[11px] font-mono text-slate-400">@{u.username}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role & School */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div>{getRoleBadge(u.role)}</div>
                        <p className="text-[11px] font-medium text-slate-500">
                          {u.schoolName || 'Global'}
                        </p>
                        {u.studentNisn && (
                          <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">
                            Wali Siswa: NISN {u.studentNisn}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Credentials & NIP/NISN */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <p className="font-mono text-[11px] text-slate-700">
                          ID: <span className="font-semibold">{u.nipOrNisn}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Lock className="w-3 h-3 text-slate-300" />
                          Kata sandi: <span className="tracking-widest">••••••••</span>
                        </p>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5 text-[11px]">
                        <p className="text-slate-700 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[150px]">{u.email}</span>
                        </p>
                        <p className="text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{u.phone}</span>
                        </p>
                      </div>
                    </td>

                    {/* Status & 2FA */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'aktif'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {u.is2FAEnabled ? '2FA Aktif' : '2FA Nonaktif'}
                        </p>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-5 py-4 text-right">
                      {canManage && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setShowResetModal(u);
                              setNewPasswordInput('');
                            }}
                            title="Reset Kata Sandi"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                          {u.role !== 'super_admin' && (
                            <button
                              type="button"
                              onClick={() => setShowDeleteModal(u)}
                              title="Hapus Akun"
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Pengguna Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Tambah Akun Pengguna Baru</h3>
                  <p className="text-[11px] text-slate-500">Mendaftarkan akun ke sistem SIAKAD Cloud</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 pt-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Peran Akun</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as Role)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="orang_tua">Orang Tua / Wali Siswa</option>
                  <option value="siswa">Siswa</option>
                  <option value="guru">Guru Pengajar</option>
                  <option value="kepala_sekolah">Kepala Sekolah</option>
                  {isSuperAdmin && <option value="admin_sekolah">Admin Sekolah</option>}
                </select>
              </div>

              {/* School Assignment (For Super Admin) */}
              {isSuperAdmin && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit Sekolah</label>
                  <select
                    value={formSchoolId}
                    onChange={(e) => setFormSchoolId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.npsn})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Budi Santoso, S.Pd / H. Pratama"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Username Login</label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="misal: budi.santoso"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi</label>
                  <input
                    type="text"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Sandi kuat..."
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* NIP or NISN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Induk (NIP / NUPTK / NISN / NIK)
                </label>
                <input
                  type="text"
                  value={formNipNisn}
                  onChange={(e) => setFormNipNisn(e.target.value)}
                  placeholder="Contoh: 19820514 200801 1 012 atau 0084592812"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Special Parent link: student NISN */}
              {formRole === 'orang_tua' && (
                <div>
                  <label className="block text-xs font-bold text-purple-700 mb-1">
                    Tautkan ke Siswa (Pilih NISN Siswa)
                  </label>
                  <select
                    value={formStudentNisn}
                    onChange={(e) => setFormStudentNisn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-bold bg-purple-50 text-purple-900"
                  >
                    <option value="">Pilih Siswa Asuhan</option>
                    {students.map((st) => (
                      <option key={st.id} value={st.nisn}>
                        {st.name} (NISN: {st.nisn} - Kelas: {st.class})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="email@sekolah.sch.id"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md cursor-pointer hover:opacity-95"
                  style={{ backgroundColor: appearance.primaryHex }}
                >
                  Simpan & Daftarkan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Reset Kata Sandi Akun</h3>
                  <p className="text-[11px] text-slate-500">Pengguna: {showResetModal.name} (@{showResetModal.username})</p>
                </div>
              </div>
              <button
                onClick={() => setShowResetModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi Baru</label>
                <input
                  type="text"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Masukkan sandi baru minimal 8 karakter..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetPassword}
                  disabled={!newPasswordInput}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition disabled:opacity-40 cursor-pointer"
                >
                  Terapkan Sandi Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete User */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Hapus Akun Pengguna?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Akun <strong>{showDeleteModal.name}</strong> (@{showDeleteModal.username}) akan dihapus dari sistem. Tindakan ini memerlukan verifikasi otorisasi 2FA.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
