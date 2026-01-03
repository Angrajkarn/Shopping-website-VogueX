"use client"

import { Check, Circle, Truck, PackageCheck, Box } from "lucide-react"

interface OrderTrackerProps {
    status: string
    createdAt: string
}

export function OrderTracker({ status, createdAt }: OrderTrackerProps) {
    const steps = [
        { label: "Order Placed", date: new Date(createdAt).toLocaleDateString(), icon: Box },
        { label: "Processing", date: "", icon: PackageCheck },
        { label: "Shipped", date: "", icon: Truck },
        { label: "Delivered", date: "", icon: Check },
    ]

    // Determine current step index
    let currentStep = 0
    const s = status?.toLowerCase()
    if (s === 'processing') currentStep = 1
    if (s === 'shipped' || s === 'in_transit') currentStep = 2
    if (s === 'delivered') currentStep = 3
    if (s === 'cancelled') currentStep = -1

    if (currentStep === -1) {
        return (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-700 font-medium text-center">
                This order has been cancelled.
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Order Status</h3>
            <div className="relative flex flex-col md:flex-row justify-between w-full">

                {/* Use a simple flex layout for milestones */}
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStep
                    const isLast = index === steps.length - 1
                    const isActive = index === currentStep

                    return (
                        <div key={step.label} className="relative flex-1 flex md:flex-col items-center md:items-start group z-10 pb-8 md:pb-0 last:pb-0">

                            {/* Connecting Line (Desktop) */}
                            {!isLast && (
                                <div className={`
                                    hidden md:block absolute top-[15px] left-[15px] w-full h-[3px] -z-10
                                    ${index < currentStep ? "bg-green-500" : "bg-gray-200"}
                                `} />
                            )}
                            {/* Connecting Line (Mobile) */}
                            {!isLast && (
                                <div className={`
                                    md:hidden absolute left-[15px] top-[30px] h-full w-[3px] -z-10
                                    ${index < currentStep ? "bg-green-500" : "bg-gray-200"}
                                `} />
                            )}

                            <div className="flex md:flex-col items-center gap-4 md:gap-2 w-full">
                                {/* Icon Circle */}
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                    ${isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 text-gray-300"}
                                    ${isActive ? "ring-4 ring-green-100" : ""}
                                `}>
                                    {isCompleted ? <step.icon className="w-4 h-4" /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />}
                                </div>

                                {/* Text */}
                                <div className="md:text-center md:items-center flex flex-col">
                                    <span className={`text-sm font-bold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                                        {step.label}
                                    </span>
                                    {step.date && (
                                        <span className="text-[10px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                                            {step.date}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
