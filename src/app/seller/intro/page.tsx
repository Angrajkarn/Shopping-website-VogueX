"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    CheckCircle2,
    Circle,
    Smartphone,
    Mail,
    FileText,
    PenTool,
    Store,
    PackageSearch,
    ChevronRight,
    ChevronDown,
    MessageCircle,
    PhoneCall
} from "lucide-react"

// Types for Onboarding Steps
type OnboardingStep = "verification" | "kyc" | "store" | "listing"

export default function SellerOnboardingPage() {
    const [currentStep, setCurrentStep] = useState<OnboardingStep>("verification")
    const [progress, setProgress] = useState(0)

    // Verification States - DEFAULT FALSE for Real-time experience
    const [mobile, setMobile] = useState("")
    const [mobileOtp, setMobileOtp] = useState("")
    const [isMobileOtpSent, setIsMobileOtpSent] = useState(false)
    const [isMobileVerified, setIsMobileVerified] = useState(false)

    const [email, setEmail] = useState("")
    const [emailOtp, setEmailOtp] = useState("")
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false)
    const [isEmailVerified, setIsEmailVerified] = useState(false)

    const [loading, setLoading] = useState(false)
    const [gstin, setGstin] = useState("")

    // Handlers
    const handleSendMobileOtp = () => {
        if (mobile.length !== 10) return
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setIsMobileOtpSent(true)
        }, 1500)
    }

    const handleVerifyMobile = () => {
        if (mobileOtp.length !== 4) return
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setIsMobileVerified(true)
            setProgress((prev) => prev + 10)
        }, 1500)
    }

    const handleSendEmailOtp = () => {
        if (!email.includes("@")) return
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setIsEmailOtpSent(true)
        }, 1500)
    }

    const handleVerifyEmail = () => {
        if (emailOtp.length !== 4) return
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setIsEmailVerified(true)
            setProgress((prev) => prev + 10)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-8 pb-20">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT SIDEBAR: Progress Tracker */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm border sticky top-24">
                            <div className="p-6 border-b bg-yellow-50/50">
                                <h3 className="font-bold text-slate-800 mb-4">Your onboarding completion status</h3>
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-3xl font-black text-slate-900">{progress}%</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 space-y-6">
                                <StepItem
                                    label="Mobile & Email Verification"
                                    active={currentStep === "verification"}
                                    completed={isMobileVerified && isEmailVerified}
                                    subSteps={["Mobile Verification", "Email Verification"]}
                                />
                                <StepItem
                                    label="ID & Signature Verification"
                                    active={currentStep === "kyc"}
                                    completed={false}
                                    subSteps={["GSTIN Verification", "Signature Verification"]}
                                />
                                <StepItem
                                    label="Store & Pickup Details"
                                    active={currentStep === "store"}
                                    completed={false}
                                    subSteps={["Display Name", "Pickup Address"]}
                                />
                                <StepItem
                                    label="Listing & Stock Availability"
                                    active={currentStep === "listing"}
                                    completed={false}
                                    subSteps={["Listing Created"]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT: Forms */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-2xl font-bold text-slate-900">Hello</h1>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                                Application ID: SEL-2025-X092
                            </span>
                        </div>

                        {/* STEP 1: Verification */}
                        <div className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-300 ${currentStep === "verification" ? "ring-2 ring-blue-600" : "opacity-80"}`}>
                            <div className="p-6 border-b flex justify-between items-center cursor-pointer" onClick={() => setCurrentStep("verification")}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isMobileVerified && isEmailVerified ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
                                        {isMobileVerified && isEmailVerified ? <CheckCircle2 className="w-5 h-5" /> : <Smartphone className="w-4 h-4" />}
                                    </div>
                                    <h2 className="font-bold text-slate-800">Mobile & Email Verification</h2>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${currentStep === "verification" ? "rotate-180" : ""}`} />
                            </div>

                            {currentStep === "verification" && (
                                <div className="p-6 space-y-8 animate-in slide-in-from-top-4 fade-in">
                                    {/* Mobile Verification Block */}
                                    <div className={`p-5 rounded-xl border transition-all ${isMobileVerified ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                                <Smartphone className="w-4 h-4" /> Mobile Number
                                            </label>
                                            {isMobileVerified && <span className="text-xs font-bold text-green-700 bg-white px-2 py-1 rounded border border-green-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</span>}
                                        </div>

                                        {!isMobileVerified ? (
                                            <div className="space-y-4">
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+91</span>
                                                        <Input
                                                            placeholder="Enter 10 digit number"
                                                            className="pl-12 h-12 text-lg font-medium"
                                                            value={mobile}
                                                            onChange={(e) => setMobile(e.target.value)}
                                                            maxLength={10}
                                                            disabled={isMobileOtpSent}
                                                        />
                                                    </div>
                                                    {!isMobileOtpSent && (
                                                        <Button
                                                            onClick={handleSendMobileOtp}
                                                            disabled={loading || mobile.length < 10}
                                                            className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            {loading ? "Sending..." : "Send OTP"}
                                                        </Button>
                                                    )}
                                                </div>

                                                {isMobileOtpSent && (
                                                    <div className="animate-in slide-in-from-top-2 fade-in">
                                                        <div className="flex gap-2 items-center">
                                                            <Input
                                                                placeholder="Enter OTP"
                                                                className="h-12 text-center tracking-widest font-mono text-lg" // Removed w-full max-w-[150px] for responsiveness
                                                                value={mobileOtp}
                                                                onChange={(e) => setMobileOtp(e.target.value)}
                                                                maxLength={4}
                                                            />
                                                            <Button
                                                                onClick={handleVerifyMobile}
                                                                disabled={loading || mobileOtp.length < 4}
                                                                className="h-12 px-6 bg-green-600 hover:bg-green-700"
                                                            >
                                                                {loading ? "Verifying..." : "Verify OTP"}
                                                            </Button>
                                                        </div>
                                                        <div className="mt-2 flex justify-between text-xs px-1">
                                                            <span className="text-slate-500">OTP sent to +91 {mobile}</span>
                                                            <button className="text-blue-600 font-bold hover:underline">Resend OTP</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-lg font-bold text-slate-800">+91 {mobile}</div>
                                        )}
                                    </div>

                                    {/* Email Verification Block */}
                                    <div className={`p-5 rounded-xl border transition-all ${isEmailVerified ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'} ${!isMobileVerified ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                                <Mail className="w-4 h-4" /> Email Address
                                            </label>
                                            {isEmailVerified && <span className="text-xs font-bold text-green-700 bg-white px-2 py-1 rounded border border-green-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</span>}
                                        </div>

                                        {!isEmailVerified ? (
                                            <div className="space-y-4">
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Enter email address"
                                                        className="h-12 text-lg font-medium"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        disabled={isEmailOtpSent}
                                                    />
                                                    {!isEmailOtpSent && (
                                                        <Button
                                                            onClick={handleSendEmailOtp}
                                                            disabled={loading || !email}
                                                            className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            {loading ? "Sending..." : "Send OTP"}
                                                        </Button>
                                                    )}
                                                </div>

                                                {isEmailOtpSent && (
                                                    <div className="animate-in slide-in-from-top-2 fade-in">
                                                        <div className="flex gap-2 items-center">
                                                            <Input
                                                                placeholder="Enter OTP"
                                                                className="h-12 text-center tracking-widest font-mono text-lg"
                                                                value={emailOtp}
                                                                onChange={(e) => setEmailOtp(e.target.value)}
                                                                maxLength={4}
                                                            />
                                                            <Button
                                                                onClick={handleVerifyEmail}
                                                                disabled={loading || emailOtp.length < 4}
                                                                className="h-12 px-6 bg-green-600 hover:bg-green-700"
                                                            >
                                                                {loading ? "Verifying..." : "Verify OTP"}
                                                            </Button>
                                                        </div>
                                                        <div className="mt-2 flex justify-between text-xs px-1">
                                                            <span className="text-slate-500">OTP sent to {email}</span>
                                                            <button className="text-blue-600 font-bold hover:underline">Resend OTP</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-lg font-bold text-slate-800">{email}</div>
                                        )}
                                    </div>

                                    <div className="flex justify-end pt-4 border-t">
                                        <Button
                                            onClick={() => setCurrentStep("kyc")}
                                            disabled={!isMobileVerified || !isEmailVerified}
                                            className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg font-bold shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
                                        >
                                            Proceed to Next Step <ChevronRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* STEP 2: KYC */}
                        <div className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-300 ${currentStep === "kyc" ? "ring-2 ring-blue-600" : "opacity-60"}`}>
                            <div className="p-6 border-b flex justify-between items-center cursor-pointer" onClick={() => setCurrentStep("kyc")}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <h2 className="font-bold text-slate-800">ID & Signature Verification</h2>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400`} />
                            </div>

                            {currentStep === "kyc" && (
                                <div className="p-6 space-y-6 animate-in slide-in-from-top-4 fade-in">
                                    <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-800">
                                        <FileText className="w-5 h-5 flex-shrink-0" />
                                        <p>GSTIN is mandatory to sell taxable goods. If you sell only books, PAN is sufficient.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border-2 border-blue-600 bg-blue-50 p-4 rounded-xl flex items-center justify-center flex-col gap-2 cursor-pointer text-blue-700 font-bold">
                                            <PackageSearch className="w-6 h-6" />
                                            Selling Goods (GSTIN)
                                        </div>
                                        <div className="border border-slate-200 p-4 rounded-xl flex items-center justify-center flex-col gap-2 cursor-pointer text-slate-500 hover:border-blue-300">
                                            <FileText className="w-6 h-6" />
                                            Selling Books (PAN)
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter GSTIN Number"
                                            className="h-12 uppercase tracking-wider font-medium"
                                            onChange={(e) => setGstin(e.target.value)}
                                            maxLength={15}
                                        />
                                        <Button disabled={!gstin} className="h-12 px-6">Verify</Button>
                                    </div>

                                    <div className="pt-6 border-t">
                                        <h3 className="font-bold text-slate-900 mb-4">Add your e-Signature</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button variant="outline" className="h-14 border-dashed border-2">
                                                <PenTool className="w-4 h-4 mr-2" /> Draw Signature
                                            </Button>
                                            <Button variant="outline" className="h-14 border-dashed border-2">
                                                Upload Image
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button onClick={() => setCurrentStep("store")} variant="ghost" className="mr-2">Back</Button>
                                        <Button onClick={() => setCurrentStep("store")} className="bg-blue-600 hover:bg-blue-700">
                                            Continue <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* STEP 3: Store Details */}
                        <div className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-300 ${currentStep === "store" ? "ring-2 ring-blue-600" : "opacity-60"}`}>
                            <div className="p-6 border-b flex justify-between items-center cursor-pointer" onClick={() => setCurrentStep("store")}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <Store className="w-4 h-4" />
                                    </div>
                                    <h2 className="font-bold text-slate-800">Store & Pickup Details</h2>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400`} />
                            </div>

                            {currentStep === "store" && (
                                <div className="p-6 space-y-6">
                                    <div className="gap-4 grid">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Display Name *</label>
                                            <Input placeholder="Enter Store Name" className="h-11" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Store Description</label>
                                            <Textarea placeholder="Tell us about your business..." className="h-24" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Pickup Pincode *</label>
                                            <div className="flex gap-2">
                                                <Input placeholder="Pincode" className="h-11 w-40" />
                                                <Button variant="outline" className="h-11">Check Availability</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button onClick={() => setCurrentStep("kyc")} variant="ghost" className="mr-2">Back</Button>
                                        <Button onClick={() => setCurrentStep("listing")} className="bg-blue-600 hover:bg-blue-700">
                                            Save & Next <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* STEP 4: Listing */}
                        <div className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-300 ${currentStep === "listing" ? "ring-2 ring-blue-600" : "opacity-60"}`}>
                            <div className="p-6 border-b flex justify-between items-center cursor-pointer" onClick={() => setCurrentStep("listing")}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <PackageSearch className="w-4 h-4" />
                                    </div>
                                    <h2 className="font-bold text-slate-800">Listing & Stock Availability</h2>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400`} />
                            </div>

                            {currentStep === "listing" && (
                                <div className="p-6">
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border shadow-sm">
                                            <PackageSearch className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">List your products</h3>
                                        <p className="text-slate-500 mb-4 max-w-sm mx-auto">Upload single products or bulk catalogs to start selling.</p>
                                        <Button>Start Listing</Button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT SIDEBAR: Support */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900">Join WhatsApp Channel</h3>
                                    <p className="text-xs text-slate-600 mt-1">Get smart selling hacks, feature updates & handy tips.</p>
                                </div>
                                <MessageCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <Button className="w-full bg-green-600 hover:bg-green-700 font-bold h-10">
                                Open in WhatsApp
                            </Button>
                        </div>

                        <div className="bg-blue-600 p-6 rounded-lg text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2">Do you need help?</h3>
                                <p className="text-blue-100 text-sm mb-6">Our team of specialists would be happy to help you setup your shop on VogueX.</p>
                                <Button variant="secondary" className="w-full font-bold">
                                    <PhoneCall className="w-4 h-4 mr-2" /> Request a Callback
                                </Button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <h3 className="font-bold text-slate-900 border-b pb-2 mb-2 text-sm">Frequently Asked Questions</h3>
                            <div className="space-y-3">
                                {["How update GSTIN?", "Where will info be used?", "Can I create account without GST?"].map((q, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs text-slate-600 cursor-pointer hover:text-blue-600">
                                        {q} <ChevronDown className="w-3 h-3" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function StepItem({ label, active, completed, subSteps }: { label: string, active: boolean, completed: boolean, subSteps: string[] }) {
    return (
        <div className={`relative ${active ? 'pl-4 border-l-2 border-blue-600' : 'pl-4 border-l-2 border-transparent'}`}>
            <div className="flex items-center gap-2 mb-2">
                {completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : active ? (
                    <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                    </div>
                ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <span className={`font-semibold ${active ? 'text-blue-700' : 'text-slate-600'}`}>{label}</span>
            </div>
            {active && (
                <div className="pl-7 space-y-2 mt-2">
                    {subSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-500">
                            <CheckCircle2 className={`w-3 h-3 ${i === 0 ? 'text-green-500' : 'text-gray-300'}`} />
                            {step}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
