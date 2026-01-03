"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { useCartStore } from "@/lib/store"
import { AddressList } from "@/components/checkout/AddressList"
import { AddressForm } from "@/components/checkout/AddressForm"
import { OrderSummary } from "@/components/checkout/OrderSummary"
import { PaymentOptions } from "@/components/checkout/PaymentOptions"
import { PriceDetails } from "@/components/checkout/PriceDetails"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function CheckoutPage() {
    const { user } = useAuthStore()
    const { items } = useCartStore()
    const [step, setStep] = useState(2) // 1: Login (Skipped), 2: Address, 3: Order Summary, 4: Payment
    const [selectedAddress, setSelectedAddress] = useState<any>(null)
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [editingAddress, setEditingAddress] = useState<any>(null)

    // Auto-advance if address effectively changes or use direct actions
    const handleAddressSelect = (addr: any) => {
        setSelectedAddress(addr)
    }

    // Step 1: Login (View Only if logged in)
    const renderLoginStep = () => (
        <div className="bg-white p-4 rounded-sm shadow-sm border mb-4">
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <span className="bg-gray-100 text-blue-600 px-2 py-0.5 text-xs font-bold rounded h-fit">1</span>
                    <div>
                        <h3 className="text-gray-500 font-medium uppercase text-sm">Login</h3>
                        <div className="flex gap-2 items-center mt-1">
                            <span className="font-semibold">{user?.first_name || 'User'}</span>
                            <span className="text-sm text-gray-600">{user?.phone_number || user?.email}</span>
                        </div>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 uppercase font-bold text-xs h-8">
                    Change
                </Button>
            </div>
        </div>
    )

    // Step 2: Address
    const renderAddressStep = () => (
        <div className="bg-white rounded-sm shadow-sm border mb-4">
            {/* Header */}
            <div className={`p-4 flex items-center gap-4 ${step === 2 ? 'bg-primary text-white' : 'bg-white'}`}>
                <span className={`px-2 py-0.5 text-xs font-bold rounded h-fit ${step === 2 ? 'bg-white text-primary' : 'bg-gray-100 text-blue-600'}`}>2</span>
                <div className="flex-1 flex justify-between items-center">
                    <h3 className={`font-medium uppercase text-sm ${step === 2 ? 'text-white' : 'text-gray-500'}`}>Delivery Address</h3>
                    {step > 2 && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-600 uppercase font-bold text-xs h-8"
                            onClick={() => setStep(2)}
                        >
                            Change
                        </Button>
                    )}
                </div>
                {step > 2 && selectedAddress && <Check className="w-4 h-4 text-blue-600" />}
            </div>

            {/* Content (Active Step) */}
            {step === 2 && (
                <div className="p-4">
                    {isAddingNew || editingAddress ? (
                        <AddressForm
                            initialData={editingAddress}
                            onCancel={() => {
                                setIsAddingNew(false)
                                setEditingAddress(null)
                            }}
                            onSuccess={(savedAddr) => {
                                setIsAddingNew(false)
                                setEditingAddress(null)
                                setSelectedAddress(savedAddr)
                                // If adding/saving "Deliver Here", auto advance
                                setStep(3)
                            }}
                        />
                    ) : (
                        <AddressList
                            selectedId={selectedAddress?.id || null}
                            onSelect={setSelectedAddress}
                            onAddNew={() => setIsAddingNew(true)}
                            onEdit={(addr) => setEditingAddress(addr)}
                        />
                    )}

                    {selectedAddress && !isAddingNew && !editingAddress && (
                        <div className="mt-4 p-4 bg-gray-50 border-t flex justify-end">
                            <Button
                                onClick={() => setStep(3)}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase w-48 h-12 rounded-sm shadow-sm"
                            >
                                Deliver Here
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Summary View (Collapsed / Completed Step) */}
            {step > 2 && selectedAddress && (
                <div className="p-4 pl-12 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{selectedAddress.name}</span>
                            <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">
                                {selectedAddress.address_type}
                            </span>
                            <span className="text-sm font-semibold ml-2">{selectedAddress.mobile}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            {selectedAddress.address}, {selectedAddress.locality}, {selectedAddress.city}, {selectedAddress.state} - <span className="font-medium text-black">{selectedAddress.pincode}</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    )

    // Step 3: Order Summary
    const renderOrderSummaryStep = () => (
        <div className="bg-white rounded-sm shadow-sm border mb-4">
            <div className={`p-4 flex items-center gap-4 ${step === 3 ? 'bg-primary text-white' : 'bg-white'}`}>
                <span className={`px-2 py-0.5 text-xs font-bold rounded h-fit ${step === 3 ? 'bg-white text-primary' : 'bg-gray-100 text-blue-600'}`}>3</span>
                <div className="flex-1 flex justify-between items-center">
                    <h3 className={`font-medium uppercase text-sm ${step === 3 ? 'text-white' : 'text-gray-500'}`}>Order Summary</h3>
                    {step > 3 && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-600 uppercase font-bold text-xs h-8"
                            onClick={() => setStep(3)}
                        >
                            Change
                        </Button>
                    )}
                </div>
                {step > 3 && <Check className="w-4 h-4 text-blue-600" />}
            </div>

            {step === 3 && (
                <OrderSummary onContinue={() => setStep(4)} />
            )}

            {step > 3 && (
                <div className="p-4 pl-12 text-sm text-gray-600">
                    <span className="font-bold text-black">{items.length} Items</span> selected for order.
                </div>
            )}
        </div>
    )

    const router = useRouter()

    const handlePaymentComplete = (method: string) => {
        toast.success(`Order placed successfully via ${method.toUpperCase()}!`)
        // In a real app, create order in backend here
        setTimeout(() => {
            router.push('/')
        }, 1500)
    }

    // Step 4: Payment
    const renderPaymentStep = () => (
        <div className="bg-white rounded-sm shadow-sm border mb-4">
            <div className={`p-4 flex items-center gap-4 ${step === 4 ? 'bg-primary text-white' : 'bg-white'}`}>
                <span className={`px-2 py-0.5 text-xs font-bold rounded h-fit ${step === 4 ? 'bg-white text-primary' : 'bg-gray-100 text-blue-600'}`}>4</span>
                <h3 className={`font-medium uppercase text-sm ${step === 4 ? 'text-white' : 'text-gray-500'}`}>Payment Options</h3>
            </div>

            {step === 4 && (
                <div className="p-0">
                    <PaymentOptions
                        onPaymentComplete={handlePaymentComplete}
                        selectedAddress={selectedAddress}
                    />
                </div>
            )}
        </div>
    )

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-100 pt-20 pb-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main Flow */}
                        <div className="flex-1">
                            {renderLoginStep()}
                            {renderAddressStep()}
                            {renderOrderSummaryStep()}
                            {renderPaymentStep()}
                        </div>

                        {/* Sidebar */}
                        <div className="w-full lg:w-80 h-fit">
                            <PriceDetails />
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}
