"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    ComposedChart,
    RadialBarChart,
    RadialBar,
    ScatterChart,
    Scatter,
    Treemap,
    ReferenceLine,
    LabelList
} from "recharts"
import {
    TrendingUp,
    Users,
    MousePointerClick,
    ArrowUpRight,
    Calendar,
    Activity,
    ShoppingBag,
    RefreshCcw,
    MapPin,
    Zap,
    BrainCircuit,
    Clock,
    Smartphone,
    Globe,
    CreditCard,
    Package,
    Truck,
    Smile,
    Heart,
    Search,
    DollarSign,
    Target,
    Scale,
    Trophy,
    Timer,
    AlertTriangle,
    Tag,
    Crown,
    Hourglass,
    Sparkles,
    Megaphone,
    Rocket,
    AlertOctagon,
    RefreshCw,
    Landmark,
    Receipt,
    Wallet,
    Coins,
    AlertCircle,
    Layers,
    TrendingDown,
    Archive,
    ThumbsUp,
    Radar as RadarIcon,
    UserCheck,
    UserPlus,
    UserMinus,
    MessageSquare,
    User,
    Mail,
    Share2,
    Megaphone as MegaphoneIcon,
    MousePointer,
    Target as TargetIcon,
    ClipboardCheck,
    RotateCcw,
    BadgeCheck,
    Box,
    Video,
    Star,
    ShieldCheck,
    Mic,
    Link2,
    LayoutTemplate

} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// --- EXTENSIVE MOCK DATA ---

// 1. Overview & Forecast
const revenueData = [
    { name: '00:00', revenue: 1200, orders: 4, forecast: 1100, cost: 800, net: 400 },
    { name: '04:00', revenue: 800, orders: 2, forecast: 900, cost: 600, net: 200 },
    { name: '08:00', revenue: 2400, orders: 8, forecast: 2600, cost: 1500, net: 900 },
    { name: '12:00', revenue: 9800, orders: 32, forecast: 9500, cost: 6000, net: 3800 },
    { name: '16:00', revenue: 14500, orders: 45, forecast: 15000, cost: 8500, net: 6000 },
    { name: '20:00', revenue: 11200, orders: 38, forecast: 10800, cost: 7000, net: 4200 },
    { name: '23:59', revenue: 5600, orders: 15, forecast: 6000, cost: 3500, net: 2100 },
]

// 2. Funnel
const funnelData = [
    { stage: 'Impressions', value: 12500, drop: 0, fill: '#3b82f6' },
    { stage: 'Product Views', value: 8400, drop: 32, fill: '#60a5fa' },
    { stage: 'Add to Cart', value: 3200, drop: 62, fill: '#8b5cf6' },
    { stage: 'Checkout', value: 1800, drop: 44, fill: '#a78bfa' },
    { stage: 'Purchase', value: 1450, drop: 19, fill: '#10b981' },
]

// 3. Demographics
const ageData = [
    { name: '18-24', value: 30 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 15 },
    { name: '45+', value: 10 },
]



// 5. Payment Split
const paymentData = [
    { name: 'Prepaid (Card/UPI)', value: 65, color: '#10b981' },
    { name: 'COD', value: 35, color: '#f59e0b' },
]

// 6. Shipping Time Trend
const shippingTrend = [
    { week: 'W1', days: 4.2 },
    { week: 'W2', days: 3.8 },
    { week: 'W3', days: 3.5 },
    { week: 'W4', days: 2.9 },
]

// 7. Sentiment
const sentimentData = [
    { name: 'Positive', value: 78, color: '#22c55e' },
    { name: 'Neutral', value: 15, color: '#94a3b8' },
    { name: 'Negative', value: 7, color: '#ef4444' },
]

// 8. Wishlist Trend
const wishlistData = [
    { name: 'Mon', count: 45, added: 12 },
    { name: 'Tue', count: 52, added: 15 },
    { name: 'Wed', count: 38, added: 8 },
    { name: 'Thu', count: 65, added: 22 },
    { name: 'Fri', count: 89, added: 30 },
    { name: 'Sat', count: 120, added: 45 },
    { name: 'Sun', count: 95, added: 35 },
]

const heatmapData = Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, hour) => ({
        day,
        hour,
        value: Math.floor(Math.random() * 100)
    }))
)

// 9. Competitor Pricing
const competitorPriceData = [
    { name: 'Product A', myPrice: 1200, avgMarketPrice: 1350 },
    { name: 'Product B', myPrice: 800, avgMarketPrice: 750 },
    { name: 'Product C', myPrice: 2400, avgMarketPrice: 2600 },
    { name: 'Product D', myPrice: 4500, avgMarketPrice: 4500 },
]

// 10. Buy Box Win Rate
const buyBoxData = [
    { name: 'Winning', value: 82, fill: '#22c55e' },
    { name: 'Losing', value: 18, fill: '#ef4444' }
]

// 11. Processing Time Histogram
const processingTimeData = [
    { range: '0-4h', orders: 45 },
    { range: '4-8h', orders: 80 },
    { range: '8-12h', orders: 30 },
    { range: '12-24h', orders: 15 },
    { range: '24h+', orders: 5 },
]

// 12. SLA Performance
const slaData = [
    { name: 'On Time Dispatch', value: 98, fill: '#22c55e' },
    { name: 'Breached', value: 2, fill: '#ef4444' }
]

// 13. Device Data
const deviceData = [
    { name: 'Mobile', value: 65, color: '#0088FE' },
    { name: 'Desktop', value: 25, color: '#00C49F' },
    { name: 'Tablet', value: 10, color: '#FFBB28' },
]

// 14. Geo Data
const geoData = [
    { city: 'Mumbai', sales: 85 },
    { city: 'Delhi', sales: 72 },
    { city: 'Bangalore', sales: 64 },
    { city: 'Hyderabad', sales: 45 },
    { city: 'Chennai', sales: 30 },
]

// 15. Loyalty Tiers
const loyaltyData = [
    { name: 'Platinum', value: 10, fill: '#e5e7eb' },
    { name: 'Gold', value: 25, fill: '#fcd34d' },
    { name: 'Silver', value: 35, fill: '#94a3b8' },
    { name: 'Bronze', value: 30, fill: '#b45309' },
]

// 16. Coupon Usage
const couponData = [
    { name: 'With Coupon', value: 42, fill: '#ec4899' },
    { name: 'Full Price', value: 58, fill: '#64748b' },
]

// 17. Refund Trend
const refundTrendData = [
    { name: 'Week 1', rate: 4.5 },
    { name: 'Week 2', rate: 4.2 },
    { name: 'Week 3', rate: 3.8 },
    { name: 'Week 4', rate: 2.4 },
]

// 18. Search Terms
const searchTerms = [
    { term: "Silk Saree", count: 1240 },
    { term: "Black Dress", count: 980 },
    { term: "Kurta Set", count: 850 },
    { term: "Heels", count: 620 },
    { term: "Handbag", count: 540 },
]

// 19. Start New Metrics Data ---

// ROAS Data
const roasData = [
    { platform: "Google Ads", spent: 1000, revenue: 5000, roas: 5 },
    { platform: "Instagram", spent: 800, revenue: 3200, roas: 4 },
    { platform: "Facebook", spent: 600, revenue: 1800, roas: 3 },
]

// Listing Quality Score (LQS)
const lqsData = [
    { name: 'Images', score: 90, fullMark: 100 },
    { name: 'Title Keywords', score: 75, fullMark: 100 },
    { name: 'Description', score: 60, fullMark: 100 },
    { name: 'Attributes', score: 85, fullMark: 100 },
    { name: 'Reviews', score: 80, fullMark: 100 },
]

// Churn Risk
const churnRiskUsers = [
    { name: "Ananya S.", risk: "High", daysSinceLastOrder: 45, value: "₹12,400" },
    { name: "Rahul K.", risk: "Medium", daysSinceLastOrder: 28, value: "₹8,200" },
    { name: "Priya M.", risk: "High", daysSinceLastOrder: 52, value: "₹15,100" },
]

// Restock Predictor
const restockData = [
    { item: "Silk Saree Red", daysLeft: 3, velocity: "Fast" },
    { item: "Leather Belt", daysLeft: 8, velocity: "Medium" },
    { item: "Cotton Kurti", daysLeft: 12, velocity: "Medium" },
]

