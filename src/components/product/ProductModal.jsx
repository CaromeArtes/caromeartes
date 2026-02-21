import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

export function ProductModal({ product, onClose }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!product) return null;

    // Garante que images seja um array, usando a imagem principal se vazio ou indefinido
    const images = (product.images && product.images.length > 0)
        ? product.images
        : [product.image];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const whatsappNumber = "5541995358400"; // Número correto
    const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre o produto: ${product.name}`);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row">

                {/* Botão Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Galeria de Imagens */}
                <div className="w-full md:w-1/2 bg-gray-100 relative min-h-[300px] md:min-h-[500px]">
                    <img
                        src={images[currentImageIndex]}
                        alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover absolute inset-0"
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                            >
                                <ChevronRight size={24} />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-primary' : 'bg-white/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Detalhes */}
                <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <span className="text-sm text-gray-500 uppercase tracking-widest mb-2">{product.category}</span>
                    <h2 className="text-3xl font-serif text-gray-900 mb-4">{product.name}</h2>

                    <div className="text-2xl font-bold text-primary mb-6">
                        {product.price > 0 ? product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "Sob Consulta"}
                    </div>

                    <div className="prose prose-sm text-gray-600 mb-8 max-w-none whitespace-pre-line">
                        {product.description}
                    </div>

                    <div className="mt-auto">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 bg-[#25D366] text-white rounded-xl font-medium text-lg hover:bg-[#128c7e] transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300"
                        >
                            <ShoppingBag size={24} />
                            Encomendar via WhatsApp
                        </a>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Peça artesanal feita sob encomenda. Prazo de produção a combinar.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
