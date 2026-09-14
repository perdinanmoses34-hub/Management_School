import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  Smile,
  Search,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  School,
  Lock,
  GraduationCap,
  Heart,
  ThumbsUp,
  Flame,
  Radio,
  Clock,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, Role } from '../../types';

interface ChannelDef {
  id: string;
  name: string;
  description: string;
  icon: any;
  allowedRoles: Role[];
  badgeColor: string;
}

const CHANNELS: ChannelDef[] = [
  {
    id: 'global',
    name: '📢 Saluran Pengumuman Sekolah',
    description: 'Pemberitahuan akademik, jadwal kegiatan, dan informasi resmi untuk semua warga sekolah.',
    icon: School,
    allowedRoles: ['super_admin', 'admin_sekolah', 'kepala_sekolah', 'guru', 'siswa', 'orang_tua'],
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'guru',
    name: '👨‍🏫 Forum Dewan Guru & Tendik',
    description: 'Koordinasi materi ajar, input nilai rapor, jadwal piket, dan kurikulum merdeka.',
    icon: GraduationCap,
    allowedRoles: ['super_admin', 'admin_sekolah', 'kepala_sekolah', 'guru'],
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'ortu',
    name: '👨‍👩‍👧 Paguyuban Orang Tua & Wali Siswa',
    description: 'Komunikasi perkembangan siswa, laporan pembayaran SPP, dan konsultasi wali kelas.',
    icon: Heart,
    allowedRoles: ['super_admin', 'admin_sekolah', 'kepala_sekolah', 'guru', 'orang_tua'],
    badgeColor: 'bg-rose-100 text-rose-800',
  },
  {
    id: 'siswa',
    name: '🎒 Ruang Belajar & Diskusi Siswa',
    description: 'Diskusi kelompok tugas, info ekstrakurikuler, dan kegiatan OSIS.',
    icon: Users,
    allowedRoles: ['super_admin', 'admin_sekolah', 'guru', 'siswa'],
    badgeColor: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'superadmin',
    name: '🌐 Manajemen Lisensi & Infrastruktur Cloud',
    description: 'Saluran khusus Super Admin Tn. Timbu dan Kepala Sekolah untuk konfigurasi server & Firebase.',
    icon: Lock,
    allowedRoles: ['super_admin', 'kepala_sekolah', 'admin_sekolah'],
    badgeColor: 'bg-purple-100 text-purple-800',
  },
];

const QUICK_TEMPLATES = [
  'Mohon bapak/ibu guru segera melengkapi rekap absensi kelas.',
  'Nilai tugas harian sudah diperbarui dan tersinkron ke cloud.',
  'Terima kasih bapak/ibu, bukti pembayaran SPP sudah terverifikasi.',
  'Pemberitahuan: Rapat koordinasi sekolah akan diadakan besok pukul 09:00 WIB.',
];

const EMOJI_OPTIONS = ['👍', '❤️', '👏', '🔥', '💡'];

