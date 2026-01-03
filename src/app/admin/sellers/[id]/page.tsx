"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft, MapPin, Mail, Phone, ExternalLink,
    ShieldCheck, AlertTriangle, Ban, MessageSquare,
    CheckCircle, XCircle, FileText, Download,
    TrendingUp, Package, Star, DollarSign, CreditCard,
    ShoppingBag, User, Calendar, Activity, ThumbsUp, ThumbsDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

// Mock Data
const generateMockSeller = (id: string) => ({
    id,
    shop_name: "Urban Threads",
    owner_name: "Olivia Martin",
    email: "contact@urbanthreads.com",
    phone: "+91 98765 43210",
    status: "Approved", // Approved, Pending, Rejected, Suspended
    joined_at: "2024-01-15T10:00:00Z",
    location: "Mumbai, Maharashtra",
    metrics: {
        revenue: "₹12.5L",
        orders: 1240,
        products: 145,
        rating: 4.8,
        returns: "2.4%"
    },
    documents: [
        { id: 1, name: "GST Registration", type: "PDF", status: "Verified", date: "2024-01-15" },
        { id: 2, name: "PAN Card", type: "Image", status: "Verified", date: "2024-01-15" },
        { id: 3, name: "Business License", type: "PDF", status: "Pending", date: "2024-01-16" }
    ],
    payouts: [
        { id: "TXN-9988", date: "2024-03-01", amount: "₹45,000", status: "Paid" },
        { id: "TXN-8877", date: "2024-02-15", amount: "₹32,500", status: "Paid" },
        { id: "TXN-7766", date: "2024-02-01", amount: "₹28,900", status: "Processing" },
    ],
    chartData: [
        { name: "Jan", revenue: 45000 },
        { name: "Feb", revenue: 52000 },
        { name: "Mar", revenue: 48000 },
        { name: "Apr", revenue: 61000 },
        { name: "May", revenue: 55000 },
        { name: "Jun", revenue: 67000 },
    ],
    products: [
        { id: 101, name: "Vintage Denim Jacket", category: "Outerwear", price: "₹2,499", stock: 45, sold: 120, status: "Active", image: "/placeholder.png" },
        { id: 102, name: "Floral Summer Dress", category: "Dresses", price: "₹1,899", stock: 12, sold: 340, status: "Low Stock", image: "/placeholder.png" },
        { id: 103, name: "Classic White Sneakers", category: "Footwear", price: "₹3,299", stock: 0, sold: 89, status: "Out of Stock", image: "/placeholder.png" },
        { id: 104, name: "Oversized Hoodie", category: "Activewear", price: "₹1,599", stock: 200, sold: 450, status: "Active", image: "/placeholder.png" },
        { id: 105, name: "Slim Fit Chinos", category: "Bottoms", price: "₹1,299", stock: 56, sold: 210, status: "Active", image: "/placeholder.png" },
    ],
    orders: [
        { id: "ORD-7829", customer: "Aarav Sharma", date: "2024-03-10", total: "₹4,598", status: "Processing", items: 3 },
        { id: "ORD-7828", customer: "Sneha Gupta", date: "2024-03-09", total: "₹1,299", status: "Shipped", items: 1 },
        { id: "ORD-7827", customer: "Rohan Verma", date: "2024-03-09", total: "₹8,999", status: "Delivered", items: 4 },
        { id: "ORD-7826", customer: "Meera Iyer", date: "2024-03-08", total: "₹2,499", status: "Cancelled", items: 1 },
        { id: "ORD-7825", customer: "Kabir Singh", date: "2024-03-08", total: "₹5,100", status: "Delivered", items: 2 },
    ],
    reviews: [
        { id: 1, user: "Priya K.", rating: 5, date: "2024-03-05", comment: "Fabric quality is amazing! Fits perfectly.", product: "Vintage Denim Jacket" },
        { id: 2, user: "Rahul M.", rating: 4, date: "2024-03-02", comment: "Good product but delivery was slightly delayed.", product: "Slim Fit Chinos" },
        { id: 3, user: "Ananya S.", rating: 1, date: "2024-02-28", comment: "Color faded after first wash. Disappointed.", product: "Floral Summer Dress" },
    ],
    activityLog: [
        { id: 1, action: "Stock Updated", details: "Added 50 units to 'Oversized Hoodie'", date: "2024-03-11T10:30:00Z" },
        { id: 2, action: "Price Changed", details: "Updated price of 'Vintage Denim Jacket' to ₹2,499", date: "2024-03-10T14:15:00Z" },
        { id: 3, action: "Order Shipped", details: "Order #ORD-7828 marked as Shipped", date: "2024-03-09T09:45:00Z" },
        { id: 4, action: "Shop Settings", details: "Updated business address", date: "2024-03-05T16:20:00Z" },
    ]
})