// Price Elasticity
const elasticityData = [
    { price: 1000, demand: 50 },
    { price: 950, demand: 65 },
    { price: 900, demand: 85 },
    { price: 850, demand: 110 },
]

// Time to Purchase
const purchaseTimeData = [
    { time: '0-5min', users: 120 },
    { time: '5-15min', users: 80 },
    { time: '15-60min', users: 45 },
    { time: '1h+', users: 20 },
]

// Review Word Cloud (Simplified as list)
const reviewKeywords = [
    { text: "Quality", value: 50, color: "#10b981" },
    { text: "Fast", value: 40, color: "#3b82f6" },
    { text: "Size", value: 30, color: "#f59e0b" },
    { text: "Fabric", value: 25, color: "#8b5cf6" },
    { text: "Color", value: 20, color: "#ec4899" },
]

// Net Profit (Waterfall Concept)
const profitData = [
    { name: 'Revenue', amount: 45000, fill: '#3b82f6' },
    { name: 'COGS', amount: -15000, fill: '#ef4444' },
    { name: 'Ads', amount: -5000, fill: '#f59e0b' },
    { name: 'Shipping', amount: -3000, fill: '#f59e0b' },
    { name: 'Fees', amount: -2000, fill: '#f59e0b' },
    { name: 'Net Profit', amount: 20000, fill: '#10b981' }, // Stacked
]

const categoryData = [
    { name: 'Ethnic', sales: 4000 },
    { name: 'Western', sales: 3000 },
    { name: 'Footwear', sales: 2000 },
    { name: 'Access.', sales: 2780 },
    { name: 'Jewelry', sales: 1890 },
]

const retentionData = [
    { name: 'New', value: 65, color: '#3b82f6' },
    { name: 'Returning', value: 35, color: '#10b981' },
]

const topProducts = [
    { name: "Silk Saree Kanjivaram", revenue: "₹1,24,000", units: 124, trend: "+12%" },
    { name: "Leather Tote Bag", revenue: "₹89,000", units: 45, trend: "+8%" },
    { name: "Slim Fit Blazer", revenue: "₹65,000", units: 89, trend: "+5%" },
    { name: "Gold Plated Earrings", revenue: "₹42,000", units: 210, trend: "+15%" },
    { name: "Running Shoes Air", revenue: "₹38,000", units: 56, trend: "-2%" },
]

const stockHealth = [
    { name: 'Healthy', value: 70, color: '#22c55e' },
    { name: 'Low Stock', value: 20, color: '#eab308' },
    { name: 'Overstock', value: 10, color: '#ef4444' },
]

// 20. DEEP FINANCIAL DATA

// Cash Flow Prediction
const cashFlowData = [
    { date: 'Mon', inflow: 12000, outflow: 4000 },
    { date: 'Tue', inflow: 15500, outflow: 3500 },
    { date: 'Wed', inflow: 11200, outflow: 8000 },
    { date: 'Thu', inflow: 18000, outflow: 4200 },
    { date: 'Fri', inflow: 22000, outflow: 12000 }, // Big payout
    { date: 'Sat', inflow: 16000, outflow: 5000 },
    { date: 'Sun', inflow: 14000, outflow: 3000 },
]

// Expense Breakdown
const expenseBreakdown = [
    { name: "Product Cost", value: 45, color: "#3b82f6" },
    { name: "Shipping/Ops", value: 20, color: "#f59e0b" },
    { name: "Marketing (Ads)", value: 15, color: "#8b5cf6" },
    { name: "Platform Fees", value: 12, color: "#64748b" },
    { name: "Tax (GST)", value: 8, color: "#ef4444" },
]

// GMV vs Net Sales
const gmvData = [
    { month: 'Jan', gmv: 450000, net: 380000 },
    { month: 'Feb', gmv: 480000, net: 410000 },
    { month: 'Mar', gmv: 520000, net: 445000 },
    { month: 'Apr', gmv: 510000, net: 430000 },
]

// Tax Liability
const taxData = [
    { month: 'Jan', collected: 25000, inputCredit: 12000 },
    { month: 'Feb', collected: 28000, inputCredit: 14000 },
    { month: 'Mar', collected: 32000, inputCredit: 15000 },
]

// 21. DEEP INVENTORY DATA (NEW)

// Dead Stock
const deadStockData = [
    { name: "Old Summer Dress", daysSinceSale: 45, quantity: 12, value: 5000 },
    { name: "Striped Socks ", daysSinceSale: 60, quantity: 50, value: 2500 },
    { name: "Neon Cap", daysSinceSale: 90, quantity: 15, value: 1500 },
]

// ABC Analysis
const abcData = [
    { name: "A - High Value", value: 70, fill: "#22c55e", desc: "Top 20% items = 70% Revenue" },
    { name: "B - Medium Value", value: 20, fill: "#f59e0b", desc: "Next 30% items = 20% Revenue" },
    { name: "C - Low Value", value: 10, fill: "#ef4444", desc: "Bottom 50% items = 10% Revenue" },
]

// Sell Through Rate
const sellThroughData = [
    { week: 'W1', rate: 45 },
    { week: 'W2', rate: 48 },
    { week: 'W3', rate: 52 },
    { week: 'W4', rate: 55 },
]

// 22. ULTIMATE CUSTOMER INTELLIGENCE DATA (NEW)

// Gender Split
const genderData = [
    { name: 'Female', value: 65, fill: '#ec4899' },
    { name: 'Male', value: 30, fill: '#3b82f6' },
    { name: 'Other', value: 5, fill: '#a8a29e' },
]

// Purchase Frequency Histogram
const frequencyData = [
    { orders: '1 Order', count: 120 },
    { orders: '2-3 Orders', count: 85 },
    { orders: '4-7 Orders', count: 45 },
    { orders: '8+ Orders', count: 15 },
]

// Global Health Score (Overview Tab Update)
const healthRadarData = [
    { subject: 'Finance', A: 90, fullMark: 100 },
    { subject: 'Operations', A: 85, fullMark: 100 },
    { subject: 'Marketing', A: 75, fullMark: 100 },
    { subject: 'Inventory', A: 80, fullMark: 100 },
    { subject: 'Sentiment', A: 88, fullMark: 100 },
    { subject: 'Growth', A: 70, fullMark: 100 },
]

// Product Performance Matrix
const productPerformanceData = [
    { name: 'Saree', views: 45, sales: 124, z: 1200, color: '#3b82f6' },
    { name: 'Tunic', views: 80, sales: 50, z: 400, color: '#f59e0b' },
    { name: 'Dress', views: 120, sales: 85, z: 850, color: '#10b981' },
    { name: 'Jeans', views: 30, sales: 10, z: 100, color: '#ef4444' },
    { name: 'Kurta', views: 65, sales: 45, z: 450, color: '#8b5cf6' },
]

// 23. DEEP MARKETING DATA (NEW)

const campaignPerformance = [
    { name: "Summer Sale '24", status: "Active", spent: "₹12,000", revenue: "₹45,000", roas: 3.75, ctr: "2.4%" },
    { name: "Diwali Bash", status: "Scheduled", spent: "₹0", revenue: "₹0", roas: "-", ctr: "-" },
    { name: "New Arrivals", status: "Active", spent: "₹8,500", revenue: "₹22,000", roas: 2.58, ctr: "1.8%" },
    { name: "Clearance", status: "Ended", spent: "₹5,000", revenue: "₹18,000", roas: 3.6, ctr: "3.1%" },
]

const trafficSourceDeep = [
    { name: 'Instagram', value: 45, fill: '#E1306C' },
    { name: 'Google Search', value: 30, fill: '#4285F4' },
    { name: 'Direct', value: 15, fill: '#94a3b8' },
    { name: 'Facebook', value: 10, fill: '#1877F2' },
]

const cacTrend = [
    { month: 'Jan', cac: 450 },
    { month: 'Feb', cac: 420 },
    { month: 'Mar', cac: 380 }, // Improving
    { month: 'Apr', cac: 390 },
]

const emailStats = [
    { name: 'Open Rate', value: 24, fill: '#8b5cf6', target: 20 },
    { name: 'Click Rate', value: 4.2, fill: '#f59e0b', target: 3.0 },
    { name: 'Bounce Rate', value: 0.8, fill: '#ef4444', target: 1.0 },
]

