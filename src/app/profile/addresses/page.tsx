"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash, MapPin } from "lucide-react"
import { AddressForm } from "@/components/profile/AddressForm"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"

export default function AddressesPage() {
    const { token } = useAuthStore()
    const [addresses, setAddresses] = useState<any[]>([])
    const [isAdding, setIsAdding] = useState(false)
    const [editingAddress, setEditingAddress] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchAddresses = async () => {
        if (!token) return
        try {
            const data = await api.getAddresses(token)
            setAddresses(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAddresses()
    }, [token])

    const handleSaveAddress = async (data: any) => {
        if (!token) return
        try {
            if (editingAddress) {
                await api.updateAddress(token, editingAddress.id, data)
                toast.success("Address Updated")
            } else {
                await api.addAddress(token, data)
                toast.success("Address Added")
            }
            setIsAdding(false)
            setEditingAddress(null)
            fetchAddresses()
        } catch (error) {
            console.error("Failed to save address:", error)
            toast.error("Failed to save address")
        }
    }

    /* 
    const handleDelete = async (id: number) => {
        // TODO: Implement delete API
    }
    */

    if (isAdding) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Add New Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <AddressForm
                        initialData={editingAddress}
                        onSubmit={handleSaveAddress}
                        onCancel={() => { setIsAdding(false); setEditingAddress(null); }}
                    />
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Saved Addresses</h1>
                <Button onClick={() => { setEditingAddress(null); setIsAdding(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                </Button>
            </div>

            {loading ? (
                <div>Loading addresses...</div>
            ) : addresses.length === 0 ? (
                <div className="text-center py-20 border rounded-lg bg-muted/10">
                    <p className="text-muted-foreground">No addresses found. Add one to get started!</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {addresses.map((address: any) => (
                        <Card key={address.id} className={address.is_default ? "border-primary" : ""}>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    {address.is_default ? "Default Address" : "Address"}
                                    {address.is_default && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        onClick={() => { setEditingAddress(address); setIsAdding(true); }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => {/* Implement delete if needed */ }}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium">{address.street}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {address.city}, {address.state} {address.zip_code}<br />
                                    {address.country}
                                </p>
                                {address.latitude && (
                                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        Location Pinned
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
