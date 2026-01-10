'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ProductCard } from '../product/ProductCard';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function RecommendedForYou() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchRecommendations();
    }, [user]);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const data = await api.getPersonalizedRecommendations(4);
            setProducts(data);
        } catch (error) {
            console.error("Failed to load recommendations", error);
        } finally {
            setLoading(false);
        }
    };

    if (!loading && products.length === 0) return null;

    return (
        <section className="py-12 bg-gradient-to-r from-violet-50/50 to-fuchsia-50/50 dark:from-violet-950/10 dark:to-fuchsia-950/10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                            {user ? `Selected for You, ${user.first_name}` : 'Recommended For You'}
                        </h2>
                    </div>
                    <button
                        onClick={fetchRecommendations}
                        className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors"
                        title="Refresh Recommendations"
                    >
                        <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
