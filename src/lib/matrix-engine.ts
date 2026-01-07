import { api } from "./api"

/**
 * Matrix Engine: Client-Side collaborative filtering.
 * Simulates a database of users to find "Nearest Neighbors".
 */

// A User History is just an array of Product IDs they have interacted with
type UserHistory = string[]

// Mock Database of "Archetype" Users
// These represent patterns we expect to see
const MOCK_USER_DATABASE: Record<string, UserHistory> = {
    // 1. The "Tech Enthusiast" (Laptops, Phones, Accessories)
    "user_tech_1": ["smartphones", "laptops", "1", "2", "5", "10"], 
    "user_tech_2": ["smartphones", "1", "12", "15", "9"],
    "user_tech_3": ["laptops", "5", "8", "2", "30"],

    // 2. The "Fashionista" (Dresses, Shoes, Bags)
    "user_fashion_1": ["womens-dresses", "womens-shoes", "40", "45", "50", "33"],
    "user_fashion_2": ["womens-dresses", "tops", "40", "42", "55"],
    "user_fashion_3": ["womens-shoes", "50", "51", "52", "45"],

    // 3. The "Hypebeast" (Sneakers, Streetwear)
    "user_hype_1": ["mens-shoes", "mens-shirts", "60", "65", "70", "12"],
    "user_hype_2": ["mens-shoes", "60", "61", "65"],

    // 4. The "Home Decorator"
    "user_home_1": ["furniture", "home-decoration", "80", "85", "90"],
    "user_home_2": ["home-decoration", "90", "91", "92"],

    // 5. The "Beauty Guru"
    "user_beauty_1": ["skincare", "fragrances", "20", "25", "28"],
    "user_beauty_2": ["skincare", "20", "21", "22", "19"]
}

class MatrixEngine {
    
    /**
     * Calculate Jaccard Similarity between two sets of items
     * J(A,B) = |A ∩ B| / |A ∪ B|
     */
    private calculateSimilarity(userA: UserHistory, userB: UserHistory): number {
        const setA = new Set(userA)
        const setB = new Set(userB)
        
        const intersection = new Set([...setA].filter(x => setB.has(x)))
        const union = new Set([...setA, ...setB])

        if (union.size === 0) return 0
        return intersection.size / union.size
    }

    /**
     * Get Recommendation based on Current User's History
     */
    async getRecommendations(currentHistory: string[]): Promise<any[]> {
        if (currentHistory.length === 0) return []

        console.log("🧠 Matrix: Analyzing User History...", currentHistory)

        // 1. Find Nearest Neighbors
        const scores = Object.entries(MOCK_USER_DATABASE).map(([userId, history]) => {
            const score = this.calculateSimilarity(currentHistory, history)
            return { userId, score, history }
        })

        // Sort by similarity
        scores.sort((a, b) => b.score - a.score)
        
        const topNeighbors = scores.slice(0, 3)
        console.log("🧠 Matrix: Found Soulmates:", topNeighbors.map(n => n.userId))

        // 2. Aggregate Recommendations
        const candidates = new Set<string>()
        const currentSet = new Set(currentHistory)

        topNeighbors.forEach(neighbor => {
            if (neighbor.score > 0) { // Only if there is ANY similarity
                neighbor.history.forEach(itemId => {
                    // Recommend items the neighbor likes that YOU haven't seen strings like 'smartphones' are categories, ignore them for product IDs (assuming IDs are numeric-ish strings)
                    // Simple check: if it looks like a number, it's a product
                    if (!currentSet.has(itemId) && !isNaN(Number(itemId))) {
                        candidates.add(itemId)
                    }
                })
            }
        })

        if (candidates.size === 0) {
            console.log("🧠 Matrix: No specific collab matches, falling back...")
            return [] 
        }

        // 3. Convert IDs to Products
        // In a real app we'd fetch these IDs. For this demo, we'll try to fetch them.
        const productIds = Array.from(candidates).slice(0, 4) // Limit to 4
        
        const products = await Promise.all(productIds.map(async (id) => {
            try {
                return await api.getProduct(id)
            } catch (e) {
                return null
            }
        }))

        return products.filter(Boolean)
    }
}

export const matrixEngine = new MatrixEngine()
