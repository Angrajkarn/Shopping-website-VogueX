"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin } from "lucide-react"

// Dynamically import Map component to avoid SSR issues with Leaflet
const AddressMap = dynamic(() => import("./AddressMap"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading Map...
        </div>
    )
})

interface AddressFormProps {
    initialData?: any
    onSubmit: (data: any) => Promise<void>
    onCancel: () => void
}

export function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [position, setPosition] = useState<[number, number]>(
        initialData?.latitude && initialData?.longitude
            ? [initialData.latitude, initialData.longitude]
            : [20.5937, 78.9629] // Default to India
    )
    const [pincodeError, setPincodeError] = useState("")

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: initialData || {
            street: "",
            city: "",
            state: "",
            zip_code: "",
            country: "India",
            is_default: false
        }
    })

    const zipcode = watch("zip_code")

    // Pincode Verification Logic
    useEffect(() => {
        if (zipcode?.length === 6) {
            verifyPincode(zipcode)
        }
    }, [zipcode])

    const verifyPincode = async (code: string) => {
        setIsLoading(true)
        setPincodeError("")
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${code}&country=India&format=json`)
            const data = await res.json()

            if (data && data.length > 0) {
                const place = data[0]
                const lat = parseFloat(place.lat)
                const lon = parseFloat(place.lon)

                setPosition([lat, lon])
                setValue("latitude", lat)
                setValue("longitude", lon)
            } else {
                setPincodeError("Invalid Pincode. Please check again.")
            }
        } catch (error) {
            console.error("Pincode verification failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const onFormSubmit = async (data: any) => {
        setIsLoading(true)
        try {
            await onSubmit({
                ...data,
                pincode: data.zip_code,
                address: data.street,
                address_type: "HOME", // Default for now
                latitude: position[0],
                longitude: position[1]
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input {...register("name", { required: true })} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input {...register("mobile", { required: true, pattern: /^[0-9]{10}$/ })} placeholder="10-digit mobile number" />
                </div>
                <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input {...register("zip_code", { required: true, minLength: 6, maxLength: 6 })} placeholder="110001" />
                    {pincodeError && <p className="text-xs text-red-500">{pincodeError}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Locality / Area</Label>
                    <Input {...register("locality", { required: true })} placeholder="Sector 15" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label>Street Address</Label>
                    <Input {...register("street", { required: true })} placeholder="House No, Building, Street" />
                </div>
                <div className="space-y-2">
                    <Label>City</Label>
                    <Input {...register("city", { required: true })} />
                </div>
                <div className="space-y-2">
                    <Label>State</Label>
                    <Input {...register("state", { required: true })} />
                </div>
            </div>

            <div className="h-[300px] w-full rounded-md overflow-hidden border">
                <AddressMap position={position} setPosition={setPosition} />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Click on the map to pin your exact location for delivery.
            </p>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Address
                </Button>
            </div>
        </form>
    )
}