// 24. HYPER-MARKETING INSIGHTS (NEW)
const channelConversion = [
    { name: 'Instagram', traffic: 4500, sales: 120, conversion: 2.6 },
    { name: 'Google', traffic: 3000, sales: 180, conversion: 6.0 },
    { name: 'Email', traffic: 1200, sales: 90, conversion: 7.5 },
    { name: 'Direct', traffic: 1500, sales: 45, conversion: 3.0 },
]

const socialGrowth = [
    { month: 'Jan', insta: 1200, fb: 800, twitter: 300 },
    { month: 'Feb', insta: 1350, fb: 820, twitter: 310 },
    { month: 'Mar', insta: 1600, fb: 850, twitter: 340 },
    { month: 'Apr', insta: 2100, fb: 900, twitter: 380 },
]

// Ad Format Performance (Radar)
const adFormatData = [
    { subject: 'Stories', A: 120, fullMark: 150 },
    { subject: 'Reels', A: 145, fullMark: 150 },
    { subject: 'Static Feed', A: 90, fullMark: 150 },
    { subject: 'Carousel', A: 110, fullMark: 150 },
    { subject: 'Search Ads', A: 85, fullMark: 150 },
    { subject: 'Video Ads', A: 130, fullMark: 150 },
]

const topAffiliates = [
    { name: "Priya Fashionista", clicks: 1240, conversions: 85, commission: "₹4,200" },
    { name: "StyleWithMe", clicks: 850, conversions: 42, commission: "₹2,100" },
    { name: "RahulTrends", clicks: 600, conversions: 30, commission: "₹1,500" },
]

// 25. MEGA-OPERATIONS DATA SUITE (NEW)
const courierPerformance = [
    { name: 'FedEx', deliveryRate: 98, avgDays: 2.1, rto: 1.2 },
    { name: 'BlueDart', deliveryRate: 96, avgDays: 1.8, rto: 2.5 },
    { name: 'Delhivery', deliveryRate: 92, avgDays: 3.5, rto: 4.0 },
    { name: 'EcomExp', deliveryRate: 88, avgDays: 4.2, rto: 6.5 },
]

const returnReasons = [
    { name: 'Size Issue', value: 45, fill: '#f87171' },
    { name: 'Quality Not Good', value: 25, fill: '#fbbf24' },
    { name: 'Wrong Item', value: 15, fill: '#60a5fa' },
    { name: 'Damaged', value: 10, fill: '#ef4444' },
    { name: 'Better Price Found', value: 5, fill: '#94a3b8' },
]

const zonePerformance = [
    { subject: 'North Zone', A: 90, fullMark: 100 },
    { subject: 'South Zone', A: 85, fullMark: 100 },
    { subject: 'East Zone', A: 60, fullMark: 100 },
    { subject: 'West Zone', A: 95, fullMark: 100 },
    { subject: 'Central', A: 75, fullMark: 100 },
    { subject: 'Metro', A: 98, fullMark: 100 },
]

const fulfillmentCosts = [
    { month: 'Jan', packing: 1200, shipping: 4500, labor: 2000 },
    { month: 'Feb', packing: 1150, shipping: 4600, labor: 2100 },
    { month: 'Mar', packing: 1100, shipping: 4300, labor: 1950 }, // Efficiency passing
    { month: 'Apr', packing: 1050, shipping: 4200, labor: 1900 },
]

const odrTrend = [
    { week: 'W1', rate: 1.5 },
    { week: 'W2', rate: 1.2 },
    { week: 'W3', rate: 0.8 },
    { week: 'W4', rate: 0.5 },
]

// 26. MEGA-PRODUCT INSIGHTS (NEW)
const categoryTreemapData = [
    { name: 'Sarees', size: 45000, fill: '#8884d8' },
    { name: 'Kurtas', size: 32000, fill: '#83a6ed' },
    { name: 'Lehengas', size: 28000, fill: '#8dd1e1' },
    { name: 'Jewelry', size: 15000, fill: '#82ca9d' },
    { name: 'Footwear', size: 12000, fill: '#a4de6c' },
    { name: 'Bags', size: 8000, fill: '#d0ed57' },
]

const highReturnProducts = [
    { name: 'Slim Fit Jeans', returnRate: 18.5, reason: 'Size Issues' },
    { name: 'Red Cotton Kurti', returnRate: 12.2, reason: 'Color Fade' },
    { name: 'Gold Bangles', returnRate: 8.4, reason: 'Damage' },
]

const variantPerformance = [
    { size: 'S', sales: 120, fill: '#8884d8' },
    { size: 'M', sales: 450, fill: '#83a6ed' },
    { size: 'L', sales: 380, fill: '#8dd1e1' },
    { size: 'XL', sales: 210, fill: '#82ca9d' },
    { size: 'XXL', sales: 90, fill: '#a4de6c' },
]

const bundleOpportunities = [
    { main: 'Silk Saree', pair: 'Gold Earrings', uplift: '+15%' },
    { main: 'Denim Jacket', pair: 'White T-Shirt', uplift: '+12%' },
    { main: 'Running Shoes', pair: 'Ankle Socks', uplift: '+22%' },
]

const productMarginData = [
    { name: 'Premium Saree', margin: 45, volume: 120, z: 200, fill: '#22c55e' }, // High Margin, High Vol
    { name: 'Basic Tee', margin: 15, volume: 800, z: 100, fill: '#3b82f6' }, // Low Margin, High Vol
    { name: 'Designer Gown', margin: 60, volume: 40, z: 300, fill: '#a855f7' }, // High Margin, Low Vol
    { name: 'Accessory Kit', margin: 30, volume: 400, z: 150, fill: '#f59e0b' },
]

const wishlistConversion = [
    { name: 'Added to Wishlist', value: 1000 },
    { name: 'Moved to Cart', value: 450 },
    { name: 'Purchased', value: 180 },
]

// 27. ULTRA-PRODUCT INSIGHTS (50+ ADDITION)
const stockAgeingData = [
    { range: '0-30 Days', value: 450, fill: '#22c55e' },
    { range: '31-60 Days', value: 320, fill: '#f59e0b' },
    { range: '61-90 Days', value: 150, fill: '#f97316' },
    { range: '90+ Days', value: 80, fill: '#ef4444' },
]

const priceElasticityData = [
    { priceChange: '-20%', salesLift: '+45%' },
    { priceChange: '-10%', salesLift: '+18%' },
    { priceChange: '0%', salesLift: '0%' },
    { priceChange: '+10%', salesLift: '-12%' },
    { priceChange: '+20%', salesLift: '-35%' },
]

const sentimentDistribution = [
    { star: '5 Star', count: 450, color: '#22c55e' },
    { star: '4 Star', count: 320, color: '#84cc16' },
    { star: '3 Star', count: 150, color: '#eab308' },
    { star: '2 Star', count: 80, color: '#f97316' },
    { star: '1 Star', count: 40, color: '#ef4444' },
]

const contentPerformance = [
    { type: 'Video', conversion: 4.2 },
    { type: 'High-Res Image', conversion: 3.5 },
    { type: 'Basic Image', conversion: 1.8 },
    { type: 'No Image', conversion: 0.5 },
]

const demandForecast = [
    { month: 'Jul', demand: 1200 },
    { month: 'Aug', demand: 1450 },
    { month: 'Sep', demand: 1800 },
    { month: 'Oct', demand: 2500 }, // Festive
    { month: 'Nov', demand: 2100 },
    { month: 'Dec', demand: 1900 },
]

// 29. MEGA-GROWTH INSIGHTS (NEW)
const keywordRankings = [
    { keyword: 'Silk Saree with Blouse', position: 3, change: '+2', vol: '12k' },
    { keyword: 'Cotton Kurti for Women', position: 8, change: '-1', vol: '8.5k' },
    { keyword: 'Gold Plated Necklace', position: 1, change: '0', vol: '5.2k' },
    { keyword: 'Designer Lehenga', position: 12, change: '+5', vol: '15k' },
    { keyword: 'Running Shoes Men', position: 5, change: '+1', vol: '22k' },
]

