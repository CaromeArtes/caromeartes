import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../../supabaseClient';

export function BannerForm({ banner, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image_url: '',
        order: 0,
        active: true
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (banner) {
            setFormData({
                ...banner,
                title: banner.title || '',
                subtitle: banner.subtitle || '',
                image_url: banner.image_url || '',
                order: banner.order || 0,
                active: banner.active ?? true
            });
        }
    }, [banner]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `banner_${Date.now()}.${fileExt}`;
            const filePath = `banners/${fileName}`;

            // Upload para o bucket 'banners' (assumindo que existe ou usuário criará)
            const { error: uploadError } = await supabase.storage
                .from('banners')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('banners').getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));

        } catch (error) {
            alert('Erro no upload: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (banner?.id) {
                const { error } = await supabase
                    .from('banners')
                    .update(formData)
                    .eq('id', banner.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('banners')
                    .insert([formData]);
                if (error) throw error;
            }
            onSave();
            onClose();
        } catch (error) {
            alert('Erro ao salvar: ' + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">
                        {banner ? 'Editar Banner' : 'Novo Banner'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                        <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-gray-700">Ativo</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Banner</label>
                        <div className="space-y-3">
                            {formData.image_url && (
                                <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg border" />
                            )}

                            <label className="cursor-pointer block w-full text-center bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors">
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                    <Upload size={24} />
                                    <span className="text-sm font-medium">Clique para fazer upload</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {uploading ? 'Salvando...' : 'Salvar Banner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
