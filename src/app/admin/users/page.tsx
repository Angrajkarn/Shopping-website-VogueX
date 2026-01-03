"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Search, MoreVertical, Ban, Shield, Mail, Calendar, UserCheck, Filter, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default function AdminUsersPage() {
    const { token } = useAuthStore()
    const [users, setUsers] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    // Filter States
    const [roleFilter, setRoleFilter] = useState("All")
    const [statusFilter, setStatusFilter] = useState("All")

    useEffect(() => {
        // Mock data for demo
        const mockUsers = [
            { id: 1, email: "olivia.martin@example.com", full_name: "Olivia Martin", date_joined: new Date().toISOString(), is_active: true, role: "Customer" },
            { id: 2, email: "jackson.lee@example.com", full_name: "Jackson Lee", date_joined: new Date(Date.now() - 86400000).toISOString(), is_active: true, role: "Seller" },
            { id: 3, email: "isabella.nguyen@gmail.com", full_name: "Isabella Nguyen", date_joined: new Date(Date.now() - 172800000).toISOString(), is_active: false, role: "Customer" },
            { id: 4, email: "william.kim@tech.com", full_name: "William Kim", date_joined: new Date(Date.now() - 259200000).toISOString(), is_active: true, role: "Admin" },
            { id: 5, email: "sofia.davis@design.co", full_name: "Sofia Davis", date_joined: new Date(Date.now() - 345600000).toISOString(), is_active: true, role: "Customer" },
            { id: 6, email: "lucas.brown@example.com", full_name: "Lucas Brown", date_joined: new Date(Date.now() - 432000000).toISOString(), is_active: true, role: "Customer" },
            { id: 7, email: "emma.wilson@store.com", full_name: "Emma Wilson", date_joined: new Date(Date.now() - 518400000).toISOString(), is_active: true, role: "Seller" },
            { id: 8, email: "james.bond@secret.uk", full_name: "James Bond", date_joined: new Date(Date.now() - 604800000).toISOString(), is_active: false, role: "Admin" },
        ]
        setUsers(mockUsers)
    }, [token])

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesRole = roleFilter === "All" || user.role === roleFilter

        const matchesStatus = statusFilter === "All" ||
            (statusFilter === "Active" && user.is_active) ||
            (statusFilter === "Banned" && !user.is_active)

        return matchesSearch && matchesRole && matchesStatus
    })

    const clearFilters = () => {
        setRoleFilter("All")
        setStatusFilter("All")
        setSearchTerm("")
    }

    const hasActiveFilters = roleFilter !== "All" || statusFilter !== "All" || searchTerm !== ""

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-slate-400 mt-1">Monitor and manage platform user accounts.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search Bar */}
                    <div className="flex items-center gap-3 bg-[#0f172a]/60 p-2 rounded-xl border border-white/10 shadow-inner w-full md:w-auto hover:bg-[#0f172a]/80 transition-colors">
                        <Search className="w-5 h-5 text-slate-500 ml-2" />
                        <Input
                            placeholder="Search users..."
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

                    {/* Filters */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className={`h-[42px] border-white/10 bg-[#0f172a]/60 text-slate-300 hover:text-white hover:bg-white/5 gap-2 ${(roleFilter !== 'All' || statusFilter !== 'All') ? 'border-violet-500/50 text-violet-400' : ''}`}>
                                <Filter className="w-4 h-4" />
                                Filters
                                {(roleFilter !== 'All' || statusFilter !== 'All') && (
                                    <Badge variant="secondary" className="h-5 px-1.5 ml-1 bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 border-none">
                                        {(roleFilter !== 'All' ? 1 : 0) + (statusFilter !== 'All' ? 1 : 0)}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-[#020617] border-slate-800 text-slate-200">
                            <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer justify-between" onClick={() => setRoleFilter("All")}>
                                All Roles {roleFilter === "All" && <UserCheck className="w-4 h-4 text-emerald-400" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer justify-between" onClick={() => setRoleFilter("Customer")}>
                                Customer {roleFilter === "Customer" && <UserCheck className="w-4 h-4 text-emerald-400" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer justify-between" onClick={() => setRoleFilter("Seller")}>
                                Seller {roleFilter === "Seller" && <UserCheck className="w-4 h-4 text-emerald-400" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer justify-between" onClick={() => setRoleFilter("Admin")}>
                                Admin {roleFilter === "Admin" && <UserCheck className="w-4 h-4 text-emerald-400" />}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer justify-between" onClick={() => setStatusFilter("All")}>
                                All Statuses {statusFilter === "All" && <UserCheck className="w-4 h-4 text-emerald-400" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer justify-between" onClick={() => setStatusFilter("Active")}>
                                Active Only {statusFilter === "Active" && <UserCheck className="w-4 h-4 text-emerald-400" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer justify-between" onClick={() => setStatusFilter("Banned")}>
                                Banned Only {statusFilter === "Banned" && <UserCheck className="w-4 h-4 text-emerald-400" />}
                            </DropdownMenuItem>

                            {(roleFilter !== 'All' || statusFilter !== 'All') && (
                                <>
                                    <DropdownMenuSeparator className="bg-slate-800" />
                                    <DropdownMenuItem className="focus:bg-rose-900/20 text-rose-400 focus:text-rose-300 cursor-pointer justify-center py-3" onClick={clearFilters}>
                                        Clear All Filters
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={clearFilters} className="text-slate-500 hover:text-white">
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            {/* Glass Table Container */}
            <div className="rounded-3xl border border-white/5 bg-[#0f172a]/40 backdrop-blur-xl overflow-hidden shadow-2xl relative">

                {/* Inner Content */}
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-slate-400 font-medium uppercase tracking-wider text-xs border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10 border-2 border-white/10 shadow-lg group-hover:border-violet-500/50 transition-colors">
                                                    <AvatarFallback className="bg-slate-800 text-slate-200 font-bold">
                                                        {user.full_name?.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold text-slate-200 group-hover:text-violet-400 transition-colors">{user.full_name}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                    user.role === 'Seller' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                                                <span className={user.is_active ? 'text-emerald-400' : 'text-rose-400'}>
                                                    {user.is_active ? 'Active' : 'Banned'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-600" />
                                                {formatDate(user.date_joined)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-[#020617] border-slate-800 text-slate-200 shadow-2xl">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-slate-800" />
                                                    <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer text-slate-300 focus:text-white focus:bg-slate-800">
                                                        <Link href={`/admin/users/${user.id}`} className="flex items-center w-full">
                                                            <Shield className="mr-2 h-4 w-4 text-violet-400" />
                                                            View Profile
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {user.is_active ? (
                                                        <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer text-rose-400 focus:text-rose-300 focus:bg-rose-500/10">
                                                            <Ban className="mr-2 h-4 w-4" />
                                                            Ban User
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer text-emerald-400 focus:text-emerald-300 focus:bg-emerald-500/10">
                                                            <UserCheck className="mr-2 h-4 w-4" />
                                                            Activate User
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="w-8 h-8 text-slate-600 mb-2" />
                                            <p className="text-lg font-medium text-slate-400">No users found</p>
                                            <p className="text-sm text-slate-600">Try adjusting your filters or search term.</p>
                                            <Button variant="link" onClick={clearFilters} className="text-violet-400 mt-2">
                                                Clear all filters
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
