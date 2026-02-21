import React from 'react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
    const whatsappNumber = "5541995358400";
    const message = encodeURIComponent("Olá! Gostaria de tirar algumas dúvidas.");
    const link = `https://wa.me/${whatsappNumber}?text=${message}`;

    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
            aria-label="Falar no WhatsApp"
        >
            <MessageCircle size={28} className="fill-current" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-medium whitespace-nowrap">
                Fale Conosco
            </span>
        </a>
    );
}
