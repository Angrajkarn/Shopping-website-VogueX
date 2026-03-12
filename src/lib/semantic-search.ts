/**
 * Semantic Intent Search Engine
 * Maps natural language "vibes" and intents to product filters/queries.
 * Real-world sites use Vector DBs (Pinecone/Milvus), but this implements
 * a heuristic-based semantic mapping for instant frontend response.
 */

interface SearchIntent {
    category?: string
    query?: string
    vibe: string
}

const SEMANTIC_MAP: Record<string, SearchIntent> = {
    "beach party": { category: "womens-dresses", query: "floral summer maxi", vibe: "🏖️ Tropical Vibes" },
    "summer vibes": { category: "womens-dresses", query: "summer", vibe: "☀️ Summer Collection" },
    "boss energy": { category: "womens-watches", query: "luxury gold", vibe: "💼 Professional Edge" },
    "workout": { category: "mens-shoes", query: "running", vibe: "💪 Athletic Performance" },
    "night out": { category: "womens-dresses", query: "party evening", vibe: "🌙 Evening Elegance" },
    "minimalist": { category: "mens-shirts", query: "white plain cotton", vibe: "⚪ Clean Aesthetic" },
    "vintage": { category: "sunglasses", query: "retro classic", vibe: "🕶️ Timeless Style" },
    "winter": { category: "mens-shirts", query: "winter warm sweater jacket", vibe: "❄️ Winter Warmth" },
    "date night": { category: "fragrances", query: "romantic", vibe: "❤️ Romantic Notes" }
}

export const semanticSearch = {
    /**
     * Attempts to find a semantic match for the user's query.
     */
    findIntent(query: string): SearchIntent | null {
        const q = query.toLowerCase().trim()
        
        for (const [key, intent] of Object.entries(SEMANTIC_MAP)) {
            if (q.includes(key) || key.includes(q)) {
                return intent
            }
        }
        
        return null
    },

    /**
     * Get all vibe keywords for suggestions
     */
    getVibeKeywords(): string[] {
        return Object.keys(SEMANTIC_MAP)
    }
}
