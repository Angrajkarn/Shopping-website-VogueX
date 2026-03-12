import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
    const date = new Date(input)
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price)
}

/**
 * Creates an SEO friendly slug from product name and ID
 * Example: "Premium Leather Jacket", "99982" -> "premium-leather-jacket-99982"
 */
export function createProductSlug(name: string, id: string | number): string {
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/(^-|-$)/g, '')     // Remove leading/trailing hyphens
    
    return `${slug}-${id}`
}

/**
 * Extracts the product ID from an SEO slug
 * Example: "premium-leather-jacket-99982" -> "99982"
 */
export function getIdFromSlug(slug: string): string {
    if (!slug) return ""
    const parts = slug.split('-')
    return parts[parts.length - 1] || slug
}
