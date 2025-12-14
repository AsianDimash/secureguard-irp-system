export enum Severity {
  LOW = 'Төмен',
  MEDIUM = 'Орташа',
  HIGH = 'Жоғары',
  CRITICAL = 'Критикалық'
}

export enum Status {
  NEW = 'Жаңа',
  IN_PROGRESS = 'Орындалуда',
  CONTAINED = 'Оқшауланды',
  CLOSED = 'Жабылды'
}

export enum IncidentType {
  PHISHING = 'Фишинг',
  DDOS = 'DDoS Шабуыл',
  MALWARE = 'Зиянды БҚ (Malware)',
  DATA_LEAK = 'Деректердің таралуы',
  UNAUTHORIZED_ACCESS = 'Рұқсатсыз кіру'
}

export interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  severity: Severity;
  status: Status;
  reportedBy: string;
  timestamp: string;
  description: string;
  affectedSystems: string[];
  checklist?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  timestamp?: string;
  completedBy?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  type: 'info' | 'warning' | 'alert' | 'success';
}

// Stats for dashboard
export interface DashboardStats {
  total: number;
  open: number;
  critical: number;
  avgResponseTime: string;
}