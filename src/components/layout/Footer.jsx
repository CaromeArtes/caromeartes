import React from 'react';
import { Instagram, Facebook, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer id="contato" className="bg-white py-16 border-t border-[#A0845C]/20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-serif text-[#803D16] mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#A0845C] after:rounded">
                    Contato
                </h2>
                <div className="text-[#713519] text-xl mb-10 mt-6">
                    Fale conosco para encomendas e dúvidas.
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    <a
                        href="https://wa.me/5541995358400"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#803D16] text-[#F2E5D5] px-8 py-3 rounded-xl font-medium text-lg hover:bg-[#713519] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                        WhatsApp
                    </a>
                    <a
                        href="mailto:contato@caromeartes.com.br"
                        className="bg-[#A0845C] text-white px-8 py-3 rounded-xl font-medium text-lg hover:bg-[#8e7350] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                        E-mail
                    </a>
                    <a
                        href="https://www.instagram.com/caromeartes/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#A0845C] text-white px-8 py-3 rounded-xl font-medium text-lg hover:bg-[#8e7350] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                        Instagram
                    </a>
                </div>

                <div className="text-[#A0845C] text-sm font-light">
                    <p>&copy; {new Date().getFullYear()} CaromeArtes. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