const seoHealthMetrics = [
    { name: 'Meta Tags', score: 98, full: 100 },
    { name: 'Mobile Use', score: 92, full: 100 },
    { name: 'Broken Links', score: 85, full: 100 },
    { name: 'Page Speed', score: 78, full: 100 },
    { name: 'Img Alt', score: 95, full: 100 },
]

const shareOfVoice = [
    { name: 'Your Brand', value: 25, fill: '#8b5cf6' },
    { name: 'Competitor A', value: 35, fill: '#94a3b8' },
    { name: 'Competitor B', value: 20, fill: '#cbd5e1' },
    { name: 'Others', value: 20, fill: '#e2e8f0' },
]

const backlinkGrowth = [
    { month: 'Mar', links: 120 },
    { month: 'Apr', links: 145 },
    { month: 'May', links: 180 },
    { month: 'Jun', links: 210 },
    { month: 'Jul', links: 290 },
]

const webVitalsData = [
    { metric: 'LCP (sec)', value: 1.2, target: 2.5, status: 'Good' },
    { metric: 'FID (ms)', value: 12, target: 100, status: 'Good' },
    { metric: 'CLS', value: 0.05, target: 0.1, status: 'Good' },
]

const experimentResults = [
    { name: 'Product Page v2', type: 'A/B Test', uplift: '+12.5%', status: 'Win' },
    { name: 'Checkout One-Step', type: 'Flow', uplift: '+8.2%', status: 'Win' },
    { name: 'New Hero Image', type: 'Design', uplift: '-2.1%', status: 'Loss' },
]

// 30. ULTRA-GROWTH & SEO (50+ MORE)
const serpFeatures = [
    { name: 'Featured Snippet', value: 12, won: true },
    { name: 'Image Pack', value: 45, won: true },
    { name: 'Video Carousel', value: 8, won: false },
    { name: 'People Also Ask', value: 85, won: true },
    { name: 'Local Pack', value: 3, won: false },
]

const backlinkQuality = [
    { name: 'High Authority (90+)', value: 45, fill: '#22c55e' },
    { name: 'Medium (50-90)', value: 120, fill: '#3b82f6' },
    { name: 'Low/Natural', value: 300, fill: '#94a3b8' },
    { name: 'Toxic/Spam', value: 12, fill: '#ef4444' },
]

const contentGapAnalysis = [
    { topic: 'Summer Silk Styling', difficulty: 'Easy', vol: '5.4k' },
    { topic: 'Care for Cotton', difficulty: 'Med', vol: '2.1k' },
    { topic: 'Wedding Gift Ideas', difficulty: 'Hard', vol: '12k' },
    { topic: 'Sustainable Fashion', difficulty: 'Med', vol: '8.5k' },
]

const referralDeepDive = [
    { source: 'Instagram / Bio', visitors: 4500, conv: '4.2%' },
    { source: 'Fashion Blog A', visitors: 1200, conv: '8.5%' },
    { source: 'Google Discover', visitors: 8500, conv: '1.2%' },
    { source: 'YouTube Reviews', visitors: 3200, conv: '5.6%' },
]

const voiceSearchReadiness = [
    { metric: 'Conversational Keywords', score: 85, full: 100, fill: '#8b5cf6' },
    { metric: 'Schema Markup', score: 92, full: 100, fill: '#ec4899' },
    { metric: 'Page Speed (Mobile)', score: 78, full: 100, fill: '#f59e0b' },
    { metric: 'FAQ Structure', score: 65, full: 100, fill: '#3b82f6' },
]

// 31. ULTRA-OVERVIEW (50+ MORE)
const liveSalesVelocity = [
    { name: '0-10m', value: 120, fill: '#ef4444' },
    { name: '10-30m', value: 250, fill: '#f97316' },
    { name: '30-60m', value: 480, fill: '#f59e0b' },
    { name: '1h+', value: 950, fill: '#22c55e' },
]

const recentWhales = [
    { name: "Vikram R.", amount: "₹85,000", items: 12, city: "Mumbai", status: "Processing" },
    { name: "Sneha P.", amount: "₹42,000", items: 8, city: "Delhi", status: "Paid" },
    { name: "Arjun K.", amount: "₹38,500", items: 5, city: "Bangalore", status: "Packed" },
]

const topCityHeatmap = [
    { city: 'Mumbai', active: 1450, growth: '+12%' },
    { city: 'Delhi', active: 1100, growth: '+8%' },
    { city: 'Bangalore', active: 980, growth: '+15%' },
    { city: 'Hyderabad', active: 620, growth: '+5%' },
    { city: 'Chennai', active: 450, growth: '-2%' },
]

const stockLowAlerts = [
    { name: 'Red Silk Saree (M)', stock: 2, threshold: 5 },
    { name: 'Blue Denim Jacket (L)', stock: 1, threshold: 5 },
    { name: 'Gold Necklace Set', stock: 3, threshold: 5 },
]

const competitorPriceWatch = [
    { product: 'Running Shoes X', myPrice: 2400, competitor: 2200, gap: '-₹200 (Risk)' },
    { product: 'Leather Wallet', myPrice: 800, competitor: 950, gap: '+₹150 (Win)' },
    { product: 'Smart Watch', myPrice: 3500, competitor: 3500, gap: 'Equal' },
]