export default function SellerDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [seller, setSeller] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Action States
    const [isSuspendOpen, setIsSuspendOpen] = useState(false)
    const [viewDoc, setViewDoc] = useState<any>(null)
    const [isRejectDocOpen, setIsRejectDocOpen] = useState(false)
    const [selectedDocId, setSelectedDocId] = useState<number | null>(null)
    const [docRejectReason, setDocRejectReason] = useState("")

    // New Action States
    const [isMessageOpen, setIsMessageOpen] = useState(false)
    const [messageSubject, setMessageSubject] = useState("")
    const [messageBody, setMessageBody] = useState("")
    const [isPayoutOpen, setIsPayoutOpen] = useState(false)
    const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null)

    useEffect(() => {
        setTimeout(() => {
            setSeller(generateMockSeller(params?.id as string))
            setLoading(false)
        }, 800)
    }, [params?.id])

    const handleVerifyDoc = (docId: number) => {
        const updatedDocs = seller.documents.map((d: any) =>
            d.id === docId ? { ...d, status: "Verified" } : d
        )
        setSeller({ ...seller, documents: updatedDocs })
        setViewDoc(null)
        toast.success("Document marked as verified")
    }

    const handleRejectDoc = () => {
        if (!selectedDocId) return
        const updatedDocs = seller.documents.map((d: any) =>
            d.id === selectedDocId ? { ...d, status: "Rejected", reason: docRejectReason } : d
        )
        setSeller({ ...seller, documents: updatedDocs })
        setIsRejectDocOpen(false)
        setDocRejectReason("")
        setSelectedDocId(null)
        toast.error("Document rejected")
    }

    const handleSuspend = () => {
        setSeller({ ...seller, status: "Suspended" })
        setIsSuspendOpen(false)
        toast.success("Seller account suspended")
    }

    const handleSendMessage = () => {
        setIsMessageOpen(false)
        setMessageSubject("")
        setMessageBody("")
        toast.success(`Message sent to ${seller.shop_name}`)
    }

    const handleReleasePayout = () => {
        const updatedPayouts = seller.payouts.map((p: any) =>
            p.id === selectedPayoutId ? { ...p, status: "Paid" } : p
        )
        setSeller({ ...seller, payouts: updatedPayouts })
        setIsPayoutOpen(false)
        setSelectedPayoutId(null)
        toast.success("Payout released successfully")
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
            </div>
        )
    }

    if (!seller) return null

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500 pb-20">
            {/* Navigation */}
            <div className="flex items-center justify-between">
                <div
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer w-fit"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Sellers</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-[#0f172a]/40 border-violet-500/20 text-violet-300 hover:text-white hover:bg-violet-600/20" onClick={() => setIsMessageOpen(true)}>
                        <MessageSquare className="w-4 h-4 mr-2" /> Message Seller
                    </Button>
                    {seller.status !== "Suspended" && (
                        <Button
                            variant="destructive"
                            className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                            onClick={() => setIsSuspendOpen(true)}
                        >
                            <Ban className="w-4 h-4 mr-2" /> Suspend Account
                        </Button>
                    )}
                </div>
            </div>

            {/* Header Card */}
            <div className="relative rounded-3xl border border-white/5 bg-[#0f172a]/60 backdrop-blur-xl overflow-hidden shadow-2xl p-8">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-violet-900/20">
                            {seller.shop_name[0]}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-white tracking-tight">{seller.shop_name}</h1>
                                {seller.status === "Approved" && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 py-0.5"><ShieldCheck className="w-3 h-3 mr-1" /> Verified</Badge>}
                                {seller.status === "Pending" && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-2 py-0.5 animate-pulse"><AlertTriangle className="w-3 h-3 mr-1" /> Pending Review</Badge>}
                                {seller.status === "Suspended" && <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 px-2 py-0.5"><Ban className="w-3 h-3 mr-1" /> Suspended</Badge>}
                            </div>
                            <div className="text-slate-400 flex items-center gap-2">
                                <span className="font-medium text-slate-200">{seller.owner_name}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                <span className="text-sm">ID: #{seller.id}</span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 pt-1">
                                <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {seller.email}</div>
                                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {seller.phone}</div>
                                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {seller.location}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center min-w-[120px]">
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Products</div>
                            <div className="text-2xl font-bold text-white">{seller.metrics.products}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center min-w-[120px]">
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Rating</div>
                            <div className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
                                {seller.metrics.rating} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-[#0f172a]/60 border border-white/5 p-1 rounded-xl w-full md:w-auto flex overflow-x-auto mb-8 scrollbar-hide">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Overview</TabsTrigger>
                    <TabsTrigger value="products" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Products</TabsTrigger>
                    <TabsTrigger value="orders" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Orders</TabsTrigger>
                    <TabsTrigger value="reviews" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Reviews</TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Documents</TabsTrigger>
                    <TabsTrigger value="payouts" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Payouts</TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Activity</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Revenue Chart */}
                        <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Revenue Trend</CardTitle>
                                <CardDescription className="text-slate-400">Monthly revenue for the last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={seller.chartData}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                            <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                                            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#f8fafc' }}
                                                itemStyle={{ color: '#a78bfa' }}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Stats */}
                        <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Performance Metrics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="text-emerald-400 font-bold text-2xl mb-1">{seller.metrics.revenue}</div>
                                        <div className="text-emerald-300/60 text-xs font-medium uppercase">Total Sales</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <div className="text-blue-400 font-bold text-2xl mb-1">{seller.metrics.orders}</div>
                                        <div className="text-blue-300/60 text-xs font-medium uppercase">Total Orders</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                        <div className="text-amber-400 font-bold text-2xl mb-1">{seller.metrics.rating}</div>
                                        <div className="text-amber-300/60 text-xs font-medium uppercase">Avg Rating</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                        <div className="text-rose-400 font-bold text-2xl mb-1">{seller.metrics.returns}</div>
                                        <div className="text-rose-300/60 text-xs font-medium uppercase">Return Rate</div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-400 text-sm">Order Fulfillment Rate</span>
                                        <span className="text-white font-bold">98.2%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full" style={{ width: '98.2%' }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* PRODUCTS TAB */}
                <TabsContent value="products">
                    <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Product Inventory</CardTitle>
                            <CardDescription className="text-slate-400">Manage seller's product listing and status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border border-white/5 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="border-white/5 hover:bg-transparent">
                                            <TableHead className="text-slate-400">Product Name</TableHead>
                                            <TableHead className="text-slate-400">Category</TableHead>
                                            <TableHead className="text-slate-400">Price</TableHead>
                                            <TableHead className="text-slate-400">Stock</TableHead>
                                            <TableHead className="text-slate-400">Sold</TableHead>
                                            <TableHead className="text-slate-400">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {seller.products.map((product: any) => (
                                            <TableRow key={product.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                                <TableCell className="font-medium text-slate-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-500">Img</div>
                                                        {product.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-400">{product.category}</TableCell>
                                                <TableCell className="text-slate-300">{product.price}</TableCell>
                                                <TableCell className={`
                                                    ${product.stock === 0 ? 'text-rose-400 font-bold' :
                                                        product.stock < 20 ? 'text-amber-400 font-bold' : 'text-slate-300'}
                                                `}>
                                                    {product.stock}
                                                </TableCell>
                                                <TableCell className="text-slate-400 font-mono">{product.sold}</TableCell>
                                                <TableCell>
                                                    <Badge className={`
                                                        ${product.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            product.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                                'bg-rose-500/10 text-rose-400 border-rose-500/20'}
                                                    `}>
                                                        {product.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ORDERS TAB */}
                <TabsContent value="orders">
                    <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Recent Orders</CardTitle>
                            <CardDescription className="text-slate-400">Track order fulfillment and status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border border-white/5 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="border-white/5 hover:bg-transparent">
                                            <TableHead className="text-slate-400">Order ID</TableHead>
                                            <TableHead className="text-slate-400">Customer</TableHead>
                                            <TableHead className="text-slate-400">Date</TableHead>
                                            <TableHead className="text-slate-400">Items</TableHead>
                                            <TableHead className="text-slate-400">Total</TableHead>
                                            <TableHead className="text-slate-400">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {seller.orders?.map((order: any) => (
                                            <TableRow key={order.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                                <TableCell className="font-medium text-violet-400">{order.id}</TableCell>
                                                <TableCell className="text-slate-300">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
                                                            {order.customer[0]}
                                                        </div>
                                                        {order.customer}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-400">{formatDate(order.date)}</TableCell>
                                                <TableCell className="text-slate-300">{order.items}</TableCell>
                                                <TableCell className="text-slate-200 font-medium">{order.total}</TableCell>
                                                <TableCell>
                                                    <Badge className={`
                                                        ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                order.status === 'Shipped' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'}
                                                    `}>
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* REVIEWS TAB */}
                <TabsContent value="reviews">
                    <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Customer Reviews</CardTitle>
                            <CardDescription className="text-slate-400">Recent feedback from customers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {seller.reviews?.map((review: any) => (
                                <div key={review.id} className="p-4 rounded-xl border border-white/5 bg-white/5 flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-slate-200 font-medium">{review.user}</h4>
                                            <span className="text-xs text-slate-500">{formatDate(review.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mb-2">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                                            ))}
                                            <span className="text-xs text-slate-500 ml-2">on {review.product}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">"{review.comment}"</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ACTIVITY TAB */}
                <TabsContent value="activity">
                    <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Activity Log</CardTitle>
                            <CardDescription className="text-slate-400">Audit trail of seller actions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative pl-6 border-l border-white/10 space-y-8">
                                {seller.activityLog?.map((log: any) => (
                                    <div key={log.id} className="relative">
                                        <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-violet-500 border-4 border-[#0f172a]" />
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-white">{log.action}</span>
                                                <span className="text-xs text-slate-500">• {new Date(log.date).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-400">{log.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* DOCUMENTS TAB */}
                <TabsContent value="documents">
                    <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Business Documents</CardTitle>
                            <CardDescription className="text-slate-400">Verify seller identification and tax documents.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {seller.documents.map((doc: any) => (
                                    <div key={doc.id} className="group relative rounded-xl overflow-hidden border border-white/10 bg-[#020617]/50 hover:border-violet-500/30 transition-all">
                                        {/* Mock Preview */}
                                        <div className="h-32 bg-slate-800/50 flex items-center justify-center relative">
                                            <FileText className="w-12 h-12 text-slate-600 group-hover:text-violet-500 transition-colors" />
                                            {doc.status === "Verified" && (
                                                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                                                    <CheckCircle className="w-3 h-3" /> Verified
                                                </div>
                                            )}
                                            {doc.status === "Rejected" && (
                                                <div className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                                                    <XCircle className="w-3 h-3" /> Rejected
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-slate-200 font-medium">{doc.name}</h3>
                                                    <p className="text-xs text-slate-500">{doc.type} • Uploaded {formatDate(doc.date)}</p>
                                                    {doc.status === "Rejected" && (
                                                        <p className="text-xs text-rose-400 mt-1">Reason: {doc.reason || "Not specified"}</p>
                                                    )}
                                                    {doc.status === "Rejected" && (
                                                        <p className="text-xs text-rose-400 mt-1">Reason: {doc.reason || "Not specified"}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <Button size="sm" variant="outline" className="flex-1 bg-transparent border-white/10 text-slate-300 hover:text-white hover:bg-white/5 h-8">
                                                    <ExternalLink className="w-3 h-3 mr-2" /> View
                                                </Button>
                                                {doc.status !== "Verified" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-8"
                                                            onClick={() => handleVerifyDoc(doc.id)}
                                                        >
                                                            Verify
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="flex-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 h-8"
                                                            onClick={() => {
                                                                setSelectedDocId(doc.id)
                                                                setIsRejectDocOpen(true)
                                                            }}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PAYOUTS TAB */}
                <TabsContent value="payouts">
                    <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-white text-lg">Payout History</CardTitle>
                            </div>
                            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => {
                                setSelectedPayoutId("ALL_PENDING") // Or logic to select specifically
                                setIsPayoutOpen(true)
                            }}>
                                <DollarSign className="w-4 h-4 mr-2" /> Release Payout
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {seller.payouts.map((payout: any) => (
                                    <div key={payout.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">{payout.amount}</div>
                                                <div className="text-xs text-slate-500">
                                                    ID: {payout.id} • {formatDate(payout.date)}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className={`${payout.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                            {payout.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>

            {/* Suspend Mock Dialog */}
            <Dialog open={isSuspendOpen} onOpenChange={setIsSuspendOpen}>
                <DialogContent className="bg-[#0f172a] border-slate-700 text-slate-200">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-rose-500" /> Suspend Seller Account
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            This will immediately disable their shop and products.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 hover:text-white" onClick={() => setIsSuspendOpen(false)}>Cancel</Button>
                        <Button variant="destructive" className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleSuspend}>Confirm Suspension</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Document Reject Dialog */}
            <Dialog open={isRejectDocOpen} onOpenChange={setIsRejectDocOpen}>
                <DialogContent className="bg-[#0f172a] border-slate-700 text-slate-200 sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-rose-500" />
                            Reject Document
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Why is this document being rejected? The seller will be notified to re-upload.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="doc-reason" className="text-slate-300">Rejection Reason</Label>
                            <Select onValueChange={setDocRejectReason}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0f172a] border-slate-700 text-slate-200">
                                    <SelectItem value="Blurry/Unreadable">Blurry or Unreadable</SelectItem>
                                    <SelectItem value="Name Mismatch">Name Mismatch</SelectItem>
                                    <SelectItem value="Expired Document">Expired Document</SelectItem>
                                    <SelectItem value="Invalid Format">Invalid Format</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 hover:text-white" onClick={() => setIsRejectDocOpen(false)}>Cancel</Button>
                        <Button onClick={handleRejectDoc} variant="destructive" className="bg-rose-600 hover:bg-rose-700 text-white" disabled={!docRejectReason}>
                            Reject Document
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Message Dialog */}
            <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
                <DialogContent className="bg-[#0f172a] border-slate-700 text-slate-200">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-violet-500" /> Message Seller
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Send an official notification or email to this seller.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="subject" className="text-slate-300">Subject</Label>
                            <Input
                                id="subject"
                                value={messageSubject}
                                onChange={(e) => setMessageSubject(e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="e.g., Compliance Warning"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message" className="text-slate-300">Message</Label>
                            <textarea
                                id="message"
                                value={messageBody}
                                onChange={(e) => setMessageBody(e.target.value)}
                                className="flex min-h-[100px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Type your message here..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 hover:text-white" onClick={() => setIsMessageOpen(false)}>Cancel</Button>
                        <Button className="bg-violet-600 hover:bg-violet-700 text-white" onClick={handleSendMessage}>Send Message</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Payout Dialog */}
            <Dialog open={isPayoutOpen} onOpenChange={setIsPayoutOpen}>
                <DialogContent className="bg-[#0f172a] border-slate-700 text-slate-200">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-500" /> Release Payout
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Are you sure you want to release the pending payout of <span className="text-white font-bold">₹28,900</span> to {seller?.shop_name}?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex gap-3">
                        <ShieldCheck className="w-5 h-5 shrink-0" />
                        <div>
                            This action will initiate a bank transfer. Funds usually settle within 24 hours. The seller will be notified via email.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 hover:text-white" onClick={() => setIsPayoutOpen(false)}>Cancel</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]" onClick={handleReleasePayout}>Confirm Transfer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}
