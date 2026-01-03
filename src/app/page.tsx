"use client";

import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { Newsletter } from "@/components/home/Newsletter";
import { SocialGrid } from "@/components/home/SocialGrid";
import { Testimonials } from "@/components/home/Testimonials";
import { ParallaxSection } from "@/components/home/ParallaxSection";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

// Existing Components (Phase 1)
import { TopCategoryNavbar } from "@/components/home/TopCategoryNavbar";
import { BankOfferStrip } from "@/components/home/BankOfferStrip";
import { DealOfTheDay } from "@/components/home/DealOfTheDay";
import { FeaturedBentoGrid } from "@/components/home/FeaturedBentoGrid";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { TabbedBestSellers } from "@/components/home/TabbedBestSellers";
import { DynamicCategoryRow } from "@/components/home/DynamicCategoryRow"; // Updated
import { BrandSpotlight } from "@/components/home/BrandSpotlight";
import { BudgetBuys } from "@/components/home/BudgetBuys";

// New Components (Phase 2)
import { SeasonalPromoGrid } from "@/components/home/SeasonalPromoGrid";
import { HourlyFashionDeals } from "@/components/home/HourlyFashionDeals";
import { PremiumLuxuryZone } from "@/components/home/PremiumLuxuryZone";
import { StyleInspiration } from "@/components/home/StyleInspiration";
import { MembershipBanner } from "@/components/home/MembershipBanner";
import { SponsoredProductStrip } from "@/components/home/SponsoredProductStrip";

// Phase 3 Components
import { LightningDeals } from "@/components/home/LightningDeals";
import { CreatorStudio } from "@/components/home/CreatorStudio";
import { ModernCategoryGrid } from "@/components/home/ModernCategoryGrid";
import { TrustMarkers } from "@/components/home/TrustMarkers";
import { ExploreMore } from "@/components/home/ExploreMore";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { InspiredBySearch } from "@/components/home/InspiredBySearch";
import { LiveFOMOTicker } from "@/components/home/LiveFOMOTicker";
import { FashionStylist } from "@/components/ai/FashionStylist";

const electronics = [
  { id: 1, name: "MacBook Pro", price: "From ₹1,29,999", offer: "Min 10% Off", image: "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp" },
  { id: 2, name: "Asus Zenbook", price: "From ₹89,999", offer: "Min 15% Off", image: "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp" },
  { id: 3, name: "Huawei Matebook", price: "From ₹99,999", offer: "Min 12% Off", image: "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/thumbnail.webp" },
  { id: 4, name: "iPhone 13 Pro", price: "From ₹1,19,999", offer: "Min 5% Off", image: "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp" },
  { id: 5, name: "iPhone X", price: "From ₹49,999", offer: "Flat ₹5000 Off", image: "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/thumbnail.webp" },
  { id: 6, name: "Oppo A57", price: "From ₹12,999", offer: "Min 20% Off", image: "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/thumbnail.webp" },
];

const beauty = [
  { id: 1, name: "CK One", price: "From ₹2,999", offer: "Buy 1 Get 1", image: "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp" },
  { id: 2, name: "Coco Noir", price: "From ₹8,999", offer: "Min 10% Off", image: "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp" },
  { id: 3, name: "Dior J'adore", price: "From ₹7,999", offer: "Min 15% Off", image: "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp" },
  { id: 4, name: "Rolet Watch", price: "From ₹12,999", offer: "Min 40% Off", image: "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/thumbnail.webp" },
  { id: 5, name: "Leather Watch", price: "From ₹3,999", offer: "Min 50% Off", image: "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp" },
  { id: 6, name: "Longines", price: "From ₹45,000", offer: "Min 10% Off", image: "https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp" },
];

