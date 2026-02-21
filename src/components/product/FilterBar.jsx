import React from 'react';
import { Search } from 'lucide-react';
import { categories } from '../../data/categories';
import { cn } from '../../lib/utils';

export function FilterBar({
    currentCategory,
    onCategoryChange,
    searchTerm,
    onSearchChange,
    sortOption,
    onSortChange
}) {
    return (
        <div className="space-y-6 mb-8">
            {/* Search & Sort */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>

                <select
                    value={sortOption}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                    <option value="featured">Destaques</option>
                    <option value="lowest">Menor Preço</option>
                    <option value="highest">Maior Preço</option>
                    <option value="bestseller">Mais Vendidos</option>
                </select>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            currentCategory === cat
                                ? "bg-gray-900 text-white shadow-md transform scale-105"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
