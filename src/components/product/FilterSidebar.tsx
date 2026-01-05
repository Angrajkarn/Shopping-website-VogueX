"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function FilterSidebar() {
    return (
        <div className="w-full space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Filters</h3>
                <p className="text-sm text-muted-foreground">
                    Refine your search
                </p>
            </div>

            <Accordion type="single" collapsible defaultValue="category" className="w-full">
                <AccordionItem value="category">
                    <AccordionTrigger>Category</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {["Men", "Women", "Kids", "Accessories", "Footwear"].map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox id={category} />
                                    <Label htmlFor={category}>{category}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-2">
                            <Slider defaultValue={[0, 1000]} max={1000} step={10} />
                            <div className="flex justify-between text-sm">
                                <span>$0</span>
                                <span>$1000+</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="color">
                    <AccordionTrigger>Color</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-2">
                            {["black", "white", "red", "blue", "green", "yellow"].map((color) => (
                                <div
                                    key={color}
                                    className="h-6 w-6 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
