import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem, LicenseType, User, Order } from '@/types'
import { mockData } from '@/data/mock'

interface StoreState {
  products: Product[]
  currentUser: User
  cart: CartItem[]
  orders: Order[]
  following: string[]
  freeDownloads: Record<string, string>
  searchQuery: string
  selectedCategory: string
  selectedTags: string[]
  priceRange: [number, number]
  sortBy: string
  licenseFilter: string

  setSearchQuery: (q: string) => void
  setSelectedCategory: (c: string) => void
  setSelectedTags: (tags: string[]) => void
  setPriceRange: (range: [number, number]) => void
  setSortBy: (sort: string) => void
  setLicenseFilter: (f: string) => void

  addToCart: (product: Product, licenseType: LicenseType) => void
  removeFromCart: (productId: string) => void
  updateCartLicense: (productId: string, licenseType: LicenseType) => void
  clearCart: () => void

  placeOrder: () => void
  toggleFollow: (creatorId: string) => void

  addReview: (productId: string, rating: number, comment: string) => void
  addProduct: (product: Omit<Product, 'id' | 'creator' | 'rating' | 'ratingCount' | 'downloadCount' | 'salesCount' | 'createdAt' | 'updatedAt' | 'status' | 'reviews'>) => void

  getOrCreateFreeDownload: (productId: string) => string

  getFilteredProducts: () => Product[]
  getProductById: (id: string) => Product | undefined
  getCartTotal: () => number
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: mockData.products,
      currentUser: mockData.currentUser,
      cart: [],
      orders: mockData.orders,
      following: mockData.currentUser.following,
      freeDownloads: {},
      searchQuery: '',
      selectedCategory: 'all',
      selectedTags: [],
      priceRange: [0, 500],
      sortBy: 'popular',
      licenseFilter: 'all',

