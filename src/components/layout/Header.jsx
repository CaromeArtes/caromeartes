import React, { useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (e, targetId) => {
        e.preventDefault();
        setIsMenuOpen(false);

        const element = document.getElementById(targetId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <header className="fixed w-full bg-[#F5F1EB]/95 backdrop-blur-md z-50 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 py-4 flex flex-col items-center gap-4">
                {/* Logo */}
                <a href="#" className="hover:scale-105 transition-transform duration-300">
                    <img src="./images/logo.png" alt="CaromeArtes Logo" className="h-28 w-auto object-contain drop-shadow-sm" />
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-[#803D16]">
                    <a href="#catalogo" onClick={(e) => scrollToSection(e, 'catalogo')} className="hover:text-[#A0845C] transition-colors font-medium lowercase text-lg cursor-pointer">produtos</a>
                    <span className="text-[#A0845C]/50 font-light">/</span>
                    <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-[#A0845C] transition-colors font-medium lowercase text-lg cursor-pointer">perguntas frequentes</a>
                    <span className="text-[#A0845C]/50 font-light">/</span>
                    <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className="hover:text-[#A0845C] transition-colors font-medium lowercase text-lg cursor-pointer">quem somos</a>
                    <span className="text-[#A0845C]/50 font-light">/</span>
                    <a href="#contato" onClick={(e) => scrollToSection(e, 'contato')} className="hover:text-[#A0845C] transition-colors font-medium lowercase text-lg cursor-pointer">contato</a>
                </nav>

                {/* Mobile Menu Button - Absolute to top right */}
                <button
                    className="md:hidden absolute top-6 right-6 p-2 text-[#803D16]"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Menu"
                >
                    {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#F5F1EB] border-t border-[#A0845C]/20 p-6 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-5 text-center">
                    <a href="#catalogo" onClick={(e) => scrollToSection(e, 'catalogo')} className="text-[#803D16] hover:text-[#A0845C] py-2 text-xl font-medium lowercase cursor-pointer">produtos</a>
                    <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="text-[#803D16] hover:text-[#A0845C] py-2 text-xl font-medium lowercase cursor-pointer">perguntas frequentes</a>
                    <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className="text-[#803D16] hover:text-[#A0845C] py-2 text-xl font-medium lowercase cursor-pointer">quem somos</a>
                    <a href="#contato" onClick={(e) => scrollToSection(e, 'contato')} className="text-[#803D16] hover:text-[#A0845C] py-2 text-xl font-medium lowercase cursor-pointer">contato</a>
                </div>
            )}
        </header>
    );
}
