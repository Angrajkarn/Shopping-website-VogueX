"use client"

import React, { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface OtpInputProps {
    length?: number
    onComplete: (otp: string) => void
}

export function OtpInput({ length = 6, onComplete }: OtpInputProps) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus()
        }
    }, [])

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return

        const newOtp = [...otp]
        newOtp[index] = value.substring(value.length - 1)
        setOtp(newOtp)

        const combinedOtp = newOtp.join("")
        if (combinedOtp.length === length) {
            onComplete(combinedOtp)
        }

        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const data = e.clipboardData.getData("text").slice(0, length)
        if (isNaN(Number(data))) return

        const newOtp = [...otp]
        data.split("").forEach((char, index) => {
            newOtp[index] = char
        })
        setOtp(newOtp)

        const combinedOtp = newOtp.join("")
        if (combinedOtp.length === length) {
            onComplete(combinedOtp)
        }
    }

    return (
        <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
                <Input
                    key={index}
                    ref={(ref) => { inputRefs.current[index] = ref }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={cn(
                        "w-12 h-14 text-center text-2xl font-bold bg-white/10 border-white/20 text-white focus:border-indigo-500 focus:ring-indigo-500 transition-all",
                        digit && "border-indigo-500 bg-indigo-500/10"
                    )}
                />
            ))}
        </div>
    )
}
