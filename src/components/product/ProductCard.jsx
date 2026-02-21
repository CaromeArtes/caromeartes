import React from 'react';
import { ShoppingBag } from 'lucide-react';

export function ProductCard({ product, onSelect }) {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const whatsappNumber = "5541995358400";
    const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre o produto: ${product.name} `);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Garante array de imagens
    const images = (product.images && product.images.length > 0)
        ? product.images
        : [product.image];

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <article
            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-start h-full cursor-pointer"
            itemScope
            itemType="https://schema.org/Product"
            onClick={() => onSelect(product)}
        >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 group/image">
                <img
                    src={images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                    loading="lazy"
                    itemProp="image"
                />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full hover:bg-white text-gray-800 opacity-0 group-hover/image:opacity-100 transition-opacity shadow-sm"
                            aria-label="Imagem anterior"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full hover:bg-white text-gray-800 opacity-0 group-hover/image:opacity-100 transition-opacity shadow-sm"
                            aria-label="Próxima imagem"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover/image:opacity-100 transition-opacity">
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full shadow-sm ${idx === currentImageIndex ? 'bg-white' : 'bg-white/60'}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {product.highlight && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Destaque
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col gap-2 w-full flex-1">
                <span className="text-xs text-gray-500 uppercase tracking-widest">{product.category}</span>
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary transition-colors" itemProp="name">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2" itemProp="description">
                    {product.description}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between w-full" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span className="text-xl font-bold text-gray-900" itemProp="price" content={product.price}>
                        {product.price > 0 ? product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "Sob Consulta"}
                    </span>
                    <meta itemProp="priceCurrency" content="BRL" />

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-900 text-white rounded-full hover:bg-primary transition-colors"
                        aria-label={`Comprar ${product.name} via WhatsApp`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ShoppingBag size={20} />
                    </a>
                </div>
            </div>
        </article>
    );
}
