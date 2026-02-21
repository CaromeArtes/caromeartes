import React from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
    {
        question: "Como faço para comprar uma peça?",
        answer: "Você pode escolher os modelos disponíveis em nossa loja online ou solicitar uma peça personalizada entrando em contato conosco pelo WhatsApp."
    },
    {
        question: "Vocês fazem peças sob medida?",
        answer: "Sim! Trabalhamos com personalização de cores, tamanhos e modelos. Basta nos enviar sua ideia e faremos um orçamento exclusivo."
    },
    {
        question: "Quanto tempo leva para produzir uma peça?",
        answer: "O prazo varia conforme o tamanho e a complexidade da peça. Em média, peças pequenas ficam prontas em até 7 dias úteis, já peças maiores podem levar de 10 a 20 dias úteis."
    },
    {
        question: "Qual é o prazo de entrega?",
        answer: "O prazo depende da sua região e será informado na finalização da compra, além do tempo de produção da peça. Para pedidos realizados em Curitiba e região, podemos enviar via Uber Flash ou combinar a retirada."
    },
    {
        question: "Como devo cuidar do meu macramê?",
        answer: (
            <ul className="list-disc pl-5 space-y-1">
                <li>Evite molhar as peças.</li>
                <li>Se acumular poeira, utilize um pincel/pano macio ou aspirador de pó leve.</li>
                <li>Não exponha diretamente ao sol por longos períodos para preservar as cores.</li>
            </ul>
        )
    },
    {
        question: "Por que escolher a Caromê?",
        answer: "Na Caromê, cada peça é feita à mão, com cuidado em cada detalhe, trazendo exclusividade e autenticidade para sua decoração. Diferente das produções em massa, nossos macramês são 100% artesanais, e podem ser impermeabilizados para maior durabilidade. Nossas cavilhas de madeira são lixadas e envernizadas, o que garante acabamento refinado. Além disso, cada criação carrega o valor do feito à mão, tornando seu ambiente único, acolhedor e cheio de personalidade."
    }
];

export function FAQ() {
    return (
        <section id="faq" className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-4xl font-serif text-[#803D16] text-center mb-12 relative inline-block left-1/2 -translate-x-1/2 after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#A0845C] after:rounded">
                    Perguntas Frequentes
                </h2>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <details key={index} className="group bg-[#F7F7F7] rounded-xl overflow-hidden shadow-sm open:shadow-md transition-shadow duration-300">
                            <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-[#803D16] font-bold text-lg hover:bg-gray-50 transition-colors">
                                <span>{item.question}</span>
                                <ChevronDown className="text-[#A0845C] transition-transform duration-300 group-open:rotate-180" />
                            </summary>
                            <div className="px-5 pb-5 pt-0 text-[#713519] leading-relaxed border-t border-transparent group-open:border-[#A0845C]/10 group-open:pt-4">
                                {item.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
