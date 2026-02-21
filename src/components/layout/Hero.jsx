import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useBanners } from '../../hooks/useBanners';

export function Hero() {
    const { banners: slides, loading } = useBanners();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (loading || slides.length === 0) return null;

    const prev = () => setCurrent((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
    const next = () => setCurrent((curr) => (curr + 1) % slides.length);

    return (
        <section className="relative h-[600px] w-full overflow-hidden bg-gray-900">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 z-10" />

                    <img
                        src={slide.image_url}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                    />

                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4">
                        <h1 className="text-4xl md:text-6xl font-bold font-serif mb-4 animate-in slide-in-from-bottom-5 fade-in duration-700">
                            {slide.title}
                        </h1>
                        <p className="text-lg md:text-xl max-w-2xl opacity-90 animate-in slide-in-from-bottom-8 fade-in duration-1000">
                            {slide.subtitle}
                        </p>
                        <a
                            href="#catalogo"
                            className="mt-8 px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors animate-in slide-in-from-bottom-10 fade-in duration-1000"
                        >
                            Ver Coleção
                        </a>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                aria-label="Anterior"
            >
                <ChevronLeft size={32} />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                aria-label="Próximo"
            >
                <ChevronRight size={32} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === current ? "bg-white w-8" : "bg-white/50"
                            }`}
                        aria-label={`Ir para slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
