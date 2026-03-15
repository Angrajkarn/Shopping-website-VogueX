"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAnalytics } from "@/hooks/useAnalytics";
import { api } from "@/lib/api";
import { PersonalizedFeed } from "@/components/home/PersonalizedFeed";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { TrendingTicker } from "@/components/home/TrendingTicker";
import { SeasonalPromoGrid } from "@/components/home/SeasonalPromoGrid";
import { LightningDeals } from "@/components/home/LightningDeals";
import { HourlyFashionDeals } from "@/components/home/HourlyFashionDeals";
import { PremiumLuxuryZone } from "@/components/home/PremiumLuxuryZone";
import { SponsoredProductStrip } from "@/components/home/SponsoredProductStrip";
import { ModernCategoryGrid } from "@/components/home/ModernCategoryGrid";
import { MembershipBanner } from "@/components/home/MembershipBanner";
import { CreatorStudio } from "@/components/home/CreatorStudio";
import { BudgetBuys } from "@/components/home/BudgetBuys";
import { BrandSpotlight } from "@/components/home/BrandSpotlight";
import { StyleInspiration } from "@/components/home/StyleInspiration";
import { VideoBanner } from "@/components/home/VideoBanner";
import { ExploreMore } from "@/components/home/ExploreMore";
import { TrustMarkers } from "@/components/home/TrustMarkers";
import { InspiredBySearch } from "@/components/home/InspiredBySearch";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { Newsletter } from "@/components/home/Newsletter";
import { SocialGrid } from "@/components/home/SocialGrid";
import { Testimonials } from "@/components/home/Testimonials";
import { ParallaxSection } from "@/components/home/ParallaxSection";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { TopCategoryNavbar } from "@/components/home/TopCategoryNavbar";
import { BankOfferStrip } from "@/components/home/BankOfferStrip";
import { DealOfTheDay } from "@/components/home/DealOfTheDay";
import { FeaturedBentoGrid } from "@/components/home/FeaturedBentoGrid";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { TabbedBestSellers } from "@/components/home/TabbedBestSellers";
import { CategoryEnrichmentRow } from "@/components/home/CategoryEnrichmentRow";

export default function Home() {
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "hero",
    "personalized-feed",
    "recently-viewed",
    "bank-offers",
    "electronics",
    "fashion",
    "mobiles",
    "home-furniture",
    "appliances",
    "beauty",
    "travel",
    "seasonal",
    "lightning-deals",
    "hourly-deals",
    "rest"
  ]);

  const { sessionId, track } = useAnalytics();

  useEffect(() => {
    const fetchLayout = async () => {
      if (!sessionId) return;
      try {
        const data = await api.getDynamicLayout({ session_id: sessionId });
        if (data && data.order) {
          console.log("🧠 Neural Layout Active:", data.top_category || "Default");
          // Merge dynamic order with mandatory discovery sections
          setSectionOrder(prev => {
              const unique = Array.from(new Set([...data.order, ...prev]));
              return unique;
          });
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic layout, using default", err);
      }
    };
    
    fetchLayout();
  }, [sessionId]);

  const components: Record<string, React.ReactNode> = {
    "hero": (
      <>
        <TrendingTicker />
        <TopCategoryNavbar />
        <div className="relative bg-white pb-2"><HeroCarousel /></div>
      </>
    ),
    "mobiles": (
      <CategoryEnrichmentRow
        title="Smartphones & Gadgets"
        category="smartphones"
        bgImage="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"
        textColor="text-white"
      />
    ),
    "fashion": (
      <CategoryEnrichmentRow
        title="Trendy Fashion"
        category="mens-shirts"
        bgImage="https://images.unsplash.com/photo-1445205170230-053b830c6050?w=800&q=80"
        textColor="text-white"
      />
    ),
    "electronics": (
      <CategoryEnrichmentRow
        title="Laptops & Computing"
        category="laptops"
        bgImage="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"
        textColor="text-white"
      />
    ),
    "home-furniture": (
      <CategoryEnrichmentRow
        title="Home & Furniture"
        category="furniture"
        bgImage="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"
        textColor="text-slate-800"
      />
    ),
    "appliances": (
      <CategoryEnrichmentRow
        title="Kitchen & Home Appliances"
        category="kitchen-accessories"
        bgImage="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
        textColor="text-slate-800"
      />
    ),
    "travel": (
      <CategoryEnrichmentRow
        title="Travel & Accessories"
        category="sunglasses"
        bgImage="https://images.unsplash.com/photo-1469854523086-cc02fe5d8dfc?w=800&q=80"
        textColor="text-white"
      />
    ),
    "beauty": (
      <CategoryEnrichmentRow
        title="Beauty & Skincare"
        category="beauty"
        bgImage="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
        textColor="text-slate-800"
      />
    ),
    "personalized-feed": <PersonalizedFeed />,
    "recently-viewed": <RecentlyViewed />,
    "bank-offers": <BankOfferStrip />,
    "seasonal": <div className="mt-4"><SeasonalPromoGrid /></div>,
    "lightning-deals": <LightningDeals />,
    "hourly-deals": <HourlyFashionDeals />,
    "luxury": <PremiumLuxuryZone />,
    "rest": (
      <>
        <div className="container mx-auto px-4 mt-4"><SponsoredProductStrip /></div>
        <ModernCategoryGrid />
        <DealOfTheDay />
        <MembershipBanner />
        <CreatorStudio />
        <BudgetBuys />
        <BrandSpotlight />
        <ShopByOccasion />
        <StyleInspiration />
        <FeaturedBentoGrid />
        <TabbedBestSellers />
        <div className="py-4 bg-black">
          <InfiniteMarquee
            items={["SUMMER SALE IS LIVE", "FLAT 50% OFF ON SNEAKERS", "NEW ARRIVALS", "FREE SHIPPING ON ORDERS ABOVE 999"]}
            speed={40}
            direction="left"
          />
        </div>
        <VideoBanner />
        <ExploreMore />
        <ParallaxSection />
        <Testimonials />
        <SocialGrid />
        <Newsletter />
        <TrustMarkers />
        <InspiredBySearch />
      </>
    )
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden font-sans text-slate-900">
      <AnimatePresence>
        {sectionOrder.map(key => (
          <motion.div key={key} layout>
            {components[key]}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
