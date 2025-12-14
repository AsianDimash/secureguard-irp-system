import React from 'react';
import { Incident, Severity, Status } from '../types';
import { CheckCircle2, Search, Triangle, Hexagon } from 'lucide-react';

interface IncidentsProps {
  incidents: Incident[];
  onUpdateStatus: (id: string, newStatus: Status) => void;
  onViewDetails: (id: string) => void;
}

const Incidents: React.FC<IncidentsProps> = ({ incidents, onUpdateStatus, onViewDetails }) => {
  const [filter, setFilter] = React.useState('');

  const filteredIncidents = incidents.filter(inc =>
    inc.title.toLowerCase().includes(filter.toLowerCase()) ||
    inc.id.toLowerCase().includes(filter.toLowerCase())
  );

  const getSeverityStyle = (s: Severity) => {
    switch (s) {
      case Severity.CRITICAL: return 'bg-red-500/10 border-red-500/50 text-red-500';
      case Severity.HIGH: return 'bg-orange-500/10 border-orange-500/50 text-orange-500';
      case Severity.MEDIUM: return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500';
      case Severity.LOW: return 'bg-zinc-500/10 border-zinc-500/50 text-zinc-500';
      default: return 'bg-zinc-500/10 border-zinc-500/50 text-zinc-500';
    }
  };

  return (
    <div className="space-y-6 animate-slide-down">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-wide">ИНЦИДЕНТТЕР ТІЗІЛІМІ</h2>
          <p className="text-zinc-400 font-mono text-sm">Барлық тіркелген қауіпсіздік оқиғаларының дерекқоры</p>
        </div>

        <div className="relative group w-full md:w-auto">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-200"></div>
          <div className="relative flex items-center bg-zinc-900 rounded-lg p-0.5">
            <Search className="absolute left-3 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="ID немесе тақырып бойынша іздеу..."
              className="pl-10 pr-4 py-2 bg-zinc-900 rounded-md text-zinc-200 placeholder-zinc-600 focus:outline-none focus:bg-zinc-800 w-full md:w-80 font-mono text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredIncidents.map((incident) => (
          <div key={incident.id} className="relative bg-zinc-900/60 backdrop-blur border border-zinc-800 hover:border-red-500/50 rounded-lg p-5 transition-all group overflow-hidden">
            {/* Corner decoration */}
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Hexagon size={60} className="text-red-500/5 stroke-[1px]" />
            </div>

            <div className="flex flex-col md:flex-row gap-6 relative z-10">

              {/* Status Indicator */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-24 border-r border-zinc-800 pr-6">
                <div className={`p-2 rounded-lg ${getSeverityStyle(incident.severity)}`}>
                  <Triangle size={24} className={incident.severity === Severity.CRITICAL ? 'fill-current' : ''} />
                </div>
                <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider text-center ${incident.severity === Severity.CRITICAL ? 'text-red-500' : 'text-zinc-400'
                  }`}>
                  {incident.severity}
                </span>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-red-600 bg-red-950/30 px-2 py-0.5 rounded border border-red-900/50">{incident.id}</span>
                  <span className="text-xs text-zinc-500 font-mono">{incident.timestamp}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors mb-2">
                  {incident.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">{incident.description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {incident.affectedSystems.map((sys, idx) => (
                    <span key={idx} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded font-mono border border-zinc-700">
                      {sys}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col justify-center items-end min-w-[150px] pl-6 border-l border-zinc-800">
                <p className="text-[10px] uppercase text-zinc-500 font-bold mb-2">Ағымдағы мәртебе</p>
                <div className={`flex items-center gap-2 mb-4 font-mono text-sm ${incident.status === Status.CLOSED ? 'text-green-500' : 'text-white'
                  }`}>
                  {incident.status === Status.CLOSED ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                  {incident.status}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={() => onViewDetails(incident.id)}
                    className="w-full text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded transition-colors mb-2"
                  >
                    Толығырақ
                  </button>

                  {incident.status !== Status.CLOSED && (
                    <select
                      className="bg-zinc-950 border border-zinc-700 text-zinc-300 text-xs rounded p-2 focus:border-red-500 outline-none w-full cursor-pointer hover:bg-zinc-900"
                      value={incident.status}
                      onChange={(e) => onUpdateStatus(incident.id, e.target.value as Status)}
                    >
                      <option value={Status.NEW}>Жаңа</option>
                      <option value={Status.IN_PROGRESS}>Орындалуда</option>
                      <option value={Status.CONTAINED}>Оқшауланды</option>
                      <option value={Status.CLOSED}>Жабылды</option>
                    </select>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Incidents;