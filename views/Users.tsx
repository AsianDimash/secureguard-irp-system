import React, { useEffect, useState } from 'react';
import { UserPlus, Trash, Shield } from 'lucide-react';

interface User {
    id: string;
    username: string;
    role: string;
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'ANALYST' });
    const [loading, setLoading] = useState(false);

    const fetchUsers = () => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data.data));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const id = `USR-${Date.now()}`;
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newUser, id })
        });

        setNewUser({ username: '', password: '', role: 'ANALYST' });
        setLoading(false);
        fetchUsers();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-3xl font-display font-bold text-white tracking-wide">ПАЙДАЛАНУШЫЛАР</h2>
                <p className="text-zinc-400 font-mono text-sm">Жүйеге кіру рұқсаттарын басқару</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create User Form */}
                <div className="lg:col-span-1">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <UserPlus size={20} className="text-red-500" /> Жаңа тіркеу
                        </h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Username</label>
                                <input
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white text-sm"
                                    value={newUser.username}
                                    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white text-sm"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Role</label>
                                <select
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white text-sm"
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="ANALYST">Analyst</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="VIEWER">Viewer</option>
                                </select>
                            </div>
                            <button
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition-colors"
                            >
                                {loading ? 'Сақталуда...' : 'Тіркеу'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Users List */}
                <div className="lg:col-span-2">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-950 border-b border-zinc-800 text-xs uppercase text-zinc-500 font-bold">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Пайдаланушы</th>
                                    <th className="p-4">Рөлі</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {users.map(user => (
                                    <tr key={user.id} className="text-sm hover:bg-zinc-900/50 transition-colors">
                                        <td className="p-4 font-mono text-zinc-500">{user.id}</td>
                                        <td className="p-4 font-bold text-white">{user.username}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${user.role === 'ADMIN' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {/* Delete functionality placeholder */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;
