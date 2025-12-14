import React from 'react';
import { Incident, LogEntry } from '../types';
import StatCard from '../components/StatCard';
import { ShieldAlert, Activity, CheckCircle, Database, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, TooltipProps } from 'recharts';

interface DashboardProps {
  incidents: Incident[];
  logs: LogEntry[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900/90 border border-red-500/30 p-3 rounded-lg shadow-xl backdrop-blur-sm">
        <p className="text-red-400 font-mono text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-lg">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ incidents, logs }) => {
  const total = incidents.length;
  const active = incidents.filter(i => i.status !== 'Жабылды').length;
  const critical = incidents.filter(i => i.severity === 'Критикалық' && i.status !== 'Жабылды').length;
  const recentLogs = logs.slice(0, 5);

  const typeData = [
    { name: 'Фишинг', value: incidents.filter(i => i.type === 'Фишинг').length },
    { name: 'DDoS', value: incidents.filter(i => i.type === 'DDoS Шабуыл').length },
    { name: 'Зиянды БҚ', value: incidents.filter(i => i.type === 'Зиянды БҚ (Malware)').length },
    { name: 'Сыртқа шығу', value: incidents.filter(i => i.type === 'Деректердің таралуы').length },
  ];

  // Colors: Red, Orange, Zinc, Dark Red
  const COLORS = ['#ef4444', '#f97316', '#71717a', '#991b1b'];

  return (
    <div className="space-y-8 animate-slide-down">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-zinc-800 pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-wide">БАСҚАРУ ОРТАЛЫҒЫ</h2>
          <p className="text-zinc-400 text-sm mt-1 font-mono">Қауіп-қатерді нақты уақытта бақылау және әрекет ету интерфейсі</p>
        </div>
        <div className="text-right">
             <p className="text-xs text-zinc-500 font-mono">ҚАУІПСІЗ БАЙЛАНЫС ОРНАТЫЛДЫ</p>
             <p className="text-red-500 text-xs font-mono animate-pulse">ENCRYPTED :: MIL-STD-256</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Белсенді қауіптер" 
          value={active} 
          icon={Activity} 
          color="red" 
          trend="Мониторинг жүруде..."
        />
        <StatCard 
          title="Критикалық дабылдар" 
          value={critical} 
          icon={ShieldAlert} 
          color="orange" 
          trend={critical > 0 ? "ШҰҒЫЛ ӘРЕКЕТ ҚАЖЕТ" : "Жүйе қалыпты"}
        />
        <StatCard 
          title="Жалпы баянаттар" 
          value={total} 
          icon={Database} 
          color="zinc" 
        />
        <StatCard 
          title="Шешілген" 
          value={incidents.filter(i => i.status === 'Жабылды').length} 
          icon={CheckCircle} 
          color="zinc" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
            <Activity size={18} className="text-red-500" /> ҚАУІП ВЕКТОРЛАРЫН ТАЛДАУ
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(239, 68, 68, 0.05)'}} />
                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
             <Lock size={18} className="text-orange-500" /> ЖҮЙЕЛІК ЖУРНАЛДАР
          </h3>
          <div className="flex-1 space-y-0 relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-zinc-800"></div>
            
            {recentLogs.map((log) => (
              <div key={log.id} className="relative pl-6 py-3 group">
                <div className={`absolute left-[3px] top-4 w-2.5 h-2.5 rounded-sm border ${
                  log.type === 'alert' ? 'bg-red-950 border-red-500' :
                  log.type === 'warning' ? 'bg-orange-950 border-orange-500' :
                  log.type === 'success' ? 'bg-green-950 border-green-500' : 'bg-zinc-950 border-zinc-500'
                } z-10 transition-transform group-hover:scale-125`}></div>
                
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                     <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                        log.type === 'alert' ? 'text-red-500' :
                        log.type === 'warning' ? 'text-orange-500' :
                        log.type === 'success' ? 'text-green-500' : 'text-zinc-500'
                     }`}>{log.action}</span>
                     <span className="text-[10px] text-zinc-600 font-mono">{log.timestamp.split(' ')[1]}</span>
                  </div>
                  <p className="text-sm text-zinc-300 group-hover:text-white transition-colors">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;