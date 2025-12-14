import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'red' | 'orange' | 'zinc' | 'blue';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = 'red' }) => {
  const styles = {
    red: 'border-red-500/30 bg-red-500/5 text-red-500',
    orange: 'border-orange-500/30 bg-orange-500/5 text-orange-500',
    zinc: 'border-zinc-500/30 bg-zinc-500/5 text-zinc-400',
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400', // Kept generic blue for info
  };

  const iconStyles = {
    red: 'bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
    orange: 'bg-orange-500/10 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
    zinc: 'bg-zinc-500/10 shadow-[0_0_10px_rgba(113,113,122,0.2)]',
    blue: 'bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
  };

  return (
    <div className={`p-6 rounded-xl border backdrop-blur-md relative overflow-hidden group hover:border-opacity-60 transition-all duration-300 ${styles[color]}`}>
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">{title}</p>
          <h3 className="text-3xl font-display font-bold text-white tracking-wide">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${iconStyles[color]} ${styles[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-zinc-400 relative z-10">
          <div className={`w-1.5 h-1.5 rounded-full ${color === 'red' ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`}></div>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;