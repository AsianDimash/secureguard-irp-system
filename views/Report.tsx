import React from 'react';
import { Incident, LogEntry, ChecklistItem } from '../types';
import { FileText, Calendar, Clock, CheckCircle, Shield, Download, ArrowLeft } from 'lucide-react';

interface ReportProps {
    incident: Incident;
    logs: LogEntry[];
    onBack: () => void;
}

const Report: React.FC<ReportProps> = ({ incident, logs, onBack }) => {
    // Filter logs related to this incident
    const incidentLogs = logs.filter(log => log.details.includes(incident.id));
    const checklist = incident.checklist || [];
    const completedItems = checklist.filter(i => i.completed);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            {/* Non-printable controls */}
            <div className="flex justify-between items-center mb-8 print:hidden">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    Артқа қайту
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-red-600/20 transition-all"
                >
                    <Download size={18} />
                    Есепті жүктеу (PDF)
                </button>
            </div>

            {/* Report Container */}
            <div className="bg-white text-zinc-900 p-12 rounded-xl shadow-2xl print:shadow-none print:p-0">

                {/* Header */}
                <div className="border-b-2 border-zinc-900 pb-6 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-zinc-900 mb-2">POST-INCIDENT REPORT</h1>
                        <p className="font-mono text-zinc-500">CONFIDENTIAL // INTERNAL USE ONLY</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold font-mono">{incident.id}</p>
                        <p className="text-sm text-zinc-500">{new Date().toLocaleDateString('kk-KZ')}</p>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-wider border-l-4 border-red-600 pl-3 mb-4">
                        1. Инцидент сипаттамасы
                    </h2>
                    <div className="grid grid-cols-2 gap-6 bg-zinc-50 p-6 rounded-lg border border-zinc-200">
                        <div>
                            <span className="block text-xs font-bold text-zinc-500 uppercase">Тақырыбы</span>
                            <span className="block text-lg font-semibold">{incident.title}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-zinc-500 uppercase">Түрі</span>
                            <span className="block text-lg font-semibold">{incident.type}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-zinc-500 uppercase">Қауіп деңгейі</span>
                            <span className="block text-lg font-semibold">{incident.severity}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-zinc-500 uppercase">Тіркелген уақыты</span>
                            <span className="block text-lg font-semibold">{incident.timestamp}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="block text-xs font-bold text-zinc-500 uppercase">Толық сипаттама</span>
                            <p className="mt-1 leading-relaxed">{incident.description}</p>
                        </div>
                    </div>
                </div>

                {/* Root Cause & Actions */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-wider border-l-4 border-zinc-900 pl-3 mb-4">
                        2. Орындалған іс-шаралар ({completedItems.length}/{checklist.length})
                    </h2>
                    <div className="space-y-2">
                        {completedItems.length > 0 ? completedItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 border-b border-zinc-100">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={16} className="text-green-600" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                <span className="text-sm font-mono text-zinc-500">{item.timestamp}</span>
                            </div>
                        )) : (
                            <p className="text-zinc-400 italic">Әрекеттер тіркелмеген.</p>
                        )}
                    </div>
                </div>

                {/* Timeline Analysis */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-wider border-l-4 border-zinc-900 pl-3 mb-4">
                        3. Хронология (Timeline)
                    </h2>
                    <div className="relative border-l-2 border-zinc-200 ml-3 space-y-6">
                        {incidentLogs.map((log) => (
                            <div key={log.id} className="relative pl-6">
                                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-zinc-400 border border-white"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold font-mono text-zinc-500">{log.timestamp}</span>
                                    <span className="font-semibold text-sm">{log.action}</span>
                                    <span className="text-sm text-zinc-600">{log.details}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conclusion / Recommendations */}
                <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider border-l-4 border-zinc-900 pl-3 mb-4">
                        4. Қорытынды және Ұсыныстар
                    </h2>
                    <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-red-900">
                        <h3 className="font-bold mb-2 flex items-center gap-2"><Shield size={18} /> Автоматты ұсыныстар:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Қауіпсіздік саясатын қайта қарау.</li>
                            <li>{incident.type} бойынша қызметкерлерді оқыту.</li>
                            <li>Мониторинг жүйесінің сезімталдығын арттыру.</li>
                            <li>2FA енгізуді қарастыру.</li>
                        </ul>
                    </div>

                    <div className="mt-12 flex justify-between items-end pt-8 border-t border-zinc-200">
                        <div className="text-center">
                            <div className="w-48 border-b border-zinc-900 mb-2"></div>
                            <span className="text-xs uppercase font-bold text-zinc-500">Орындаушы (Аты-жөні, Қолы)</span>
                        </div>
                        <div className="text-center">
                            <div className="w-48 border-b border-zinc-900 mb-2"></div>
                            <span className="text-xs uppercase font-bold text-zinc-500">Басшылық (Аты-жөні, Қолы)</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Report;
