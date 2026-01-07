"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Search, Star, X } from "lucide-react"
import { api } from "@/lib/api"
import { ScrollArea } from "@/components/ui/scroll-area"

export function FilterSidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // --- Dynamic Options State ---
    const [availableBrands, setAvailableBrands] = React.useState<string[]>([])
    const [availableSizes, setAvailableSizes] = React.useState<string[]>([])
    const [maxPriceLimit, setMaxPriceLimit] = React.useState(50000)
    const [loadingOptions, setLoadingOptions] = React.useState(true)

    // --- Selection State ---
    const [selectedGenders, setSelectedGenders] = React.useState<string[]>([])
    const [selectedBrands, setSelectedBrands] = React.useState<string[]>([])
    const [selectedSizes, setSelectedSizes] = React.useState<string[]>([])
    const [selectedRating, setSelectedRating] = React.useState<string | null>(null)
    const [priceRange, setPriceRange] = React.useState([0, 50000])
    const [selectedColor, setSelectedColor] = React.useState<string | null>(null)

    // --- Search State ---
    const [brandSearch, setBrandSearch] = React.useState("")

    // 1. Sync from URL on Mount
    React.useEffect(() => {
        const genders = searchParams.get("gender")?.split(",") || []
        setSelectedGenders(genders)

        const brands = searchParams.get("brand")?.split(",") || []
        setSelectedBrands(brands)

        const sizes = searchParams.get("size")?.split(",") || []
        setSelectedSizes(sizes)

        const rating = searchParams.get("rating")
        setSelectedRating(rating || null)

        const min = searchParams.get("min_price")
        const max = searchParams.get("max_price")
        if (min && max) {
            setPriceRange([Number(min), Number(max)])
        }

        const color = searchParams.get("color")
        setSelectedColor(color || null)
    }, [searchParams])

    // 2. Fetch Dynamic Options based on Category Context
    React.useEffect(() => {
        const fetchOptions = async () => {
            setLoadingOptions(true)
            try {
                const category = searchParams.get("category") || undefined
                const subcategory = searchParams.get("subcategory") || undefined

                const data = await api.getFilterOptions(category, subcategory)
                setAvailableBrands(data.brands || [])
                setAvailableSizes(data.sizes || [])
                if (data.max_price) setMaxPriceLimit(data.max_price)
                if (!searchParams.get("max_price")) {
                    setPriceRange([0, data.max_price || 50000])
                }
            } catch (err) {
                console.error("Failed to load filter options", err)
            } finally {
                setLoadingOptions(false)
            }
        }
        fetchOptions()
    }, [searchParams.get("category"), searchParams.get("subcategory")])

    // --- Handlers ---

    const updateURL = (params: URLSearchParams) => {
        params.delete("offset") // Reset pagination
        router.push(`/shop?${params.toString()}`, { scroll: false })
    }

    const handleCheckboxFilter = (
        key: string,
        item: string,
        currentSelection: string[],
        setSelection: (val: string[]) => void
    ) => {
        let newSelection = [...currentSelection]
        if (newSelection.includes(item)) {
            newSelection = newSelection.filter(i => i !== item)
        } else {
            newSelection.push(item)
        }
        setSelection(newSelection)

        const params = new URLSearchParams(searchParams.toString())
        if (newSelection.length > 0) {
            params.set(key, newSelection.join(","))
        } else {
            params.delete(key)
        }
        updateURL(params)
    }

    const handleRatingChange = (rating: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (rating) {
            // Toggle off if clicking same
            if (selectedRating === rating) {
                setSelectedRating(null)
                params.delete("rating")
            } else {
                setSelectedRating(rating)
                params.set("rating", rating)
            }
        } else {
            params.delete("rating")
        }
        updateURL(params)
    }

    const handlePriceCommit = (value: number[]) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("min_price", value[0].toString())
        params.set("max_price", value[1].toString())
        updateURL(params)
    }

    const handleColorChange = (color: string) => {
        const newColor = selectedColor === color ? null : color
        setSelectedColor(newColor)
        const params = new URLSearchParams(searchParams.toString())
        if (newColor) params.set("color", newColor)
        else params.delete("color")
        updateURL(params)
    }

    const clearFilters = () => {
        router.push("/shop")
    }

    // Filter lists based on internal search
    const filteredBrands = availableBrands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between pb-2 border-b">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold">Filters</h3>
                    <p className="text-xs text-muted-foreground">
                        {loadingOptions ? "Updating options..." : "Refine your search"}
                    </p>
                </div>
                {(selectedBrands.length > 0 || selectedSizes.length > 0 || selectedRating || selectedGenders.length > 0 || selectedColor) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                        Clear All
                    </Button>
                )}
            </div>

            <Accordion type="multiple" defaultValue={["brand", "price", "size", "rating"]} className="w-full">

                {/* 1. Brand Filter (Searchable) */}
                <AccordionItem value="brand">
                    <AccordionTrigger className="text-sm font-semibold">Brand</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 pt-2">
                            {availableBrands.length > 8 && (
                                <div className="relative mb-2">
                                    <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search Brand"
                                        className="pl-8 h-8 text-xs"
                                        value={brandSearch}
                                        onChange={(e) => setBrandSearch(e.target.value)}
                                    />
                                </div>
                            )}
                            <ScrollArea className="h-[200px] pr-2">
                                {loadingOptions ? (
                                    <div className="text-xs text-gray-400 p-2">Loading brands...</div>
                                ) : filteredBrands.length > 0 ? (
                                    filteredBrands.map((brand) => (
                                        <div key={brand} className="flex items-center space-x-2 py-1.5">
                                            <Checkbox
                                                id={`brand-${brand}`}
                                                checked={selectedBrands.includes(brand)}
                                                onCheckedChange={() => handleCheckboxFilter("brand", brand, selectedBrands, setSelectedBrands)}
                                            />
                                            <Label htmlFor={`brand-${brand}`} className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {brand}
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-center p-4 text-gray-400">No brands found</div>
                                )}
                            </ScrollArea>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 2. Price Range */}
                <AccordionItem value="price">
                    <AccordionTrigger className="text-sm font-semibold">Price</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-6 pt-4 px-2">
                            <Slider
                                value={priceRange}
                                min={0}
                                max={maxPriceLimit}
                                step={100}
                                onValueChange={setPriceRange}
                                onValueCommit={handlePriceCommit}
                                className="my-4"
                            />
                            <div className="flex justify-between items-center text-sm">
                                <div className="border px-2 py-1 rounded bg-slate-50">₹{priceRange[0]}</div>
                                <span className="text-gray-400">-</span>
                                <div className="border px-2 py-1 rounded bg-slate-50">₹{priceRange[1]}</div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 3. Size Filter (Chips) */}
                <AccordionItem value="size">
                    <AccordionTrigger className="text-sm font-semibold">Size</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {availableSizes.map(size => {
                                const isSelected = selectedSizes.includes(size)
                                return (
                                    <div
                                        key={size}
                                        onClick={() => handleCheckboxFilter("size", size, selectedSizes, setSelectedSizes)}
                                        className={`
                                            px-3 py-1 text-xs border rounded-full cursor-pointer transition-all select-none
                                            ${isSelected
                                                ? "bg-black text-white border-black font-medium"
                                                : "bg-white text-slate-700 hover:border-black"}
                                        `}
                                    >
                                        {size}
                                    </div>
                                )
                            })}
                            {availableSizes.length === 0 && !loadingOptions && (
                                <p className="text-xs text-gray-400">No sizes available</p>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 4. Customer Rating */}
                <AccordionItem value="rating">
                    <AccordionTrigger className="text-sm font-semibold">Customer Ratings</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pt-1">
                            {[4, 3, 2, 1].map((stars) => (
                                <div
                                    key={stars}
                                    className={`flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-slate-50 ${selectedRating === String(stars) ? "bg-slate-100 font-medium" : ""}`}
                                    onClick={() => handleRatingChange(String(stars))}
                                >
                                    <div className="flex items-center gap-0.5 text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < stars ? "fill-current" : "text-gray-300 stroke-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-slate-600">& Up</span>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 5. Color Filter */}
                <AccordionItem value="color">
                    <AccordionTrigger className="text-sm font-semibold">Color</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-3 pt-2 px-1">
                            {[
                                { name: "black", hex: "#000000" },
                                { name: "white", hex: "#ffffff", border: true },
                                { name: "red", hex: "#ef4444" },
                                { name: "blue", hex: "#3b82f6" },
                                { name: "green", hex: "#22c55e" },
                                { name: "yellow", hex: "#eab308" },
                                { name: "purple", hex: "#a855f7" },
                                { name: "pink", hex: "#ec4899" },
                                { name: "orange", hex: "#f97316" },
                                { name: "gray", hex: "#6b7280" },
                            ].map((c) => (
                                <div
                                    key={c.name}
                                    className={`
                                        h-8 w-8 rounded-full cursor-pointer transition-all relative flex items-center justify-center
                                        ${selectedColor === c.name ? "ring-2 ring-offset-2 ring-slate-900 scale-110" : "hover:scale-110 hover:shadow-md"}
                                        ${c.border ? "border border-gray-200" : ""}
                                    `}
                                    style={{ backgroundColor: c.hex }}
                                    onClick={() => handleColorChange(c.name)}
                                    title={c.name}
                                >
                                    {selectedColor === c.name && (
                                        <div className={`w-2 h-2 rounded-full ${c.name === 'white' ? 'bg-black' : 'bg-white'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
