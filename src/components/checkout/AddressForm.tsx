"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

// Schema
const addressSchema = z.object({
    name: z.string().min(1, "Name is required"),
    mobile: z.string().length(10, "10-digit mobile number required").regex(/^\d+$/, "Numbers only"),
    pincode: z.string().length(6, "6-digit pincode").regex(/^\d+$/, "Numbers only"),
    locality: z.string().min(1, "Locality is required"),
    address: z.string().min(5, "Address must be at least 5 chars"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    landmark: z.string().optional(),
    alternate_phone: z.string().optional(),
    address_type: z.enum(["HOME", "WORK"]),
})

export type AddressFormValues = z.infer<typeof addressSchema>

interface AddressFormProps {
    initialData?: any
    onCancel: () => void
    onSuccess: (address: any) => void
}

export function AddressForm({ initialData, onCancel, onSuccess }: AddressFormProps) {
    const { token } = useAuthStore()
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            address_type: "HOME",
            ...initialData
        }
    })

    // Reset form when initialData changes (important for switching between add/edit modes)
    useEffect(() => {
        if (initialData) {
            reset(initialData)
        } else {
            reset({ address_type: "HOME" }) // Reset to default for "Add New"
        }
    }, [initialData, reset])

    const onSave = async (data: AddressFormValues) => {
        if (!token) return
        setLoading(true)
        try {
            let savedAddress;
            if (initialData?.id) {
                savedAddress = await api.updateAddress(token, initialData.id, data)
                toast.success("Address updated successfully")
            } else {
                savedAddress = await api.addAddress(token, data)
                toast.success("Address added successfully")
            }
            onSuccess(savedAddress)
        } catch (error) {
            toast.error(initialData?.id ? "Failed to update address" : "Failed to add address")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-blue-50/50 p-6 border rounded-sm mb-4">
            <h3 className="text-sm font-semibold text-blue-600 mb-4 uppercase">
                {initialData ? "Edit Address" : "Add A New Address"}
            </h3>

            <form onSubmit={handleSubmit(onSave)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Row 1: Name & Mobile */}
                <div className="space-y-1">
                    <Input placeholder="Name" {...register("name")} className={errors.name ? 'border-red-500' : ''} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-1">
                    <Input placeholder="10-digit mobile number" {...register("mobile")} maxLength={10} className={errors.mobile ? 'border-red-500' : ''} />
                    {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
                </div>

                {/* Row 2: Pincode & Locality */}
                <div className="space-y-1">
                    <Input placeholder="Pincode" {...register("pincode")} maxLength={6} className={errors.pincode ? 'border-red-500' : ''} />
                    {errors.pincode && <p className="text-xs text-red-500">{errors.pincode.message}</p>}
                </div>
                <div className="space-y-1">
                    <Input placeholder="Locality" {...register("locality")} className={errors.locality ? 'border-red-500' : ''} />
                    {errors.locality && <p className="text-xs text-red-500">{errors.locality.message}</p>}
                </div>

                {/* Row 3: Address (Full width) */}
                <div className="md:col-span-2 space-y-1">
                    <Textarea placeholder="Address (Area and Street)" {...register("address")} className={`resize-none h-20 ${errors.address ? 'border-red-500' : ''}`} />
                    {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                </div>

                {/* Row 4: City & State */}
                <div className="space-y-1">
                    <Input placeholder="City/District/Town" {...register("city")} className={errors.city ? 'border-red-500' : ''} />
                    {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                </div>
                <div className="space-y-1">
                    <Input placeholder="State" {...register("state")} className={errors.state ? 'border-red-500' : ''} />
                    {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
                </div>

                {/* Row 5: Landmark & Alt Phone */}
                <div className="space-y-1">
                    <Input placeholder="Landmark (Optional)" {...register("landmark")} />
                </div>
                <div className="space-y-1">
                    <Input placeholder="Alternate Phone (Optional)" {...register("alternate_phone")} />
                </div>

                {/* Row 6: Address Type */}
                <div className="md:col-span-2 pt-2">
                    <p className="text-xs text-gray-500 mb-2">Address Type</p>
                    <RadioGroup
                        defaultValue={initialData?.address_type || "HOME"}
                        className="flex gap-4"
                        onValueChange={(val) => setValue("address_type", val as "HOME" | "WORK")}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="HOME" id="r-home" />
                            <Label htmlFor="r-home">Home (All day delivery)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="WORK" id="r-work" />
                            <Label htmlFor="r-work">Work (Delivery between 10 AM - 5 PM)</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex gap-3 mt-4">
                    <Button type="submit" disabled={loading} className="w-1/2 md:w-auto uppercase font-bold tracking-wide bg-primary">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {initialData ? "Update Address" : "Save and Deliver Here"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={onCancel} className="uppercase font-bold tracking-wide text-blue-600 hover:text-blue-700">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}
