import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { MainLayoutWrapper } from "@/components/layout/main-layout-wrapper";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

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
        <MainLayoutWrapper
          navbar={<Navbar />}
          sidebar={<CartSidebar />}
          footer={<Footer />}
        >
          {children}
        </MainLayoutWrapper>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
