import React, { useState } from 'react';
import { Incident, IncidentType, Severity, Status } from '../types';
import { Save, Cpu } from 'lucide-react';

interface NewIncidentProps {
  onSubmit: (incident: Incident) => void;
  onCancel: () => void;
}

const NewIncident: React.FC<NewIncidentProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: IncidentType.PHISHING,
    severity: Severity.LOW,
    description: '',
    affectedSystems: '',
    reportedBy: 'Admin User'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncident: Incident = {
      id: `NX-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.title,
      type: formData.type,
      severity: formData.severity,
      status: Status.NEW,
      reportedBy: formData.reportedBy,
      timestamp: new Date().toLocaleString('kk-KZ'),
      description: formData.description,
      affectedSystems: formData.affectedSystems.split(',').map(s => s.trim()).filter(s => s.length > 0)
    };
    onSubmit(newIncident);
  };

  return (
    <div className="max-w-3xl mx-auto animate-slide-down">
      <div className="flex items-center gap-4 mb-8">
         <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <Cpu className="text-red-500" size={32} />
         </div>
         <div>
            <h2 className="text-3xl font-display font-bold text-white">ИНЦИДЕНТТІ ТІРКЕУ</h2>
            <p className="text-zinc-400 font-mono text-sm">Орталықтандырылған дерекқорға жаңа жазба енгізу.</p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-xl p-8 shadow-2xl relative overflow-hidden group">
        
        {/* Animated border gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 opacity-50"></div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Тақырыбы / Атауы</label>
            <input 
              required
              type="text" 
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder-zinc-700"
              placeholder="Мысалы: 192.168.1.0/24 желісіндегі аномалия"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Векторлық жіктеу</label>
              <select 
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-4 text-white focus:border-red-500 outline-none appearance-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as IncidentType})}
              >
                {Object.values(IncidentType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Қауіп деңгейі</label>
              <div className="flex gap-2">
                 {[Severity.LOW, Severity.MEDIUM, Severity.HIGH, Severity.CRITICAL].map((sev) => (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setFormData({...formData, severity: sev})}
                      className={`flex-1 py-3 rounded border text-xs font-bold transition-all ${
                        formData.severity === sev 
                          ? sev === Severity.CRITICAL ? 'bg-red-600 text-white border-red-600' : 'bg-red-500 text-white border-red-500'
                          : 'bg-zinc-950 border-zinc-700 text-zinc-500 hover:border-zinc-500'
                      }`}
                    >
                      {sev}
                    </button>
                 ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Тактикалық сипаттама</label>
            <textarea 
              required
              rows={5}
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-4 text-white focus:border-red-500 outline-none font-mono text-sm"
              placeholder="Толық сипаттама, логтар немесе бақылау нәтижелері..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Нысанаға алынған активтер</label>
            <input 
              type="text" 
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-4 text-white focus:border-red-500 outline-none font-mono text-sm"
              placeholder="Server-01, DB-Prod, 10.0.0.5"
              value={formData.affectedSystems}
              onChange={e => setFormData({...formData, affectedSystems: e.target.value})}
            />
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-8 py-3 rounded border border-zinc-600 text-zinc-400 hover:text-white hover:border-white transition-colors"
            >
              БОЛДЫРМАУ
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded font-bold tracking-wide shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              ПРОТОКОЛДЫ ОРЫНДАУ
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default NewIncident;