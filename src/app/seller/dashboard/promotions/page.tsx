"use client"

import { useState } from "react"
import { Plus, Tag, Copy, Calendar, MoreHorizontal, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// Mock Promotions
const promotions = [
    { id: 1, code: "SUMMER20", discount: "20% OFF", type: "Percentage", usage: 145, status: "Active", expiry: "2024-06-30" },
    { id: 2, code: "WELCOME10", discount: "10% OFF", type: "First Order", usage: 890, status: "Active", expiry: "No Expiry" },
    { id: 3, code: "FLASH50", discount: "₹500 OFF", type: "Fixed Amount", usage: 50, status: "Expired", expiry: "2024-01-01" },
]

export default function PromotionsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const handleCreate = () => {
        setIsCreateOpen(false)
        toast.success("Promotion Created Successfully!")
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
                    <p className="text-gray-500 text-sm">Create coupons and deals to boost sales.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 text-white hover:bg-slate-800">
                            <Plus className="mr-2 h-4 w-4" /> Create Promotion
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Coupon</DialogTitle>
                            <DialogDescription>Set up a new discount code for your customers.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="code" className="text-right">Code</Label>
                                <Input id="code" placeholder="e.g. SALE20" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="discount" className="text-right">Discount</Label>
                                <div className="col-span-3 flex gap-2">
                                    <Input id="discount" placeholder="20" className="w-20" />
                                    <select className="border rounded-md px-2 text-sm bg-white">
                                        <option>%</option>
                                        <option>₹</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate}>Create Coupon</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Active Campaigns Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white shadow-md flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg mb-1">Boost Your Sales with Ads</h3>
                    <p className="text-purple-100 text-sm max-w-xl">Run targeted ad campaigns on VogueX to reach millions of fashion enthusiasts. Get ₹2000 ad credit on your first campaign.</p>
                </div>
                <Button variant="secondary" className="whitespace-nowrap">
                    <Megaphone className="mr-2 h-4 w-4" /> Start Campaign
                </Button>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promo) => (
                    <Card key={promo.id} className="border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${promo.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="font-mono text-xs bg-slate-50">
                                    {promo.type}
                                </Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="text-xl font-bold mt-2">{promo.code}</CardTitle>
                            <CardDescription className="text-green-600 font-semibold">{promo.discount}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm text-gray-500 gap-4 mt-2">
                                <span className="flex items-center">
                                    <Tag className="w-3 h-3 mr-1" /> {promo.usage} used
                                </span>
                                <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" /> {promo.expiry}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 p-3 flex justify-between items-center">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${promo.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {promo.status}
                            </span>
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                                <Copy className="w-3 h-3 mr-1" /> Copy Code
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
