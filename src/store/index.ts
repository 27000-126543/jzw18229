import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem, LicenseType, User, Order, DownloadCertificate, TrendData, ProductStatus } from '@/types'
import { mockData } from '@/data/mock'

interface StoreState {
  products: Product[]
  currentUser: User
  cart: CartItem[]
  orders: Order[]
  following: string[]
  freeDownloads: Record<string, string>
  downloadCertificates: DownloadCertificate[]
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
  resetFilters: () => void

  addToCart: (product: Product, licenseType: LicenseType) => void
  removeFromCart: (productId: string) => void
  updateCartLicense: (productId: string, licenseType: LicenseType) => void
  clearCart: () => void

  placeOrder: () => Order | null
  toggleFollow: (creatorId: string) => void

  addReview: (productId: string, rating: number, comment: string) => void

  saveDraft: (productData: Omit<Product, 'id' | 'creator' | 'rating' | 'ratingCount' | 'downloadCount' | 'salesCount' | 'createdAt' | 'updatedAt' | 'status' | 'reviews'>, existingId?: string) => string
  submitForReview: (productId: string) => void
  publishProduct: (productId: string) => void
  updateProductStatus: (productId: string, status: ProductStatus) => void
  addProduct: (productData: Omit<Product, 'id' | 'creator' | 'rating' | 'ratingCount' | 'downloadCount' | 'salesCount' | 'createdAt' | 'updatedAt' | 'status' | 'reviews'>) => string

  getOrCreateFreeDownload: (productId: string) => DownloadCertificate
  getDownloadCertificates: () => DownloadCertificate[]
  getCertificateByProductId: (productId: string) => DownloadCertificate | undefined

  getFilteredProducts: () => Product[]
  getProductsByCreator: (creatorId: string, status?: ProductStatus) => Product[]
  getProductById: (id: string) => Product | undefined
  getCartTotal: () => number
  getCreatorStats: (creatorId: string) => { totalSales: number; totalRevenue: number; totalDownloads: number; totalProducts: number }
  getTrendData: (creatorId: string, days?: number) => TrendData[]
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
      downloadCertificates: [],
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
      resetFilters: () => set({
        searchQuery: '',
        selectedCategory: 'all',
        selectedTags: [],
        priceRange: [0, 500],
        sortBy: 'popular',
        licenseFilter: 'all',
      }),

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
        const { cart, orders, currentUser, downloadCertificates } = get()
        if (cart.length === 0) return null

        const today = new Date().toISOString().split('T')[0]
        const expiryDate = new Date()
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
        const expiryStr = expiryDate.toISOString().split('T')[0]

        const newOrder: Order = {
          id: `o${orders.length + 100}`,
          userId: currentUser.id,
          items: cart.map((item) => ({
            productId: item.productId,
            title: item.title,
            thumbnail: item.thumbnail,
            price: item.licenseType === 'commercial' ? item.priceCommercial : item.pricePersonal,
            licenseType: item.licenseType,
          })),
          totalAmount: get().getCartTotal(),
          status: 'completed',
          createdAt: today,
          downloadCredential: `CRED-${Date.now()}`,
        }

        const newCertificates: DownloadCertificate[] = cart.map((item) => {
          const product = get().getProductById(item.productId)
          return {
            id: `cert-${Date.now()}-${item.productId}`,
            productId: item.productId,
            productTitle: item.title,
            thumbnail: item.thumbnail,
            licenseType: item.licenseType,
            price: item.licenseType === 'commercial' ? item.priceCommercial : item.pricePersonal,
            isFree: false,
            credential: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            downloadedAt: today,
            expiresAt: expiryStr,
            fileFormat: product?.fileFormat || '.zip',
            fileSize: product?.fileSize || '未知',
            buyerName: currentUser.name,
            buyerEmail: currentUser.email,
          }
        })

        const products = get().products
        const updatedProducts = products.map((p) => {
          const cartItem = cart.find((ci) => ci.productId === p.id)
          if (cartItem) {
            return {
              ...p,
              salesCount: p.salesCount + 1,
              downloadCount: p.downloadCount + 1,
              updatedAt: today,
            }
          }
          return p
        })

        set({
          orders: [...orders, newOrder],
          cart: [],
          downloadCertificates: [...downloadCertificates, ...newCertificates],
          products: updatedProducts,
        })

        return newOrder
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

