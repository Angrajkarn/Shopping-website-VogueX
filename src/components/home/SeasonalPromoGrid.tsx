"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

export function SeasonalPromoGrid() {
    return (
        <section className="py-2 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-auto md:h-[500px]">

                    {/* Large Left Item */}
                    <div className="md:col-span-1 relative h-[300px] md:h-full group overflow-hidden cursor-pointer">
                        <Image
                            src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1500&auto=format&fit=crop"
                            alt="Mens Collection"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                            <h3 className="text-white text-3xl font-bold uppercase tracking-wider">Urban Men</h3>
                            <p className="text-slate-200 mt-2 font-medium">Streetwear Collection '25</p>
                            <Button variant="secondary" className="w-fit mt-4">Explore</Button>
                        </div>
                    </div>

                    {/* Right Column Split */}
                    <div className="md:col-span-2 grid grid-rows-2 gap-2 h-[500px] md:h-full">

                        {/* Top Right */}
                        <div className="relative group overflow-hidden cursor-pointer">
                            <Image
                                src="https://images.unsplash.com/photo-1560243563-062bfc001d68?q=80&w=1500&auto=format&fit=crop"
                                alt="Summer Vibe"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <div className="text-center">
                                    <h3 className="text-white text-4xl font-black italic">SUMMER SALE</h3>
                                    <p className="text-white text-lg font-bold mt-1">FLAT 50% OFF</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Split */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="relative group overflow-hidden cursor-pointer">
                                <Image
                                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
                                    alt="Accessories"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-white text-black px-3 py-1 text-sm font-bold uppercase tracking-widest">Watches</span>
                                </div>
                            </div>
                            <div className="relative group overflow-hidden cursor-pointer">
                                <Image
                                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
                                    alt="Footwear"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-white text-black px-3 py-1 text-sm font-bold uppercase tracking-widest">Sneakers</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}
