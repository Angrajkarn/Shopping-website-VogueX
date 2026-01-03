"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAuthStore } from "@/lib/auth-store"
import { api } from "@/lib/api"
import { Loader2, Save, Trash2, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
    const { user, token, fetchUser, logout } = useAuthStore()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone_number: ""
        }
    })

    useEffect(() => {
        if (user) {
            reset({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                phone_number: user.phone_number || "",
                gender: user.gender || ""
            })
        }
    }, [user, reset])

    const onSubmit = async (data: any) => {
        if (!token) return
        setIsLoading(true)
        setMessage(null)
        try {
            await api.updateProfile(token, data)
            await fetchUser()
            setMessage({ type: 'success', text: "Profile updated successfully!" })
        } catch (error) {
            console.error("PROFILE UPDATE ERROR:", error)
            setMessage({ type: 'error', text: "Failed to update profile. Please try again." })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (!token) return
        setIsDeleting(true)
        try {
            await api.deleteAccount(token)
            logout()
            router.push('/')
        } catch (error) {
            console.error(error)
            setMessage({ type: 'error', text: "Failed to delete account. Please try again." })
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>

            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input {...register("first_name")} />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input {...register("last_name")} />
                            </div>
                        </div>

                        {/* Gender Section */}
                        <div className="space-y-3">
                            <Label>Gender</Label>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="gender-male"
                                        value="Male"
                                        {...register("gender")}
                                        className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                                    />
                                    <Label htmlFor="gender-male" className="font-normal cursor-pointer">Male</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="gender-female"
                                        value="Female"
                                        {...register("gender")}
                                        className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                                    />
                                    <Label htmlFor="gender-female" className="font-normal cursor-pointer">Female</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="gender-other"
                                        value="Other"
                                        {...register("gender")}
                                        className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                                    />
                                    <Label htmlFor="gender-other" className="font-normal cursor-pointer">Other</Label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input {...register("email")} type="email" readOnly className="bg-muted opacity-70 cursor-not-allowed" />
                                <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input {...register("phone_number")} placeholder="+1234567890" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage how we communicate with you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Order Updates</Label>
                                <p className="text-sm text-muted-foreground">Receive updates about your order status</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Promotional Emails</Label>
                                <p className="text-sm text-muted-foreground">Receive emails about new products and sales</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-900 bg-red-50/10">
                    <CardHeader>
                        <CardTitle className="text-red-500 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Danger Zone
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Once you delete your account, there is no going back. All your data including orders, addresses, and wishlist items will be permanently removed.
                        </p>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline">Cancel</Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Confirm Delete
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
