import { Link } from 'react-router-dom'
import { Star, Download, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product, CATEGORY_LABELS } from '@/types'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="glass-card overflow-hidden card-hover">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={product.thumbnails[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-transparent" />

            {product.isFree && (
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-md">
                FREE
              </div>
            )}

            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-surface-950/70 backdrop-blur-sm text-surface-300 text-xs rounded-md border border-surface-700/50">
                {CATEGORY_LABELS[product.category]}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-surface-300">
                <img
                  src={product.creator.avatar}
                  alt={product.creator.name}
                  className="w-5 h-5 rounded-full border border-surface-700"
                />
                <span className="truncate max-w-[100px]">{product.creator.name}</span>
              </div>
              {!product.isFree && (
                <span className="text-brand-400 font-bold text-sm">
                  ¥{product.pricePersonal}
                </span>
              )}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-sm font-semibold text-surface-100 mb-2 truncate group-hover:text-brand-400 transition-colors">
              {product.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-surface-500">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {product.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {product.downloadCount}
                </span>
              </div>
              <div className="flex gap-1">
                {product.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 bg-surface-800 text-surface-400 text-[10px] rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
