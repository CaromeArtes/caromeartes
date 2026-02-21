import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, Image as ImageIcon, Plus, Search, Filter, ChevronUp, ChevronDown, Star, Flame } from 'lucide-react';

import { ProductForm } from '../components/admin/ProductForm';
import { BannerForm } from '../components/admin/BannerForm';
import { supabase } from '../supabaseClient';

export function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Erro ao sair:', error.message);
        navigate('/login');
    };

    useEffect(() => {
        setSearchTerm('');
        setFilterCategory('');
        setSortConfig({ key: 'created_at', direction: 'desc' });
        fetchData();
    }, [activeTab]);

    async function fetchData() {
        setLoading(true);
        const table = activeTab === 'products' ? 'products' : 'banners';
        const orderBy = activeTab === 'products' ? 'created_at' : 'order';

        try {
            // Tenta buscar com ordenação
            const { data: result, error } = await supabase
                .from(table)
                .select('*')
                .order(orderBy, { ascending: activeTab === 'banners' });

            if (error) {
                // Se der erro de coluna (400), tenta sem ordenação (silenciosamente)
                const { data: simpleResult, error: simpleError } = await supabase
                    .from(table)
                    .select('*');

                if (simpleError) {
                    setData([]);
                } else {
                    setData(simpleResult || []);
                }
            } else {
                setData(result || []);
            }
        } catch (error) {
            console.error('Erro ao buscar:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }

    const categories = activeTab === 'products'
        ? [...new Set(data.map(item => item.category).filter(Boolean))]
        : [];

    const filteredData = data.filter(item => {
        if (activeTab !== 'products') {
            const term = searchTerm.toLowerCase();
            return !term || (item.title && item.title.toLowerCase().includes(term)) || (item.name && item.name.toLowerCase().includes(term));
        }

        const matchesSearch = !searchTerm ||
            (item.name || item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = !filterCategory || item.category === filterCategory;

        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        if (activeTab !== 'products') {
            if (sortConfig.key === 'title') {
                return sortConfig.direction === 'asc'
                    ? (a.title || '').localeCompare(b.title || '')
                    : (b.title || '').localeCompare(a.title || '');
            }
            if (sortConfig.key === 'order') {
                return sortConfig.direction === 'asc'
                    ? (a.order || 0) - (b.order || 0)
                    : (b.order || 0) - (a.order || 0);
            }
            if (sortConfig.key === 'active') {
                return sortConfig.direction === 'asc'
                    ? (a.active === b.active ? 0 : a.active ? -1 : 1)
                    : (a.active === b.active ? 0 : a.active ? 1 : -1);
            }
            return 0; // mantém ordem padrão
        }

        const parsePrc = (val) => typeof val === 'string' ? parseFloat(val.replace(/[^\d.,]/g, '').replace(',', '.')) : (parseFloat(val) || 0);
        const directionMultiplier = sortConfig.direction === 'asc' ? 1 : -1;

        switch (sortConfig.key) {
            case 'price':
                return (parsePrc(a.price) - parsePrc(b.price)) * directionMultiplier;
            case 'name':
                return (a.name || a.title || '').localeCompare(b.name || b.title || '') * directionMultiplier;
            case 'category':
                return (a.category || '').localeCompare(b.category || '') * directionMultiplier;
            case 'created_at':
            default:
                return (new Date(a.created_at || 0) - new Date(b.created_at || 0)) * directionMultiplier;
        }
    });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronDown size={14} className="opacity-0 group-hover:opacity-30 transition-opacity" />;
        }
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={14} className="text-primary" />
            : <ChevronDown size={14} className="text-primary" />;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header Admin */}
            <header className="bg-white shadow-sm z-10 relative">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold font-serif text-gray-800">CaromeArtes | Admin</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                    >
                        <LogOut size={18} /> Sair
                    </button>
                </div>
            </header>

            <div className="flex flex-1 container mx-auto px-4 py-8 gap-8">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0">
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'products'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Package size={20} /> Produtos
                        </button>
                        <button
                            onClick={() => setActiveTab('banners')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'banners'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <ImageIcon size={20} /> Banners
                        </button>
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 bg-white rounded-xl shadow-sm p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {activeTab === 'products' ? 'Gerenciar Produtos' : 'Gerenciar Banners'}
                        </h2>
                        <button
                            onClick={() => {
                                setSelectedItem(null);
                                setIsFormOpen(true);
                            }}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus size={20} /> Adicionar Novo
                        </button>
                    </div>

                    {/* Toolbar de Filtros */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={`Buscar ${activeTab === 'products' ? 'produto' : 'banner'}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>

                        {activeTab === 'products' && (
                            <>
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary text-sm bg-white"
                                >
                                    <option value="">Todas as Categorias</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Carregando...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Imagem</th>
                                        <th className="px-4 py-3 cursor-pointer group select-none hover:bg-gray-100 transition-colors" onClick={() => handleSort(activeTab === 'products' ? 'name' : 'title')}>
                                            <div className="flex items-center gap-1">Título/Nome <SortIcon columnKey={activeTab === 'products' ? 'name' : 'title'} /></div>
                                        </th>
                                        {activeTab === 'products' && (
                                            <>
                                                <th className="px-4 py-3 cursor-pointer group select-none hover:bg-gray-100 transition-colors" onClick={() => handleSort('price')}>
                                                    <div className="flex items-center gap-1">Preço <SortIcon columnKey="price" /></div>
                                                </th>
                                                <th className="px-4 py-3 cursor-pointer group select-none hover:bg-gray-100 transition-colors" onClick={() => handleSort('category')}>
                                                    <div className="flex items-center gap-1">Categoria <SortIcon columnKey="category" /></div>
                                                </th>
                                            </>
                                        )}
                                        {activeTab === 'banners' && (
                                            <>
                                                <th className="px-4 py-3 cursor-pointer group select-none hover:bg-gray-100 transition-colors" onClick={() => handleSort('order')}>
                                                    <div className="flex items-center gap-1">Ordem <SortIcon columnKey="order" /></div>
                                                </th>
                                                <th className="px-4 py-3 cursor-pointer group select-none hover:bg-gray-100 transition-colors" onClick={() => handleSort('active')}>
                                                    <div className="flex items-center gap-1">Status <SortIcon columnKey="active" /></div>
                                                </th>
                                            </>
                                        )}
                                        <th className="px-4 py-3 rounded-tr-lg">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500 italic">
                                                Nenhum {activeTab === 'products' ? 'produto' : 'banner'} encontrado. Clique em "Adicionar Novo" para começar ou limpe os filtros.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <img
                                                        src={activeTab === 'products' ? (item.image || 'https://placehold.co/50') : (item.image_url || 'https://placehold.co/50')}
                                                        alt=""
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {item.title || item.name || 'Sem título'}
                                                        {activeTab === 'products' && item.highlight && (
                                                            <Star size={16} className="text-yellow-500 fill-yellow-500" title="Destaque" />
                                                        )}
                                                        {activeTab === 'products' && item.bestSeller && (
                                                            <Flame size={16} className="text-red-500 fill-red-500" title="Mais Vendido" />
                                                        )}
                                                    </div>
                                                    {activeTab === 'banners' && <div className="text-xs text-gray-400">{item.subtitle}</div>}
                                                </td>

                                                {activeTab === 'products' && (
                                                    <>
                                                        <td className="px-4 py-3 text-gray-600">
                                                            {(typeof item.price === 'string'
                                                                ? parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
                                                                : parseFloat(item.price) || 0
                                                            ).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                                {item.category || 'Geral'}
                                                            </span>
                                                        </td>
                                                    </>
                                                )}

                                                {activeTab === 'banners' && (
                                                    <>
                                                        <td className="px-4 py-3">{item.order}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-xs ${item.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {item.active ? 'Ativo' : 'Inativo'}
                                                            </span>
                                                        </td>
                                                    </>
                                                )}

                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                            setIsFormOpen(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        Editar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>

            {isFormOpen && (
                activeTab === 'products' ? (
                    <ProductForm
                        product={selectedItem}
                        onClose={() => setIsFormOpen(false)}
                        onSave={() => {
                            fetchData();
                            setIsFormOpen(false);
                        }}
                    />
                ) : (
                    <BannerForm
                        banner={selectedItem}
                        onClose={() => setIsFormOpen(false)}
                        onSave={() => {
                            fetchData();
                            setIsFormOpen(false);
                        }}
                    />
                )
            )}
        </div>
    );
}
