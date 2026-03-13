"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface VoiceContextType {
    isListening: boolean
    isProcessing: boolean
    transcript: string
    lastCommand: string | null
    toggleListening: () => void
    speak: (text: string) => void
    isSupported: boolean
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function VoiceControlProvider({ children }: { children: ReactNode }) {
    const [isListening, setIsListening] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [lastCommand, setLastCommand] = useState<string | null>(null)
    const [isSupported, setIsSupported] = useState(false)
    const [recognition, setRecognition] = useState<any>(null)

    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (SpeechRecognition) {
                setIsSupported(true)
                const recog = new SpeechRecognition()
                recog.continuous = false
                recog.interimResults = true
                recog.lang = "en-US"

                recog.onstart = () => setIsListening(true)

                recog.onend = () => {
                    setIsListening(false)
                }

                recog.onresult = (event: any) => {
                    const current = event.resultIndex
                    const transcriptText = event.results[current][0].transcript
                    setTranscript(transcriptText)

                    if (event.results[current].isFinal) {
                        processCommand(transcriptText.toLowerCase())
                    }
                }

                recog.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error)
                    setIsListening(false)
                    setIsProcessing(false)
                    if (event.error === 'not-allowed') {
                        toast.error("Microphone access denied.")
                    }
                }

                setRecognition(recog)
            }
        }
    }, [])

    const processCommand = async (cmd: string) => {
        setLastCommand(cmd)
        setIsProcessing(true)

        try {
            // Get current context
            const path = window.location.pathname
            const searchParams = new URLSearchParams(window.location.search)
            
            // Extract product ID from URL if possible
            // Format is usually /products/[name]-[id]
            let productId = null
            if (path.startsWith('/products/')) {
                const parts = path.split('-')
                productId = parts[parts.length - 1]
            }

            // Backend Intent Engine
            const res = await api.processVoiceCommand(cmd, {
                path,
                productId,
                category: searchParams.get('category')
            })

            // Speak response
            if (res.message) speak(res.message)

            // Execute Action
            if (res.action === 'navigate' && res.val) {
                router.push(res.val)
            } else if (res.action === 'scroll') {
                const el = document.getElementById(res.val)
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' })
                } else {
                    // Fallback to searching for the text in headings
                    window.scrollBy({ top: 500, behavior: 'smooth' })
                }
            } else if (res.action === 'scroll_window') {
                window.scrollBy({ top: res.val, behavior: 'smooth' })
            } else if (res.action === 'scroll_top') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else if (res.action === 'reload') {
                window.location.reload()
            }

        } catch (e) {
            console.error(e)
            speak("I'm having trouble connecting to the server.")
        } finally {
            setIsProcessing(false)
        }
    }

    const speak = (text: string) => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(text)
            const voices = window.speechSynthesis.getVoices()
            const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha") || v.lang.startsWith("en"))
            if (preferredVoice) utterance.voice = preferredVoice
            utterance.pitch = 1.1 // Slightly higher for friendly vibe
            utterance.rate = 1.0
            window.speechSynthesis.speak(utterance)
        }
    }

    const toggleListening = () => {
        if (!recognition) return
        if (isListening) {
            recognition.stop()
        } else {
            setTranscript("")
            recognition.start()
        }
    }

    return (
        <VoiceContext.Provider value={{ isListening, isProcessing, transcript, lastCommand, toggleListening, speak, isSupported }}>
            {children}
        </VoiceContext.Provider>
    )
}

export const useVoice = () => {
    const context = useContext(VoiceContext)
    if (context === undefined) {
        throw new Error("useVoice must be used within a VoiceControlProvider")
    }
    return context
}
