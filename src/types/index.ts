export type Category = 'figma' | 'ppt' | 'font' | 'icon' | 'code' | 'notion' | 'other'
export type LicenseType = 'personal' | 'commercial'
export type ProductStatus = 'draft' | 'pending' | 'published' | 'offline'
export type OrderStatus = 'pending' | 'paid' | 'completed' | 'refunded'

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  createdAt: string
}

export interface Creator {
  id: string
  name: string
  avatar: string
  bio: string
  followersCount: number
  productsCount: number
  totalSales: number
  totalRevenue: number
  joinedAt: string
}

export interface Product {
  id: string
  title: string
  description: string
  category: Category
  tags: string[]
  creator: Creator
  pricePersonal: number
  priceCommercial: number
  isFree: boolean
  licenseTypes: LicenseType[]
  thumbnails: string[]
  previewImages: string[]
  fileFormat: string
  fileSize: string
  compatibility: string
  rating: number
  ratingCount: number
  downloadCount: number
  salesCount: number
  createdAt: string
  updatedAt: string
  status: ProductStatus
  reviews: Review[]
}

export interface OrderItem {
  productId: string
  title: string
  thumbnail: string
  price: number
  licenseType: LicenseType
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
  downloadCredential: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'buyer' | 'creator'
  following: string[]
  purchases: string[]
  createdAt: string
}

export interface TrendData {
  date: string
  downloads: number
  sales: number
  revenue: number
}

export interface ProductSales {
  productId: string
  title: string
  sales: number
  revenue: number
}

export interface Settlement {
  id: string
  month: string
  totalRevenue: number
  platformFee: number
  netAmount: number
  status: 'pending' | 'processing' | 'completed'
}

export interface CartItem {
  productId: string
  title: string
  thumbnail: string
  pricePersonal: number
  priceCommercial: number
  licenseType: LicenseType
  creatorName: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  figma: 'Figma 模板',
  ppt: 'PPT 模板',
  font: '字体',
  icon: '图标包',
  code: '代码片段',
  notion: 'Notion 模板',
  other: '其他',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  figma: '🎨',
  ppt: '📊',
  font: '🔤',
  icon: '🧩',
  code: '💻',
  notion: '📝',
  other: '📦',
}

export const LICENSE_LABELS: Record<LicenseType, string> = {
  personal: '个人用途',
  commercial: '商用授权',
}
