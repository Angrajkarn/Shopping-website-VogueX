"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, X, Mic, Camera, Loader2, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAnalytics } from "@/hooks/useAnalytics"
import { api } from "@/lib/api"

export function SearchModal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [suggestions, setSuggestions] = React.useState<string[]>([])
    const [isListening, setIsListening] = React.useState(false)
    const [isScanning, setIsScanning] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const router = useRouter()
    const { track } = useAnalytics()

    // Mock suggestions or fetch from backend
    React.useEffect(() => {
        if (query.length > 2) {
            // In a real app, debounce and fetch from api.searchProducts(query) to get suggestions
            // For now, mock based on query
            if ("sarees".includes(query.toLowerCase())) setSuggestions(["Silk Saree", "Cotton Saree", "Banarasi Saree"])
            else if ("kurta".includes(query.toLowerCase())) setSuggestions(["Mens Kurta", "Womens Kurta Set", "Yellow Kurta"])
            else setSuggestions([])
        } else {
            setSuggestions([])
        }
    }, [query])

    const handleSearch = (e?: React.FormEvent, term?: string) => {
        e?.preventDefault()
        const q = term || query
        if (!q.trim()) return

        // 🧠 TRACK ML EVENT
        track('SEARCH', { metadata: { query: q, type: isListening ? 'voice' : 'text' } })

        setOpen(false)
        router.push(`/shop?q=${encodeURIComponent(q)}`)
    }

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice search is not supported in this browser.")
            return
        }

        setIsListening(true)
        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition()
        recognition.continuous = false
        recognition.lang = 'en-US'

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setQuery(transcript)
            handleSearch(undefined, transcript)
            setIsListening(false)
        }

        recognition.onerror = () => setIsListening(false)
        recognition.onend = () => setIsListening(false)

        recognition.start()
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsScanning(true)

        // Simulate AI Vision Analysis
        setTimeout(() => {
            setIsScanning(false)
            setQuery("Floral Dress") // Simulated result
            setSuggestions(["Red Floral Dress", "Floral Maxi Dress", "Summer Floral Print"])
        }, 2000)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden gap-0">
                <DialogTitle className="sr-only">Search</DialogTitle>
                <DialogDescription className="sr-only">Search for products</DialogDescription>

                <div className="p-4 border-b flex items-center gap-3">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <form onSubmit={(e) => handleSearch(e)} className="flex-1">
                        <Input
                            placeholder="Search for 'Red Silk Saree'..."
                            className="border-0 focus-visible:ring-0 px-0 text-lg shadow-none"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                    </form>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Sensory Inputs */}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b">
                    <Button
                        variant="outline"
                        size="sm"
                        className={`gap-2 text-xs rounded-full ${isListening ? 'bg-red-50 text-red-500 border-red-200 animate-pulse' : ''}`}
                        onClick={startListening}
                    >
                        {isListening ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mic className="w-3 h-3" />}
                        {isListening ? "Listening..." : "Voice Search"}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-xs rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {isScanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                        {isScanning ? "Analyzing..." : "Visual Search"}
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>

                <div className="p-4 bg-muted/30 min-h-[300px]">
                    {isScanning ? (
                        <div className="flex flex-col items-center justify-center h-full py-10 gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                <div className="bg-white p-4 rounded-full border shadow-sm relative z-10">
                                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">Analyzing image patterns...</p>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Suggestions</h4>
                            <div className="flex flex-col gap-1">
                                {suggestions.map(s => (
                                    <Button
                                        key={s}
                                        variant="ghost"
                                        className="justify-start h-auto py-2 px-2 text-sm"
                                        onClick={() => handleSearch(undefined, s)}
                                    >
                                        <Search className="w-3 h-3 mr-2 text-muted-foreground" /> {s}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-sm text-muted-foreground">Try searching for <span className="text-primary font-medium">"Lehenga"</span> or <span className="text-primary font-medium">"Sherwani"</span></p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
