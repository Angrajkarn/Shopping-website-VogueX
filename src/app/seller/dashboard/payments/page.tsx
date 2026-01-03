"use client"

import { useState } from "react"
import { DollarSign, ArrowUpRight, ArrowDownLeft, Wallet, Building2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Mock Transactions
const transactions = [
    { id: "TXN-9981", type: "Order Credit", ref: "ORD-7829", date: "2024-03-10", amount: 12400, status: "Pending" },
    { id: "TXN-9980", type: "Withdrawal", ref: "Bank Transfer", date: "2024-03-01", amount: -45000, status: "Completed" },
    { id: "TXN-9979", type: "Order Credit", ref: "ORD-7650", date: "2024-02-28", amount: 8999, status: "Available" },
    { id: "TXN-9978", type: "Order Credit", ref: "ORD-7649", date: "2024-02-28", amount: 2500, status: "Available" },
]

export default function PaymentsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                    <p className="text-gray-500 text-sm">Manage your payouts and view transaction history.</p>
                </div>
                <Button className="bg-slate-900 text-white hover:bg-slate-800">
                    <Wallet className="mr-2 h-4 w-4" /> Request Payout
                </Button>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">Available Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₹11,499.00</div>
                        <p className="text-xs text-slate-400 mt-1">Available for withdrawal</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Pending Settlement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">₹12,400.00</div>
                        <p className="text-xs text-gray-500 mt-1">Will be available in 3-5 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Last Withdrawal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">₹45,000.00</div>
                        <p className="text-xs text-secondary-foreground flex items-center mt-1">
                            <span className="text-green-600 flex items-center mr-1">
                                <CheckCircleIcon className="w-3 h-3 mr-1" /> Paid
                            </span>
                            on Mar 01, 2024
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions */}
            <h2 className="text-lg font-bold text-gray-900 mt-8">Recent Transactions</h2>
            <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((txn) => (
                            <TableRow key={txn.id}>
                                <TableCell className="font-medium">{txn.id}</TableCell>
                                <TableCell>
                                    <span className="flex items-center">
                                        {txn.amount > 0
                                            ? <ArrowDownLeft className="h-4 w-4 text-green-500 mr-2" />
                                            : <ArrowUpRight className="h-4 w-4 text-slate-500 mr-2" />
                                        }
                                        {txn.type}
                                    </span>
                                </TableCell>
                                <TableCell>{txn.ref}</TableCell>
                                <TableCell>{txn.date}</TableCell>
                                <TableCell className={`text-right font-medium ${txn.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                                    {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                        ${txn.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            txn.status === 'Available' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {txn.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
    )
}