      saveDraft: (productData, existingId) => {
        const { products, currentUser } = get()
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

        if (existingId) {
          set({
            products: products.map((p) =>
              p.id === existingId
                ? { ...p, ...productData, updatedAt: today, status: 'draft' as ProductStatus }
                : p
            ),
          })
          return existingId
        }

        const newId = `p${products.length + 1000}`
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
          status: 'draft',
          reviews: [],
        }
        set({ products: [newProduct, ...products] })
        return newId
      },

      submitForReview: (productId) => {
        const { products } = get()
        const today = new Date().toISOString().split('T')[0]
        set({
          products: products.map((p) =>
            p.id === productId ? { ...p, status: 'pending' as ProductStatus, updatedAt: today } : p
          ),
        })
      },

      publishProduct: (productId) => {
        const { products } = get()
        const today = new Date().toISOString().split('T')[0]
        set({
          products: products.map((p) =>
            p.id === productId ? { ...p, status: 'published' as ProductStatus, updatedAt: today } : p
          ),
        })
      },

      updateProductStatus: (productId, status) => {
        const { products } = get()
        const today = new Date().toISOString().split('T')[0]
        set({
          products: products.map((p) =>
            p.id === productId ? { ...p, status, updatedAt: today } : p
          ),
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
          status: 'pending',
          reviews: [],
        }
        set({ products: [newProduct, ...products] })
        return newId
      },

      getOrCreateFreeDownload: (productId) => {
        const { downloadCertificates, currentUser } = get()
        const existing = downloadCertificates.find((c) => c.productId === productId && c.isFree)
        if (existing) {
          return existing
        }

        const product = get().getProductById(productId)
        if (!product) {
          throw new Error('Product not found')
        }

        const today = new Date().toISOString().split('T')[0]
        const expiryDate = new Date()
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
        const expiryStr = expiryDate.toISOString().split('T')[0]

        const certificate: DownloadCertificate = {
          id: `cert-free-${Date.now()}-${productId}`,
          productId,
          productTitle: product.title,
          thumbnail: product.thumbnails[0],
          licenseType: 'personal',
          price: 0,
          isFree: true,
          credential: `CERT-FREE-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          downloadedAt: today,
          expiresAt: expiryStr,
          fileFormat: product.fileFormat,
          fileSize: product.fileSize,
          buyerName: currentUser.name,
          buyerEmail: currentUser.email,
        }

        const products = get().products
        set({
          downloadCertificates: [...downloadCertificates, certificate],
          freeDownloads: { ...get().freeDownloads, [productId]: certificate.credential },
          products: products.map((p) =>
            p.id === productId ? { ...p, downloadCount: p.downloadCount + 1, updatedAt: today } : p
          ),
        })

        return certificate
      },

      getDownloadCertificates: () => get().downloadCertificates,

      getCertificateByProductId: (productId) => {
        return get().downloadCertificates.find((c) => c.productId === productId)
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

      getProductsByCreator: (creatorId, status) => {
        let products = get().products.filter((p) => p.creator.id === creatorId)
        if (status) {
          products = products.filter((p) => p.status === status)
        }
        return products.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      },

      getProductById: (id) => get().products.find((p) => p.id === id),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          return total + (item.licenseType === 'commercial' ? item.priceCommercial : item.pricePersonal)
        }, 0)
      },

      getCreatorStats: (creatorId) => {
        const products = get().products.filter((p) => p.creator.id === creatorId)
        const totalProducts = products.length
        const totalSales = products.reduce((sum, p) => sum + p.salesCount, 0)
        const totalDownloads = products.reduce((sum, p) => sum + p.downloadCount, 0)
        const totalRevenue = products.reduce((sum, p) => sum + (p.salesCount * (p.isFree ? 0 : p.pricePersonal) * 0.85), 0)
        return { totalSales, totalRevenue: Math.round(totalRevenue * 100) / 100, totalDownloads, totalProducts }
      },

      getTrendData: (creatorId, days = 7) => {
        const products = get().products.filter((p) => p.creator.id === creatorId)
        const trend: TrendData[] = []

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          const dayOfWeek = date.toLocaleDateString('zh-CN', { weekday: 'short' })

          const isToday = i === 0
          const multiplier = isToday ? 1 : (0.3 + Math.random() * 0.7)

          const baseDownloads = products.reduce((sum, p) => sum + Math.floor(p.downloadCount / 30), 0)
          const baseSales = products.reduce((sum, p) => sum + Math.floor(p.salesCount / 30), 0)
          const baseRevenue = baseSales * (products[0]?.pricePersonal || 10) * 0.85

          trend.push({
            date: dayOfWeek,
            downloads: Math.max(0, Math.floor(baseDownloads * multiplier)),
            sales: Math.max(0, Math.floor(baseSales * multiplier)),
            revenue: Math.max(0, Math.round(baseRevenue * multiplier * 100) / 100),
          })
        }

        if (trend.length > 0) {
          const today = trend[trend.length - 1]
          today.downloads = Math.max(today.downloads, products.reduce((sum, p) => sum + (p.salesCount > 0 ? 1 : 0), 0))
          today.sales = Math.max(today.sales, products.reduce((sum, p) => sum + (p.salesCount > 0 ? 1 : 0), 0))
          today.revenue = Math.max(today.revenue, products.reduce((sum, p) => sum + (p.salesCount > 0 ? (p.isFree ? 0 : p.pricePersonal * 0.85) : 0), 0))
        }

        return trend
      },
    }),
    {
      name: 'creativemart-store',
      partialize: (state) => ({
        products: state.products,
        cart: state.cart,
        orders: state.orders,
        following: state.following,
        freeDownloads: state.freeDownloads,
        downloadCertificates: state.downloadCertificates,
      }),
    }
  )
)
