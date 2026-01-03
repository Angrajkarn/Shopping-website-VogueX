"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useAuthStore } from "@/lib/auth-store"
import { CreditCard, Truck, User, Bell, Shield } from "lucide-react"

export default function SettingsPage() {
    const { user } = useAuthStore()

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 text-sm">Manage your account preferences and store settings.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Alerts</TabsTrigger>
                </TabsList>

                {/* Profile Settings */}
                <TabsContent value="profile" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Profile</CardTitle>
                            <CardDescription>This is how your store appears to customers on VogueX.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">Store Name</Label>
                                    <Input id="storeName" defaultValue="Vogue Designer Hub" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gstin">GSTIN (Tax ID)</Label>
                                    <Input id="gstin" defaultValue="27ABCDE1234F1Z5" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Store Description</Label>
                                <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    defaultValue="Premium fashion retailer specializing in luxury accessories and contemporary wear."
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                                <Button>Save Changes</Button>
                                <Button variant="outline">View Public Profile</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>Private contact details for VogueX Admin use.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" defaultValue={user?.email || ''} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" defaultValue="+91 98765 43210" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Shipping Settings */}
                <TabsContent value="shipping" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Preferences</CardTitle>
                            <CardDescription>Configure how you fulfill orders.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">VogueX Express</div>
                                    <p className="text-sm text-gray-500">Let VogueX handle pickup and delivery (Recommended).</p>
                                </div>
                                <Switch checked={true} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">Self Ship</div>
                                    <p className="text-sm text-gray-500">You handle the logistics yourself.</p>
                                </div>
                                <Switch checked={false} />
                            </div>

                            <div className="pt-4 border-t">
                                <Label>Pickup Address</Label>
                                <div className="mt-2 p-3 bg-slate-50 rounded-md border text-sm text-gray-700">
                                    123 Fashion Estate, Okhla Phase III,<br />
                                    New Delhi, Delhi - 110020
                                </div>
                                <Button variant="link" className="px-0">Change Address</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Choose what you want to be notified about.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">New Orders</div>
                                    <p className="text-sm text-gray-500">Receive an email when you get a new order.</p>
                                </div>
                                <Switch checked={true} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">Low Stock Alerts</div>
                                    <p className="text-sm text-gray-500">Get notified when products are running low.</p>
                                </div>
                                <Switch checked={true} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">Return Requests</div>
                                    <p className="text-sm text-gray-500">Alerts for new return applications.</p>
                                </div>
                                <Switch checked={true} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
