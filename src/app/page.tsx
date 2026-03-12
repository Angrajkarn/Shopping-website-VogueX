"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAnalytics } from "@/hooks/useAnalytics";
import { api } from "@/lib/api";
import { PersonalizedFeed } from "@/components/home/PersonalizedFeed";

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
import { DynamicCategoryRow } from "@/components/home/DynamicCategoryRow";
import { BrandSpotlight } from "@/components/home/BrandSpotlight";
import { BudgetBuys } from "@/components/home/BudgetBuys";
import { SeasonalPromoGrid } from "@/components/home/SeasonalPromoGrid";
import { HourlyFashionDeals } from "@/components/home/HourlyFashionDeals";
import { PremiumLuxuryZone } from "@/components/home/PremiumLuxuryZone";
import { StyleInspiration } from "@/components/home/StyleInspiration";
import { MembershipBanner } from "@/components/home/MembershipBanner";
import { SponsoredProductStrip } from "@/components/home/SponsoredProductStrip";
import { LightningDeals } from "@/components/home/LightningDeals";
import { CreatorStudio } from "@/components/home/CreatorStudio";
import { ModernCategoryGrid } from "@/components/home/ModernCategoryGrid";
import { TrustMarkers } from "@/components/home/TrustMarkers";
import { ExploreMore } from "@/components/home/ExploreMore";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { InspiredBySearch } from "@/components/home/InspiredBySearch";
import { TrendingTicker } from "@/components/home/TrendingTicker";
import { VideoBanner } from "@/components/home/VideoBanner";


export default function Home() {
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "hero",
    "new-arrivals",
    "personalized-feed",
    "recently-viewed",
    "bank-offers",
    "seasonal",
    "lightning-deals",
    "hourly-deals",
    "electronics",
    "beauty",
    "home",
    "luxury",
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
          setSectionOrder(data.order);
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
    "new-arrivals": (
      <div className="py-2">
        <DynamicCategoryRow
          title="New Arrivals & Fresh Drops"
          category=""
          bgImage="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80"
          textColor="text-white"
        />
      </div>
    ),

    "personalized-feed": <PersonalizedFeed />,
    "recently-viewed": <RecentlyViewed />,
    "bank-offers": <BankOfferStrip />,
    "seasonal": <div className="mt-4"><SeasonalPromoGrid /></div>,
    "lightning-deals": <LightningDeals />,
    "hourly-deals": <HourlyFashionDeals />,
    "electronics": (
      <div className="py-2">
        <DynamicCategoryRow
          title="Best of Electronics"
          category="smartphones"
          bgImage="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&q=80"
          textColor="text-white"
        />
      </div>
    ),
    "beauty": (
      <div className="py-2">
        <DynamicCategoryRow
          title="Beauty & Personal Care"
          category="fragrances"
          bgImage="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80"
          textColor="text-white"
        />
      </div>
    ),
    "home": (
      <div className="py-2">
        <DynamicCategoryRow
          title="Home & Living"
          category="home-decoration"
          bgImage="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&q=80"
        />
      </div>
    ),
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
