import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartState {
  items: CartItem[]
  addItem: (product: any) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.id === product.id)

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({
            items: [...currentItems, {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: product.quantity || 1,
              image: product.image || (product.images && product.images[0]) || '/images/product-1.jpg'
            }],
          })
        }
      },
      removeItem: (id) => set({
        items: get().items.filter((item) => item.id !== id),
      }),
      updateQuantity: (id, qty) => set({
        items: get().items.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
        ),
      }),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'petals-pearls-cart',
    }
  )
)
