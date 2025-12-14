import sqlite3 from 'sqlite3';
import { IRP_SCENARIOS } from './constants.js';

const db = new sqlite3.Database('./secureguard.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Incidents Table
        db.run(`CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      title TEXT,
      type TEXT,
      severity TEXT,
      status TEXT,
      reportedBy TEXT,
      timestamp TEXT,
      description TEXT,
      affectedSystems TEXT
    )`);

        // Logs Table
        db.run(`CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT,
      action TEXT,
      user TEXT,
      details TEXT,
      type TEXT
    )`);

        // Checklist Items Table
        db.run(`CREATE TABLE IF NOT EXISTS checklist_items (
      id TEXT PRIMARY KEY,
      incidentId TEXT,
      label TEXT,
      completed INTEGER,
      timestamp TEXT,
      completedBy TEXT,
      FOREIGN KEY(incidentId) REFERENCES incidents(id)
    )`);

        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )`);

        // Seed initial incidents if empty
        db.get("SELECT count(*) as count FROM incidents", (err, row) => {
            if (row.count === 0) {
                console.log("Seeding initial data...");
                seedData();
            }
        });

        // Seed initial users if empty
        db.get("SELECT count(*) as count FROM users", (err, row) => {
            if (row.count === 0) {
                console.log("Creating default admin user...");
                db.run("INSERT INTO users VALUES (?, ?, ?, ?)", ['USR-001', 'admin', 'admin123', 'ADMIN']);
            }
        });
    });
}

function seedData() {
    const stmt = db.prepare("INSERT INTO incidents VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    const incidents = [
        ['NX-802', 'Желіге рұқсатсыз кіру әрекеті', 'Рұқсатсыз кіру', 'Жоғары', 'Орындалуда', 'AI Monitor', '2023-10-27 09:14:22', 'Белгісіз ішкі желіден (subnet) қалыптан тыс трафик анықталды.', 'Core-Switch-01'],
        ['NX-774', 'Фишингтік векторды талдау', 'Фишинг', 'Орташа', 'Жаңа', 'Employee #402', '2023-10-26 14:30:00', '"salary_update.pdf.exe" тіркемесінде күдікті payload табылды.', 'Mail-Exchange'],
        ['NX-601', 'Ransomware оқшаулау', 'Зиянды БҚ (Malware)', 'Критикалық', 'Оқшауланды', 'Endpoint Security', '2023-10-25 11:20:15', 'Cryptolocker нұсқасы Sandbox ортасында оқшауланды.', 'Workstation-Fin-04']
    ];

    incidents.forEach(inc => stmt.run(inc));
    stmt.finalize();

    const logStmt = db.prepare("INSERT INTO logs VALUES (?, ?, ?, ?, ?, ?)");
    const logs = [
        ['LOG-992', '2023-10-27 09:15:00', 'SYS_ALERT', 'SYSTEM', 'Инцидент NX-802 ЖОҒАРЫ деңгейімен белгіленді', 'alert'],
        ['LOG-991', '2023-10-26 14:35:00', 'USR_REP', 'Emp_402', 'Потенциалды фишинг үлгісін жіберді', 'warning'],
        ['LOG-990', '2023-10-25 11:21:00', 'AUTO_DEF', 'SYSTEM', 'Түйінді оқшаулау протоколы орындалды', 'success']
    ];
    logs.forEach(l => logStmt.run(l));
    logStmt.finalize();
}

export default db;
