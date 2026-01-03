"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"

export function MagneticButton({
    children,
    className = "",
    onClick,
}: {
    children: React.ReactNode
    className?: string
    onClick?: () => void
}) {
    const ref = useRef<HTMLButtonElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX, clientY } = e
        const { height, width, left, top } = ref.current!.getBoundingClientRect()
        const middleX = clientX - (left + width / 2)
        const middleY = clientY - (top + height / 2)
        setPosition({ x: middleX, y: middleY })
    }

    const reset = () => {
        setPosition({ x: 0, y: 0 })
    }

    const { x, y } = position
    return (
        <motion.button
            ref={ref}
            className={className}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onClick={onClick}
        >
            {children}
        </motion.button>
    )
}
