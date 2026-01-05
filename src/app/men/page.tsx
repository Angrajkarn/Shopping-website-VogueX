"use client"

import { ProductListing } from "@/components/product/ProductListing"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function MenPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <ProductListing initialCategory="mens-shirts" />
        </Suspense>
    )
}
