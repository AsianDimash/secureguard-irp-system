import React, { useEffect } from 'react';
import { Incident, IncidentType, Status, Severity, ChecklistItem } from '../types';
import { IRP_SCENARIOS } from '../constants';
import { ArrowLeft, CheckCircle2, Circle, AlertTriangle, ShieldCheck, Clock, ShieldAlert, FileText } from 'lucide-react';

interface IncidentDetailsProps {
    incident: Incident;
    onBack: () => void;
    onUpdateStatus: (id: string, status: Status) => void;
    onUpdateChecklist: (id: string, checklist: ChecklistItem[]) => void;
    onAddLog: (action: string, details: string, type: 'info' | 'warning' | 'alert' | 'success') => void;
    onGenerateReport: () => void;
}

const IncidentDetails: React.FC<IncidentDetailsProps> = ({
    incident,
    onBack,
    onUpdateStatus,
    onUpdateChecklist,
    onAddLog,
    onGenerateReport
}) => {

    // Initialize checklist if empty
    useEffect(() => {
        if (!incident.checklist || incident.checklist.length === 0) {
            const scenarioItems = IRP_SCENARIOS[incident.type] || [];
            const newChecklist: ChecklistItem[] = scenarioItems.map((label, idx) => ({
                id: `chk-${incident.id}-${idx}`,
                label,
                completed: false
            }));
            onUpdateChecklist(incident.id, newChecklist);
        }
    }, [incident.id]); // Run only when incident changes

    const handleToggleChecklist = (itemId: string) => {
        if (!incident.checklist) return;

        const updatedChecklist = incident.checklist.map(item => {
            if (item.id === itemId) {
                const newCompletedState = !item.completed;
                // Log the action
                if (newCompletedState) {
                    onAddLog(
                        'IRP_ACTION',
                        `Инцидент ${incident.id}: "${item.label}" орындалды`,
                        'success'
                    );
                }
                return {
                    ...item,
                    completed: newCompletedState,
                    timestamp: new Date().toLocaleString('kk-KZ'),
                    completedBy: 'Admin' // Mock user
                };
            }
            return item;
        });

        onUpdateChecklist(incident.id, updatedChecklist);
    };

    const activeChecklist = incident.checklist || [];
    const progress = activeChecklist.length > 0
        ? Math.round((activeChecklist.filter(i => i.completed).length / activeChecklist.length) * 100)
        : 0;

    const getStatusColor = (s: Status) => {
        switch (s) {
            case Status.NEW: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case Status.IN_PROGRESS: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case Status.CONTAINED: return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            case Status.CLOSED: return 'text-green-500 bg-green-500/10 border-green-500/20';
            default: return 'text-zinc-500';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-zinc-500 text-sm">{incident.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${getStatusColor(incident.status)}`}>
                                {incident.status}
                            </span>
                        </div>
                        <h1 className="text-2xl font-display font-bold text-white">{incident.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {incident.status !== Status.CLOSED ? (
                        <button
                            onClick={() => onUpdateStatus(incident.id, Status.CLOSED)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold text-sm shadow-[0_0_15px_rgba(22,163,74,0.3)]"
                        >
                            <CheckCircle2 size={16} />
                            Инцидентті Жабу
                        </button>
                    ) : (
                        <button
                            onClick={() => onUpdateStatus(incident.id, Status.IN_PROGRESS)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors font-semibold text-sm"
                        >
                            <ShieldAlert size={16} />
                            Қайта ашу
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <AlertTriangle size={14} /> Инцидент туралы
                        </h3>

                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="text-zinc-500 block text-xs mb-1">Қауіп деңгейі</span>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded border ${incident.severity === Severity.CRITICAL ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                                    incident.severity === Severity.HIGH ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' :
                                        'bg-blue-500/10 border-blue-500/30 text-blue-500'
                                    }`}>
                                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                                    <span className="font-bold">{incident.severity}</span>
                                </div>
                            </div>

                            <div>
                                <span className="text-zinc-500 block text-xs mb-1">Сипаттама</span>
                                <p className="text-zinc-300 bg-zinc-950/50 p-3 rounded border border-zinc-800/50">
                                    {incident.description}
                                </p>
                            </div>

                            <div>
                                <span className="text-zinc-500 block text-xs mb-1">Әсер еткен жүйелер</span>
                                <div className="flex flex-wrap gap-2">
                                    {incident.affectedSystems.map(sys => (
                                        <span key={sys} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300 font-mono border border-zinc-700">
                                            {sys}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                                <div>
                                    <span className="text-zinc-500 block text-xs mb-1">Тіркелген уақыт</span>
                                    <span className="text-zinc-200 font-mono text-xs">{incident.timestamp}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-500 block text-xs mb-1">Кім тіркеді</span>
                                    <span className="text-zinc-200 font-mono text-xs">{incident.reportedBy}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: IRP Checklist */}
                <div className="lg:col-span-2">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck size={14} /> Incident Response Plan (IRP)
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <span className="block text-2xl font-display font-bold text-white leading-none">{progress}%</span>
                                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Орындалуы</span>
                                </div>
                                <div className="w-12 h-12 relative">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-800" />
                                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className={`text-red-500 transition-all duration-1000 ease-out`} strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * progress) / 100} />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3">
                            {activeChecklist.length === 0 ? (
                                <div className="text-center py-12 text-zinc-500">
                                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>Жоспар жүктелуде...</p>
                                </div>
                            ) : (
                                activeChecklist.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleToggleChecklist(item.id)}
                                        className={`flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer group ${item.completed
                                            ? 'bg-zinc-950/30 border-zinc-800'
                                            : 'bg-zinc-900 border-zinc-700 hover:border-red-500/50 hover:bg-zinc-800'
                                            }`}
                                    >
                                        <div className={`mt-0.5 min-w-[20px] h-5 rounded-full border flex items-center justify-center transition-colors ${item.completed ? 'bg-green-500 border-green-500' : 'border-zinc-600 group-hover:border-red-500'
                                            }`}>
                                            {item.completed && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium transition-colors ${item.completed ? 'text-zinc-500 line-through' : 'text-zinc-200 group-hover:text-white'
                                                }`}>
                                                {item.label}
                                            </p>
                                            {item.completed && (
                                                <p className="text-[10px] text-zinc-600 mt-1 font-mono">
                                                    Орындалды: {item.timestamp} | {item.completedBy}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default IncidentDetails;
