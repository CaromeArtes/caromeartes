import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useBanners() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBanners();
    }, []);

    async function fetchBanners() {
        try {
            // Tenta buscar do Supabase
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .eq('active', true)
                .order('order', { ascending: true });

            if (error) {
                console.warn('Erro ao buscar banners (provavelmente tabela inexistente):', error.message);
                throw error;
            }
            setBanners(data || []);
        } catch (err) {
            // Fallback para banner padrão se der erro ou estiver vazio
            setBanners([{
                id: 'default',
                title: "Arte em Macramê",
                subtitle: "Peças exclusivas feitas à mão para transformar seu ambiente.",
                image_url: "/images/hero-bg.jpeg",
                active: true
            }]);
        } finally {
            setLoading(false);
        }
    }

    return { banners, loading };
}
