import { formatPrice } from "./utils"

export interface ExternalProduct {
    id: string | number
    name: string
    price: number
    image: string
    category: string
    source: "local" | "global"
    rating?: number
}

const DUMMY_JSON_URL = "https://dummyjson.com/products"
const FAKE_STORE_URL = "https://fakestoreapi.com/products"

export const ExternalProductEngine = {
    /**
     * Discovery logic to fetch products from global marketplaces
     */
    async discoverByCategory(categorySlug: string, limit = 10): Promise<ExternalProduct[]> {
        const results: ExternalProduct[] = []

        try {
            // 1. Fetch from DummyJSON (Primary External Source)
            // It has better category support
            const dummyRes = await fetch(`${DUMMY_JSON_URL}/category/${categorySlug}?limit=${limit}`)
            if (dummyRes.ok) {
                const data = await dummyRes.json()
                if (data.products) {
                    const mapped = data.products.map((p: any) => ({
                        id: `dj-${p.id}`,
                        name: p.title,
                        price: p.price,
                        image: p.thumbnail,
                        category: p.category,
                        source: "global",
                        rating: p.rating
                    }))
                    results.push(...mapped)
                }
            }

            // 2. Fetch from Fakestoreapi (Backup/Diversity Source)
            // If results are still low, we fetch generic ones or try to match category
            if (results.length < limit) {
                const fsRes = await fetch(`${FAKE_STORE_URL}?limit=${limit}`)
                if (fsRes.ok) {
                    const data = await fsRes.json()
                    const mapped = data.map((p: any) => ({
                        id: `fs-${p.id}`,
                        name: p.title,
                        price: p.price,
                        image: p.image,
                        category: p.category,
                        source: "global",
                        rating: p.rating?.rate
                    }))
                    // Filter by keyword if categorySlug is provided
                    const filtered = mapped.filter((p: any) => 
                        p.category.toLowerCase().includes(categorySlug.toLowerCase()) || 
                        p.name.toLowerCase().includes(categorySlug.toLowerCase())
                    )
                    results.push(...filtered)
                }
            }

        } catch (error) {
            console.error("ExternalProductEngine Error:", error)
        }

        return results.slice(0, limit)
    }
}
