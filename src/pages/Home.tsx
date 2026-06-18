import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Star, Users, Package, TrendingUp } from 'lucide-react'
import { useStore } from '@/store'
import { Category, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types'
import ProductCard from '@/components/ProductCard'

const categories: Category[] = ['figma', 'ppt', 'font', 'icon', 'code', 'notion', 'other']

export default function Home() {
  const { products, setSearchQuery } = useStore()
  const [searchInput, setSearchInput] = useState('')

  const published = products.filter((p) => p.status === 'published')
  const hotProducts = [...published].sort((a, b) => b.salesCount - a.salesCount).slice(0, 6)
  const freeProducts = published.filter((p) => p.isFree).slice(0, 6)
  const newProducts = [...published]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  const creatorMap = new Map<string, { id: string; name: string; avatar: string; productsCount: number; followersCount: number }>()
  published.forEach((p) => {
    if (!creatorMap.has(p.creator.id)) {
      creatorMap.set(p.creator.id, {
        id: p.creator.id,
        name: p.creator.name,
        avatar: p.creator.avatar,
        productsCount: 0,
        followersCount: p.creator.followersCount,
      })
    }
    creatorMap.get(p.creator.id)!.productsCount++
  })
  const creators = [...creatorMap.values()].sort((a, b) => b.followersCount - a.followersCount).slice(0, 6)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-950" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 gradient-text font-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            发现创意，释放价值
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-surface-400 mb-10 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            创意市集 — 汇聚全球创作者的数字资产交易平台，Figma 模板、字体、图标、代码一应俱全
          </motion.p>
          <motion.form
            onSubmit={handleSearch}
            className="relative max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="搜索模板、字体、图标、代码..."
              className="input-dark w-full pl-12 pr-32 py-4 text-base rounded-xl"
            />
            <button type="submit" className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-lg text-sm font-semibold">
              搜索
            </button>
          </motion.form>
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat}
                to={`/browse?category=${cat}`}
                className="px-4 py-1.5 rounded-full bg-surface-800/60 border border-surface-700/50 text-surface-300 text-sm hover:border-brand-500/50 hover:text-brand-400 transition-colors"
              >
                {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="section-title mb-8">浏览分类</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/browse?category=${cat}`}
                className="glass-card flex-shrink-0 w-28 h-28 flex flex-col items-center justify-center gap-2 card-hover group"
              >
                <span className="text-3xl">{CATEGORY_ICONS[cat]}</span>
                <span className="text-xs text-surface-400 group-hover:text-brand-400 transition-colors">{CATEGORY_LABELS[cat]}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-500" />
            热门推荐
          </h2>
          <Link to="/browse?sort=popular" className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-sm transition-colors">
            查看更多 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title flex items-center gap-2">
            <Star className="w-6 h-6 text-emerald-500" />
            免费精选
          </h2>
          <Link to="/browse?license=free" className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
            查看更多 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freeProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-500" />
            新上架作品
          </h2>
          <Link to="/browse?sort=newest" className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-sm transition-colors">
            查看更多 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-500" />
            推荐创作者
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {creators.map((creator, i) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 text-center card-hover group"
            >
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-surface-700 group-hover:border-brand-500 transition-colors"
              />
              <h3 className="text-sm font-semibold text-surface-100 truncate mb-2">{creator.name}</h3>
              <div className="flex flex-col gap-1 text-xs text-surface-500">
                <span>{creator.productsCount} 个作品</span>
                <span>{creator.followersCount >= 1000 ? `${(creator.followersCount / 1000).toFixed(1)}k` : creator.followersCount} 关注</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
