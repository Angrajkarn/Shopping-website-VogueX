"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { ProductGallery } from "@/components/product/ProductGallery"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Star, ShieldCheck, MapPin, AlertCircle, Zap, CornerUpRight } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { toast } from "sonner"
import { RelatedProducts } from "@/components/product/RelatedProducts"
import { ProductBundle } from "@/components/product/ProductBundle"
import { useAnalytics } from "@/hooks/useAnalytics"
import { usePageTracking } from "@/hooks/usePageTracking"
import { StickyCartBar } from "@/components/product/StickyCartBar"

// Types matching backend response
interface ProductVariant {
    id: number
    sku: string
    attributes: Record<string, string>
    price_selling: string
    price_mrp: string
    inventory: {
        stock_status: string
        available_stock: number
    }
}

interface ProductDetail {
    id: number
    name: string
    description_long: string
    description_short: string
    rating_average: number
    rating_count: number
    images: { id: number; url: string; image_type: string }[]
    variants: ProductVariant[]
    brand: string
    category: any // Can be string or object
    reviews: {
        id: number
        user_name: string
        rating: number
        comment: string
        created_at: string
    }[]
}

export default function ProductPage() {
    const params = useParams()
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id

    const { addItem } = useCartStore()
    const [product, setProduct] = useState<ProductDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Selection State
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})

    // Pincode State
    const [pincode, setPincode] = useState("")
    const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null)

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return
            try {
                const data = await api.getProduct(id)
                setProduct(data)

                // Default to first variant
                if (data.variants && data.variants.length > 0) {
                    const first = data.variants[0]
                    setSelectedVariant(first)
                    setSelectedAttributes(first.attributes)
                }
            } catch (err) {
                setError("Failed to load product")
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    // Find valid variant when attributes change
    const handleAttributeSelect = (key: string, value: string) => {
        const newAttrs = { ...selectedAttributes, [key]: value }
        setSelectedAttributes(newAttrs)

        // Try to find exact match
        const match = product?.variants.find(v => {
            return Object.entries(newAttrs).every(([k, val]) => {
                // Handle potetial number/string mismatch in attributes if backend sends numbers
                return String(v.attributes[k]) === String(val)
            })
        })

        if (match) setSelectedVariant(match)
    }

    const router = useRouter()
    const { isAuthenticated } = useAuthStore()
    const { track } = useAnalytics()

    useEffect(() => {
        if (product) {
            track('VIEW', {
                product_id: product.id,
                metadata: {
                    title: product.name,
                    price: parseFloat(product.variants[0]?.price_selling || "0"),
                    image: product.images[0]?.url,
                    category: typeof product.category === 'string' ? product.category : product.category?.name
                }
            })
        }
    }, [product?.id])

    // Advanced Page Tracking (Time & Scroll)
    usePageTracking(product?.id, {
        category: typeof product?.category === 'string' ? product.category : product?.category?.name,
        brand: product?.brand
    })

    const handleAddToCart = (silent = false) => {
        if (!product || !selectedVariant) return

        addItem({
            id: selectedVariant.id.toString(),
            name: `${product.name} (${Object.values(selectedVariant.attributes).join(' ')})`,
            price: parseFloat(selectedVariant.price_selling),
            image: product.images[0]?.url || "",
            quantity: 1,
            size: selectedVariant.attributes['storage'] || selectedVariant.attributes['size'] || 'N/A',
            color: selectedVariant.attributes['color'] || 'N/A'
        }, silent)
        if (!silent) toast.success("Added to cart!")
    }

    const handleBuyNow = () => {
        if (!product || !selectedVariant) return

        // 1. Add to cart SILENTLY (so drawer doesn't open)
        handleAddToCart(true)

        // 2. Check Auth and Redirect
        if (isAuthenticated) {
            router.push('/checkout')
        } else {
            router.push('/login?redirect=/checkout')
        }
    }

    // Extract all unique attribute keys and values from variants
    const getAttributeOptions = () => {
        if (!product) return {}
        const options: Record<string, Set<string>> = {}
        product.variants.forEach(v => {
            Object.entries(v.attributes).forEach(([key, val]) => {
                if (key === 'color_hex') return // Skip hex codes for display logic
                if (!options[key]) options[key] = new Set()
                options[key].add(val)
            })
        })
        return options
    }

    const checkDelivery = () => {
        // Mock delivery check (In real world, call API with variant ID + Pincode)
        if (pincode.length === 6) {
            setDeliveryStatus("Available in 2 Days")
        } else {
            setDeliveryStatus("Invalid Pincode")
        }
    }

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
    if (error || !product) return <div className="h-screen flex items-center justify-center text-red-500">Product not found</div>

    const attributeOptions = getAttributeOptions()
    const discount = selectedVariant
        ? Math.round(((parseFloat(selectedVariant.price_mrp) - parseFloat(selectedVariant.price_selling)) / parseFloat(selectedVariant.price_mrp)) * 100)
        : 0

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Gallery */}
                <ProductGallery images={product.images} />

                {/* Right: Info */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold">{product.name}</h1>
                                <p className="text-muted-foreground mt-1">{product.description_short}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => {
                                        const shareData = {
                                            title: product.name,
                                            text: `Check out ${product.name} on VogueX!`,
                                            url: window.location.href
                                        }
                                        if (navigator.share) {
                                            navigator.share(shareData).catch(console.error)
                                        } else {
                                            navigator.clipboard.writeText(window.location.href)
                                            toast.success("Link copied to clipboard")
                                        }
                                    }}
                                >
                                    <CornerUpRight className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">{product.rating_average} ★</Badge>
                            <span className="text-sm text-gray-500">{product.rating_count} Ratings</span>
                        </div>
                    </div>

                    {/* Price Block */}
                    {selectedVariant && (
                        <div className="bg-gray-50 p-4 rounded-xl border">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold">₹{parseFloat(selectedVariant.price_selling).toLocaleString()}</span>
                                <span className="text-lg text-gray-400 line-through">₹{parseFloat(selectedVariant.price_mrp).toLocaleString()}</span>
                                <span className="text-green-600 font-bold">{discount}% OFF</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                        </div>
                    )}

                    {/* Variants */}
                    <div className="space-y-4">
                        {Object.entries(attributeOptions).map(([key, values]) => (
                            <div key={key}>
                                <label className="text-sm font-medium capitalize mb-2 block">{key}</label>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(values).map(val => {
                                        const isSelected = selectedAttributes[key] === val
                                        // Specific logic for Color swatches if needed, simplified here to chips
                                        return (
                                            <button
                                                key={val}
                                                onClick={() => handleAttributeSelect(key, val)}
                                                className={`px-4 py-2 rounded-lg border text-sm transition-all ${isSelected
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "hover:border-primary/50 bg-white"
                                                    }`}
                                            >
                                                {val}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Inventory Status */}
                    {selectedVariant && (
                        <div className="flex items-center gap-2 text-sm">
                            {selectedVariant.inventory.available_stock < 10 ? (
                                <span className="text-red-600 font-bold animate-pulse flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    Hurry! Only {selectedVariant.inventory.available_stock} left!
                                </span>
                            ) : (
                                <span className="text-green-600 flex items-center gap-1">
                                    <ShieldCheck className="h-4 w-4" />
                                    In Stock
                                </span>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button size="lg" className="flex-1 h-14 text-lg" onClick={handleBuyNow}>
                            <Zap className="h-5 w-5 mr-2" />
                            Buy Now
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 text-lg" onClick={() => handleAddToCart(false)}>
                            Add to Cart
                        </Button>
                    </div>

                    {/* Delivery */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            Delivery Availability
                        </h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                maxLength={6}
                                className="border rounded-md px-3 py-2 w-full max-w-[200px]"
                            />
                            <Button variant="secondary" onClick={checkDelivery}>Check</Button>
                        </div>
                        {deliveryStatus && (
                            <p className="text-sm mt-2 text-blue-800 font-medium">{deliveryStatus}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="prose text-gray-600">
                        <h3 className="text-lg font-bold text-gray-900">Description</h3>
                        <p className="whitespace-pre-line leading-relaxed">{product.description_long}</p>
                    </div>

                    {/* Bundle & Save */}
                    {product && selectedVariant && (
                        <ProductBundle
                            mainProduct={{
                                id: product.id,
                                name: product.name,
                                price: parseFloat(selectedVariant.price_selling),
                                image: product.images[0]?.url,
                                category: product.category
                            }}
                        />
                    )}

                    {/* Reviews Section */}
                    <div className="border-t pt-8 mt-8">
                        <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>

                        {product.reviews && product.reviews.length > 0 ? (
                            <div className="space-y-6">
                                {product.reviews.map((review) => (
                                    <div key={review.id} className="border-b pb-6 last:border-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-bold flex items-center gap-1">
                                                {review.rating} <Star className="w-3 h-3 fill-current" />
                                            </div>
                                            <span className="font-semibold">{review.user_name || "Anonymous"}</span>
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                        <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                            </div>
                        )}
                    </div>


                </div>
            </div>

            {/* Similar Products (Full Width) */}
            {product && (
                <div className="mt-16">
                    <RelatedProducts
                        type="similar"
                        categoryId={
                            typeof product.category === 'string'
                                ? product.category
                                : (product.category?.slug || product.category?.name || product.category?.level3 || undefined)
                        }
                        currentProductId={product.id}
                    />
                </div>
            )}

            {/* Recommended For You (History) */}
            <div className="mt-16">
                <RelatedProducts type="history" />
            </div>

            {/* Sticky Add to Cart Bar */}
            {product && selectedVariant && (
                <StickyCartBar
                    productName={product.name}
                    productPrice={parseFloat(selectedVariant.price_selling)}
                    productImage={product.images[0]?.url || ""}
                    onAddToCart={() => handleAddToCart(false)}
                />
            )}
        </div>
    )
}
