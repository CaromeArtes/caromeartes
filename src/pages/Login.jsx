import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '../supabaseClient';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim(),
            });

            if (authError) throw authError;

            navigate('/admin');
        } catch (err) {
            console.error('Erro no login:', err.message);
            setError('Credenciais inválidas. Verifique seu e-mail e senha.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Lock className="text-primary" size={32} />
                    </div>
                </div>
                <h1 className="text-2xl font-serif font-bold text-center text-gray-900 mb-2">Painel Caromê</h1>
                <p className="text-center text-gray-500 mb-8 text-sm">Acesse sua conta administrativa</p>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Autenticando...' : 'Entrar no Painel'}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4 italic">
                        Ambiente restrito a administradores
                    </p>
                </form>
            </div>
        </div>
    );
}