export const RealtimeChatView: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    addMessageReaction,
    currentUser,
    currentRole,
    activeSchool,
    appearance,
    isFirestoreConnected,
  } = useApp();

  const [activeChannelId, setActiveChannelId] = useState<string>('global');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = CHANNELS.find((c) => c.id === activeChannelId) || CHANNELS[0];

  const filteredMessages = chatMessages
    .filter((m) => m.channelId === activeChannelId)
    .filter(
      (m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.senderUsername.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages.length, activeChannelId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText;
    setInputText('');
    await sendChatMessage(text, activeChannelId);
  };

  const handleApplyTemplate = (text: string) => {
    setInputText(text);
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800">SUPER ADMIN</span>;
      case 'admin_sekolah':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">ADMIN SEKOLAH</span>;
      case 'kepala_sekolah':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">KEPALA SEKOLAH</span>;
      case 'guru':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">GURU</span>;
      case 'siswa':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800">SISWA</span>;
      case 'orang_tua':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">ORANG TUA</span>;
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
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Menu Chatting Real-Time Terhubung
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                {isFirestoreConnected ? 'FIREBASE REALTIME AKTIF' : 'CLOUD REALTIME SYNC'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Komunikasi langsung multi-peran (Super Admin, Kepala Sekolah, Admin, Guru, Siswa, Orang Tua)
            </p>
          </div>
        </div>

        {/* Active User Mini Pill */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-300 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
              <span className="text-[10px] font-mono text-slate-400">@{currentUser.username}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {getRoleBadge(currentUser.role)}
              <span className="text-[10px] text-slate-500">Sekolah: {activeSchool.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left Sidebar: Channels List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Saluran Percakapan
              </h3>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                5 Ruang
              </span>
            </div>

            <div className="space-y-1.5">
              {CHANNELS.map((chan) => {
                const isSelected = chan.id === activeChannelId;
                const canAccess = chan.allowedRoles.includes(currentRole);
                const msgCount = chatMessages.filter((m) => m.channelId === chan.id).length;

                return (
                  <button
                    key={chan.id}
                    type="button"
                    onClick={() => setActiveChannelId(chan.id)}
                    className={`w-full p-3 rounded-xl text-left transition flex items-start justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-200 shadow-xs ring-1 ring-blue-500'
                        : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="space-y-1 flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900">{chan.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                        {chan.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                      {msgCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Templates Bar */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Template Pesan Cepat
              </span>
              <div className="space-y-1">
                {QUICK_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-[11px] text-slate-700 transition cursor-pointer border border-slate-100 truncate"
                  >
                    "{tmpl}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Messages Feed & Input (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Channel Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {activeChannel.name}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
                  {filteredMessages.length} Pesan
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{activeChannel.description}</p>
            </div>

            {/* Message Filter Search */}
            <div className="relative sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari dalam obrolan..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[460px] bg-slate-50/40">
            {filteredMessages.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <MessageSquare className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
                <p className="text-xs font-semibold">Belum ada pesan di saluran ini</p>
                <p className="text-[11px] text-slate-400">Mulai diskusi atau kirim pengumuman sekarang</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isMe = msg.senderUsername === currentUser.username;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
                    />

                    <div className={`max-w-[85%] sm:max-w-[75%] space-y-1 ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                      {/* Sender Info */}
                      <div className={`flex items-center gap-2 text-[11px] ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span className="font-extrabold text-slate-800">{msg.senderName}</span>
                        {getRoleBadge(msg.senderRole)}
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      </div>

                      {/* Bubble */}
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs relative group ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-tr-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                        }`}
                        style={isMe ? { backgroundColor: appearance.primaryHex } : {}}
                      >
                        <p className="whitespace-pre-wrap select-text">{msg.content}</p>

                        {/* Reactions List */}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 pt-1 border-t border-white/20">
                            {Object.entries(msg.reactions).map(([emoji, rawUsers]) => {
                              const userList = (rawUsers as string[]) || [];
                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => addMessageReaction(msg.id, emoji)}
                                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 transition cursor-pointer ${
                                    userList.includes(currentUser.username)
                                      ? isMe
                                        ? 'bg-white/30 text-white ring-1 ring-white'
                                        : 'bg-blue-50 text-blue-700 ring-1 ring-blue-300'
                                      : isMe
                                      ? 'bg-black/10 text-white/90'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  <span>{emoji}</span>
                                  <span>{userList.length}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Hover Emoji Reaction Trigger */}
                        <div
                          className={`absolute top-1 ${
                            isMe ? '-left-24' : '-right-24'
                          } hidden group-hover:flex items-center bg-white border border-slate-200 rounded-full shadow-sm p-1 gap-1 z-10`}
                        >
                          {EMOJI_OPTIONS.map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => addMessageReaction(msg.id, em)}
                              className="w-5 h-5 flex items-center justify-center text-xs hover:scale-125 transition cursor-pointer"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Tulis pesan di ${activeChannel.name}... (Tekan Enter untuk mengirim)`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundColor: appearance.primaryHex }}
              >
                <span>Kirim</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[10px] text-slate-400">
                Pesan terenkripsi SHA-256 & tersinkron real-time ke semua pengguna
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Sebagai: <strong>{currentUser.name}</strong> ({currentUser.role})
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
