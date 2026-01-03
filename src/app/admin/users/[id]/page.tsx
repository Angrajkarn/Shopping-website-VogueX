"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    User, Mail, Phone, MapPin, Calendar, Shield,
    CreditCard, Package, Clock, AlertCircle, CheckCircle,
    Ban, MoreVertical, Edit, Trash2, ArrowLeft, RefreshCw,
    Wallet, Send, MessageSquare, History, FileText, Check, X, Truck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

// Mock Data Generators
const generateMockUser = (id: string) => ({
    id,
    full_name: "Olivia Martin",
    email: "olivia.martin@example.com",
    phone: "+91 98765 43210",
    role: "Customer",
    status: "Active",
    joined_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    last_login: new Date().toISOString(),
    spent: "₹45,200",
    order_count: 12,
    addresses: [
        { id: 1, type: "Home", text: "123, Cyber Street, Tech Park, Mumbai, MH 400001" },
        { id: 2, type: "Work", text: "Unit 404, Innovation Hub, Bangalore, KA 560001" }
    ],
    wallet: {
        balance: 1200,
        points: 450
    }
})

const generateMockOrders = () => [
    {
        id: "ORD-7782-XJ",
        date: new Date().toISOString(),
        total: "₹1,999",
        status: "Processing",
        payment: "Paid (UPI)",
        items: [
            { name: "Neon Verse Oversized Tee", price: "₹1,499", qty: 1, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&q=80" },
            { name: "Cyber Socks", price: "₹500", qty: 1, image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=100&q=80" }
        ],
        shipping: { method: "Express", tracking: "TRK-998877", address: "123, Cyber Street, Tech Park, Mumbai" }
    },
    {
        id: "ORD-9921-MC",
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        total: "₹3,499",
        status: "Shipped",
        payment: "Paid (Card)",
        items: [
            { name: "Cyberpunk Cargo Pants", price: "₹3,499", qty: 1, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=100&q=80" }
        ],
        shipping: { method: "Standard", tracking: "TRK-112233", address: "Unit 404, Innovation Hub, Bangalore" }
    },
    {
        id: "ORD-3321-KL",
        date: new Date(Date.now() - 86400000 * 15).toISOString(),
        total: "₹899",
        status: "Delivered",
        payment: "Paid (Wallet)",
        items: [
            { name: "Holographic Visor", price: "₹899", qty: 1, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=100&q=80" }
        ],
        shipping: { method: "Standard", tracking: "TRK-554433", address: "123, Cyber Street, Tech Park, Mumbai" }
    },
    {
        id: "ORD-1102-PP",
        date: new Date(Date.now() - 86400000 * 45).toISOString(),
        total: "₹12,500",
        status: "Refunded",
        payment: "Refunded",
        items: [
            { name: "TechWear Jacket Bundle", price: "₹12,500", qty: 1, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&q=80" }
        ],
        shipping: { method: "Express", tracking: "TRK-000000", address: "123, Cyber Street, Tech Park, Mumbai" }
    }
]

export default function UserDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Action States
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isWalletOpen, setIsWalletOpen] = useState(false)
    const [isSuspendOpen, setIsSuspendOpen] = useState(false)
    const [isMessageOpen, setIsMessageOpen] = useState(false)
    const [viewOrder, setViewOrder] = useState<any>(null)

    // Form States
    const [editForm, setEditForm] = useState({ full_name: "", email: "", role: "", phone: "" })
    const [walletAmount, setWalletAmount] = useState("")
    const [walletAction, setWalletAction] = useState("credit")
    const [suspendReason, setSuspendReason] = useState("")
    const [messageText, setMessageText] = useState("")

    useEffect(() => {
        // Simulate API Fetch
        setTimeout(() => {
            if (params?.id) {
                const mockUser = generateMockUser(params.id as string)
                setUser(mockUser)
                setOrders(generateMockOrders())
                setEditForm({
                    full_name: mockUser.full_name,
                    email: mockUser.email,
                    role: mockUser.role,
                    phone: mockUser.phone
                })
            }
            setLoading(false)
        }, 800)
    }, [params?.id])

    const handleStatusChange = (orderId: string, newStatus: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        toast.success(`Order ${orderId} updated to ${newStatus}`)
    }

    const handleSaveProfile = () => {
        setUser({ ...user, ...editForm })
        setIsEditOpen(false)
        toast.success("User profile updated successfully")
    }

    const handleUpdateWallet = () => {
        const amount = parseInt(walletAmount)
        if (isNaN(amount) || amount <= 0) return toast.error("Invalid amount")

        const newBalance = walletAction === "credit" ? user.wallet.balance + amount : user.wallet.balance - amount
        setUser({ ...user, wallet: { ...user.wallet, balance: newBalance } })
        setIsWalletOpen(false)
        setWalletAmount("")
        toast.success(`Wallet ${walletAction === 'credit' ? 'credited' : 'debited'} by ₹${amount}`)
    }

    const handleSuspendUser = () => {
        const newStatus = user.status === "Active" ? "Suspended" : "Active"
        setUser({ ...user, status: newStatus })
        setIsSuspendOpen(false)
        setSuspendReason("")
        toast.success(`User account ${newStatus === 'Active' ? 'reactivated' : 'suspended'}`)
    }

    const handleSendMessage = () => {
        if (!messageText.trim()) return toast.error("Message cannot be empty")
        setIsMessageOpen(false)
        setMessageText("")
        toast.success("Notification sent to user")
    }

    const handleSendInvoice = (orderId: string) => {
        toast.success(`Invoice for order ${orderId} sent to ${user.email}`)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-[#020617]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
                    <p className="text-slate-400 text-sm animate-pulse">Loading user profile...</p>
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500 pb-20">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-slate-400 hover:text-white transition-colors cursor-pointer w-fit" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Back to Users</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-[#0f172a]/40 border-violet-500/20 text-violet-300 hover:text-white hover:bg-violet-600/20 transition-all shadow-[0_0_15px_-3px_rgba(124,58,237,0.1)]" onClick={() => setIsMessageOpen(true)}>
                        <MessageSquare className="w-4 h-4 mr-2" /> Message
                    </Button>
                </div>
            </div>

            {/* Profile Header Card */}
            <div className="relative rounded-3xl border border-white/5 bg-[#0f172a]/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                <div className="p-8 relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-[#020617] shadow-xl ring-2 ring-violet-500/50">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
                            <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-2xl font-bold text-white">
                                {user.full_name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-white tracking-tight">{user.full_name}</h1>
                                <Badge className={`uppercase text-[10px] tracking-wider ${user.role === 'Admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-violet-500/10 text-violet-400'} border border-white/5`}>
                                    {user.role}
                                </Badge>
                                <Badge className={`${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                    {user.status}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
                                <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                                    <Mail className="w-4 h-4 text-slate-500" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                                    <Phone className="w-4 h-4 text-slate-500" />
                                    {user.phone}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-slate-500" />
                                    Mumbai, India
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white flex-1 md:flex-none">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset Password
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-900/20 flex-1 md:flex-none">
                                    Actions
                                    <MoreVertical className="w-4 h-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#0f172a] border-slate-700 text-slate-200 shadow-xl">
                                <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => setIsEditOpen(true)}>
                                    <Edit className="w-4 h-4 mr-2" /> Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => setIsWalletOpen(true)}>
                                    <Wallet className="w-4 h-4 mr-2" /> Manage Wallet
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuItem
                                    className="focus:bg-rose-900/20 text-rose-400 focus:text-rose-400 cursor-pointer"
                                    onClick={() => setIsSuspendOpen(true)}
                                >
                                    <Ban className="w-4 h-4 mr-2" /> {user.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Key Stats Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/5 divide-x divide-white/5 bg-[#020617]/30">
                    <div className="p-6 text-center hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1 group-hover:text-violet-400 transition-colors">Total Spent</div>
                        <div className="text-2xl font-bold text-white">{user.spent}</div>
                    </div>
                    <div className="p-6 text-center hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1 group-hover:text-violet-400 transition-colors">Total Orders</div>
                        <div className="text-2xl font-bold text-white">{user.order_count}</div>
                    </div>
                    <div className="p-6 text-center hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1 group-hover:text-emerald-400 transition-colors">Wallet Balance</div>
                        <div className="text-2xl font-bold text-emerald-400">₹{user.wallet.balance}</div>
                    </div>
                    <div className="p-6 text-center hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1 group-hover:text-amber-400 transition-colors">Loyalty Points</div>
                        <div className="text-2xl font-bold text-amber-400">{user.wallet.points}</div>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="orders" className="w-full">
                <TabsList className="bg-[#0f172a]/60 border border-white/5 p-1 rounded-xl w-full md:w-auto grid grid-cols-4 md:inline-flex mb-8">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Overview</TabsTrigger>
                    <TabsTrigger value="orders" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Orders</TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Activity</TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            Order History <Badge variant="outline" className="ml-2 border-white/10 text-slate-400">{orders.length}</Badge>
                        </h3>
                        <div className="flex gap-2">
                            <Button variant="outline" className="bg-[#0f172a]/40 border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-colors">
                                <FileText className="w-4 h-4 mr-2" /> Download Statement
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {orders.map((order) => (
                            <Card key={order.id} className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md overflow-hidden hover:bg-[#0f172a]/60 transition-colors group">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row items-stretch">
                                        {/* Status Strip */}
                                        <div className={`w-full md:w-2 ${order.status === 'Processing' ? 'bg-amber-500 animate-pulse' :
                                            order.status === 'Shipped' ? 'bg-blue-500' :
                                                order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-rose-500'
                                            }`} />

                                        <div className="p-6 flex-1 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-violet-500/30 transition-colors">
                                                    <Package className="w-6 h-6 text-slate-400 group-hover:text-violet-400 transition-colors" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-mono text-violet-400 font-bold tracking-wide">{order.id}</span>
                                                        <Badge variant="outline" className={`border-none ${order.status === 'Processing' ? 'bg-amber-500/10 text-amber-400' :
                                                            order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' :
                                                                order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                                            }`}>
                                                            {order.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-slate-300 font-medium mb-1">
                                                        {order.items[0].name}
                                                        {order.items.length > 1 && <span className="text-slate-500 text-sm font-normal"> +{order.items.length - 1} more</span>}
                                                    </div>
                                                    <div className="text-slate-500 text-xs flex items-center gap-2">
                                                        <Calendar className="w-3 h-3" /> {formatDate(order.date)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                                <div>
                                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total</div>
                                                    <div className="text-lg font-bold text-white">{order.total}</div>
                                                </div>
                                                <div className="flex-1 md:flex-none flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="hover:bg-white/10 text-slate-400 hover:text-white">
                                                                Manage <MoreVertical className="w-4 h-4 ml-2" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-[#020617] border-slate-800 text-slate-200 shadow-xl">
                                                            <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator className="bg-slate-800" />
                                                            <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer" onClick={() => setViewOrder(order)}>View Details</DropdownMenuItem>
                                                            <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer" onClick={() => handleSendInvoice(order.id)}>Send Invoice</DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-slate-800" />
                                                            {order.status !== 'Refunded' && order.status !== 'Delivered' && (
                                                                <DropdownMenuItem
                                                                    className="hover:bg-rose-950/30 text-rose-400 hover:text-rose-300 cursor-pointer"
                                                                    onClick={() => handleStatusChange(order.id, 'Refunded')}
                                                                >
                                                                    Cancel & Refund
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* ... other tabs content ... */}
                <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-violet-400" /> Saved Addresses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {user.addresses.map((addr: any) => (
                                    <div key={addr.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between">
                                        <div>
                                            <div className="text-sm font-bold text-slate-200 mb-1">{addr.type}</div>
                                            <div className="text-sm text-slate-400 leading-relaxed max-w-[250px]">{addr.text}</div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="hover:bg-white/10 text-slate-500">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-emerald-400" /> Payment Methods
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-6 bg-slate-700 rounded flex items-center justify-center text-[8px] text-slate-300 font-mono border border-white/5">VISA</div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-200">•••• •••• •••• 4242</div>
                                            <div className="text-xs text-slate-500">Expires 12/28</div>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/10">Primary</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="activity">
                    <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2"><History className="w-5 h-5 text-blue-400" /> Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                {[{ title: "Order Placed", desc: "Order #ORD-7782-XJ placed via UPI", time: "2 hours ago" },
                                { title: "Login Detected", desc: "Successful login from Mumbai, India", time: "5 hours ago" },
                                { title: "Wallet Credit", desc: "₹500 promotional credit added", time: "1 day ago" }
                                ].map((item, i) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 group-hover:bg-violet-600 transition-colors shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-4 rounded-xl border border-white/5 shadow-sm">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-slate-200">{item.title}</div>
                                                <time className="font-caveat font-medium text-violet-400 text-xs">{item.time}</time>
                                            </div>
                                            <div className="text-slate-400 text-sm">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white">Security & Login</CardTitle>
                            <CardDescription className="text-slate-400">Manage account access and security settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                                    <Input id="email" value={user.email} className="bg-white/5 border-white/10 text-white" readOnly />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-slate-300">Password</Label>
                                    <div className="flex gap-4">
                                        <Input id="password" type="password" value="********" className="bg-white/5 border-white/10 text-white" readOnly />
                                        <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 hover:text-white">Change</Button>
                                    </div>
                                </div>
                            </div>
                            <Separator className="bg-white/5" />
                            <div className="space-y-4">
                                <div className="text-slate-200 font-medium mb-4">Login History</div>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-slate-500" />
                                            <div>
                                                <div className="text-slate-300">Windows PC - Chrome</div>
                                                <div className="text-xs text-slate-500">Mumbai, India • {formatDate(new Date(Date.now() - 86400000 * i).toISOString())}</div>
                                            </div>
                                        </div>
                                        <div className="text-emerald-400 text-xs bg-emerald-500/10 px-2 py-1 rounded">Successful</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* EDIT PROFILE DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-[#0f172a] border-slate-700 text-slate-200 sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-white">Edit Profile</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Make changes to the user's personal details here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right text-slate-300">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={editForm.full_name}
                                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                className="col-span-3 bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right text-slate-300">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                className="col-span-3 bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right text-slate-300">
                                Role
                            </Label>
                            <Select
                                value={editForm.role}
                                onValueChange={(val) => setEditForm({ ...editForm, role: val })}
                            >
                                <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0f172a] border-slate-700 text-slate-200">
                                    <SelectItem value="Customer">Customer</SelectItem>
                                    <SelectItem value="Seller">Seller</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 hover:text-white" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveProfile} className="bg-violet-600 hover:bg-violet-700 text-white">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* WALLET DIALOG */}
            <Dialog open={isWalletOpen} onOpenChange={setIsWalletOpen}>
                <DialogContent className="bg-[#0f172a] border-slate-700 text-slate-200 sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-white">Manage Wallet</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Manually credit or debit funds to the user's wallet.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex justify-center mb-4">
                            <div className="text-3xl font-bold text-emerald-400">₹{user.wallet.balance}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant={walletAction === 'credit' ? 'default' : 'outline'}
                                className={walletAction === 'credit' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-white/10 hover:bg-white/5 text-slate-300'}
                                onClick={() => setWalletAction('credit')}
                            >
                                Credit (+)
                            </Button>
                            <Button
                                variant={walletAction === 'debit' ? 'default' : 'outline'}
                                className={walletAction === 'debit' ? 'bg-rose-600 hover:bg-rose-700' : 'border-white/10 hover:bg-white/5 text-slate-300'}
                                onClick={() => setWalletAction('debit')}
                            >
                                Debit (-)
                            </Button>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="amount" className="text-slate-300">Amount (₹)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                value={walletAmount}
                                onChange={(e) => setWalletAmount(e.target.value)}
                                className="bg-white/5 border-white/10 text-white text-lg"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reason" className="text-slate-300">Reason</Label>
                            <Input
                                id="reason"
                                placeholder="e.g. Refund for Order #123"
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 hover:text-white" onClick={() => setIsWalletOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateWallet} className="bg-white text-slate-900 hover:bg-slate-200">Confirm Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* NOTIFICATION DIALOG */}
            <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
                <DialogContent className="bg-[#0f172a] border-slate-700 text-slate-200 sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-white">Send Notification</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Send a push notification or email to this user.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label className="text-slate-300">Subject</Label>
                            <Input className="bg-white/5 border-white/10 text-white" placeholder="Important Update" />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-slate-300">Message</Label>
                            <Textarea
                                className="bg-white/5 border-white/10 text-white min-h-[100px]"
                                placeholder="Type your message here..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 cursor-pointer">Email</Badge>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-pointer">In-App</Badge>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 cursor-pointer">SMS</Badge>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 hover:text-white" onClick={() => setIsMessageOpen(false)}>Cancel</Button>
                        <Button onClick={handleSendMessage} className="bg-violet-600 hover:bg-violet-700 text-white">
                            <Send className="w-4 h-4 mr-2" /> Send Message
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* SUSPEND DIALOG */}
            <Dialog open={isSuspendOpen} onOpenChange={setIsSuspendOpen}>
                <DialogContent className="bg-[#0f172a] border-slate-700 text-slate-200">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                            {user.status === 'Active' ? 'Suspend User Account' : 'Reactivate User Account'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {user.status === 'Active'
                                ? 'Are you sure you want to suspend this user? They will not be able to log in or place orders.'
                                : 'Are you sure you want to reactivate this user? Current suspension will be lifted.'
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {user.status === 'Active' && (
                            <div className="grid gap-2">
                                <Label htmlFor="suspend-reason" className="text-slate-300">Reason for Suspension</Label>
                                <Select onValueChange={setSuspendReason}>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder="Select a reason" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0f172a] border-slate-700 text-slate-200">
                                        <SelectItem value="fraud">Fraudulent Activity</SelectItem>
                                        <SelectItem value="abuse">Abusive Behavior</SelectItem>
                                        <SelectItem value="payment">Payment Issues</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200 text-xs">
                            <span className="font-bold">Warning:</span> An email notification will be sent to the user regarding this action.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 hover:text-white" onClick={() => setIsSuspendOpen(false)}>Cancel</Button>
                        <Button onClick={handleSuspendUser} variant="destructive" className="bg-rose-600 hover:bg-rose-700 text-white">
                            {user.status === 'Active' ? 'Confirm Suspension' : 'Confirm Reactivation'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* VIEW ORDER DETAILS DIALOG */}
            {viewOrder && (
                <Dialog open={!!viewOrder} onOpenChange={(open) => !open && setViewOrder(null)}>
                    <DialogContent className="bg-[#0f172a] border-slate-700 text-slate-200 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-white flex items-center gap-2">
                                Order Details <span className="text-violet-400 font-mono text-base">{viewOrder.id}</span>
                            </DialogTitle>
                            <DialogDescription className="text-slate-400">
                                View items, shipping, and payment information.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            {/* Items List */}
                            <div className="space-y-3">
                                <div className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Items in Order</div>
                                {viewOrder.items.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div className="w-12 h-12 rounded-lg bg-slate-800 border border-white/10 overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-slate-200 font-medium">{item.name}</div>
                                            <div className="text-xs text-slate-500">Qty: {item.qty}</div>
                                        </div>
                                        <div className="text-white font-bold">{item.price}</div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="bg-white/5" />

                            {/* Shipping & Payment Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Shipping Details</div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-violet-400 mt-1" />
                                            <div className="text-sm text-slate-400 leading-relaxed">{viewOrder.shipping.address}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Truck className="w-4 h-4 text-violet-400" />
                                            <div className="text-sm text-slate-400">
                                                {viewOrder.shipping.method} <span className="text-slate-600">|</span> <span className="font-mono text-slate-300">{viewOrder.shipping.tracking}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Payment Info</div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-400">Status</span>
                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{viewOrder.payment}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-400">Total Amount</span>
                                            <span className="text-lg font-bold text-white">{viewOrder.total}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 hover:text-white" onClick={() => setViewOrder(null)}>Close</Button>
                            <Button className="bg-violet-600 hover:bg-violet-700 text-white">Download Invoice</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    )
}
