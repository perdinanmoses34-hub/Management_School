import React, { useState } from 'react';
import { Bell, Check, Trash2, X, AlertCircle, CreditCard, Award, Shield, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';

export const NotificationModal: React.FC = () => {
  const { isNotifModalOpen, setIsNotifModalOpen, notifications, markNotificationAsRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread' | 'pembayaran' | 'absensi' | 'akademik'>('all');

  if (!isNotifModalOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter !== 'all') return n.category === filter;
    return true;
  });

  const getCategoryIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'pembayaran':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'absensi':
        return <Award className="w-4 h-4 text-blue-600" />;
      case 'keamanan':
        return <Shield className="w-4 h-4 text-purple-600" />;
      case 'akademik':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Cpu className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-slate-900/40 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col mt-12 sm:mt-8">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Notifikasi Sistem</h3>
              <p className="text-xs text-slate-500">Aktivitas real-time sekolah</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              id="btn-mark-all-read"
              onClick={markAllNotificationsRead}
              title="Tandai semua telah dibaca"
              className="p-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Tandai Dibaca</span>
            </button>
            <button
              id="btn-close-notif-modal"
              onClick={() => setIsNotifModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex gap-1.5 overflow-x-auto text-xs no-scrollbar">
          {(['all', 'unread', 'pembayaran', 'absensi', 'akademik'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f === 'all'
                ? 'Semua'
                : f === 'unread'
                ? 'Belum Dibaca'
                : f === 'pembayaran'
                ? 'SPP Online'
                : f === 'absensi'
                ? 'Absensi'
                : 'Akademik'}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto p-3 divide-y divide-slate-100 flex-1">
          {filteredNotifs.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Tidak ada notifikasi saat ini</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3 rounded-xl transition cursor-pointer ${
                  !notif.read ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