export default function AnalyticsPage() {
    const [liveVisitors, setLiveVisitors] = useState(124)

    // Simulate Live Visitors Tick
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveVisitors(prev => prev + Math.floor(Math.random() * 5) - 2)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        Analytics Headquarters
                        <Badge variant="outline" className="animate-pulse border-green-500 text-green-600 bg-green-50 flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            LIVE
                        </Badge>
                    </h1>
                    <p className="text-gray-500 mt-1">Enterprise-grade intelligence with AI-driven Growth & SEO insights.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Custom Range</Button>
                    <Button className="bg-slate-900 text-white">Export PDF Report</Button>
                </div>
            </div>

            {/* 1. KEY METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-100 shadow-sm bg-gradient-to-br from-indigo-900 to-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-3 opacity-10"><Zap size={100} /></div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-300">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₹45,231</div>
                        <p className="text-xs text-slate-400 flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1 text-green-400" /> +20.1% vs yesterday
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-500">Live Traffic</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{liveVisitors}</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <Activity className="h-3 w-3 mr-1" /> Active shoppers
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-500">Avg Order Value</CardTitle>
                        <Target className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₹2,450</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +5%
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-500">Listing Quality</CardTitle>
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">85/100</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            Excellence (SEO Optimized)
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-4 flex flex-wrap h-auto gap-2 bg-transparent p-0">
                    <TabsTrigger className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border px-4 py-2" value="overview">Overview</TabsTrigger>
                    <TabsTrigger className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border px-4 py-2" value="growth">Growth & SEO</TabsTrigger>
                    <TabsTrigger className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border px-4 py-2" value="finance">Financials</TabsTrigger>
                    <TabsTrigger className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border px-4 py-2" value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border px-4 py-2" value="customers">Customers</TabsTrigger>
                    <TabsTrigger className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border px-4 py-2" value="marketing">Marketing</TabsTrigger>
                    <TabsTrigger className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border px-4 py-2" value="ops">Operations</TabsTrigger>
                    <TabsTrigger className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border px-4 py-2" value="products">Products</TabsTrigger>
                </TabsList>

                {/* 1. OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Revenue Forecast
                                    <Badge variant="secondary" className="text-xs font-normal text-purple-600 bg-purple-50 border-purple-100">
                                        <BrainCircuit className="w-3 h-3 mr-1" /> AI Predicted
                                    </Badge>
                                </CardTitle>
                                <CardDescription>Actual revenue vs AI predicted trajectory.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            formatter={(value: any, name: any) => [`₹${value}`, name === 'revenue' ? 'Actual' : 'AI Forecast']}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                        <Line type="monotone" dataKey="forecast" stroke="#9333ea" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>


                        <div className="space-y-6">
                            {/* BUSINESS HEALTH RADAR (NEW) */}
                            <Card className="border-slate-100 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">Business Health <RadarIcon className="h-4 w-4 text-purple-500" /></CardTitle>
                                    <CardDescription>Departmental Scorecard</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={healthRadarData}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" fontSize={10} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Healthy" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                                            <Tooltip />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Sales by Category</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="sales">
                                                {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5]} />)}
                                            </Pie>
                                            <Tooltip />
                                            <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-100 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Cart Abandonment</CardTitle>
                                    <CardDescription>Rate over 24h</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-500">62.8%</div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full mt-2">
                                        <div className="bg-red-400 h-2 rounded-full" style={{ width: '62.8%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Industry avg: 69.5% (You are doing well)</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* NEW SECTION: ULTRA-OVERVIEW INSIGHTS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* LIVE VELOCITY GAUGE */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Sales Velocity <Timer className="h-4 w-4 text-orange-600" /></CardTitle>
                                <CardDescription>Orders per timeslice (Live)</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={20} data={liveSalesVelocity}>
                                        <RadialBar
                                            label={{ position: 'insideStart', fill: '#fff', fontSize: '10px' }}
                                            background
                                            dataKey="value"
                                        />
                                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ fontSize: '10px', left: 0 }} />
                                        <Tooltip />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* RECENT WHALES */}
                        <Card className="border-slate-100 shadow-sm col-span-1 lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Whale Watch 🐳 <Crown className="h-4 w-4 text-purple-600" /></CardTitle>
                                <CardDescription>High Value Orders (&gt;₹20k) in last hour</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentWhales.map((w, i) => (
                                        <div key={i} className="flex justify-between items-center bg-purple-50/50 p-3 rounded-md border border-purple-100">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xs">{w.name.charAt(0)}</div>
                                                <div>
                                                    <div className="font-bold text-purple-900">{w.name}</div>
                                                    <div className="text-xs text-purple-600">{w.city} • {w.items} items</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-extrabold text-purple-700 text-lg">{w.amount}</div>
                                                <Badge className="bg-purple-600 hover:bg-purple-700 h-5 text-[10px]">{w.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* CITY HEATMAP */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Live Heatmap <MapPin className="h-4 w-4 text-red-500" /></CardTitle>
                                <CardDescription>Active users by City</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topCityHeatmap.map((c, i) => (
                                        <div key={i} className="flex justify-between items-center border-b last:border-0 pb-2 border-slate-100">
                                            <span className="text-sm font-medium text-slate-700">{c.city}</span>
                                            <div className="text-right">
                                                <span className="font-bold text-slate-900 block">{c.active}</span>
                                                <span className="text-[10px] text-green-600">{c.growth}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* STOCK LOW ALERTS */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Panic Room <AlertOctagon className="h-4 w-4 text-red-600" /></CardTitle>
                                <CardDescription>Critical Low Stock (&lt;5)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {stockLowAlerts.map((s, i) => (
                                        <div key={i} className="bg-red-50 p-2 rounded border border-red-100 flex justify-between items-center">
                                            <span className="text-xs font-medium text-red-900 truncate w-32">{s.name}</span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-red-600 border-red-200 bg-white">{s.stock} left</Badge>
                                            </div>
                                        </div>
                                    ))}
                                    <Button size="sm" variant="destructive" className="w-full text-xs h-8">Restock All Now</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* COMPETITOR PRICE WATCH */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Price Wars <Target className="h-4 w-4 text-blue-600" /></CardTitle>
                                <CardDescription>Live Competitor Variance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {competitorPriceWatch.map((c, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div>
                                                <div className="text-xs font-bold text-slate-700">{c.product}</div>
                                                <div className="text-[10px] text-gray-400">You: ₹{c.myPrice} vs Mkt: ₹{c.competitor}</div>
                                            </div>
                                            <Badge className={c.gap.includes('Risk') ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}>{c.gap}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* 2. GROWTH & SEO TAB */}
                <TabsContent value="growth" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Listing Quality Score</CardTitle>
                                <CardDescription>AI Analysis of Product SEO</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={lqsData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="name" fontSize={12} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                        <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>ROAS Optimization</CardTitle>
                                <CardDescription>Ad Spend Efficiency</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={roasData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="platform" fontSize={12} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="roas" fill="#10b981" name="ROAS (x)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Price Elasticity</CardTitle>
                                <CardDescription>Demand Curve Simulation</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={elasticityData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="price" label={{ value: 'Price', position: 'insideBottom', offset: -5 }} />
                                        <YAxis label={{ value: 'Demand', angle: -90, position: 'insideLeft' }} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="demand" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* NEW SECTION: SEO DEEP DIVE */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* KEYWORD RANKINGS TABLE */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Keyword Dominance <Search className="h-4 w-4 text-blue-500" /></CardTitle>
                                <CardDescription>Top Ranked Search Terms (Google/Platform)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {keywordRankings.map((k, i) => (
                                        <div key={i} className="flex justify-between items-center bg-blue-50/50 p-2 rounded border border-blue-100">
                                            <div>
                                                <div className="font-medium text-sm text-blue-900">{k.keyword}</div>
                                                <div className="text-[10px] text-blue-400">Vol: {k.vol}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-blue-700">#{k.position}</div>
                                                <div className={`text-[10px] ${k.change.startsWith('+') ? 'text-green-600' : k.change.startsWith('-') ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {k.change === '0' ? '-' : k.change}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO HEALTH SCORECARD */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">SEO Health <Activity className="h-4 w-4 text-green-500" /></CardTitle>
                                <CardDescription>Technical Compliance Score</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" data={seoHealthMetrics} startAngle={180} endAngle={0}>
                                        <RadialBar label={{ position: 'insideStart', fill: '#fff' }} background dataKey="score" fill="#22c55e" />
                                        <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" wrapperStyle={{ top: 0, left: 350, lineHeight: '24px' }} />
                                        <Tooltip />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* SHARE OF VOICE */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Share of Voice <MegaphoneIcon className="h-4 w-4 text-purple-500" /></CardTitle>
                                <CardDescription>Market Visibility vs Competitors</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={shareOfVoice} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                                            {shareOfVoice.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="vertical" verticalAlign="middle" align="bottom" wrapperStyle={{ fontSize: '10px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* CORE WEB VITALS */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Core Web Vitals <Zap className="h-4 w-4 text-yellow-500" /></CardTitle>
                                <CardDescription>Page Speed & User Exp.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 pt-4">
                                    {webVitalsData.map((v, i) => (
                                        <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 border-slate-100">
                                            <span className="text-sm font-medium text-slate-600">{v.metric}</span>
                                            <div className="text-right">
                                                <div className="font-bold text-slate-800">{v.value}</div>
                                                <Badge variant="outline" className="text-[10px] h-4 text-green-600 border-green-200 bg-green-50">{v.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-2 text-xs text-gray-400">Passing Google Core Update ✅</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* EXPERIMENT RESULTS */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Growth Experiments <Rocket className="h-4 w-4 text-indigo-500" /></CardTitle>
                                <CardDescription>Recent A/B Tests</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {experimentResults.map((e, i) => (
                                        <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                            <div className="flex justify-between mb-1">
                                                <span className="font-semibold text-xs text-slate-800">{e.name}</span>
                                                <Badge className={e.status === 'Win' ? 'bg-green-500' : 'bg-red-400'}>{e.status}</Badge>
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-500">
                                                <span>{e.type}</span>
                                                <span className={e.uplift.startsWith('+') ? 'text-green-600 font-bold' : 'text-red-500'}>{e.uplift}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* NEW SECTION: ULTRA-GROWTH INITIATIVES */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* SERP FEATURE WINS */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">SERP Wins <LayoutTemplate className="h-4 w-4 text-blue-500" /></CardTitle>
                                <CardDescription>Google Rich Results Owned</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {serpFeatures.map((f, i) => (
                                        <div key={i} className={`p-3 rounded-md border flex items-center justify-between ${f.won ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
                                            <span className="text-sm font-medium text-slate-700">{f.name}</span>
                                            {f.won ? <BadgeCheck className="h-4 w-4 text-green-600" /> : <div className="h-4 w-4 rounded-full border border-slate-300" />}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* BACKLINK QUALITY */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Backlink Profile <Link2 className="h-4 w-4 text-indigo-500" /></CardTitle>
                                <CardDescription>Authority & Toxicity Check</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={backlinkQuality} innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                                            {backlinkQuality.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* CONTENT GAP AI */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Content Gaps <BrainCircuit className="h-4 w-4 text-pink-500" /></CardTitle>
                                <CardDescription>AI Topic Suggestions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {contentGapAnalysis.map((c, i) => (
                                        <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 border-slate-100">
                                            <div>
                                                <div className="font-medium text-sm text-slate-800">{c.topic}</div>
                                                <div className="text-[10px] text-gray-400">Vol: {c.vol}</div>
                                            </div>
                                            <Badge variant="outline" className={`text-[10px] ${c.difficulty === 'Easy' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>{c.difficulty}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* REFERRAL DEEP DIVE */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Referral Quality <Globe className="h-4 w-4 text-cyan-500" /></CardTitle>
                                <CardDescription>Top Traffic Sources by Conv.%</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {referralDeepDive.map((r, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">{r.source}</span>
                                                <span className="text-[10px] text-gray-400">{r.visitors} visits</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-green-600">{r.conv}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* VOICE SEARCH */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Voice Readiness <Mic className="h-4 w-4 text-purple-500" /></CardTitle>
                                <CardDescription>Optimization for 'Hey Google'</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={10} data={voiceSearchReadiness}>
                                        <RadialBar
                                            label={{ position: 'insideStart', fill: '#fff' }}
                                            background
                                            dataKey="score"
                                        />
                                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ fontSize: '10px', left: 0 }} />
                                        <Tooltip />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* 3. FINANCE TAB */}
                <TabsContent value="finance" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Cash Flow & Payout Forecast <Landmark className="h-4 w-4 text-green-600" /></CardTitle>
                                <CardDescription>Estimated Inflow vs Outflow</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" fill="#22c55e" name="Inflow (Payout)" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" fill="#ef4444" name="Outflow (Expenses)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-1 border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>GMV vs Net Sales</CardTitle>
                                <CardDescription>Impact of Returns (₹)</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={gmvData}>
                                        <XAxis dataKey="month" fontSize={12} />
                                        <YAxis hide />
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                        <Bar dataKey="gmv" stackId="a" fill="#94a3b8" name="Gross Value" />
                                        <Bar dataKey="net" stackId="a" fill="#3b82f6" name="Realized Rev" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-1 border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Expense Structure</CardTitle>
                                <CardDescription>Where every ₹ goes</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={expenseBreakdown} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {expenseBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="vertical" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Profit Waterfall</CardTitle>
                                <CardDescription>Net Profit Breakdown</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={profitData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="amount" fill="#8884d8">
                                            {profitData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Tax Liability <Receipt className="h-4 w-4 text-gray-500" /></CardTitle>
                                <CardDescription>Est. GST Payable (Output - Input)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {taxData.map((t, i) => (
                                        <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-md border border-slate-100">
                                            <div>
                                                <div className="font-medium text-sm">{t.month}</div>
                                                <div className="text-xs text-green-600">ITC: ₹{t.inputCredit}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-gray-900">₹{t.collected - t.inputCredit}</div>
                                                <div className="text-[10px] text-gray-500">Payable</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-2">
                                        <Button variant="outline" className="w-full text-xs h-8">Download Tax Report</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* 4. INVENTORY TAB (UPDATED) */}
                <TabsContent value="inventory" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* LOST REVENUE (NEW) */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">Lost Oppty <AlertCircle className="h-4 w-4" /></CardTitle>
                                <CardDescription>Est. Revenue lost to Stockouts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-red-500">₹12,450</div>
                                <p className="text-xs text-gray-500 mt-2">Missed sales in last 30 days due to OOS.</p>
                                <Button size="sm" variant="outline" className="mt-4 w-full text-red-600 border-red-100 hover:bg-red-50">View OOS Items</Button>
                            </CardContent>
                        </Card>

                        {/* ABC ANALYSIS (NEW) */}
                        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">ABC Analysis <Layers className="h-4 w-4 text-blue-500" /></CardTitle>
                                <CardDescription>Inventory Valuation Classification</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[150px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={abcData} margin={{ left: 30 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                                            {abcData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* SMART RESTOCK (Existing) */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Restock Alert</CardTitle>
                                <CardDescription>Action Needed</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {restockData.slice(0, 2).map((item, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <span>{item.item}</span>
                                            <span className="font-bold text-red-500">{item.daysLeft}d left</span>
                                        </div>
                                    ))}
                                    <Button size="sm" className="w-full mt-2">View All</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* DEAD STOCK (NEW) */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Dead Stock <Archive className="h-4 w-4 text-gray-500" /></CardTitle>
                                <CardDescription>0 Sales in 60+ Days</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {deadStockData.map((stock, i) => (
                                    <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                                        <div>
                                            <div className="text-sm font-medium">{stock.name}</div>
                                            <div className="text-xs text-gray-500">{stock.daysSinceSale}d dormant</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-gray-700">₹{stock.value}</div>
                                            <Badge variant="secondary" className="text-[10px] h-4">Liquidate</Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Inventory Turnover Status</CardTitle>
                                <CardDescription>Stock Health</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={stockHealth} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                                            {stockHealth.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* SELL THROUGH RATE (NEW) */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Sell-Through Rate</CardTitle>
                                <CardDescription>Weekly Efficiency</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={sellThroughData}>
                                        <defs>
                                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="week" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="rate" stroke="#10b981" fillOpacity={1} fill="url(#colorRate)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* 5. CUSTOMER INTEL TAB (UPDATED) */}
                <TabsContent value="customers" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* CUSTOMER SATISFACTION (NEW) */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">CSAT Score <ThumbsUp className="h-4 w-4 text-green-600" /></CardTitle>
                                <CardDescription>Overall Satisfaction</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <div className="text-4xl font-bold text-green-600 flex items-center gap-2">
                                    4.5 <span className="text-lg text-gray-400">/ 5</span>
                                </div>
                                <div className="flex gap-1 mt-3">
                                    {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-2 h-8 rounded bg-green-500 opacity-80" />)}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Based on 120 reviews</p>
                            </CardContent>
                        </Card>

                        {/* PURCHASE FREQUENCY (NEW) */}
                        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Purchase Frequency <RefreshCw className="h-4 w-4 text-blue-500" /></CardTitle>
                                <CardDescription>How often do customers return?</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={frequencyData}>
                                        <XAxis dataKey="orders" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* GENDER SPLIT (NEW) */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Demographics</CardTitle>
                                <CardDescription>Gender Split</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={genderData} innerRadius={40} outerRadius={60} dataKey="value">
                                            {genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* COHORT ANALYSIS (NEW TABLE) */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">Customer Retention Cohorts <Users className="h-4 w-4 text-purple-500" /></CardTitle>
                            <CardDescription>Percentage of returning users over time (The "Golden Metric")</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <div className="min-w-[600px] grid grid-cols-6 gap-1 text-sm text-center">
                                    <div className="font-bold text-gray-500 text-left pl-2">Cohort</div>
                                    <div className="font-bold text-gray-500">Month 0</div>
                                    <div className="font-bold text-gray-500">Month 1</div>
                                    <div className="font-bold text-gray-500">Month 2</div>
                                    <div className="font-bold text-gray-500">Month 3</div>
                                    <div className="font-bold text-gray-500">Month 4</div>

                                    {/* Rows */}
                                    <div className="text-left pl-2 font-medium">Jan 2024</div>
                                    <div className="bg-blue-100 py-2 rounded">100%</div>
                                    <div className="bg-blue-200 py-2 rounded">42%</div>
                                    <div className="bg-blue-300 py-2 rounded">35%</div>
                                    <div className="bg-blue-400 py-2 text-white rounded">32%</div>
                                    <div className="bg-blue-500 py-2 text-white rounded">30%</div>

                                    <div className="text-left pl-2 font-medium">Feb 2024</div>
                                    <div className="bg-blue-100 py-2 rounded">100%</div>
                                    <div className="bg-blue-200 py-2 rounded">45%</div>
                                    <div className="bg-blue-300 py-2 rounded">38%</div>
                                    <div className="bg-blue-400 py-2 text-white rounded">36%</div>
                                    <div className="py-2 text-gray-300">-</div>

                                    <div className="text-left pl-2 font-medium">Mar 2024</div>
                                    <div className="bg-blue-100 py-2 rounded">100%</div>
                                    <div className="bg-blue-200 py-2 rounded">40%</div>
                                    <div className="bg-blue-300 py-2 rounded">28%</div>
                                    <div className="py-2 text-gray-300">-</div>
                                    <div className="py-2 text-gray-300">-</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* AGE DEMOGRAPHICS (NEW CHART) */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Age Groups</CardTitle>
                                <CardDescription>Buyer Age Distribution</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ageData}>
                                        <XAxis dataKey="name" fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="value" >
                                            {ageData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042'][index % 4]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* CHURN RISK (Existing - Preserved) */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Churn Risk Alert <AlertOctagon className="h-4 w-4 text-red-500" /></CardTitle>
                                <CardDescription>At-risk High Value Customers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {churnRiskUsers.map((user, i) => (
                                        <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 hover:bg-red-50 transition-colors p-1 rounded">
                                            <div>
                                                <div className="font-medium text-sm">{user.name}</div>
                                                <div className="text-xs text-gray-500">Last seen {user.daysSinceLastOrder}d ago</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-sm">{user.value}</div>
                                                <Badge variant="destructive" className="text-[10px] h-4">High Risk</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* LOYALTY (Existing - Preserved) */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Loyalty Tiers <Crown className="h-4 w-4 text-yellow-500" />
                                </CardTitle>
                                <CardDescription>User Tier Distribution</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={loyaltyData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={60}
                                            dataKey="value"
                                        >
                                            {loyaltyData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Time to Purchase Analysis</CardTitle>
                                <CardDescription>Session duration before order</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={purchaseTimeData}>
                                        <XAxis dataKey="time" fontSize={12} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="users" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Shopping Heatmap</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-24 grid-rows-7 gap-1 h-[200px]">
                                    {heatmapData.flat().map((point, i) => (
                                        <div key={i} className={cn("rounded-[1px]", point.value > 80 ? "bg-blue-600" : point.value > 40 ? "bg-blue-300" : "bg-slate-100")} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* 6. MARKETING TAB (UPDATED) */}
                <TabsContent value="marketing" className="space-y-6">
                    {/* KEY MARKETING METRICS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-gray-500">Ad Spend (MTD)</CardTitle>
                                <DollarSign className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹25,500</div>
                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                    <ArrowUpRight className="h-3 w-3 mr-1 text-red-500" /> +12% vs last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-gray-500">Impressions</CardTitle>
                                <Users className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">128.5k</div>
                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" /> +8.4%
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-gray-500">Avg. CTR</CardTitle>
                                <MousePointer className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">2.4%</div>
                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                    Industry Avg: 1.8%
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-gray-500">CAC</CardTitle>
                                <TargetIcon className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹390</div>
                                <p className="text-xs text-green-600 flex items-center mt-1">
                                    <TrendingDown className="h-3 w-3 mr-1" /> -5% (Improving)
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* CAMPAIGN PERFORMANCE (NEW TABLE) */}
                        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Campaign Performance <MegaphoneIcon className="h-4 w-4 text-purple-500" /></CardTitle>
                                <CardDescription>Active & Recent Campaigns</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-4 py-3 rounded-l-md">Campaign</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Spent</th>
                                                <th className="px-4 py-3">Revenue</th>
                                                <th className="px-4 py-3">ROAS</th>
                                                <th className="px-4 py-3 rounded-r-md">CTR</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {campaignPerformance.map((c, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant={c.status === 'Active' ? 'default' : 'secondary'} className={c.status === 'Active' ? 'bg-green-600' : ''}>{c.status}</Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">{c.spent}</td>
                                                    <td className="px-4 py-3 font-semibold">{c.revenue}</td>
                                                    <td className="px-4 py-3 font-bold text-green-600">{c.roas}x</td>
                                                    <td className="px-4 py-3">{c.ctr}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* TRAFFIC SOURCE DEEP */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Traffic Sources <Share2 className="h-4 w-4 text-blue-500" /></CardTitle>
                                <CardDescription>Where customers come from</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={trafficSourceDeep} innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={5}>
                                            {trafficSourceDeep.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="vertical" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* CAC TREND */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Acquisition Cost (CAC)</CardTitle>
                                <CardDescription>Cost per customer trend</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={cacTrend}>
                                        <defs>
                                            <linearGradient id="colorCac" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" fontSize={12} />
                                        <YAxis tickFormatter={(val) => `₹${val}`} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="cac" stroke="#ef4444" fill="url(#colorCac)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* EMAIL MARKETING */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Email Marketing <Mail className="h-4 w-4 text-indigo-500" /></CardTitle>
                                <CardDescription>Newsletter Performance</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={emailStats} layout="vertical" margin={{ left: 20 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={80} fontSize={11} />
                                        <Tooltip />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                            {emailStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="text-center text-xs text-gray-400 mt-[-10px]">Target: &gt; 20% Open Rate</div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Top Search Terms</CardTitle>
                                <CardDescription>What users are typing</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {searchTerms.map((term, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                                            <span className="flex items-center gap-2"><Search className="w-3 h-3 text-gray-400" /> {term.term}</span>
                                            <span className="font-bold">{term.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* REVIEW WORD CLOUD */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Review Word Cloud</CardTitle>
                                <CardDescription>Voice of Customer</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2 items-center justify-center p-6 h-[250px]">
                                {reviewKeywords.map((kw, i) => (
                                    <span key={i} className="font-bold" style={{ fontSize: `${kw.value / 2}px`, color: kw.color }}>
                                        {kw.text}
                                    </span>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Brand Sentiment</CardTitle>
                                <CardDescription>Social media mentions</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={sentimentData} innerRadius={60} outerRadius={80} dataKey="value">
                                            {sentimentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* 7. OPERATIONS TAB (SUPER-CHARGED) */}
                <TabsContent value="ops" className="space-y-6">
                    {/* TOP LEVEL OPS METRICS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Card className="border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Perfect Order Rate</div>
                            <div className="text-3xl font-extrabold text-green-600">94.2%</div>
                            <div className="text-[10px] text-gray-400 mt-1">Target: 95%</div>
                        </Card>
                        <Card className="border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Avg Handling Time</div>
                            <div className="text-3xl font-extrabold text-blue-600">14h</div>
                            <div className="text-[10px] text-green-500 mt-1">-2h vs last week</div>
                        </Card>
                        <Card className="border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">RTO Rate</div>
                            <div className="text-3xl font-extrabold text-red-500">8.4%</div>
                            <div className="text-[10px] text-red-300 mt-1">High in East Zone</div>
                        </Card>
                        <Card className="border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Late Dispatch</div>
                            <div className="text-3xl font-extrabold text-yellow-500">0.8%</div>
                            <div className="text-[10px] text-green-500 mt-1">Within SLA</div>
                        </Card>
                        <Card className="border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Cost / Order</div>
                            <div className="text-3xl font-extrabold text-slate-700">₹42</div>
                            <div className="text-[10px] text-green-500 mt-1">Optimization Active</div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* COURIER PERFORMANCE TABLE */}
                        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Logistics Partner Performance <Truck className="h-4 w-4 text-blue-500" /></CardTitle>
                                <CardDescription>Speed & Reliability by Courier</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-4 py-3 rounded-l-md">Partner</th>
                                                <th className="px-4 py-3">Delivery Success</th>
                                                <th className="px-4 py-3">Avg Time</th>
                                                <th className="px-4 py-3 rounded-r-md">RTO %</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {courierPerformance.map((c, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-green-500" style={{ width: `${c.deliveryRate}%` }} />
                                                            </div>
                                                            <span>{c.deliveryRate}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 font-semibold">{c.avgDays} Days</td>
                                                    <td className={`px-4 py-3 font-bold ${c.rto > 5 ? 'text-red-500' : 'text-green-600'}`}>{c.rto}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* RETURN REASONS */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Return Reasons <RotateCcw className="h-4 w-4 text-red-400" /></CardTitle>
                                <CardDescription>Why customers return</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={returnReasons} innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={2}>
                                            {returnReasons.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '11px' }} Layout="vertical" verticalAlign="bottom" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* FULFILLMENT COST STACK */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Fulfillment Costs <Box className="h-4 w-4 text-orange-500" /></CardTitle>
                                <CardDescription>Packing, Shipping & Labor Breakdown</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={fulfillmentCosts}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" fontSize={12} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="shipping" stackId="a" fill="#3b82f6" />
                                        <Bar dataKey="labor" stackId="a" fill="#6366f1" />
                                        <Bar dataKey="packing" stackId="a" fill="#f59e0b" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* ZONE PERFORMANCE & ODR */}
                        <div className="grid grid-cols-1 gap-6">
                            <Card className="border-slate-100 shadow-sm h-[180px]">
                                <CardHeader className="py-3">
                                    <CardTitle className="text-sm">Zone-wise Delivery Speed</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[120px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={zonePerformance} layout="vertical" barSize={10}>
                                            <XAxis type="number" hide domain={[0, 100]} />
                                            <YAxis dataKey="subject" type="category" width={80} fontSize={10} tickLine={false} axisLine={false} />
                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="A" fill="#10b981" radius={[0, 4, 4, 0]} background={{ fill: '#f1f5f9' }} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 shadow-sm flex-1">
                                <CardHeader className="py-3 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm">Order Defect Rate (ODR) Trend</CardTitle>
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">High Quality</Badge>
                                </CardHeader>
                                <CardContent className="h-[100px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={odrTrend}>
                                            <defs>
                                                <linearGradient id="colorOdr" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Tooltip />
                                            <Area type="monotone" dataKey="rate" stroke="#ef4444" fill="url(#colorOdr)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Order Processing Speed</CardTitle>
                                <CardDescription>Time from Order to Dispatch (Hours)</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">

                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={processingTimeData}>
                                        <XAxis dataKey="range" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>SLA Compliance</CardTitle>
                                <CardDescription>On-time Handover vs Breaches</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={slaData}>
                                        <RadialBar
                                            label={{ position: 'insideStart', fill: '#fff' }}
                                            background
                                            dataKey="value"
                                        />
                                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" />
                                        <Tooltip />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <div className="absolute text-2xl font-bold text-green-600">98%</div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* 8. PRODUCTS TAB */}
                <TabsContent value="products" className="space-y-6">
                    {/* KEY PRODUCT METRICS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Total SKU Count</div>
                            <div className="text-3xl font-extrabold text-slate-800">4,215</div>
                            <div className="text-[10px] text-green-500 mt-1">+120 New this month</div>
                        </Card>
                        <Card className="border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Top Category Share</div>
                            <div className="text-3xl font-extrabold text-blue-600">32%</div>
                            <div className="text-[10px] text-gray-400 mt-1">Sarees & Ethnic</div>
                        </Card>
                        <Card className="border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Avg. Margin</div>
                            <div className="text-3xl font-extrabold text-green-600">38.5%</div>
                            <div className="text-[10px] text-green-500 mt-1">+2% vs last Qtr</div>
                        </Card>
                        <Card className="border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Bundle Conversion</div>
                            <div className="text-3xl font-extrabold text-purple-600">18.2%</div>
                            <div className="text-[10px] text-gray-400 mt-1">Users buying &gt;1 item</div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* CATEGORY TREEMAP */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Category Revenue Share <Layers className="h-4 w-4 text-pink-500" /></CardTitle>
                                <CardDescription>Revenue distribution by category size</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <Treemap
                                        data={categoryTreemapData}
                                        dataKey="size"
                                        stroke="#fff"
                                        fill="#8884d8"
                                    >
                                        <Tooltip />
                                    </Treemap>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* PRODUCT MARGIN VS VOLUME */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Margin Matrix <TargetIcon className="h-4 w-4 text-green-500" /></CardTitle>
                                <CardDescription>Visualizing Profitability vs Volume</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid />
                                        <XAxis type="number" dataKey="volume" name="Volume" unit=" units" label={{ value: 'Sales Volume', position: 'insideBottom', offset: -10 }} />
                                        <YAxis type="number" dataKey="margin" name="Margin" unit="%" label={{ value: 'Profit Margin', angle: -90, position: 'insideLeft' }} />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                        <Scatter name="Products" data={productMarginData} fill="#8884d8">
                                            {productMarginData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* HIGH RETURN OFFENDERS */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">High Return Alerts <AlertTriangle className="h-4 w-4 text-red-500" /></CardTitle>
                                <CardDescription>Top products returned by users</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {highReturnProducts.map((p, i) => (
                                        <div key={i} className="flex justify-between items-center bg-red-50 p-3 rounded-md border border-red-100">
                                            <div>
                                                <div className="font-medium text-sm text-red-900">{p.name}</div>
                                                <div className="text-xs text-red-700">Reason: {p.reason}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-red-600">{p.returnRate}%</div>
                                                <div className="text-[10px] text-red-400">Return Rate</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* VARIANT PERFORMANCE */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Size Analysis <Tag className="h-4 w-4 text-blue-500" /></CardTitle>
                                <CardDescription>Sales distribution by Size</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={variantPerformance}>
                                        <XAxis dataKey="size" />
                                        <Tooltip />
                                        <Bar dataKey="sales" fill="#8884d8">
                                            {variantPerformance.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* BUNDLE OPPORTUNITIES */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Bundling AI <Sparkles className="h-4 w-4 text-purple-500" /></CardTitle>
                                <CardDescription>Frequently bought together</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {bundleOpportunities.map((b, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 border-b last:border-0">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{b.main}</span>
                                                <span className="text-xs text-gray-500">+ {b.pair}</span>
                                            </div>
                                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{b.uplift} Sales</Badge>
                                        </div>
                                    ))}
                                    <Button variant="ghost" className="w-full text-xs text-purple-600">View All Combinations</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle>Product Performance Matrix</CardTitle>
                            <CardDescription>Views vs Conversions (Bubble Size = Revenue)</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid />
                                    <XAxis type="number" dataKey="views" name="Views" unit="k" />
                                    <YAxis type="number" dataKey="sales" name="Sales" unit=" units" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Scatter name="Products" data={productPerformanceData} fill="#8884d8">
                                        {productPerformanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle>Top Selling products</CardTitle>
                            <CardDescription>Best performing items by revenue this week.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-medium">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-md">Product Name</th>
                                            <th className="px-4 py-3">Units Sold</th>
                                            <th className="px-4 py-3">Total Revenue</th>
                                            <th className="px-4 py-3 rounded-r-md text-right">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {topProducts.map((p, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50">
                                                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                                                <td className="px-4 py-3 text-gray-600">{p.units}</td>
                                                <td className="px-4 py-3 font-semibold">{p.revenue}</td>
                                                <td className={`px-4 py-3 text-right font-medium ${p.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                                    {p.trend}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* NEW SECTION: INVENTORY HEALTH & PRICING */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* STOCK AGEING */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Stock Ageing <Clock className="h-4 w-4 text-orange-500" /></CardTitle>
                                <CardDescription>Inventory freshness analysis</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={stockAgeingData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {stockAgeingData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* PRICE ELASTICITY */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Price Sensitivity <DollarSign className="h-4 w-4 text-green-500" /></CardTitle>
                                <CardDescription>Discount impact on Sales</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={priceElasticityData} layout="vertical" margin={{ left: 20 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="priceChange" type="category" width={40} fontSize={10} />
                                        <Tooltip />
                                        <Bar dataKey="salesLift" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                            <LabelList dataKey="salesLift" position="right" style={{ fontSize: '10px' }} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* CONTENT PERFORMANCE */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Content ROI <Video className="h-4 w-4 text-pink-500" /></CardTitle>
                                <CardDescription>Conversion by Media Type</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={contentPerformance}>
                                        <XAxis dataKey="type" fontSize={10} />
                                        <Tooltip />
                                        <Bar dataKey="conversion" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* NEW SECTION: CUSTOMER VOICE & FORECAST */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* REVIEW SENTIMENT */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Star Rating Dist. <Star className="h-4 w-4 text-yellow-500" /></CardTitle>
                                <CardDescription>Product Satisfaction Score</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sentimentDistribution} layout="vertical" margin={{ left: 20 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="star" type="category" width={40} fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                                            {sentimentDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* DEMAND FORECAST */}
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">Demand Forecast <TrendingUp className="h-4 w-4 text-purple-500" /></CardTitle>
                                <CardDescription>Predicted Unit Sales (Next 6 Months)</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={demandForecast}>
                                        <defs>
                                            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="demand" stroke="#8b5cf6" fill="url(#colorDemand)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                </TabsContent>
            </Tabs>
        </div >
    )
}
