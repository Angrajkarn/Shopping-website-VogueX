
import Link from "next/link"
import { Facebook, Twitter, Youtube, Instagram, Briefcase, Star, Gift, HelpCircle, CreditCard } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-[#172337] text-white pt-10 pb-6 text-xs font-sans">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 gap-x-4">
                    {/* LEFT SECTION (LINKS) */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div>
                            <h4 className="text-[#878787] mb-3 uppercase font-medium">About</h4>
                            <ul className="space-y-2">
                                <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
                                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                                <li><Link href="/careers" className="hover:underline">Careers</Link></li>
                                <li><Link href="/stories" className="hover:underline">VogueX Stories</Link></li>
                                <li><Link href="/press" className="hover:underline">Press</Link></li>
                                <li><Link href="/corporate" className="hover:underline">Corporate Information</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[#878787] mb-3 uppercase font-medium">Help</h4>
                            <ul className="space-y-2">
                                <li><Link href="/payments" className="hover:underline">Payments</Link></li>
                                <li><Link href="/shipping" className="hover:underline">Shipping</Link></li>
                                <li><Link href="/cancellation" className="hover:underline">Cancellation & Returns</Link></li>
                                <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[#878787] mb-3 uppercase font-medium">Consumer Policy</h4>
                            <ul className="space-y-2">
                                <li><Link href="/cancellation" className="hover:underline">Cancellation & Returns</Link></li>
                                <li><Link href="/terms" className="hover:underline">Terms Of Use</Link></li>
                                <li><Link href="/security" className="hover:underline">Security</Link></li>
                                <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
                                <li><Link href="/sitemap" className="hover:underline">Sitemap</Link></li>
                                <li><Link href="/grievance" className="hover:underline">Grievance Redressal</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT SECTION (ADDRESS) */}
                    <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6 pl-0 md:pl-8 border-l border-[#454d5e]">
                        <div>
                            <h4 className="text-[#878787] mb-3 uppercase font-medium">Mail Us:</h4>
                            <p className="leading-5">
                                VogueX Internet Private Limited,<br />
                                Buildings Alyssa, Begonia &<br />
                                Clove Embassy Tech Village,<br />
                                Outer Ring Road, Devarabeesanahalli Village,<br />
                                Bengaluru, 560103,<br />
                                Karnataka, India
                            </p>
                            <div className="mt-4">
                                <h4 className="text-[#878787] mb-2 uppercase font-medium">Social:</h4>
                                <div className="flex gap-3">
                                    <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-400" />
                                    <Twitter className="w-5 h-5 cursor-pointer hover:text-blue-400" />
                                    <Youtube className="w-5 h-5 cursor-pointer hover:text-red-500" />
                                    <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-500" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[#878787] mb-3 uppercase font-medium">Registered Office Address:</h4>
                            <p className="leading-5">
                                VogueX Internet Private Limited,<br />
                                Buildings Alyssa, Begonia &<br />
                                Clove Embassy Tech Village,<br />
                                Outer Ring Road, Devarabeesanahalli Village,<br />
                                Bengaluru, 560103,<br />
                                Karnataka, India<br />
                                CIN : U51109KA2012PTC066107<br />
                                <span className="text-blue-400">Telephone: 044-45614700</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-[#454d5e] mt-10 pt-6">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-4 md:gap-6 items-center">
                            <Link href="/seller" className="flex items-center gap-2 hover:underline">
                                <Briefcase className="w-4 h-4 text-yellow-400" />
                                <span>Become a Seller</span>
                            </Link>
                            <Link href="/advertise" className="flex items-center gap-2 hover:underline">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>Advertise</span>
                            </Link>
                            <Link href="/gift-cards" className="flex items-center gap-2 hover:underline">
                                <Gift className="w-4 h-4 text-yellow-500" />
                                <span>Gift Cards</span>
                            </Link>
                            <Link href="/help" className="flex items-center gap-2 hover:underline">
                                <HelpCircle className="w-4 h-4 text-yellow-500" />
                                <span>Help Center</span>
                            </Link>
                            <span>© 2024-2025 VogueX.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Payment Icons (Mocked) */}
                            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg" alt="Payment Methods" className="h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
