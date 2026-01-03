import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    size?: string
    color?: string
    category?: string
}

interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem, silent?: boolean) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    isOpen: boolean
    toggleCart: () => void

    // Gift Card State
    giftCardCode: string
    giftCardBalance: number
    isGiftCardApplied: boolean
    applyGiftCard: (code: string, balance: number) => void
    removeGiftCard: () => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            isOpen: false,

            // Gift Card Initial State
            giftCardCode: "",
            giftCardBalance: 0,
            isGiftCardApplied: false,

            addItem: (item, silent = false) =>
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id)
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id
                                    ? { ...i, quantity: i.quantity + 1 }
                                    : i
                            ),
                            isOpen: silent ? state.isOpen : true,
                        }
                    }
                    return { items: [...state.items, { ...item, quantity: 1 }], isOpen: silent ? state.isOpen : true }
                }),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),
            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                })),
            clearCart: () => set({ items: [], giftCardCode: "", giftCardBalance: 0, isGiftCardApplied: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            // Gift Card Actions
            applyGiftCard: (code, balance) => set({ giftCardCode: code, giftCardBalance: balance, isGiftCardApplied: true }),
            removeGiftCard: () => set({ giftCardCode: "", giftCardBalance: 0, isGiftCardApplied: false })
        }),
        {
            name: 'cart-storage',
        }
    )
)
