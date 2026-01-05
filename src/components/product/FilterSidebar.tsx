"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Star, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function FilterSidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // State for local interaction before pushing to URL (for smoother UX) or direct push
    // For "Real Time", direct push is better but might need debounce for slider.

    const [priceRange, setPriceRange] = React.useState([0, 50000])

    const updateFilter = (expert: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === null) {
            params.delete(expert)
        } else {
            params.set(expert, value)
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const toggleArrayFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const current = params.get(key)?.split(",") || []

        if (current.includes(value)) {
            const next = current.filter(c => c !== value)
            if (next.length === 0) params.delete(key)
            else params.set(key, next.join(","))
        } else {
            current.push(value)
            params.set(key, current.join(","))
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const brands = ["Nike", "Adidas", "Puma", "Zara", "H&M", "Levi's", "Gucci", "Versace", "Rolex", "Casio", "Apple", "Samsung"]
    const [brandSearch, setBrandSearch] = React.useState("")

    const filteredBrands = brands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight">Filters</h3>
                    <p className="text-sm text-muted-foreground">
                        {searchParams.toString() ? "Refine results" : "Select filters"}
                    </p>
                </div>
                {searchParams.toString() && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2"
                        onClick={() => router.push('?')}
                    >
                        Clear All
                    </Button>
                )}
            </div>

            <Accordion type="multiple" defaultValue={["price", "brand", "discount", "rating"]} className="w-full">

                {/* --- PRICE FILTER --- */}
                <AccordionItem value="price">
                    <AccordionTrigger className="text-base font-semibold">Price Range</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-4 px-1">
                            <Slider
                                defaultValue={[0, 50000]}
                                max={100000}
                                step={500}
                                min={0}
                                value={priceRange}
                                onValueChange={setPriceRange}
                                onValueCommit={(vals) => {
                                    const params = new URLSearchParams(searchParams.toString())
                                    params.set("minPrice", vals[0].toString())
                                    params.set("maxPrice", vals[1].toString())
                                    router.push(`?${params.toString()}`, { scroll: false })
                                }}
                            />
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="border px-3 py-1 rounded bg-slate-50">₹{priceRange[0].toLocaleString()}</span>
                                <span className="text-muted-foreground">-</span>
                                <span className="border px-3 py-1 rounded bg-slate-50">₹{priceRange[1].toLocaleString()}</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* --- BRAND FILTER --- */}
                <AccordionItem value="brand">
                    <AccordionTrigger className="text-base font-semibold">Brands</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search brands..."
                                    className="pl-8 h-9 text-sm"
                                    value={brandSearch}
                                    onChange={(e) => setBrandSearch(e.target.value)}
                                />
                            </div>
                            <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                                <div className="space-y-2">
                                    {filteredBrands.map((brand) => {
                                        const isChecked = (searchParams.get("brand")?.split(",") || []).includes(brand)
                                        return (
                                            <div key={brand} className="flex items-center space-x-2 p-1 hover:bg-accent rounded-sm cursor-pointer" onClick={() => toggleArrayFilter("brand", brand)}>
                                                <Checkbox
                                                    id={brand}
                                                    checked={isChecked}
                                                    onCheckedChange={() => toggleArrayFilter("brand", brand)}
                                                />
                                                <Label htmlFor={brand} className="flex-1 cursor-pointer font-normal">{brand}</Label>
                                            </div>
                                        )
                                    })}
                                    {filteredBrands.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No brands found</p>}
                                </div>
                            </ScrollArea>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* --- DISCOUNT FILTER --- */}
                <AccordionItem value="discount">
                    <AccordionTrigger className="text-base font-semibold">Discount Range</AccordionTrigger>
                    <AccordionContent>
                        <RadioGroup
                            defaultValue={searchParams.get("discount") || "all"}
                            onValueChange={(val) => updateFilter("discount", val === "all" ? null : val)}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="10" id="d-10" />
                                <Label htmlFor="d-10">10% Off or more</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="30" id="d-30" />
                                <Label htmlFor="d-30">30% Off or more</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="50" id="d-50" />
                                <Label htmlFor="d-50">50% Off or more</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="70" id="d-70" />
                                <Label htmlFor="d-70">70% Off or more</Label>
                            </div>
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>

                {/* --- GENDER FILTER --- */}
                <AccordionItem value="gender">
                    <AccordionTrigger className="text-base font-semibold">Gender</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {["Men", "Women", "Kids", "Unisex"].map((g) => {
                                const isChecked = (searchParams.get("gender")?.split(",") || []).includes(g)
                                return (
                                    <div key={g} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={g}
                                            checked={isChecked}
                                            onCheckedChange={() => toggleArrayFilter("gender", g)}
                                        />
                                        <Label htmlFor={g}>{g}</Label>
                                    </div>
                                )
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* --- COLOR FILTER --- */}
                <AccordionItem value="color">
                    <AccordionTrigger className="text-base font-semibold">Color</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-2">
                            {["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple", "Beige", "Navy"].map((color) => {
                                const isSelected = (searchParams.get("color")?.split(",") || []).includes(color)
                                return (
                                    <div
                                        key={color}
                                        className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border shadow-sm transition-transform hover:scale-110 ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-200'}`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        onClick={() => toggleArrayFilter("color", color)}
                                        title={color}
                                    >
                                        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
                                    </div>
                                )
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* --- SIZE FILTER --- */}
                <AccordionItem value="size">
                    <AccordionTrigger className="text-base font-semibold">Size</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-2">
                            {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((size) => {
                                const isSelected = (searchParams.get("size")?.split(",") || []).includes(size)
                                return (
                                    <div
                                        key={size}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer border transition-colors ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-accent border-input'}`}
                                        onClick={() => toggleArrayFilter("size", size)}
                                    >
                                        {size}
                                    </div>
                                )
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* --- RATING FILTER --- */}
                <AccordionItem value="rating">
                    <AccordionTrigger className="text-base font-semibold">Customer Ratings</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {[4, 3, 2, 1].map((rating) => {
                                const isSelected = searchParams.get("minRating") === rating.toString()
                                return (
                                    <div
                                        key={rating}
                                        className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${isSelected ? 'bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-accent'}`}
                                        onClick={() => updateFilter("minRating", isSelected ? null : rating.toString())}
                                    >
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-current" : "text-gray-300"}`} />
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium">& Up</span>
                                    </div>
                                )
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* --- AVAILABILITY --- */}
                <AccordionItem value="availability">
                    <AccordionTrigger className="text-base font-semibold">Availability</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex items-center space-x-2 py-1">
                            <Checkbox
                                id="in-stock"
                                checked={searchParams.get("availability") === "in_stock"}
                                onCheckedChange={(c) => updateFilter("availability", c ? "in_stock" : null)}
                            />
                            <Label htmlFor="in-stock">Exclude Out of Stock</Label>
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    )
}
