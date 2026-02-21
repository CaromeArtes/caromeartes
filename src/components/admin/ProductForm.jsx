import React, { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { supabase } from '../../supabaseClient';

export function ProductForm({ product, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Geral',
        description: '',
        image: '',
        images: [],
        colors: '',
        highlight: false,
        bestSeller: false
    });
    const [categories, setCategories] = useState(['Geral', 'Painéis', 'Colares de Mesa', 'Suporte de Plantas', 'Luminárias', 'Prendedor de Cortina', 'Quadros Têxteis']);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (product) {
            // Sanitização profunda para dados legados
            let cleanPrice = product.price || '';
            if (typeof cleanPrice === 'string') {
                cleanPrice = cleanPrice.replace(/[^\d.,]/g, '').replace(',', '.');
            }

            setFormData({
                ...product,
                name: product.title || product.name || '',
                price: cleanPrice || '',
                category: product.category || 'Geral',
                description: product.description || '',
                image: product.image || '',
                images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
                colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
                highlight: Boolean(product.highlight),
                bestSeller: Boolean(product.bestSeller)
            });
        }
    }, [product]);

    async function fetchCategories() {
        try {
            const { data, error } = await supabase.from('products').select('category');
            if (data) {
                const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
                setCategories(prev => [...new Set([...prev, ...uniqueCategories])]);
            }
        } catch (e) {
            console.warn('Erro ao buscar categorias existentes:', e);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        const value = newCategory.trim();
        if (value && !categories.includes(value)) {
            setCategories(prev => [...prev, value]);
            setFormData(prev => ({ ...prev, category: value }));
            setNewCategory('');
            setIsAddingCategory(false);
        } else if (categories.includes(value)) {
            setFormData(prev => ({ ...prev, category: value }));
            setNewCategory('');
            setIsAddingCategory(false);
        }
    };

    const handleImageUpload = async (e, isMain = false) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('products').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            if (isMain) {
                setFormData(prev => ({ ...prev, image: publicUrl }));
            } else {
                setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
            }

        } catch (error) {
            alert('Erro no upload: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Tenta salvar apenas campos que tendem a existir em versões antigas primeiro
            // Para ser 100% resiliente, vamos montar o objeto dinamicamente
            const dataToSave = {
                name: formData.name,
                title: formData.name,
                price: parseFloat(formData.price) || 0,
                description: formData.description,
                image: formData.image,
                category: formData.category || 'Geral',
                images: formData.images,
                colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
                highlight: Boolean(formData.highlight),
                bestseller: Boolean(formData.bestSeller)
            };

            const { error } = product?.id
                ? await supabase.from('products').update(dataToSave).eq('id', product.id)
                : await supabase.from('products').insert([{
                    ...dataToSave,
                    id: formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') + '-' + Date.now().toString().slice(-4)
                }]);

            if (error) {
                // Se der erro 400, provavelmente é coluna inexistente.
                // Avisa o usuário de forma clara.
                if (error.message.includes('column') || error.code === '42703') {
                    alert('ERRO DE ESQUEMA: Algumas colunas (como cores ou categoria) não existem no seu banco.\n\nPOR FAVOR: Rode o script supabase_setup.sql no seu Supabase para corrigir isso!');
                }
                throw error;
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Não foi possível salvar: ' + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto font-sans">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                    <h3 className="text-xl font-bold text-gray-800">
                        {product ? 'Editar Produto' : 'Novo Produto'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço Numérico (Ex: 129.90)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                step="0.01"
                                placeholder="0.00"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Categoria</label>
                            {!isAddingCategory && (
                                <button
                                    type="button"
                                    onClick={() => setIsAddingCategory(true)}
                                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                                >
                                    <Plus size={12} /> Nova Categoria
                                </button>
                            )}
                        </div>

                        {isAddingCategory ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Nome da categoria..."
                                    className="flex-1 px-4 py-2 border border-primary rounded-lg outline-none"
                                />
                                <button onClick={handleAddCategory} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">Add</button>
                                <button onClick={() => setIsAddingCategory(false)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">X</button>
                            </div>
                        ) : (
                            <select
                                name="category"
                                value={formData.category || 'Geral'}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cores Disponíveis (separadas por vírgula)</label>
                        <input
                            type="text"
                            name="colors"
                            value={formData.colors}
                            onChange={handleChange}
                            placeholder="Ex: Cru, Bege, Terracota"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.highlight}
                                onChange={(e) => setFormData(p => ({ ...p, highlight: e.target.checked }))}
                                className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                            />
                            <span className="text-sm font-medium text-gray-700">Produto Destaque</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.bestSeller}
                                onChange={(e) => setFormData(p => ({ ...p, bestSeller: e.target.checked }))}
                                className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-600"
                            />
                            <span className="text-sm font-medium text-gray-700">Mais Vendido</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-bold">Foto Principal</label>
                        <div className="flex items-center gap-4">
                            {formData.image && (
                                <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border shadow-sm" />
                            )}
                            <label className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors border border-dashed border-gray-300">
                                <Upload size={18} />
                                <span className="text-sm">Carregar Foto</span>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" disabled={uploading} />
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                        <button type="submit" disabled={uploading} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 shadow-md">
                            {uploading ? 'Aguarde...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
