import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                // Tenta buscar do Supabase com ordenação
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                // Se houver erro de ordenação (ex: coluna não existe pois o SQL não foi rodado), tenta sem ordenação
                if (error) {
                    console.warn('Erro na ordenação, tentando busca simples:', error.message);
                    const { data: fallbackData, error: fallbackError } = await supabase
                        .from('products')
                        .select('*');

                    if (fallbackError) throw fallbackError;

                    setProducts(mapData(fallbackData));
                } else {
                    setProducts(mapData(data));
                }
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        function mapData(data) {
            return (data || []).map(p => ({
                ...p,
                name: p.title || p.name,
                image: p.image || './images/placeholder.jpg',
                images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || './images/placeholder.jpg'],
                price: typeof p.price === 'string'
                    ? parseFloat(p.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
                    : parseFloat(p.price) || 0,
                category: p.category || 'Geral', // Garante a manutenção da categoria
                description: p.description || '',
                highlight: Boolean(p.highlight),
                bestSeller: Boolean(p.bestSeller)
            }));
        }

        fetchProducts();
    }, []);

    return { products, loading, error };
}
