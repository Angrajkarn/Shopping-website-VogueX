"use client"


import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Loader2, Download, ShieldCheck, Mail, Star, MessageCircle, Share2, XCircle, Copy, Twitter } from "lucide-react"
import { toast } from "sonner"
import { OrderTracker } from "@/components/orders/OrderTracker"
import { OrderSupportChat } from "@/components/orders/OrderSupportChat"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function OrderDetailsPage() {
    const { token, isAuthenticated, user } = useAuthStore()
    const router = useRouter()
    const params = useParams()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isChatOpen, setIsChatOpen] = useState(false)

    useEffect(() => {
        if (!isAuthenticated || !token) {
            router.push("/login")
            return
        }

        const fetchOrder = async () => {
            try {
                const orderId = Array.isArray(params.id) ? params.id[0] : params.id
                if (!orderId) return

                const res = await api.getOrder(token, orderId)
                setOrder(res)
            } catch (err: any) {
                console.error("Failed to load order", err)
                setError("Failed to load order details.")
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [isAuthenticated, token, params.id, router])

    const handleCancelOrder = async () => {
        if (confirm("Are you sure you want to cancel this order?")) {
            try {
                if (!token || !order) return
                await api.cancelOrder(token, order.order_id)

                toast.success("Order Cancelled Successfully")
                // Real-time update
                setOrder((prev: any) => ({ ...prev, status: 'Cancelled' }))
            } catch (err: any) {
                toast.error(err.message || "Failed to cancel order")
            }
        }
    }

    const handleChatSupport = () => {
        setIsChatOpen(true)
    }

    const [isShareOpen, setIsShareOpen] = useState(false)

    const handleShare = async () => {
        const shareData = {
            title: `Order #${order.order_id}`,
            text: `Check out my order on VogueX!`,
            url: window.location.href
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                // If user cancels or fails, fallback to modal
                setIsShareOpen(true)
            }
        } else {
            setIsShareOpen(true)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard")
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareText = `Check out my order #${order?.order_id} on VogueX!`

    // ... state for review
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")

    const handleRatingClick = (value: number) => {
        setRating(value)
        setIsReviewOpen(true)
    }

    const handleDownloadInvoice = async () => {
        try {
            toast.loading("Generating Invoice...")
            const blob = await api.downloadInvoice(token!, order.order_id)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `Invoice-${order.order_id}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.dismiss()
            toast.success("Invoice Downloaded")
        } catch (err) {
            toast.dismiss()
            toast.error("Failed to download invoice")
        }
    }

    const submitReview = async () => {
        if (rating === 0) {
            toast.error("Please select a star rating")
            return
        }
        if (!comment.trim()) {
            toast.error("Please write a comment then submit")
            return
        }

        try {
            if (!token || !mainItem) return
            const productId = mainItem.product_id

            await api.submitReview(token, productId, { rating, comment })
            toast.success("Review Submitted!")
            setIsReviewOpen(false)
        } catch (err: any) {
            toast.error(err.message || "Failed to submit review")
        }
    }

    if (loading) {
        return <div className="flex justify-center py-20 min-h-screen bg-gray-100"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
    }

    if (error || !order) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 mb-4">{error || "Order not found"}</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    // Main Item for display
    const mainItem = order.items && order.items.length > 0 ? order.items[0] : null





    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Share Modal */}
            <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share Order</DialogTitle>
                        <DialogDescription>
                            Share your order details with friends and family.
                        </DialogDescription>
                    </DialogHeader>
                    {/* ... (Keep existing share content) ... */}
                    <div className="flex items-center space-x-2 py-4">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                            <Input
                                id="link"
                                defaultValue={shareUrl}
                                readOnly
                                className="h-9"
                            />
                        </div>
                        <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
                            <span className="sr-only">Copy</span>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex justify-center gap-6 pb-4">
                        <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 text-green-600 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 border rounded-full flex items-center justify-center bg-green-50">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                        </a>
                        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 text-blue-500 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 border rounded-full flex items-center justify-center bg-blue-50">
                                <Twitter className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Twitter</span>
                        </a>
                        <a href={`mailto:?subject=${encodeURIComponent("Check out my order")}&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`} className="flex flex-col items-center gap-2 text-gray-600 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 border rounded-full flex items-center justify-center bg-gray-50">
                                <Mail className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Email</span>
                        </a>
                    </div>

                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* Breadcrumbs (Mock) */}
                <div className="text-xs text-gray-500 mb-4 flex gap-2">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <span>/</span>
                    <Link href="/profile/orders" className="hover:text-blue-600">My Orders</Link>
                    <span>/</span>
                    <span>{order.order_id}</span>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* LEFT COLUMN: Main Order Info */}
                    <div className="flex-1 space-y-4 min-w-0">

                        {/* 1. Delivery Address & Download Invoice */}
                        <div className="bg-white p-6 shadow-sm rounded-sm flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-lg mb-2">Delivery Address</h3>
                                <div className="text-sm space-y-1">
                                    <p className="font-semibold">
                                        {order.user_name || (user ? `${user.first_name} ${user.last_name}` : "User Name")}
                                    </p>
                                    <p className="max-w-md text-gray-600 leading-relaxed">
                                        {order.shipping_address}
                                    </p>
                                    <p className="font-semibold mt-2">{order.user_phone || ""}</p>
                                </div>
                            </div>
                            <div className="text-right flex gap-3">
                                <Button variant="ghost" onClick={handleShare} className="text-blue-600 font-bold uppercase text-xs hover:bg-transparent px-0 flex gap-2 items-center">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </Button>
                                {/* Only show download invoice if Paid/Completed */}
                                <Button variant="ghost" onClick={handleDownloadInvoice} className="text-blue-600 font-bold uppercase text-xs hover:bg-transparent px-0 flex gap-2 items-center">
                                    <Download className="w-4 h-4" />
                                    Download Invoice
                                </Button>
                            </div>
                        </div>

                        {/* 2. Order Tracker & Product Info */}
                        <div className="bg-white p-6 shadow-sm rounded-sm border border-gray-100">
                            <div className="flex gap-6 mb-8">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 p-1 border rounded-md bg-white flex items-center justify-center relative overflow-hidden">
                                    <Link href={`/products/${mainItem?.product_id}`} className="block relative h-full w-full">
                                        {mainItem?.product_image && (
                                            <img
                                                src={mainItem.product_image}
                                                alt={mainItem.product_name}
                                                className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                                            />
                                        )}
                                    </Link>
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-start pt-1">
                                    <Link href={`/products/${mainItem?.product_id}`} className="hover:text-blue-600 transition-colors w-fit">
                                        <h2 className="font-semibold text-lg sm:text-xl leading-tight text-gray-900 mb-2 truncate">
                                            {mainItem?.product_name}
                                        </h2>
                                    </Link>
                                    <div className="space-y-1 mb-4 flex-1">
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <span className="font-medium text-gray-700">Color:</span> {mainItem?.color || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <span className="font-medium text-gray-700">Seller:</span> RetailNet
                                        </p>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-gray-900">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                                        <span className="text-sm text-green-600 font-medium">2 Offers Applied</span>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Tracker */}
                        <OrderTracker status={order.status} createdAt={order.created_at} />

                        {/* Detailed Text Footer (Mock) */}
                        {order.status === 'Delivered' && (
                            <div className="mt-6 text-sm text-gray-600 bg-blue-50 p-4 rounded-sm border border-blue-100">
                                Your item has been delivered.
                            </div>
                        )}


                        {/* 3. Items List (If multiple) */}
                        {order.items.length > 1 && (
                            <div className="bg-white p-6 shadow-sm rounded-sm">
                                <h3 className="font-medium text-lg mb-4">Other Items in this Order</h3>
                                <div className="space-y-4">
                                    {order.items.slice(1).map((item: any) => (
                                        <div key={item.id} className="flex gap-4 border-b last:border-0 pb-4 last:pb-0">
                                            <div className="h-16 w-16 bg-muted rounded-sm overflow-hidden relative shrink-0">
                                                <img src={item.product_image} className="object-cover w-full h-full" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{item.product_name}</h4>
                                                <p className="text-sm">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>


                    {/* RIGHT COLUMN: Sidebar (Help, Security, Price) */}
                    <div className="w-full md:w-[300px] lg:w-[320px] space-y-4 shrink-0">

                        {/* Actions */}
                        <div className="bg-white p-4 shadow-sm rounded-sm space-y-3">
                            {/* Cancel Order (Only if not delivered/cancelled) */}
                            {order.status === 'Cancelled' ? (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-sm flex items-center gap-3 text-red-700 font-medium">
                                    <XCircle className="w-5 h-5" />
                                    Order Cancelled
                                </div>
                            ) : order.status !== 'Delivered' && (
                                <Button
                                    onClick={handleCancelOrder}
                                    variant="outline"
                                    className="w-full justify-start text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 font-medium"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel Order
                                </Button>
                            )}

                            <Button
                                onClick={handleChatSupport}
                                variant="outline"
                                className="w-full justify-start text-blue-600 border-gray-200"
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chat with Support
                            </Button>
                        </div>





                        {/* Rate & Review Product */}
                        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Rate this Product</DialogTitle>
                                    <DialogDescription>Share your experience with others</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-8 h-8 cursor-pointer transition-colors ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                onClick={() => setRating(star)}
                                            />
                                        ))}
                                    </div>
                                    <textarea
                                        className="w-full border rounded-md p-2 text-sm"
                                        rows={4}
                                        placeholder="Write your review..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button onClick={submitReview}>Submit Review</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <div className="bg-white p-4 shadow-sm rounded-sm">
                            <h3 className="font-medium mb-3">Rate & Review Product</h3>
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors"
                                        onClick={() => handleRatingClick(star)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Price Details */}
                        <div className="bg-white p-4 shadow-sm rounded-sm">
                            <h3 className="font-medium border-b pb-3 mb-4">Price Details</h3>
                            {(() => {
                                // 1. Calculate Subtotal from Items (Source of Truth for Item Price)
                                const subtotal = order.items.reduce((acc: number, item: any) => acc + (parseFloat(item.price) * item.quantity), 0)

                                // 2. Get Discount
                                const giftCardDiscount = parseFloat(order.gift_card_discount || "0")

                                // 3. Calculate Final Paid
                                const totalPaid = Math.max(0, subtotal - giftCardDiscount)

                                // Mock list price
                                const listPrice = subtotal * 1.1

                                return (
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span>List Price</span>
                                            <span className="line-through text-gray-500">₹{listPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Item Total</span>
                                            <span>₹{subtotal.toLocaleString()}</span>
                                        </div>

                                        {giftCardDiscount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Gift Card Discount</span>
                                                <span>- ₹{giftCardDiscount.toLocaleString()}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span className="text-green-600">Free</span>
                                        </div>

                                        <div className="border-t border-dashed pt-3 mt-3 flex justify-between font-bold text-lg">
                                            <span>Total Paid</span>
                                            <span>₹{totalPaid.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )
                            })()}


                            {/* Security */}
                            <div className="flex items-center gap-2 text-xs text-gray-500 justify-center mt-4">
                                <ShieldCheck className="w-4 h-4" />
                                Safe and Secure Payments.
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <OrderSupportChat
                order={order}
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                userName={user ? user.first_name : "User"}
            />
        </div >

    )
}
