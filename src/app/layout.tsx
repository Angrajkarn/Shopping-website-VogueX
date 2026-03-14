import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { MainLayoutWrapper } from "@/components/layout/main-layout-wrapper";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { ExitIntentPopup } from "@/components/ui/ExitIntentPopup";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { VoiceControlProvider } from "@/context/VoiceControlContext";
import { VogueXCoinsProvider } from "@/context/VogueXCoinsContext";
import { CollaborationProvider } from "@/context/CollaborationContext";
import { VoiceOrb } from "@/components/voice/VoiceOrb";
import { CoinWallet } from "@/components/loyalty/CoinWallet";
import { CollaborationToolbar } from "@/components/collaboration/CollaborationToolbar";
import { CollaborationOverlays } from "@/components/collaboration/CollaborationOverlays";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VOGUEX | Modern Fashion",
  description: "Experience the future of fashion with VOGUEX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(inter.className, "min-h-screen flex flex-col")} suppressHydrationWarning>
        <VoiceControlProvider>
          <VogueXCoinsProvider>
            <CollaborationProvider>
              <Suspense fallback={null}>
                <GlobalLoader />
              </Suspense>
              <MainLayoutWrapper
                navbar={<Navbar />}
                sidebar={<CartSidebar />}
                footer={<Footer />}
              >
                {children}
              </MainLayoutWrapper>
              <VoiceOrb />
              <CoinWallet />
              <CollaborationToolbar />
              <CollaborationOverlays />
              <ExitIntentPopup />
              <Toaster position="top-center" richColors />
            </CollaborationProvider>
          </VogueXCoinsProvider>
        </VoiceControlProvider>
      </body>
    </html>
  );
}
