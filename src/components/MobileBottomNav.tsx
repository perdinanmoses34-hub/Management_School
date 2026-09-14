import React from 'react';
import { Home, BookOpen, Clock, CreditCard, BarChart2, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t, currentRole } = useApp();

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'akademik', label: 'Akademik', icon: BookOpen },
    { id: 'absensi', label: 'Absensi', icon: Clock },
    { id: 'spp', label: 'SPP Online', icon: CreditCard },
    {
      id: currentRole === 'super_admin' ? 'superAdmin' : 'analitik',
      label: currentRole === 'super_admin' ? 'Super Admin' : 'Analitik',
      icon: currentRole === 'super_admin' ? Shield : BarChart2,
    },
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
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition ${
                  isActive ? 'bg-blue-50' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
