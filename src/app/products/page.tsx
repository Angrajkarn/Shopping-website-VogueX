"use client"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { ProductListing } from "@/components/product/ProductListing"

function ProductsContent() {
    return <ProductListing />
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <ProductsContent />
        </Suspense>
    )
}
