import React from 'react';
import { Heart, Leaf, Scroll } from 'lucide-react';

export function About() {
    return (
        <section id="sobre" className="py-20 bg-[#F7F3EE]">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h2 className="text-4xl font-serif text-[#803D16] mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#A0845C] after:rounded">
                        Nossa História
                    </h2>
                    <p className="text-[#713519] text-xl leading-relaxed mt-8">
                        Cada peça é criada com amor e dedicação, utilizando técnicas tradicionais de macramê que
                        passaram de geração em geração. Nosso compromisso é trazer beleza natural e sustentável para sua casa.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-[#F7F7F7] rounded-2xl p-8 text-center shadow-md hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 mx-auto mb-4 bg-[#EEF2E8] rounded-full flex items-center justify-center text-3xl">
                            {/* ❤ */}
                            <Heart className="text-[#803D16]" size={32} fill="#803D16" />
                        </div>
                        <h3 className="text-[#803D16] text-xl font-bold mb-3">Feito com Amor</h3>
                        <p className="text-[#713519]">
                            Cada nó é cuidadosamente trabalhado, garantindo qualidade e durabilidade em todas as nossas peças artesanais.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#F7F7F7] rounded-2xl p-8 text-center shadow-md hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 mx-auto mb-4 bg-[#EEF2E8] rounded-full flex items-center justify-center text-3xl">
                            {/* 🍃 */}
                            <Leaf className="text-[#803D16]" size={32} />
                        </div>
                        <h3 className="text-[#803D16] text-xl font-bold mb-3">Sustentável</h3>
                        <p className="text-[#713519]">
                            Utilizamos apenas materiais naturais e ecologicamente corretos, respeitando o meio ambiente em todo processo.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#F7F7F7] rounded-2xl p-8 text-center shadow-md hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 mx-auto mb-4 bg-[#EEF2E8] rounded-full flex items-center justify-center text-3xl">
                            {/* 🧶 */}
                            <Scroll className="text-[#803D16]" size={32} />
                        </div>
                        <h3 className="text-[#803D16] text-xl font-bold mb-3">Tradição</h3>
                        <p className="text-[#713519]">
                            Preservamos técnicas ancestrais de macramê, mantendo viva a tradição artesanal em cada criação única.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
