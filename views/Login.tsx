import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User } from 'lucide-react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                login(data.user);
            } else {
                setError(data.error || 'Қате орын алды');
            }
        } catch (err) {
            setError('Серверге қосылу мүмкін емес');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                        <Shield size={32} className="text-white" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-white mb-2 font-display tracking-wide">SECUREGUARD</h1>
                <p className="text-zinc-500 text-center text-sm mb-8 font-mono">INCIDENT RESPONSE PLATFORM</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Логин</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-zinc-600" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none transition-colors"
                                placeholder="Admin"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Құпиясөз</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-zinc-600" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-red-600/20 mt-4"
                    >
                        КІРУ
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-zinc-600 text-xs">DEFAULT ACCESS: admin / admin123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
