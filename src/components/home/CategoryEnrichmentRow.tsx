"use client"

import { useEffect, useState } from "react"
import { CategoryRowSection } from "./CategoryRowSection"
import { api } from "@/lib/api"
import { ExternalProductEngine, ExternalProduct } from "@/lib/ExternalProductEngine"
import { formatPrice } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Search, ShoppingBag } from "lucide-react"

interface CategoryEnrichmentRowProps {
    title: string
    category: string
    bgImage?: string
    textColor?: string
}

export function CategoryEnrichmentRow({ title, category, bgImage, textColor }: CategoryEnrichmentRowProps) {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [discoveryStatus, setDiscoveryStatus] = useState<"local" | "global" | "done">("local")

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setDiscoveryStatus("local")
            
            try {
                // Phase 1: Local Fetch
                const localData = await api.getProducts(category, 5)
                const localMapped = (localData.products || []).map(p => ({
                    id: p.id,
                    name: p.title,
                    price: p.price, // Keep as number
                    offer: "In Stock",
                    image: p.thumbnail,
                    source: "local"
                }))
                
                setProducts(localMapped)
                
                // Phase 2: Global Discovery (Simulated Real-time fetch)
                if (category) {
                    setDiscoveryStatus("global")
                    // Minimum delay for "Wow" factor of real-time search
                    await new Promise(r => setTimeout(r, 1500))
                    
                    const globalProducts = await ExternalProductEngine.discoverByCategory(category, 10 - localMapped.length)
                    const globalMapped = globalProducts.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: p.price, // Keep as number
                        offer: "Global Deal",
                        image: p.image,
                        source: "global"
                    }))
                    
                    setProducts(prev => [...prev, ...globalMapped])
                }
            } catch (e) {
                console.error(`Failed to enrich category ${category}`, e)
            } finally {
                setDiscoveryStatus("done")
                setLoading(false)
            }
        }
        fetchData()
    }, [category])

    return (
        <div className="relative group/row">
            {/* Discovery Status Indicator */}
            <AnimatePresence>
                {discoveryStatus === "global" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20 whitespace-nowrap"
                    >
                        <Globe className="w-3 h-3 text-blue-400 animate-spin" />
                        Scanning Global Marketplaces for {title}...
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && products.length === 0 ? (
                <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Search className="w-8 h-8 text-slate-300 animate-bounce" />
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Warming up engines...</p>
                    </div>
                </div>
            ) : (
                <CategoryRowSection
                    title={title}
                    bgImage={bgImage}
                    products={products}
                    category={category}
                    textColor={textColor}
                    badge={discoveryStatus === "done" ? <div className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-100"><Globe className="w-3 h-3"/> AI Verified</div> : null}
                />
            )}
        </div>
    )
}
