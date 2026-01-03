"use client"

import { motion, useInView, HTMLMotionProps } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface MotionSectionProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode
    delay?: number
    className?: string
}

export function MotionSection({
    children,
    delay = 0,
    className,
    ...props
}: MotionSectionProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    )
}
