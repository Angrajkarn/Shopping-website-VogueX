"use client"

import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface OrderFiltersProps {
    activeStatus: string
    onStatusChange: (status: string) => void
    activeTime: string
    onTimeChange: (time: string) => void
}

export function OrderFilters({ activeStatus, onStatusChange, activeTime, onTimeChange }: OrderFiltersProps) {
    const statusFilters = [
        { id: "all", label: "All Status" },
        { id: "on_the_way", label: "On the way" },
        { id: "delivered", label: "Delivered" },
        { id: "cancelled", label: "Cancelled" },
        { id: "returned", label: "Returned" },
    ]

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {/* Status Pills */}
            {statusFilters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onStatusChange(filter.id)}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border flex-shrink-0",
                        activeStatus === filter.id
                            ? "bg-black text-white border-black shadow-md"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                >
                    {filter.label}
                </button>
            ))}

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-gray-300 mx-2 flex-shrink-0" />

            {/* Year Dropdown */}
            <Select value={activeTime} onValueChange={onTimeChange}>
                <SelectTrigger className="w-[110px] h-9 rounded-full border-gray-200 bg-white text-sm font-medium focus:ring-black flex-shrink-0">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all_time">Anytime</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
