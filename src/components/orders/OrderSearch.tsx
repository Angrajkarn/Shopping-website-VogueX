"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"

interface OrderSearchProps {
    onSearch: (query: string) => void
}

export function OrderSearch({ onSearch }: OrderSearchProps) {
    const [query, setQuery] = useState("")

    // Simple debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query)
        }, 300)

        return () => clearTimeout(timer)
    }, [query, onSearch])

    return (
        <div className="relative w-full group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Search className="w-4 h-4" />
            </div>
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by Order ID, Product, or Price..."
                className="pl-10 h-10 w-full rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
            />
            {query && (
                <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}
