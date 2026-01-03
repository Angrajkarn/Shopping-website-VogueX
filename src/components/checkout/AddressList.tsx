"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Plus, Check, Loader2, Home, Briefcase } from "lucide-react"

interface Address {
    id: number
    name: string
    mobile: string
    pincode: string
    locality: string
    address: string
    city: string
    state: string
    landmark?: string
    alternate_phone?: string
    address_type: 'HOME' | 'WORK'
    is_default: boolean
}

interface AddressListProps {
    selectedId: number | null
    onSelect: (address: Address) => void
    onAddNew: () => void
    onEdit: (address: Address) => void
}

export function AddressList({ selectedId, onSelect, onAddNew, onEdit }: AddressListProps) {
    const { token } = useAuthStore()
    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) return
        api.getAddresses(token)
            .then((data) => {
                setAddresses(data)
                // Auto-select default or first
                if (!selectedId && data.length > 0) {
                    const defaultAddr = data.find((a: Address) => a.is_default)

                    onSelect(defaultAddr || data[0])
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [token]) // eslint-disable-line

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium">Select Delivery Address</h3>
            </div>

            {addresses.map((addr) => (
                <div
                    key={addr.id}
                    className={`
                        relative border rounded-sm p-4 cursor-pointer transition-all
                        ${selectedId === addr.id ? 'border-primary bg-blue-50/10' : 'border-gray-200 hover:border-gray-300'}
                    `}
                    onClick={() => onSelect(addr)}
                >
                    <div className="flex items-start gap-3">
                        <div className={`
                            w-4 h-4 rounded-full border flex items-center justify-center mt-1 flex-shrink-0
                            ${selectedId === addr.id ? 'border-primary' : 'border-gray-400'}
                        `}>
                            {selectedId === addr.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{addr.name}</span>
                                <span className={`
                                    text-[10px] px-1.5 py-0.5 rounded uppercase font-medium text-white
                                    ${addr.address_type === 'HOME' ? 'bg-primary' : 'bg-gray-600'}
                                `}>
                                    {addr.address_type}
                                </span>
                                <span className="text-sm font-semibold ml-2">{addr.mobile}</span>
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed">
                                {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-medium text-black">{addr.pincode}</span>
                            </p>

                            {selectedId === addr.id && (
                                <Button className="mt-4 h-10 px-6 uppercase font-bold text-xs tracking-wider">
                                    Deliver Here
                                </Button>
                            )}
                        </div>

                        {/* Edit Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 font-bold uppercase text-xs hover:text-blue-700 hover:bg-transparent"
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit(addr)
                            }}
                        >
                            EDIT
                        </Button>
                    </div>
                </div>
            ))}

            <button
                onClick={onAddNew}
                className="w-full py-4 border border-dashed border-primary/40 rounded-sm flex items-center gap-2 text-primary font-medium hover:bg-blue-50/50 transition-colors pl-4"
            >
                <Plus className="w-4 h-4" />
                ADD A NEW ADDRESS
            </button>
        </div>
    )
}
