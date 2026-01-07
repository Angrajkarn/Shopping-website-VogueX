"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CreditCard, Smartphone, Banknote, Wallet, Plus } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { formatPrice } from "@/lib/utils"

// Add declaration for Razorpay global
declare global {
    interface Window {
        Razorpay: any;
    }
}

interface PaymentOptionsProps {
    onPaymentComplete: (method: string) => void
    selectedAddress: any
}

export function PaymentOptions({ onPaymentComplete, selectedAddress }: PaymentOptionsProps) {
    const [paymentMethod, setPaymentMethod] = useState("upi")
    const { items, clearCart, giftCardCode, giftCardBalance, isGiftCardApplied, applyGiftCard, removeGiftCard } = useCartStore()
    const { user, token } = useAuthStore()
    const router = useRouter()
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    // Processing state
    const [isProcessing, setIsProcessing] = useState(false)
    const [upiId, setUpiId] = useState("")
    const [isUpiVerified, setIsUpiVerified] = useState(false)
    const [showTimer, setShowTimer] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
    const [timer, setTimer] = useState<any>(null)

    const [inputCode, setInputCode] = useState("")
    const [isCheckingGiftCard, setIsCheckingGiftCard] = useState(false)

    // Calculate final total
    const effectiveTotal = Math.max(0, total - (isGiftCardApplied ? giftCardBalance : 0))

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s < 10 ? '0' : ''}${s}`
    }

    const handleVerifyUPI = () => {
        if (!upiId) {
            toast.error("Please enter a UPI ID")
            return
        }
        // Strict Regex for VPA (Format Only)
        // /[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}/
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/
        if (!upiRegex.test(upiId)) {
            toast.error("Invalid UPI ID")
            return
        }

        toast.success("UPI ID Verified") // DO NOT say "Bank Verified"
        setIsUpiVerified(true)
    }

    // ... loadRazorpay ...
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script")
            script.src = "https://checkout.razorpay.com/v1/checkout.js"
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handlePayment = async () => {
        if (!token) {
            try {
                router.push("/login?redirect=/checkout")
            } catch (e) {
                window.location.href = "/login?redirect=/checkout"
            }
            return
        }
        setIsProcessing(true)

        if (paymentMethod === 'cod') {
            // COD Flow
            setTimeout(() => {
                setIsProcessing(false)
                onPaymentComplete(paymentMethod)
            }, 2000)
            return
        }

        // Razorpay Flow
        const res = await loadRazorpay()
        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?")
            setIsProcessing(false)
            return
        }

        try {
            // 1. Create Order on Backend
            // 1. Create Order on Backend
            const orderPayload = {
                amount: total,
                items: items.map(item => ({
                    product_id: item.id,
                    product_name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity
                })),
                shipping_address: selectedAddress ?
                    `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`
                    : "Address Not Provided",
                gift_card_code: isGiftCardApplied ? giftCardCode : undefined
            }

            const orderData = await api.createRazorpayOrder(token, orderPayload)

            if (orderData.error) {
                toast.error(orderData.error)
                setIsProcessing(false)
                return
            }

            // Start 5 min timer
            setTimer(300)

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RxAgOJqtxNUD2g",
                amount: orderData.amount,
                currency: orderData.currency,
                name: "VogueX",
                description: "Order Transaction",
                order_id: orderData.id,
                handler: async function (response: any) {
                    // Payment Successful
                    console.log("PAYMENT SUCCESS", response)

                    try {
                        // Verify Payment on Backend
                        await api.verifyPayment(token, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        })

                        toast.success("Payment Verified & Order Placed!")
                        clearCart()
                        setTimer(null)
                        router.push(`/checkout/success?order_id=${orderData.local_order_id}`)
                    } catch (verifyError) {
                        console.error("Verification Failed", verifyError)
                        toast.error("Payment successful but verification failed. Please contact support.")
                        // Still redirect but user might see Pending status
                        router.push(`/checkout/success?order_id=${orderData.local_order_id}`)
                    }
                },
                prefill: {
                    name: user?.first_name,
                    email: user?.email,
                    contact: user?.phone_number || "",
                },
                theme: {
                    color: "#3399cc",
                },
                // CUSTOM CONFIG FOR UPI/QR
                config: {
                    display: {
                        blocks: {
                            banks: {
                                name: 'Pay via UPI',
                                instruments: [
                                    {
                                        method: 'upi',
                                        flows: ['collect', 'intent', 'qr']
                                    }
                                ]
                            }
                        },
                        sequence: ['block.banks'],
                        preferences: {
                            show_default_blocks: false
                        }
                    }
                },
                modal: {
                    ondismiss: function () {
                        // clearInterval(timerInterval) // Removed as timerInterval is not defined
                        setShowTimer(false)
                        setIsProcessing(false)
                        toast("Payment cancelled")
                    }
                }
            }

            const paymentObject = new window.Razorpay(options)
            paymentObject.open()

        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Something went wrong")
            setIsProcessing(false)
            setShowTimer(false)
        }
    }

    return (
        <div className="bg-white relative">
            {/* Timer Overlay */}
            {showTimer && (
                <div className="absolute inset-0 z-50 bg-white/90 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Complete Your Payment</h3>
                    <p className="text-gray-600 mb-4">Please approve the payment in your UPI app</p>
                    <div className="text-3xl font-mono font-bold text-orange-600">
                        {formatTime(timeLeft)}
                    </div>
                    <p className="text-sm text-gray-400 mt-4">Do not close this window</p>
                </div>
            )}

            {/* Offer Banner */}
            <div className="p-4 bg-[#effcf5] flex items-center justify-between border-b border-dashed border-green-200">
                <div className="text-sm">
                    <span className="font-bold text-green-700">10% instant discount</span>
                    <span className="text-gray-600 ml-2">Claim now with payment offers</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-[10px] bg-white border px-1 py-0.5 rounded text-gray-400 font-bold">+3</span>
                </div>
            </div>

            {/* Price Details Block - Flipkart Style */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <h3 className="text-gray-500 font-bold mb-3 uppercase text-sm">Price Details</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <div>Price ({items.length} item{items.length > 1 ? 's' : ''})</div>
                        <div>{formatPrice(total)}</div>
                    </div>
                    {isGiftCardApplied && (
                        <div className="flex justify-between text-green-600">
                            <div>Gift Card Discount</div>
                            <div>- {formatPrice(Math.min(giftCardBalance, total))}</div>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <div>Delivery Charges</div>
                        <div className="text-green-600">Free</div>
                    </div>

                    <div className="border-t border-dashed my-2"></div>

                    <div className="flex justify-between font-bold text-lg">
                        <div>Total Amount</div>
                        <div>{formatPrice(effectiveTotal)}</div>
                    </div>
                </div>
                {isGiftCardApplied && (
                    <div className="mt-3 text-green-600 font-bold text-sm">
                        You will save {formatPrice(Math.min(giftCardBalance, total))} on this order
                    </div>
                )}
            </div>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="divide-y">

                {/* UPI */}
                <div className={`p-4 ${paymentMethod === 'upi' ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex items-start gap-3">
                        <RadioGroupItem value="upi" id="upi" className="mt-1" />
                        <div className="flex-1">
                            <Label htmlFor="upi" className="font-medium text-base flex items-center gap-2 cursor-pointer">
                                <span>UPI</span>
                                <div className="flex gap-1 ml-2">
                                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7ec.svg" alt="UPI" className="h-4" />
                                </div>
                            </Label>
                            <p className="text-xs text-green-600 mt-0.5">Get upto {formatPrice(15)} cashback • 2 offers available</p>

                            {paymentMethod === 'upi' && (
                                <div className="mt-4 pl-0 max-w-sm">
                                    <p className="text-sm text-gray-600 mb-3">Pay by any UPI app</p>
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Enter UPI ID"
                                                className={`bg-white ${isUpiVerified ? 'border-green-500' : ''}`}
                                                value={upiId}
                                                onChange={(e) => {
                                                    setUpiId(e.target.value)
                                                    setIsUpiVerified(false)
                                                }}
                                            />
                                            <Button
                                                variant="secondary"
                                                className={`
                                                        ${isUpiVerified ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                                    `}
                                                onClick={handleVerifyUPI}
                                            >
                                                {isUpiVerified ? 'Verified' : 'Verify'}
                                            </Button>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Google Pay, PhonePe, Paytm and more
                                        </div>
                                        <Button onClick={handlePayment} disabled={isProcessing} className="w-full mt-2 bg-orange-500 hover:bg-orange-600 h-12 uppercase font-bold shadow-sm">
                                            {isProcessing ? "Processing..." : `Pay ${formatPrice(effectiveTotal)}`}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div className={`p-4 ${paymentMethod === 'card' ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex items-start gap-3">
                        <RadioGroupItem value="card" id="card" className="mt-1" />
                        <div className="flex-1">
                            <Label htmlFor="card" className="font-medium text-base flex items-center gap-2 cursor-pointer">
                                <CreditCard className="w-5 h-5 text-gray-600" />
                                Credit / Debit / ATM Card
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">Add and secure cards as per RBI guidelines</p>
                            <p className="text-xs text-green-600">Save upto {formatPrice(603)} • 3 offers available</p>

                            {paymentMethod === 'card' && (
                                <div className="mt-4 max-w-sm space-y-4">
                                    <Input placeholder="Card Number" className="bg-white" />
                                    <div className="flex gap-4">
                                        <Input placeholder="Valid Thru (MM/YY)" className="bg-white" />
                                        <Input placeholder="CVV" className="bg-white" />
                                    </div>
                                    <Button onClick={handlePayment} disabled={isProcessing} className="w-full bg-orange-500 hover:bg-orange-600 h-12 uppercase font-bold shadow-sm">
                                        {isProcessing ? "Processing..." : `Pay ${formatPrice(effectiveTotal)}`}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* EMI */}
                <div className={`p-4 ${paymentMethod === 'emi' ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex items-start gap-3">
                        <RadioGroupItem value="emi" id="emi" className="mt-1" />
                        <div className="flex-1">
                            <Label htmlFor="emi" className="font-medium text-base flex items-center gap-2 cursor-pointer">
                                <Wallet className="w-5 h-5 text-gray-600" />
                                EMI (Easy Installments)
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">Get Debit and Cardless EMIs on HDFC Bank</p>
                            {paymentMethod === 'emi' && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 italic">No EMI options available for this order.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* COD */}
                <div className={`p-4 ${paymentMethod === 'cod' ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex items-start gap-3">
                        <RadioGroupItem value="cod" id="cod" className="mt-1" />
                        <div className="flex-1">
                            <Label htmlFor="cod" className="font-medium text-base flex items-center gap-2 cursor-pointer">
                                <Banknote className="w-5 h-5 text-gray-600" />
                                Cash on Delivery
                            </Label>
                            {paymentMethod === 'cod' && (
                                <div className="mt-4 max-w-sm">
                                    <div className="bg-white border border-yellow-200 p-3 rounded mb-4 text-sm text-gray-700 shadow-sm">
                                        Due to high demand, we might ask for a small confirmation fee.
                                    </div>
                                    <Button onClick={handlePayment} disabled={isProcessing} className="w-full bg-orange-500 hover:bg-orange-600 h-12 uppercase font-bold shadow-sm">
                                        {isProcessing ? "Processing..." : "Place Order"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gift Card */}
                {/* Gift Card */}
                <div className="p-4 bg-gray-50/50">
                    {!isGiftCardApplied ? (
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter Gift Card Code"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                className="bg-white"
                            />
                            <Button
                                variant="outline"
                                onClick={async () => {
                                    if (!inputCode) return toast.error("Enter a code")
                                    setIsCheckingGiftCard(true)
                                    try {
                                        const res = await api.validateGiftCard(token || "", inputCode)
                                        // Update Global Store
                                        applyGiftCard(inputCode, parseFloat(res.current_balance))
                                        toast.success(`Gift Card Applied! Balance: ${formatPrice(parseFloat(res.current_balance))}`)
                                    } catch (e: any) {
                                        toast.error(e.message)
                                    } finally {
                                        setIsCheckingGiftCard(false)
                                    }
                                }}
                                disabled={isCheckingGiftCard}
                            >
                                {isCheckingGiftCard ? "..." : "Apply"}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded">
                            <div>
                                <p className="font-bold text-green-700">Gift Card Applied</p>
                                <p className="text-xs text-green-600">Code: {giftCardCode} • Balance Used: {formatPrice(Math.min(giftCardBalance, total))}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 h-auto p-0 hover:bg-transparent"
                                onClick={() => {
                                    removeGiftCard()
                                    setInputCode("")
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    )}
                </div>

            </RadioGroup>
        </div>
    )
}

