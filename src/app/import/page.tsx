"use client"

import { useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, Download, CheckCircle, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"

export default function ImportPage() {
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleImport = async () => {
        if (!url) return
        setLoading(true)
        setResult(null)

        try {
            const data = await api.scrapeProduct(url)

            if (data.error) {
                toast.error("Import Failed", { description: data.error })
            } else {
                setResult(data)
                toast.success("Product Imported Successfully!")
            }
        } catch (e) {
            toast.error("Network Error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container max-w-2xl mx-auto py-12 px-4">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Universal Product Importer 🕷️</h1>
                <p className="text-muted-foreground">
                    Paste a URL from Amazon, Flipkart, Myntra, or any store to import it instantly into VogueX.
                </p>
            </div>

            <Card className="p-6 shadow-lg border-2 border-indigo-50">
                <div className="flex gap-4">
                    <Input
                        placeholder="https://amazon.in/p/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="h-12 text-lg"
                    />
                    <Button
                        size="lg"
                        className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700"
                        onClick={handleImport}
                        disabled={loading || !url}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Import
                    </Button>
                </div>

                <div className="mt-4 flex gap-2 justify-center text-xs text-gray-400">
                    <span>Supported:</span>
                    <span className="font-medium text-gray-600">Amazon</span>
                    <span className="font-medium text-gray-600">Flipkart</span>
                    <span className="font-medium text-gray-600">Myntra</span>
                    <span className="font-medium text-gray-600">Ajio</span>
                </div>
            </Card>

            {result && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
                        {/* Image Preview */}
                        <div className="w-32 h-40 bg-white rounded-lg border shrink-0 relative overflow-hidden">
                            {result.images && result.images[0] ? (
                                <Image
                                    src={result.images[0].url}
                                    alt="Imported"
                                    fill
                                    className="object-contain p-2"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                                <CheckCircle className="h-5 w-5" />
                                Product Created!
                            </div>
                            <h3 className="font-bold text-lg line-clamp-2">{result.name}</h3>
                            <p className="text-2xl font-bold">₹{parseFloat(result.variants?.[0]?.price_selling || "0").toLocaleString()}</p>
                            <div className="text-sm text-gray-500 line-clamp-2">{result.description_short}</div>

                            <div className="pt-4 flex gap-3">
                                <Button asChild>
                                    <Link href={`/products/${result.id}`}>View Product Page</Link>
                                </Button>
                                <Button variant="outline" onClick={() => {
                                    setResult(null)
                                    setUrl("")
                                }}>
                                    Import Another
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
