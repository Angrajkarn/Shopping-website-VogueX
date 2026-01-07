import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
            <div className="relative">
                <div className="text-4xl font-black tracking-tighter mb-4 animate-pulse">
                    VOGUEX
                </div>
                <div className="absolute -top-6 -right-6">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
                </div>
            </div>
            <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
                Curating Fashion...
            </p>
        </div>
    )
}
