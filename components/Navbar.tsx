import React from 'react';
import { LayoutDashboard, AlertCircle, PlusCircle, BookOpen, FileText, Cpu, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Басты бет', icon: LayoutDashboard },
    { id: 'incidents', label: 'Инциденттер', icon: AlertCircle },
    { id: 'new', label: 'Жаңа баянат', icon: PlusCircle },
    { id: 'irp', label: 'IRP Протоколы', icon: BookOpen },
    { id: 'logs', label: 'Журналдар', icon: FileText },
  ];

  if (user?.role === 'ADMIN') {
    menuItems.push({ id: 'users', label: 'Пайдаланушылар', icon: Users });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-red-900/50 z-50 flex items-center justify-between px-4 lg:px-8 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-200"></div>
          <div className="relative bg-zinc-900 border border-red-500/30 p-2 rounded-lg">
            <Cpu size={24} className="text-red-500" />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="font-display font-bold text-xl tracking-wider text-white leading-none">
            NEXUS <span className="text-red-500">CORE</span>
          </h1>
          <span className="text-[10px] text-red-600 font-mono tracking-[0.2em] uppercase">Red Team Ops</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-1 bg-zinc-900/50 p-1 rounded-xl border border-white/5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 relative overflow-hidden ${active
                  ? 'text-white shadow-lg'
                  : 'text-zinc-400 hover:text-red-200 hover:bg-white/5'
                }`}
            >
              {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-lg"></div>
              )}
              <Icon size={16} className={active ? 'text-red-500' : ''} />
              <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/30 border border-red-900/50">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </div>
          <span className="text-xs font-mono text-red-500 font-bold">LIVE</span>
        </div>

        <div
          onClick={logout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 cursor-pointer transition-colors group"
        >
          <span className="font-display font-bold text-xs text-zinc-300 group-hover:text-white">{user?.username}</span>
          <LogOut size={14} className="text-zinc-500 group-hover:text-red-500" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;