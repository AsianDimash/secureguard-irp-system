import React, { useState } from 'react';
import { Search, Microscope, Shield, Eraser, RotateCcw, FileText } from 'lucide-react';
import { IncidentType } from '../types';

const IRPGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState<IncidentType>(IncidentType.PHISHING);

  const steps = [
    { id: 1, title: 'АНЫҚТАУ', icon: Search, desc: 'Аномалияны анықтау және растау (Detection).' },
    { id: 2, title: 'ТАЛДАУ', icon: Microscope, desc: 'Ауқымын және шығу көзін анықтау (Analysis).' },
    { id: 3, title: 'ОҚШАУЛАУ', icon: Shield, desc: 'Зақымдалған жүйелерді оқшаулау (Containment).' },
    { id: 4, title: 'ЖОЮ', icon: Eraser, desc: 'Қауіпті толығымен жою (Eradication).' },
    { id: 5, title: 'ҚАЛПЫНА КЕЛТІРУ', icon: RotateCcw, desc: 'Қызметтерді қалпына келтіру (Recovery).' },
    { id: 6, title: 'ҚОРЫТЫНДЫ', icon: FileText, desc: 'Құжаттама және қатемен жұмыс (Post-Mortem).' },
  ];

  const scenarios = {
    [IncidentType.PHISHING]: ["Email тақырыптарын талдау", "URL тексеру (Sandbox)", "Құпиясөзді ауыстыру", "Хатты өшіру", "Пайдаланушыларды хабардар ету"],
    [IncidentType.DDOS]: ["Трафикті талдау", "Провайдермен (ISP) байланысу", "Rate Limiting қосу", "IP-мекенжайларды бұғаттау", "Load Balancer тексеру"],
    [IncidentType.MALWARE]: ["Хостты желіден ажырату", "Процестерді тексеру", "Толық антивирустық сканерлеу", "Backup-тан қайтару", "Осалдықтарды жабу (Patch)"],
    [IncidentType.DATA_LEAK]: ["DLP логтарын тексеру", "Аккаунттарды бұғаттау", "Заңгерлік бағалау", "Хронологияны құру", "Құпиясөздерді мәжбүрлі ауыстыру"],
    [IncidentType.UNAUTHORIZED_ACCESS]: ["Авторизация логтарын (Auth Logs) тексеру", "Сессияларды үзу", "2FA тексеру", "Firewall ережелерін жаңарту", "Пайдаланушы аудиті"]
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-3xl font-display font-bold text-white tracking-widest">IRP <span className="text-red-500">ПРОТОКОЛЫ</span></h2>
        <p className="text-zinc-400 font-mono text-sm">NIST 800-61 Ақпараттық қауіпсіздік инциденттерін өңдеу нұсқаулығы</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Vertical Stepper */}
        <div className="lg:col-span-4 space-y-2">
           {steps.map((step) => {
             const Icon = step.icon;
             const active = activeStep === step.id;
             return (
               <button
                 key={step.id}
                 onClick={() => setActiveStep(step.id)}
                 className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex items-center justify-between group ${
                   active 
                     ? 'bg-red-500/10 border-red-500/50 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                     : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-600'
                 }`}
               >
                 <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold ${active ? 'text-red-500' : 'text-zinc-600'}`}>0{step.id}</span>
                    <span className="font-display font-bold tracking-wider">{step.title}</span>
                 </div>
                 <Icon size={18} className={active ? 'text-red-500' : 'text-zinc-600'} />
               </button>
             )
           })}
        </div>

        {/* Right: Content */}
        <div className="lg:col-span-8">
           <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-xl p-8 h-full relative overflow-hidden">
              {/* Dynamic Background Number */}
              <div className="absolute -top-10 -right-10 text-[200px] font-display font-bold text-zinc-800/20 select-none">
                {activeStep}
              </div>

              <div className="relative z-10">
                 <h3 className="text-2xl font-display font-bold text-red-500 mb-2">{steps[activeStep-1].title}</h3>
                 <p className="text-zinc-300 mb-8 border-l-2 border-red-500 pl-4">{steps[activeStep-1].desc}</p>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Стандартты процедура</h4>
                       <div className="space-y-2">
                          {[1,2,3].map(i => (
                             <div key={i} className="flex items-center gap-3 p-3 bg-zinc-950/50 rounded border border-zinc-800/50">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-zinc-300">№{activeStep}.{i} Фазалық операцияны орындау</span>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Сценарийлік Чек-лист</h4>
                          <select 
                            className="bg-zinc-950 border border-zinc-700 text-[10px] text-red-500 rounded px-2 py-1 outline-none uppercase font-bold cursor-pointer"
                            value={selectedScenario}
                            onChange={(e) => setSelectedScenario(e.target.value as IncidentType)}
                          >
                            {Object.values(IncidentType).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                       </div>
                       
                       <div className="bg-zinc-950 rounded border border-zinc-800 p-1">
                          {scenarios[selectedScenario].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 border-b border-zinc-900 last:border-0 hover:bg-zinc-900 transition-colors cursor-default group">
                               <div className="w-4 h-4 border border-zinc-600 rounded flex items-center justify-center group-hover:border-red-500">
                                  <div className="w-2 h-2 bg-red-500 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                               </div>
                               <span className="text-sm text-zinc-400 group-hover:text-white">{item}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IRPGuide;