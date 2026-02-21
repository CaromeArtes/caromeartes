import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/layout/Header';
import { Hero } from '../components/layout/Hero';
import { Footer } from '../components/layout/Footer';
import { WhatsAppButton } from '../components/layout/WhatsAppButton';
import { About } from '../components/layout/About';
import { FAQ } from '../components/layout/FAQ';
import { FilterBar } from '../components/product/FilterBar';
import { ProductCard } from '../components/product/ProductCard';
import { ProductModal } from '../components/product/ProductModal';
import { useProducts } from '../hooks/useProducts';

export function Home() {
    const { products, loading } = useProducts();
    const [currentCategory, setCurrentCategory] = useState("Todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("featured");
    const [selectedProduct, setSelectedProduct] = useState(null);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Categoria
        if (currentCategory !== "Todos") {
            result = result.filter(p => p.category === currentCategory);
        }

        // Busca
        if (searchTerm) {
            result = result.filter(p =>
                p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Ordenação
        switch (sortOption) {
            case "lowest":
                result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case "highest":
                result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case "bestseller":
                result.sort((a, b) => (b.bestSeller === a.bestSeller ? 0 : b.bestSeller ? 1 : -1));
                break;
            case "featured":
            default:
                result.sort((a, b) => (b.highlight === a.highlight ? 0 : b.highlight ? 1 : -1));
                break;
        }

        return result;
    }, [products, currentCategory, searchTerm, sortOption]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando catálogo...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Helmet>
                <title>CaromeArtes | Catálogo Têxtil e Decoração</title>
                <meta name="description" content="Catálogo exclusivo de macramê, luminárias e decoração têxtil. Peças feitas à mão com design único." />
            </Helmet>

            <Header />

            <main className="flex-1 pt-16">
                <Hero />

                <section id="catalogo" className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#803D16] mb-4">
                            Nossa Coleção
                        </h2>
                        <p className="text-[#713519] max-w-2xl mx-auto">
                            Explore nossa seleção de peças artesanais, criadas para trazer aconchego e personalidade ao seu ambiente.
                        </p>
                    </div>

                    <FilterBar
                        currentCategory={currentCategory}
                        onCategoryChange={setCurrentCategory}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        sortOption={sortOption}
                        onSortChange={setSortOption}
                    />

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onSelect={setSelectedProduct}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <p className="text-xl text-gray-500">Nenhum produto encontrado com os filtros atuais.</p>
                            <button
                                onClick={() => {
                                    setCurrentCategory("Todos");
                                    setSearchTerm("");
                                }}
                                className="mt-4 text-primary hover:underline font-medium"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}
                </section>

                <About />
                <FAQ />
            </main>

            <Footer />
            <WhatsAppButton />

            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}
