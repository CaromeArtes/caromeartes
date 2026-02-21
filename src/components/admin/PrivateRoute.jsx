import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export function PrivateRoute({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verifica a sessão atual
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Escuta mudanças na autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-sm animate-pulse">Verificando acesso...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