      setSearchQuery: (q) => set({ searchQuery: q }),
      setSelectedCategory: (c) => set({ selectedCategory: c }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      setPriceRange: (range) => set({ priceRange: range }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setLicenseFilter: (f) => set({ licenseFilter: f }),

      addToCart: (product, licenseType) => {
        const cart = get().cart
        const exists = cart.find((item) => item.productId === product.id)
        if (exists) {
          set({
            cart: cart.map((item) =>
              item.productId === product.id ? { ...item, licenseType } : item
            ),
          })
        } else {
          set({
            cart: [
              ...cart,
              {
                productId: product.id,
                title: product.title,
                thumbnail: product.thumbnails[0],
                pricePersonal: product.pricePersonal,
                priceCommercial: product.priceCommercial,
                licenseType,
                creatorName: product.creator.name,
              },
            ],
          })
        }
      },

      removeFromCart: (productId) =>
        set({ cart: get().cart.filter((item) => item.productId !== productId) }),

      updateCartLicense: (productId, licenseType) =>
        set({
          cart: get().cart.map((item) =>
            item.productId === productId ? { ...item, licenseType } : item
          ),
        }),

      clearCart: () => set({ cart: [] }),

      placeOrder: () => {
        const { cart, orders } = get()
        if (cart.length === 0) return
        const newOrder: Order = {
          id: `o${orders.length + 1}`,
          userId: get().currentUser.id,
          items: cart.map((item) => ({
            productId: item.productId,
            title: item.title,
            thumbnail: item.thumbnail,
            price: item.licenseType === 'commercial' ? item.priceCommercial : item.pricePersonal,
            licenseType: item.licenseType,
          })),
          totalAmount: get().getCartTotal(),
          status: 'completed',
          createdAt: new Date().toISOString().split('T')[0],
          downloadCredential: `CRED-${Date.now()}`,
        }
        set({ orders: [...orders, newOrder], cart: [] })
      },

      toggleFollow: (creatorId) => {
        const following = get().following
        if (following.includes(creatorId)) {
          set({ following: following.filter((id) => id !== creatorId) })
        } else {
          set({ following: [...following, creatorId] })
        }
      },

      addReview: (productId, rating, comment) => {
        const products = get().products
        set({
          products: products.map((p) => {
            if (p.id === productId) {
              const newReview = {
                id: `${productId}-r${p.reviews.length}`,
                userId: get().currentUser.id,
                userName: get().currentUser.name,
                userAvatar: get().currentUser.avatar,
                rating,
                comment,
                createdAt: new Date().toISOString().split('T')[0],
              }
              const allReviews = [...p.reviews, newReview]
              const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
              return { ...p, reviews: allReviews, rating: Math.round(avgRating * 10) / 10, ratingCount: allReviews.length }
            }
            return p
          }),
        })
      },

      addProduct: (productData) => {
        const { products, currentUser } = get()
        const newId = `p${products.length + 100}`
        const today = new Date().toISOString().split('T')[0]
        const creator = {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          bio: '创意市集创作者',
          followersCount: 0,
          productsCount: 0,
          totalSales: 0,
          totalRevenue: 0,
          joinedAt: today,
        }
        const newProduct: Product = {
          id: newId,
          ...productData,
          creator,
          rating: 0,
          ratingCount: 0,
          downloadCount: 0,
          salesCount: 0,
          createdAt: today,
          updatedAt: today,
          status: 'published',
          reviews: [],
        }
        set({ products: [newProduct, ...products] })
      },

      getOrCreateFreeDownload: (productId) => {
        const { freeDownloads } = get()
        if (freeDownloads[productId]) {
          return freeDownloads[productId]
        }
        const credential = `CRED-FREE-${Date.now()}`
        set({ freeDownloads: { ...freeDownloads, [productId]: credential } })
        const products = get().products
        set({
          products: products.map((p) =>
            p.id === productId ? { ...p, downloadCount: p.downloadCount + 1 } : p
          ),
        })
        return credential
      },

      getFilteredProducts: () => {
        const { products, searchQuery, selectedCategory, selectedTags, priceRange, sortBy, licenseFilter } = get()
        let filtered = [...products].filter((p) => p.status === 'published')

        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q))
          )
        }

        if (selectedCategory !== 'all') {
          filtered = filtered.filter((p) => p.category === selectedCategory)
        }

        if (selectedTags.length > 0) {
          filtered = filtered.filter((p) => selectedTags.some((tag) => p.tags.includes(tag)))
        }

        filtered = filtered.filter((p) => {
          const minPrice = p.isFree ? 0 : Math.min(p.pricePersonal, p.priceCommercial)
          const maxPrice = p.isFree ? 0 : Math.max(p.pricePersonal, p.priceCommercial)
          return maxPrice >= priceRange[0] && minPrice <= priceRange[1]
        })

        if (licenseFilter === 'free') {
          filtered = filtered.filter((p) => p.isFree)
        } else if (licenseFilter === 'personal') {
          filtered = filtered.filter((p) => p.licenseTypes.includes('personal'))
        } else if (licenseFilter === 'commercial') {
          filtered = filtered.filter((p) => p.licenseTypes.includes('commercial'))
        }

        switch (sortBy) {
          case 'popular':
            filtered.sort((a, b) => b.salesCount - a.salesCount)
            break
          case 'newest':
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            break
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating)
            break
          case 'price_low':
            filtered.sort((a, b) => (a.isFree ? 0 : a.pricePersonal) - (b.isFree ? 0 : b.pricePersonal))
            break
          case 'price_high':
            filtered.sort((a, b) => (b.isFree ? 0 : b.priceCommercial) - (a.isFree ? 0 : a.priceCommercial))
            break
        }

        return filtered
      },

      getProductById: (id) => get().products.find((p) => p.id === id),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          return total + (item.licenseType === 'commercial' ? item.priceCommercial : item.pricePersonal)
        }, 0)
      },
    }),
    {
      name: 'creativemart-store',
      partialize: (state) => ({
        cart: state.cart,
        orders: state.orders,
        following: state.following,
      }),
    }
  )
)
