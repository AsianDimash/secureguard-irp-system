import React from 'react';
import { LayoutDashboard, AlertCircle, PlusCircle, BookOpen, FileText, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Басты бет', icon: LayoutDashboard },
    { id: 'incidents', label: 'Инциденттер', icon: AlertCircle },
    { id: 'new', label: 'Инцидент тіркеу', icon: PlusCircle },
    { id: 'irp', label: 'IRP Жоспары', icon: BookOpen },
    { id: 'logs', label: 'Журналдар', icon: FileText },
  ];

  return (
    <aside className="w-20 md:w-64 bg-gray-950 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <div className="bg-blue-600 p-2 rounded-lg shrink-0">
          <ShieldCheck size={24} className="text-white" />
        </div>
        <h1 className="font-bold text-xl text-white hidden md:block tracking-tight">Secure<span className="text-blue-500">Guard</span></h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                active 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
              }`}
            >
              <Icon size={20} className={`shrink-0 ${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <span className="font-medium hidden md:block">{item.label}</span>
              
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 hidden md:block shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-900 rounded-lg p-3 hidden md:block border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Current User</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
            <div>
              <p className="text-sm font-medium text-white">Security Analyst</p>
              <p className="text-xs text-green-500">● Online</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;