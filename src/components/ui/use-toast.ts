// Simplified version of shadcn/ui toast hook
import { useState, useEffect } from "react"

export interface ToastProps {
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: "default" | "destructive"
}

type ToastAction =
    | { type: "ADD_TOAST"; toast: ToastProps }
    | { type: "DISMISS_TOAST" }

export function useToast() {
    const [toasts, setToasts] = useState<ToastProps[]>([])

    const toast = ({ title, description, variant = "default" }: ToastProps) => {
        // In a real implementation this would use a context or global state
        // For now we'll just log or use window.alert if needed, but the UI expects this hook
        console.log("Toast:", title, description)
        // We could implement a simple custom toaster overlay here if needed
    }

    return {
        toast,
        toasts,
        dismiss: () => setToasts([])
    }
}
