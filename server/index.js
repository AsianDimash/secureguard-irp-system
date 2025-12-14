import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './db.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// --- Routes ---

// GET /api/incidents
app.get('/api/incidents', (req, res) => {
    const sql = `SELECT * FROM incidents ORDER BY timestamp DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        // Fetch checklist items for each incident
        // This is N+1 but acceptable for small scale demo
        const incidents = rows.map(async (row) => {
            row.affectedSystems = row.affectedSystems ? row.affectedSystems.split(',') : [];

            return new Promise((resolve) => {
                db.all("SELECT * FROM checklist_items WHERE incidentId = ?", [row.id], (err, items) => {
                    row.checklist = items.map(item => ({ ...item, completed: !!item.completed }));
                    resolve(row);
                });
            });
        });

        Promise.all(incidents).then(results => res.json({ "data": results }));
    });
});

// POST /api/incidents
app.post('/api/incidents', (req, res) => {
    const { id, title, type, severity, status, reportedBy, timestamp, description, affectedSystems } = req.body;
    const sysStr = affectedSystems.join(',');

    const sql = `INSERT INTO incidents (id, title, type, severity, status, reportedBy, timestamp, description, affectedSystems) VALUES (?,?,?,?,?,?,?,?,?)`;
    const params = [id, title, type, severity, status, reportedBy, timestamp, description, sysStr];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": req.body
        });
    });
});

// PATCH /api/incidents/:id/status
app.patch('/api/incidents/:id/status', (req, res) => {
    const { status } = req.body;
    const sql = `UPDATE incidents SET status = ? WHERE id = ?`;

    db.run(sql, [status, req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "updated", changes: this.changes });
    });
});

// PATCH /api/incidents/:id/checklist
// Replace entire checklist for simplicity in this demo
app.patch('/api/incidents/:id/checklist', (req, res) => {
    const incidentId = req.params.id;
    const items = req.body.items; // Array of items

    db.serialize(() => {
        // Delete existing items
        db.run("DELETE FROM checklist_items WHERE incidentId = ?", [incidentId]);

        // Insert new
        const stmt = db.prepare("INSERT INTO checklist_items VALUES (?, ?, ?, ?, ?, ?)");
        items.forEach(item => {
            stmt.run([item.id, incidentId, item.label, item.completed ? 1 : 0, item.timestamp || '', item.completedBy || '']);
        });
        stmt.finalize();

        res.json({ message: "checklist updated" });
    });
});

// GET /api/logs
app.get('/api/logs', (req, res) => {
    const sql = "SELECT * FROM logs ORDER BY timestamp DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "data": rows });
    });
});

// POST /api/logs
app.post('/api/logs', (req, res) => {
    const { id, timestamp, action, user, details, type } = req.body;
    db.run(`INSERT INTO logs VALUES (?, ?, ?, ?, ?, ?)`, [id, timestamp, action, user, details, type], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "success", data: req.body });
    });
});

// --- Auth Routes ---

// POST /api/login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({ message: "success", user: { id: row.id, username: row.username, role: row.role } });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

// GET /api/users
app.get('/api/users', (req, res) => {
    db.all("SELECT id, username, role FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// POST /api/users
app.post('/api/users', (req, res) => {
    const { id, username, password, role } = req.body;
    db.run("INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)", [id, username, password, role], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "success", id: this.lastID });
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