const home = [
  { id: 1, name: "Decoration Swing", price: "From ₹2,999", offer: "Min 60% Off", image: "https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp" },
  { id: 2, name: "Family Photo Frame", price: "From ₹599", offer: "Min 50% Off", image: "https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp" },
  { id: 3, name: "House Plant", price: "From ₹399", offer: "Min 40% Off", image: "https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp" },
  { id: 4, name: "Colombo Sofa", price: "From ₹24,999", offer: "Min 55% Off", image: "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp" },
  { id: 5, name: "Bedside Table", price: "From ₹4,999", offer: "Min 40% Off", image: "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden font-sans text-slate-900">

      {/* 1. Top Category Navigation */}
      <TopCategoryNavbar />

      {/* 2. Hero Section */}
      <div className="relative bg-white pb-2">
        <HeroCarousel />
      </div>

      {/* 3. Recently Viewed (ML Engine) */}
      <RecentlyViewed />

      {/* 4. Inspired by Search (ML Engine) [Phase 4] */}
      <InspiredBySearch />

      {/* Trust Makers [Phase 3] */}
      <TrustMarkers />

      {/* 3. Bank Offers */}
      <BankOfferStrip />

      {/* 4. Seasonal Grid [NEW] */}
      <div className="mt-4">
        <SeasonalPromoGrid />
      </div>

      {/* Lightning Deals [Phase 3] */}
      <LightningDeals />

      {/* 5. Hourly Deals [NEW] */}
      <HourlyFashionDeals />

      {/* 6. Sponsored Strip [NEW] */}
      <div className="container mx-auto px-4 mt-4">
        <SponsoredProductStrip />
      </div>

      {/* 7. Category Row: Electronics */}
      <div className="py-2">
        <DynamicCategoryRow
          title="Best of Electronics"
          category="Electronics"
          bgImage="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&q=80"
          textColor="text-white"
        />
      </div>

      {/* Modern Category Grid [Phase 3] */}
      <ModernCategoryGrid />

      {/* 8. Deal of the Day */}
      <DealOfTheDay />

      {/* 9. Membership Banner [NEW] */}
      <MembershipBanner />

      {/* Creator Studio [Phase 3] */}
      <CreatorStudio />

      {/* 10. Budget Buys */}
      <BudgetBuys />

      {/* 11. Category Row: Beauty */}
      <div className="py-2">
        <DynamicCategoryRow
          title="Beauty, Food, Toys & More"
          category="Beauty"
          bgImage="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80"
          textColor="text-white"
        />
      </div>

      {/* 12. Premium Luxury Zone [NEW] */}
      <PremiumLuxuryZone />

      {/* 13. Brand Spotlight */}
      <BrandSpotlight />

      {/* 14. Shop By Occasion */}
      <ShopByOccasion />

      {/* 15. Category Row: Home */}
      <div className="py-2">
        <DynamicCategoryRow
          title="Home & Kitchen Essentials"
          category="Home"
          bgImage="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&q=80"
        />
      </div>

      {/* 16. Style Inspiration [NEW] */}
      <StyleInspiration />

      {/* 17. Featured Bento Grid */}
      <FeaturedBentoGrid />

      {/* 18. Tabbed Best Sellers */}
      <TabbedBestSellers />

      {/* 19. Marquee */}
      <div className="py-4 bg-black">
        <InfiniteMarquee
          items={["SUMMER SALE IS LIVE", "FLAT 50% OFF ON SNEAKERS", "NEW ARRIVALS", "FREE SHIPPING ON ORDERS ABOVE 999"]}
          speed={40}
          direction="left"
        />
      </div>

      {/* 20. Video Banner */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
          alt="Fashion Film"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white space-y-8 max-w-4xl px-6">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">THE NEW VOGUE</h2>
          <p className="text-lg md:text-xl font-medium tracking-widest uppercase opacity-90">Cinematic Collection 2025</p>
          <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-10 h-16 font-bold text-lg gap-2 shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
            <Play className="w-5 h-5 fill-current" /> Watch Campaign
          </Button>
        </div>
      </section>

      {/* Explore More - Infinite Feed [Phase 3] */}
      <ExploreMore />

      {/* 21. Parallax */}
      <ParallaxSection />

      {/* 22. Social Proof */}
      <Testimonials />
      <SocialGrid />

      {/* 23. Newsletter */}
      <Newsletter />

      {/* 24. Live Social Proof (Phase 6) */}
      <LiveFOMOTicker />

      {/* 25. AI Stylist (Phase 7) */}
      <FashionStylist />
    </div>
  );
}
