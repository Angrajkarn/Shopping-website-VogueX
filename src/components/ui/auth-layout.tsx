"use client"

import React, { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import Image from "next/image"

export function AuthLayout({ children, title, subtitle, image }: { children: React.ReactNode, title: string, subtitle: string, image: string }) {
    return (
        <div className="min-h-screen w-full grid lg:grid-cols-2 bg-black overflow-hidden">
            {/* Left: Cinematic Image */}
            <div className="relative hidden lg:block overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10" />
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={image}
                        alt="Auth Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>

                {/* Text Overlay */}
                <div className="absolute bottom-20 left-12 z-20 max-w-lg">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-5xl font-bold text-white mb-4 leading-tight"
                    >
                        Redefining <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            Digital Fashion
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="text-lg text-gray-300"
                    >
                        Experience the future of style with our immersive platform.
                    </motion.p>
                </div>
            </div>

            {/* Right: Form Section */}
            <div className="relative flex items-center justify-center p-8 bg-black">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] animate-blob" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] animate-blob animation-delay-2000" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
                </div>

                {/* 3D Card */}
                <TiltCard>
                    <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
                        <div className="mb-8">
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl font-bold text-white"
                            >
                                {title}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-sm text-gray-400 mt-2"
                            >
                                {subtitle}
                            </motion.p>
                        </div>
                        {children}
                    </div>
                </TiltCard>
            </div>
        </div>
    )
}

function TiltCard({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

    const rotateX = useMotionTemplate`${mouseYSpring}deg`
    const rotateY = useMotionTemplate`${mouseXSpring}deg`

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()

        const width = rect.width
        const height = rect.height

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5

        x.set(xPct * 5) // Reduced rotation intensity for better usability
        y.set(yPct * -5)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className="relative z-10 w-full max-w-md perspective-1000"
        >
            {children}
        </motion.div>
    )
}
