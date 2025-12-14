import React from 'react';
import { LogEntry } from '../types';
import { Terminal, Download } from 'lucide-react';

interface LogsProps {
  logs: LogEntry[];
}

const Logs: React.FC<LogsProps> = ({ logs }) => {
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      <div className="flex justify-between items-end mb-4 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded">
            <Terminal size={20} className="text-orange-500" />
          </div>
          <h2 className="text-xl font-display font-bold text-white tracking-wider">ЖҮЙЕЛІК_АУДИТ_ЖУРНАЛЫ</h2>
        </div>
        <button className="flex items-center gap-2 text-xs font-mono text-red-500 hover:text-red-400 transition-colors">
           <Download size={14} /> CSV_ЭКСПОРТТАУ
        </button>
      </div>

      <div className="flex-1 bg-black/40 backdrop-blur-sm border border-zinc-800 rounded-lg overflow-hidden flex flex-col font-mono text-xs shadow-inner relative">
        {/* Scan line effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

        <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-700 flex text-zinc-500 uppercase font-bold tracking-widest z-10">
          <div className="w-40">Уақыты</div>
          <div className="w-24">Деңгей</div>
          <div className="w-32">Көзі</div>
          <div className="flex-1">Оқиға деректері</div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-0 z-10 custom-scrollbar">
          {logs.map((log, index) => (
            <div key={log.id} className={`flex px-4 py-2 hover:bg-zinc-800/50 transition-colors border-l-2 ${
              log.type === 'alert' ? 'border-red-500 bg-red-900/10' :
              log.type === 'warning' ? 'border-orange-500' :
              log.type === 'success' ? 'border-green-500' : 'border-transparent'
            } ${index % 2 === 0 ? 'bg-zinc-900/20' : ''}`}>
              <div className="w-40 text-zinc-500">{log.timestamp}</div>
              <div className="w-24">
                <span className={`${
                  log.type === 'alert' ? 'text-red-500' :
                  log.type === 'warning' ? 'text-orange-500' :
                  log.type === 'success' ? 'text-green-500' : 'text-zinc-500'
                }`}>[{log.type.toUpperCase()}]</span>
              </div>
              <div className="w-32 text-zinc-300">{log.user}</div>
              <div className="flex-1 text-zinc-400">
                <span className="text-orange-400 mr-2">{log.action}</span> 
                {log.details}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logs;