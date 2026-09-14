import React from 'react';
import { Home, BookOpen, MessageSquare, CreditCard, BarChart2, Shield, Users, Palette } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { currentRole, appearance, chatMessages } = useApp();

  const getDynamicAdminTab = () => {
    if (currentRole === 'super_admin') return { id: 'superAdmin', label: 'Super Admin', icon: Shield };
    if (currentRole === 'admin_sekolah') return { id: 'pengguna', label: 'Pengguna', icon: Users };
    return { id: 'analitik', label: 'Analitik', icon: BarChart2 };
  };

  const adminTab = getDynamicAdminTab();

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'akademik', label: 'Akademik', icon: BookOpen },
    { id: 'chat', label: 'Chat', icon: MessageSquare, badge: chatMessages.length },
    { id: 'spp', label: 'SPP', icon: CreditCard },
    adminTab,
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] relative"
              style={isActive ? { color: appearance.primaryHex } : { color: '#64748b' }}
            >
              <div
                className="p-1 rounded-xl transition relative"
                style={isActive ? { backgroundColor: `${appearance.primaryHex}15` } : {}}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.id === 'chat' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
