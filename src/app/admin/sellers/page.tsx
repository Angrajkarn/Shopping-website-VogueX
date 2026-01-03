"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Search, MoreVertical, XCircle, FileText, CheckCircle, TrendingUp, Users, AlertCircle, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"

export default function AdminSellersPage() {
    const { token } = useAuthStore()
    const [sellers, setSellers] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)

    // Action States
    const [activeTab, setActiveTab] = useState("applications")
    const [selectedSeller, setSelectedSeller] = useState<any>(null)
    const [isApproveOpen, setIsApproveOpen] = useState(false)
    const [isRejectOpen, setIsRejectOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState("")

    useEffect(() => {
        // Mock data
        setTimeout(() => {
            const mockSellers = [
                { id: 1, shop_name: "Urban Threads", owner: "Olivia Martin", status: "Approved", revenue: "₹12.5L", products: 145, rating: 4.8, joined: new Date().toISOString() },
                { id: 2, shop_name: "Tech Haven", owner: "Jackson Lee", status: "Pending", revenue: "₹0", products: 0, rating: 0, joined: new Date(Date.now() - 40000000).toISOString() },
                { id: 3, shop_name: "Green Earth Decor", owner: "Isabella Nguyen", status: "Approved", revenue: "₹5.4L", products: 62, rating: 4.5, joined: new Date(Date.now() - 90000000).toISOString() },
                { id: 4, shop_name: "Speedy Gadgets", owner: "Liam Wilson", status: "Rejected", revenue: "₹2.1L", products: 0, rating: 0, joined: new Date(Date.now() - 150000000).toISOString() },
                { id: 5, shop_name: "Luxury Looms", owner: "Sophia Chen", status: "Pending", revenue: "₹8.9L", products: 12, rating: 0, joined: new Date(Date.now() - 20000000).toISOString() },
                { id: 6, shop_name: "Nordic Home", owner: "Emma Watson", status: "Approved", revenue: "₹21.2L", products: 320, rating: 4.9, joined: new Date(Date.now() - 300000000).toISOString() },
                { id: 7, shop_name: "Cyber Kickz", owner: "Noah Miller", status: "Pending", revenue: "₹0", products: 0, rating: 0, joined: new Date(Date.now() - 10000000).toISOString() },
            ]
            setSellers(mockSellers)
            setLoading(false)
        }, 800)
    }, [token])

    const filteredSellers = sellers.filter(s => {
        const matchesSearch = s.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.owner?.toLowerCase().includes(searchTerm.toLowerCase())

        if (activeTab === "applications") return matchesSearch && s.status === "Pending"
        if (activeTab === "active") return matchesSearch && s.status === "Approved"
        if (activeTab === "rejected") return matchesSearch && s.status === "Rejected"
        return matchesSearch
    })

    const handleApprove = () => {
        setSellers(prev => prev.map(s => s.id === selectedSeller.id ? { ...s, status: "Approved" } : s))
        setIsApproveOpen(false)
        setSelectedSeller(null)
        toast.success(`${selectedSeller.shop_name} approved successfully!`)
    }

    const handleReject = () => {
        setSellers(prev => prev.map(s => s.id === selectedSeller.id ? { ...s, status: "Rejected" } : s))
        setIsRejectOpen(false)
        setRejectReason("")
        setSelectedSeller(null)
        toast.error(`${selectedSeller.shop_name} application rejected.`)
    }

    // Computed Stats
    const totalRevenue = "₹48.1L" // Mocked sum
    const totalSellers = sellers.filter(s => s.status === "Approved").length
    const pendingRequests = sellers.filter(s => s.status === "Pending").length

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Seller Management</h1>
                    <p className="text-slate-400 mt-1">Review applications and manage active vendor accounts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-[#0f172a]/60 border-white/10 text-slate-300 hover:text-white">
                        <FileText className="w-4 h-4 mr-2" /> Export Report
                    </Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-900/20">
                        <Users className="w-4 h-4 mr-2" /> Invite Seller
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md relative overflow-hidden group hover:border-violet-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-24 h-24 text-violet-500" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Platform Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white mb-1">{totalRevenue}</div>
                        <div className="flex items-center text-xs text-emerald-400 gap-1 bg-emerald-500/10 w-fit px-2 py-1 rounded-full border border-emerald-500/20">
                            <TrendingUp className="w-3 h-3" /> +12.5% from last month
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-emerald-500" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Sellers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white mb-1">{totalSellers}</div>
                        <div className="text-xs text-slate-500">
                            across 12 different categories
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-white/5 bg-[#0f172a]/40 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertCircle className="w-24 h-24 text-amber-500" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-400 mb-1">{pendingRequests}</div>
                        <div className="text-xs text-slate-500">
                            needs review & approval
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col gap-6">

                {/* Search & Tabs */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                        <TabsList className="bg-[#0f172a]/60 border border-white/5 p-1 rounded-xl w-full md:w-auto grid grid-cols-3 md:inline-flex">
                            <TabsTrigger value="applications" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6 relative">
                                Requests
                                {pendingRequests > 0 && <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-amber-500 text-black text-[10px]">{pendingRequests}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger value="active" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Active Sellers</TabsTrigger>
                            <TabsTrigger value="rejected" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-6">Rejected</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-3 bg-[#0f172a]/60 p-2 rounded-xl border border-white/10 shadow-inner w-full md:w-auto hover:bg-[#0f172a]/80 transition-colors">
                        <Search className="w-5 h-5 text-slate-500 ml-2" />
                        <Input
                            placeholder="Search shops..."
                            className="bg-transparent border-none focus-visible:ring-0 text-white w-full md:w-64 placeholder:text-slate-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white" onClick={() => setSearchTerm("")}>
                                <X className="w-3 h-3" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Seller Table */}
                <div className="rounded-3xl border border-white/5 bg-[#0f172a]/40 backdrop-blur-xl overflow-hidden shadow-2xl relative min-h-[400px]">
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-slate-400 font-medium uppercase tracking-wider text-xs border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4">Shop Name</th>
                                    <th className="px-6 py-4">Owner</th>
                                    <th className="px-6 py-4">Status</th>
                                    {activeTab === 'active' && <th className="px-6 py-4">Products</th>}
                                    {activeTab === 'active' && <th className="px-6 py-4">Rating</th>}
                                    <th className="px-6 py-4">Revenue (Est)</th>
                                    <th className="px-6 py-4">Applied/Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex justify-center items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                                                Loading sellers...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredSellers.length > 0 ? (
                                    filteredSellers.map((seller) => (
                                        <tr key={seller.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg ${seller.status === 'Pending' ? 'bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/50' :
                                                            seller.status === 'Rejected' ? 'bg-rose-500/20 text-rose-500 ring-1 ring-rose-500/50' :
                                                                'bg-gradient-to-br from-violet-600 to-indigo-600'
                                                        }`}>
                                                        {seller.shop_name?.substring(0, 1).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-200 group-hover:text-violet-400 transition-colors">{seller.shop_name}</div>
                                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                                            ID: #{seller.id.toString().padStart(4, '0')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                                                        {seller.owner[0]}
                                                    </div>
                                                    {seller.owner}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${seller.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    seller.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                                                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                    }`}>
                                                    {seller.status}
                                                </span>
                                            </td>
                                            {activeTab === 'active' && <td className="px-6 py-4 text-slate-300">{seller.products}</td>}
                                            {activeTab === 'active' && (
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-amber-400">
                                                        ★ {seller.rating}
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-6 py-4 font-mono text-slate-400">{seller.revenue}</td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">
                                                {formatDate(seller.joined)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {seller.status === 'Pending' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50 h-8 font-medium transition-all shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)] hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.5)]"
                                                                onClick={() => {
                                                                    setSelectedSeller(seller)
                                                                    setIsApproveOpen(true)
                                                                }}
                                                            >
                                                                Approve
                                                            </Button>
                                                        </>
                                                    )}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-[#020617] border-slate-800 text-slate-200 shadow-2xl">
                                                            <DropdownMenuLabel>Manage Shop</DropdownMenuLabel>
                                                            <DropdownMenuSeparator className="bg-slate-800" />
                                                            <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer text-slate-300 focus:text-white focus:bg-slate-800">
                                                                <Link href={`/admin/sellers/${seller.id}`} className="flex items-center w-full">
                                                                    <FileText className="mr-2 h-4 w-4 text-violet-400" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {seller.status === 'Pending' && (
                                                                <DropdownMenuItem
                                                                    className="hover:bg-rose-950/30 cursor-pointer text-rose-400 focus:text-rose-300 focus:bg-rose-950/30"
                                                                    onClick={() => {
                                                                        setSelectedSeller(seller)
                                                                        setIsRejectOpen(true)
                                                                    }}
                                                                >
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Reject Application
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="w-8 h-8 text-slate-600 mb-2" />
                                                <p className="text-lg font-medium text-slate-400">No {activeTab} sellers found</p>
                                                <p className="text-sm text-slate-600">Try adjusting your search term.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* APPROVE DIALOG */}
            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <DialogContent className="bg-[#0f172a] border-slate-700 text-slate-200 sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            Approve Seller Application
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Are you sure you want to approve <span className="text-white font-medium">{selectedSeller?.shop_name}</span>? They will gain access to the Seller Dashboard immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 hover:text-white" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
                        <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]">
                            Confirm Approval
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* REJECT DIALOG */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent className="bg-[#0f172a] border-slate-700 text-slate-200 sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-rose-500" />
                            Reject Application
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Please provide a reason for rejecting <span className="text-white font-medium">{selectedSeller?.shop_name}</span>. This will be emailed to them.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason" className="text-slate-300">Reason</Label>
                            <Select onValueChange={setRejectReason}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0f172a] border-slate-700 text-slate-200">
                                    <SelectItem value="docs">Incomplete Documents</SelectItem>
                                    <SelectItem value="policy">Policy Violation</SelectItem>
                                    <SelectItem value="quality">Quality Standards</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {rejectReason === 'other' && (
                            <Textarea
                                className="bg-white/5 border-white/10 text-white min-h-[80px]"
                                placeholder="Type specific reason..."
                            />
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300 hover:text-white" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                        <Button onClick={handleReject} variant="destructive" className="bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_15px_-3px_rgba(225,29,72,0.4)]">
                            Reject Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}
