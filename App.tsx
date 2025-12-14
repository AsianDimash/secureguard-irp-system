import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import Incidents from './views/Incidents';
import NewIncident from './views/NewIncident';
import IRPGuide from './views/IRPGuide';
import Logs from './views/Logs';
import IncidentDetails from './views/IncidentDetails';
import Report from './views/Report';
import Login from './views/Login';
import Users from './views/Users';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Incident, LogEntry, IncidentType, Severity, Status, ChecklistItem } from './types';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch('/api/incidents')
      .then(res => res.json())
      .then(data => setIncidents(data.data));

    fetch('/api/logs')
      .then(res => res.json())
      .then(data => setLogs(data.data));
  }, [isAuthenticated]);

  const addLog = (action: string, details: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: `LOG-${Math.floor(Date.now() / 1000)}`,
      timestamp: new Date().toLocaleString('kk-KZ'),
      user: user?.username || 'SYSTEM',
      action,
      details,
      type
    };

    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog)
    })
      .then(res => res.json())
      .then(() => setLogs(prev => [newLog, ...prev]));
  };

  const handleCreateIncident = (newIncident: Incident) => {
    fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIncident)
    })
      .then(res => res.json())
      .then(() => {
        setIncidents(prev => [newIncident, ...prev]);
        addLog('INC_CREATE', `ID: ${newIncident.id} | Түрі: ${newIncident.type}`, 'alert');
        setCurrentView('incidents');
      });
  };

  const handleUpdateStatus = (id: string, newStatus: Status) => {
    fetch(`/api/incidents/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(() => {
        setIncidents(prev => prev.map(inc => {
          if (inc.id === id) {
            addLog('STAT_CHANGE', `ID: ${id} -> ${newStatus}`, newStatus === Status.CLOSED ? 'success' : 'info');
            return { ...inc, status: newStatus };
          }
          return inc;
        }));
      });
  };

  const handleUpdateChecklist = (id: string, checklist: ChecklistItem[]) => {
    fetch(`/api/incidents/${id}/checklist`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: checklist })
    })
      .then(() => {
        setIncidents(prev => prev.map(inc =>
          inc.id === id ? { ...inc, checklist } : inc
        ));
      });
  };

  const handleViewDetails = (id: string) => {
    setSelectedIncidentId(id);
    setCurrentView('incident-details');
  };

  const handleGenerateReport = () => {
    setCurrentView('report');
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard incidents={incidents} logs={logs} />;
      case 'incidents': return <Incidents incidents={incidents} onUpdateStatus={handleUpdateStatus} onViewDetails={handleViewDetails} />;
      case 'incident-details':
        const selected = incidents.find(i => i.id === selectedIncidentId);
        if (!selected) return <Incidents incidents={incidents} onUpdateStatus={handleUpdateStatus} onViewDetails={handleViewDetails} />;
        return (
          <IncidentDetails
            incident={selected}
            onBack={() => setCurrentView('incidents')}
            onUpdateStatus={handleUpdateStatus}
            onUpdateChecklist={handleUpdateChecklist}
            onAddLog={addLog}
            onGenerateReport={handleGenerateReport}
          />
        );
      case 'report':
        const reportIncident = incidents.find(i => i.id === selectedIncidentId);
        if (!reportIncident) return <Dashboard incidents={incidents} logs={logs} />;
        return <Report incident={reportIncident} logs={logs} onBack={() => setCurrentView('incident-details')} />;
      case 'new': return <NewIncident onSubmit={handleCreateIncident} onCancel={() => setCurrentView('dashboard')} />;
      case 'irp': return <IRPGuide />;
      case 'logs': return <Logs logs={logs} />;
      case 'users': return <Users />;
      default: return <Dashboard incidents={incidents} logs={logs} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-red-500/30">
      {/* Decorative ambient background */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <Navbar currentView={currentView} onChangeView={setCurrentView} />

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen animate-fade-in">
        {renderView()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;