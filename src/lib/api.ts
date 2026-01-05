export interface Product {
    id: number
    title: string
    description: string
    price: number
    discountPercentage: number
    rating: number
    stock: number
    brand: string
    category: string
    thumbnail: string
    images: string[]
}

export interface ProductResponse {
    products: Product[]
    total: number
    skip: number
    limit: number
}

const BASE_URL = "https://dummyjson.com"
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const res = await fetch(url, options)
    if (!res.ok) {
        if (res.status === 401) {
            if (typeof window !== 'undefined') {
                console.error("Session Expired: Redirecting to Login")
                localStorage.removeItem('auth-storage')
                document.cookie = "auth_token=; path=/; max-age=0; SameSite=Strict; Secure"
                window.location.href = '/login'
            }
            throw new Error("Session expired. Please login again.")
        }

        // Try to parse error message
        const text = await res.text()
        try {
            const json = JSON.parse(text)
            throw new Error(json.error || json.detail || res.statusText)
        } catch (e) {
            throw new Error(text || res.statusText)
        }
    }
    return res
}

export const api = {
    // Products (Backend)
    async getProducts(category?: string, limit = 20, skip = 0): Promise<ProductResponse> {
        let url = `${BACKEND_URL}/products/?limit=${limit}&offset=${skip}`
        if (category) {
            // Use strict category filter if backend supports it (it does now)
            url += `&category=${encodeURIComponent(category)}`
        }

        const res = await fetch(url)
        if (!res.ok) {
            throw new Error("Failed to fetch products")
        }
        // Backend returns ListAPIView format (array or paginated). 
        // Standard Django DRF ListAPIView with pagination returns { count, next, previous, results: [] }
        // My ProductListView sets serializer_class but assumes default pagination?
        // Let's assume standard response for now. If it returns array, we handle it.
        const data = await res.json()

        // Normalize response to match Frontend expectation { products: [] }
        let rawProducts: any[] = []
        let total = 0

        if (Array.isArray(data)) {
            rawProducts = data
            total = data.length
        } else if (data.results) {
            rawProducts = data.results
            total = data.count
        }

        const products = rawProducts.map((p: any) => {
            // Derive Price from first variant
            const price = p.variants && p.variants.length > 0
                ? parseFloat(p.variants[0].price_selling)
                : 0

            // Derive Thumbnail from images (MAIN or first)
            let thumbnail = ""
            if (p.images && p.images.length > 0) {
                const main = p.images.find((img: any) => img.image_type === 'MAIN')
                thumbnail = main ? main.url : p.images[0].url
            }

            // Derive Category string
            let category = "Unknown"
            if (p.category) {
                if (typeof p.category === 'string') category = p.category
                else if (p.category.level3) category = p.category.level3
                else if (p.category.level2) category = p.category.level2
            }

            return {
                id: p.id,
                title: p.name,
                description: p.description_short,
                price: price,
                discountPercentage: 0, // Backend doesn't return this yet on root, ignore
                rating: p.rating_average,
                stock: 100, // Dummy or sum(variants)
                brand: p.brand,
                category: category,
                thumbnail: thumbnail,
                images: p.images ? p.images.map((i: any) => i.url) : []
            }
        })

        return { products, total, skip, limit }
    },

    async getCategories(): Promise<string[]> {
        const res = await fetch(`${BASE_URL}/products/categories`)
        if (!res.ok) {
            throw new Error("Failed to fetch categories")
        }
        const data = await res.json()
        return data.map((c: any) => c.slug)
    },

    async searchProducts(query: string): Promise<ProductResponse> {
        const res = await fetch(`${BASE_URL}/products/search?q=${query}`)
        if (!res.ok) {
            throw new Error("Failed to search products")
        }
        return res.json()
    },

    async getProduct(id: string): Promise<any> {
        const res = await fetch(`${BACKEND_URL}/products/${id}/`)
        if (!res.ok) {
            throw new Error("Failed to fetch product")
        }
        return res.json()
    },

    async getProductBySlug(slug: string): Promise<any> {
        const res = await fetch(`${BACKEND_URL}/products/${slug}/`)
        if (!res.ok) {
            throw new Error("Failed to fetch product")
        }
        return res.json()
    },

    // Auth & User (Django Backend)
    async login(credentials: any) {
        const res = await fetch(`${BACKEND_URL}/users/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        })
        if (!res.ok) throw new Error('Login failed')
        return res.json()
    },

    async signup(data: any) {
        const res = await fetch(`${BACKEND_URL}/users/auth/signup/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            const errorMessage = Object.values(errorData).flat().join(', ') || 'Signup failed'
            throw new Error(errorMessage)
        }
        return res.json()
    },

    // Seller Auth
    async sellerLogin(credentials: any) {
        const res = await fetch(`${BACKEND_URL}/sellers/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        })
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.error || 'Login failed')
        }
        return res.json()
    },

    async sellerSignup(data: any) {
        const res = await fetch(`${BACKEND_URL}/sellers/auth/signup/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.error || 'Signup failed')
        }
        return res.json()
    },

    async sendSellerOTP(data: { email?: string, phone_number?: string }) {
        const res = await fetch(`${BACKEND_URL}/sellers/auth/send-otp/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.error || 'Failed to send OTP')
        }
        return res.json()
    },

    async getProfile(token: string) {
        const res = await fetchWithAuth(`${BACKEND_URL}/users/profile/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return res.json()
    },

    async getDashboardStats(token: string) {
        const res = await fetchWithAuth(`${BACKEND_URL}/users/dashboard/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return res.json()
    },

    async updateProfile(token: string, data: any) {
        const res = await fetchWithAuth(`${BACKEND_URL}/users/profile/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
        return res.json()
    },

    async deleteAccount(token: string) {
        const res = await fetch(`${BACKEND_URL}/users/profile/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        if (!res.ok) throw new Error('Failed to delete account')
        return true // 204 No Content usually returns bodyless
    },

    async getAddresses(token: string) {
        const res = await fetch(`${BACKEND_URL}/users/addresses/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
            console.error(`getAddresses Failed: ${res.status} ${res.statusText}`)

            if (res.status === 401) {
                // Auto-logout if token is invalid
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth-storage')
                    window.location.href = '/login'
                }
                throw new Error("Session expired. Please login again.")
            }

            const text = await res.text()
            console.error("Response body:", text)
            throw new Error(`Failed to fetch addresses: ${res.status} ${res.statusText}`)
        }
        const data = await res.json()
        return Array.isArray(data) ? data : (data.results || [])
    },

    async addAddress(token: string, data: any) {
        const res = await fetch(`${BACKEND_URL}/users/addresses/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            console.error(`addAddress Failed: ${res.status} ${res.statusText}`)

            if (res.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth-storage')
                    window.location.href = '/login'
                }
                throw new Error("Session expired")
            }

            const text = await res.text()
            console.error("Response body:", text)
            throw new Error(`Failed to add address: ${text || res.statusText}`)
        }
        return res.json()
    },

    async updateAddress(token: string, id: number, data: any) {
        const res = await fetch(`${BACKEND_URL}/users/addresses/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Failed to update address')
        return res.json()
    },

    async deleteAddress(token: string, id: number) {
        const res = await fetch(`${BACKEND_URL}/users/addresses/${id}/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        if (!res.ok) throw new Error('Failed to delete address')
        return true
    },

    async sendOtp(data: { email?: string; phone_number?: string }) {
        const res = await fetch(`${BACKEND_URL}/users/auth/otp/send/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Failed to send OTP')
        return res.json()
    },

    async sendSignupOtp(data: { email: string }) {
        const res = await fetch(`${BACKEND_URL}/users/auth/signup/otp/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.error || 'Failed to send OTP')
        }
        return res.json()
    },

    async verifyOtp(data: { email?: string; phone_number?: string; otp: string }) {
        const res = await fetch(`${BACKEND_URL}/users/auth/otp/verify/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Invalid OTP')
        return res.json()
    },

    async googleLogin(token: string) {
        const res = await fetch(`${BACKEND_URL}/users/auth/google/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        })
        if (!res.ok) {
            const errorText = await res.text()
            console.error("Google Login Backend Error:", errorText)
            try {
                const errorJson = JSON.parse(errorText)
                throw new Error(errorJson.error || 'Google login failed')
            } catch (e) {
                throw new Error(`Google login failed: ${res.status} ${res.statusText}`)
            }
        }
        return res.json()
    },

    async forgotPassword(email: string) {
        const res = await fetch(`${BACKEND_URL}/users/auth/forgot-password/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })
        if (!res.ok) throw new Error('Failed to process request')
        return res.json()
    },

    async resetPassword(data: any) {
        const res = await fetch(`${BACKEND_URL}/users/auth/reset-password/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            console.error("Reset Password Error:", errorData)
            // Handle serializer errors (which might be an object of arrays)
            if (typeof errorData === 'object' && !errorData.error && !errorData.message) {
                // Convert field errors to string
                const msg = Object.entries(errorData).map(([k, v]) => `${k}: ${v}`).join(', ')
                throw new Error(msg || 'Failed to reset password')
            }
            throw new Error(errorData.error || errorData.message || 'Failed to reset password')
        }
        return res.json()
    },

    // Orders
    async createOrder(token: string, data: any) {
        const res = await fetch(`${BACKEND_URL}/orders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Failed to create order')
        return res.json()
    },

    async getOrders(token: string) {
        const res = await fetchWithAuth(`${BACKEND_URL}/orders/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        return Array.isArray(data) ? data : (data.results || [])
    },

    async getOrder(token: string, id: string) {
        const res = await fetchWithAuth(`${BACKEND_URL}/orders/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return res.json()
    },

    async cancelOrder(token: string, orderId: string) {
        const res = await fetch(`${BACKEND_URL}/orders/${orderId}/cancel/`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || 'Failed to cancel order')
        }
        return res.json()
    },

    async createRazorpayOrder(token: string, data: any) {
        const res = await fetch(`${BACKEND_URL}/razorpay/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const text = await res.text()
            console.error("createRazorpayOrder Failed:", text)
            if (res.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth-storage')
                    window.location.href = '/login'
                }
                throw new Error("Session expired")
            }
            try {
                const json = JSON.parse(text)
                throw new Error(json.error || 'Failed to create Razorpay order')
            } catch (e) {
                throw new Error(`Failed to create Razorpay order: ${res.statusText}`)
            }
        }
        return res.json()
    },

    async verifyPayment(token: string, data: any) {
        const res = await fetch(`${BACKEND_URL}/razorpay/verify/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const errorText = await res.text()
            console.error("Verify Payment Error Response:", errorText)
            throw new Error(`Payment verification failed: ${errorText}`)
        }
        return res.json()
    },

    async submitReview(token: string, productId: number, data: { rating: number, comment: string }) {
        const res = await fetch(`${BACKEND_URL}/products/${productId}/reviews/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}))
            console.error("Submit Review Error:", errData)
            throw new Error(errData.detail || JSON.stringify(errData) || 'Failed to submit review')
        }
        return res.json()
    },

    async downloadInvoice(token: string, orderId: string) {
        const res = await fetch(`${BACKEND_URL}/orders/${orderId}/invoice/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to download invoice')
        return res.blob()
    },

    async syncCart(token: string, items: any[]) {
        const res = await fetch(`${BACKEND_URL}/orders/cart/sync/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ items })
        })
        if (!res.ok) throw new Error('Failed to sync cart')
        return res.json()
    },

    // Contact
    async sendMessage(data: { name: string; email: string; subject: string; message: string }) {
        const res = await fetch(`${BACKEND_URL}/users/contact/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Failed to send message')
        return res.json()
    },

    // Careers
    async applyForJob(formData: FormData) {
        // Content-Type is set automatically for FormData
        const res = await fetch(`${BACKEND_URL}/users/careers/apply/`, {
            method: 'POST',
            body: formData,
        })
        if (!res.ok) throw new Error('Failed to submit application')
        return res.json()
    },

    // Wishlist
    async getWishlist(token: string) {
        const res = await fetch(`${BACKEND_URL}/wishlist/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
            console.error(`getWishlist Failed: ${res.status} ${res.statusText}`)
            if (res.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth-storage')
                    window.location.href = '/login'
                }
                throw new Error("Session expired")
            }
            throw new Error('Failed to fetch wishlist')
        }
        const data = await res.json()
        return Array.isArray(data) ? data : (data.results || [])
    },

    async addToWishlist(token: string, product: any) {
        const payload = {
            product_id: product.id,
            product_name: product.title,
            product_image: product.thumbnail,
            product_price: product.price
        }
        const res = await fetch(`${BACKEND_URL}/wishlist/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        })
        if (!res.ok) {
            const text = await res.text()
            console.error("addToWishlist Failed:", text)
            try {
                const err = JSON.parse(text)
                throw new Error(err.detail || JSON.stringify(err))
            } catch (e) {
                throw new Error(`Failed to add to wishlist: ${res.statusText}`)
            }
        }
        return res.json()
    },

    async removeFromWishlist(token: string, productId: number) {
        const res = await fetch(`${BACKEND_URL}/wishlist/${productId}/`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to remove from wishlist')
        return true
    },

    // Notifications
    async getNotifications(token: string) {
        const res = await fetch(`${BACKEND_URL}/users/notifications/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
            if (res.status === 401) {
                if (typeof window !== 'undefined') localStorage.removeItem('auth-storage') // Silent fail for notifs/wishlist on 401 to avoid redirect loop if feasible? 
                // Actually redirect is fine, but maybe aggressive.
                // Let's stick to the pattern.
                if (typeof window !== 'undefined') {
                    window.location.href = '/login'
                }
                throw new Error("Session expired")
            }
            throw new Error('Failed to fetch notifications')
        }
        return res.json()
    },

    async markNotificationRead(token: string, id: number) {
        const res = await fetch(`${BACKEND_URL}/users/notifications/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id }),
        })
        if (!res.ok) throw new Error('Failed to mark read')
        return res.json()
    },

    async markAllNotificationsRead(token: string) {
        const res = await fetch(`${BACKEND_URL}/users/notifications/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ mark_all_read: true }),
        })
        if (!res.ok) throw new Error('Failed to mark all read')
        return res.json()
    },

    // 🧠 AI/ML Analytics (Observer)
    async trackEvent(data: { interaction_type: string, product_id?: string | number, metadata?: any, session_id?: string }, token?: string) {
        const headers: any = { 'Content-Type': 'application/json' }
        if (token) headers['Authorization'] = `Bearer ${token}`

        // Silent fail is preferred for analytics to not block UI
        try {
            await fetch(`${BACKEND_URL}/analytics/track/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
            })
        } catch (e) {
            console.warn("Analytics tracking failed:", e)
        }
    },

    async getHistory(session_id?: string, token?: string) {
        let url = `${BACKEND_URL}/analytics/history/`
        if (session_id) url += `?session_id=${session_id}`

        const headers: any = {}
        if (token) headers['Authorization'] = `Bearer ${token}`

        const res = await fetch(url, { headers })
        if (!res.ok) return []
        return res.json()
    },

    async getInspiredProducts(session_id?: string, token?: string) {
        let url = `${BACKEND_URL}/analytics/inspired/`
        if (session_id) url += `?session_id=${session_id}`

        const headers: any = {}
        if (token) headers['Authorization'] = `Bearer ${token}`

        const res = await fetch(url, { headers })
        if (!res.ok) return { term: "", products: [] }
        return res.json()
    },

    async askStylist(message: string, session_id?: string, token?: string) {
        const url = `${BACKEND_URL}/analytics/stylist/`
        const headers: any = { "Content-Type": "application/json" }
        if (token) headers['Authorization'] = `Bearer ${token}`

        const body = JSON.stringify({ message, session_id })

        try {
            const res = await fetch(url, { method: 'POST', headers, body })
            if (!res.ok) throw new Error("Agent busy")
            return res.json()
        } catch (e) {
            console.error("Agent error", e)
            return { type: "text", response: "I'm having a little trouble connecting to my fashion brain. Try again?" }
        }
    },

    async getLoyaltyDashboard(token: string) {
        const url = `${BACKEND_URL}/loyalty/dashboard/`
        const headers: any = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }

        const res = await fetch(url, { headers })
        if (!res.ok) throw new Error("Failed to fetch loyalty data")
        return res.json()
    },

    async validateGiftCard(token: string, code: string) {
        const res = await fetch(`${BACKEND_URL}/giftcards/validate/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${token}` // Optional if we allowed public check
            },
            body: JSON.stringify({ code })
        })
        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || "Invalid Gift Card")
        }
        return res.json()
    },

    // --- ADMIN PANEL ---
    // --- ADMIN PANEL ---
    async getAdminStats(token: string) {
        return fetchWithAuth(`${BACKEND_URL}/admin-panel/dashboard/stats/`, {
            // headers: { Authorization: `Bearer ${token}` } // Disabled for public demo
        }).then(res => res.json())
    },

    async getAdminActivity(token: string) {
        return fetchWithAuth(`${BACKEND_URL}/admin-panel/dashboard/activity/`, {
            // headers: { Authorization: `Bearer ${token}` } // Disabled for public demo
        }).then(res => res.json())
    },

    async getUsers(token: string, params: any = {}) {
        const qs = new URLSearchParams(params).toString()
        return fetchWithAuth(`${BACKEND_URL}/admin-panel/users/?${qs}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.json())
    },

    async getSellers(token: string, params: any = {}) {
        const qs = new URLSearchParams(params).toString()
        return fetchWithAuth(`${BACKEND_URL}/admin-panel/sellers/?${qs}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.json())
    },

    async verifySeller(token: string, sellerId: number, status: 'VERIFIED' | 'REJECTED') {
        const res = await fetchWithAuth(`${BACKEND_URL}/admin-panel/sellers/${sellerId}/`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ verification_status: status })
        })
        return res.json()
    },

    async manageUser(token: string, userId: number, action: 'ban' | 'activate') {
        const isActive = action === 'activate'
        const res = await fetchWithAuth(`${BACKEND_URL}/admin-panel/users/${userId}/`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_active: isActive })
        })
        return res.json()
    }
}

// Export standalone functions for backward compatibility if needed, 
// but ideally we should migrate everything to use `api.method()`
export const getProducts = api.getProducts
export const getCategories = api.getCategories
export const searchProducts = api.searchProducts
export const getProduct = api.getProduct
