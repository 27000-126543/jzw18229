import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { useStore } from '@/store'
import { Category, CATEGORY_LABELS } from '@/types'
import ProductCard from '@/components/ProductCard'

const CATEGORIES: Category[] = ['figma', 'ppt', 'font', 'icon', 'code', 'notion', 'other']
const LICENSE_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'free', label: '免费' },
  { value: 'personal', label: '个人用途' },
  { value: 'commercial', label: '商用授权' },
]
const SORT_OPTIONS = [
  { value: 'popular', label: '最受欢迎' },
  { value: 'newest', label: '最新发布' },
  { value: 'rating', label: '评分最高' },
  { value: 'price_low', label: '价格从低到高' },
  { value: 'price_high', label: '价格从高到低' },
]

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const isInitializing = useRef(true)

  const {
    products,
    searchQuery,
    selectedCategory,
    selectedTags,
    licenseFilter,
    sortBy,
    setSearchQuery,
    setSelectedCategory,
    setSelectedTags,
    setLicenseFilter,
    setSortBy,
    resetFilters,
    getFilteredProducts,
  } = useStore()

  useEffect(() => {
    const cat = searchParams.get('category')
    const lic = searchParams.get('license')
    const sort = searchParams.get('sort')
    const q = searchParams.get('q')
    const tagsParam = searchParams.get('tags')

    if (cat && CATEGORIES.includes(cat as Category)) {
      setSelectedCategory(cat)
    } else if (!cat) {
      setSelectedCategory('all')
    }

    if (lic && LICENSE_OPTIONS.some((o) => o.value === lic)) {
      setLicenseFilter(lic)
    } else if (!lic) {
      setLicenseFilter('all')
    }

    if (sort && SORT_OPTIONS.some((o) => o.value === sort)) {
      setSortBy(sort)
    } else if (!sort) {
      setSortBy('popular')
    }

    if (q) {
      setSearchQuery(q)
    } else if (!q) {
      setSearchQuery('')
    }

    if (tagsParam) {
      const tags = tagsParam.split(',').map((t) => t.trim()).filter(Boolean)
      setSelectedTags(tags)
    } else if (!tagsParam) {
      setSelectedTags([])
    }

    isInitializing.current = false
  }, [searchParams, setSelectedCategory, setLicenseFilter, setSortBy, setSearchQuery, setSelectedTags])

  useEffect(() => {
    if (isInitializing.current) return

    const params: Record<string, string> = {}
    if (selectedCategory !== 'all') params.category = selectedCategory
    if (licenseFilter !== 'all') params.license = licenseFilter
    if (sortBy !== 'popular') params.sort = sortBy
    if (searchQuery) params.q = searchQuery
    if (selectedTags.length > 0) params.tags = selectedTags.join(',')

    setSearchParams(params, { replace: true })
  }, [selectedCategory, licenseFilter, sortBy, searchQuery, selectedTags, setSearchParams])

  const allTags = useMemo(() => {
    const tagMap = new Map<string, number>()
    products.forEach((p) => p.tags.forEach((t) => tagMap.set(t, (tagMap.get(t) || 0) + 1)))
    return [...tagMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([tag]) => tag)
  }, [products])

  const filtered = getFilteredProducts()

  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    )
  }

  const clearFilters = () => {
    resetFilters()
  }

  const hasActiveFilters = selectedCategory !== 'all' || selectedTags.length > 0 || licenseFilter !== 'all' || searchQuery

  const activeBadges = useMemo(() => {
    const badges: { key: string; label: string; onRemove: () => void }[] = []
    if (selectedCategory !== 'all') {
      badges.push({
        key: 'cat',
        label: CATEGORY_LABELS[selectedCategory as Category],
        onRemove: () => setSelectedCategory('all'),
      })
    }
    selectedTags.forEach((tag) =>
      badges.push({ key: `tag-${tag}`, label: tag, onRemove: () => toggleTag(tag) })
    )
    if (licenseFilter !== 'all') {
      const opt = LICENSE_OPTIONS.find((o) => o.value === licenseFilter)
      badges.push({ key: 'lic', label: opt?.label || licenseFilter, onRemove: () => setLicenseFilter('all') })
    }
    return badges
  }, [selectedCategory, selectedTags, licenseFilter, setSelectedCategory, setLicenseFilter])

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-surface-200 mb-3">分类</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedCategory === 'all'}
              onChange={() => setSelectedCategory('all')}
              className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500/50 focus:ring-offset-0"
            />
            <span className="text-sm text-surface-300 group-hover:text-surface-100 transition-colors">全部</span>
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500/50 focus:ring-offset-0"
              />
              <span className="text-sm text-surface-300 group-hover:text-surface-100 transition-colors">
                {CATEGORY_LABELS[cat]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-surface-200 mb-3">热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`badge transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                  : 'bg-surface-800 text-surface-400 border border-transparent hover:text-surface-200 hover:border-surface-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-surface-200 mb-3">授权类型</h3>
        <div className="space-y-2">
          {LICENSE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="license"
                checked={licenseFilter === opt.value}
                onChange={() => setLicenseFilter(opt.value)}
                className="w-4 h-4 border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500/50 focus:ring-offset-0"
              />
              <span className="text-sm text-surface-300 group-hover:text-surface-100 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-surface-200 mb-3">排序方式</h3>
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="input-dark flex items-center justify-between text-sm"
          >
            <span>{SORT_OPTIONS.find((o) => o.value === sortBy)?.label}</span>
            <ChevronDown className={`w-4 h-4 text-surface-500 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute z-20 mt-1 w-full glass-card py-1 overflow-hidden"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      sortBy === opt.value ? 'text-brand-400 bg-brand-500/10' : 'text-surface-300 hover:bg-surface-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters} className="w-full btn-secondary text-sm py-2">
          清除筛选
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索数字资产..."
              className="input-dark pl-12 pr-10 py-4 text-lg rounded-xl"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-surface-400">
              共 <span className="text-surface-100 font-semibold">{filtered.length}</span> 个结果
            </span>
            {activeBadges.map((b) => (
              <span key={b.key} className="badge bg-brand-500/15 text-brand-400 border border-brand-500/30 gap-1">
                {b.label}
                <button onClick={b.onRemove} className="hover:text-brand-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden btn-secondary py-2 px-3 text-sm flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            筛选
          </button>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="glass-card p-5 sticky top-8">
              <FilterPanel />
            </div>
          </aside>

          <AnimatePresence>
            {mobileFilterOpen && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-80 bg-surface-900 p-6 overflow-y-auto lg:hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-title text-lg">筛选</h2>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-surface-400 hover:text-surface-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel />
              </motion.div>
            )}
          </AnimatePresence>
          {mobileFilterOpen && (
            <div onClick={() => setMobileFilterOpen(false)} className="fixed inset-0 z-40 bg-black/60 lg:hidden" />
          )}

          <div className="flex-1 min-w-0">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-surface-500">
                <Search className="w-12 h-12 mb-4 opacity-40" />
                <p className="text-lg font-medium">未找到匹配的资产</p>
                <p className="text-sm mt-1">尝试调整筛选条件或搜索词</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="btn-primary mt-4 text-sm py-2">清除筛选</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
