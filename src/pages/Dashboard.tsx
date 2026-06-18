import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, Download, Users, Package, Edit, Trash2, Plus, Eye, Check, Clock } from 'lucide-react'
import { useStore } from '@/store'
import { mockData } from '@/data/mock'
import { CATEGORY_LABELS, Product, ProductStatus, PRODUCT_STATUS_LABELS } from '@/types'

const tabs = ['overview', 'products', 'settlements'] as const
type Tab = typeof tabs[number]

function useCountUp(end: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const ref = useRef(false)
  useEffect(() => {
    ref.current = false
    setCount(0)
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration])
  return count
}

function StatCard({ icon: Icon, label, value, prefix, change }: { icon: React.ElementType; label: string; value: number; prefix: string; change: string }) {
  const counted = useCountUp(value)
  const isPositive = change.startsWith('+')
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-400" />
        </div>
        <span className={`badge ${isPositive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
          {change}
        </span>
      </div>
      <p className="text-surface-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-surface-100">{prefix}{counted.toLocaleString()}</p>
    </motion.div>
  )
}

function OverviewTab() {
  const { getCreatorStats, getTrendData, getProductsByCreator, currentUser } = useStore()
  const stats = getCreatorStats(currentUser.id)
  const trendData = getTrendData(currentUser.id, 7)
  const products = getProductsByCreator(currentUser.id)
  const topProducts = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5)

  const displayStats = [
    { icon: TrendingUp, label: '总销量', value: stats.totalSales, prefix: '', suffix: '', change: '+12.5%' },
    { icon: DollarSign, label: '总收入', value: stats.totalRevenue, prefix: '¥', suffix: '', change: '+8.3%' },
    { icon: Package, label: '作品总数', value: stats.totalProducts, prefix: '', suffix: '', change: '+2' },
    { icon: Download, label: '总下载', value: stats.totalDownloads, prefix: '', suffix: '', change: '+15.1%' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="glass-card p-6">
        <h3 className="section-title text-xl mb-6">下载与销售趋势</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="date" stroke="#2A2A2A" tick={{ fill: '#8A8A8A', fontSize: 12 }} />
              <YAxis stroke="#2A2A2A" tick={{ fill: '#8A8A8A', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #3A3A3A', borderRadius: 12, color: '#F5F0EB' }} />
              <Line type="monotone" dataKey="downloads" stroke="#FF6B2C" strokeWidth={2} dot={{ fill: '#FF6B2C', r: 4 }} name="下载量" />
              <Line type="monotone" dataKey="sales" stroke="#FFA266" strokeWidth={2} dot={{ fill: '#FFA266', r: 4 }} name="销量" />
              <Line type="monotone" dataKey="revenue" stroke="#4ADE80" strokeWidth={2} dot={{ fill: '#4ADE80', r: 4 }} name="收入" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="glass-card p-6">
        <h3 className="section-title text-xl mb-6">热门产品</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-surface-400 text-sm border-b border-surface-700/50">
                <th className="pb-3 font-medium">产品</th>
                <th className="pb-3 font-medium">销量</th>
                <th className="pb-3 font-medium">下载</th>
                <th className="pb-3 font-medium text-right">收入</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.id} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition">
                  <td className="py-3 flex items-center gap-3">
                    <img src={p.thumbnails[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-surface-100 font-medium">{p.title}</span>
                  </td>
                  <td className="py-3 text-surface-300">{p.salesCount.toLocaleString()}</td>
                  <td className="py-3 text-surface-300">{p.downloadCount.toLocaleString()}</td>
                  <td className="py-3 text-surface-300 text-right">¥{Math.round((p.salesCount * (p.isFree ? 0 : p.pricePersonal) * 0.85) * 100) / 100}</td>
                </tr>
              ))}
              {topProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-surface-500">暂无作品数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ProductsTab() {
  const { getProductsByCreator, currentUser, updateProductStatus, publishProduct } = useStore()
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all')
  const allProducts = getProductsByCreator(currentUser.id)
  const products = statusFilter === 'all' ? allProducts : allProducts.filter((p) => p.status === statusFilter)

  const statusMap: Record<string, { label: string; cls: string }> = {
    published: { label: '已上架', cls: 'bg-green-500/15 text-green-400' },
    draft: { label: '草稿', cls: 'bg-surface-600/30 text-surface-400' },
    pending: { label: '审核中', cls: 'bg-amber-500/15 text-amber-400' },
    offline: { label: '已下架', cls: 'bg-red-500/15 text-red-400' },
  }

  const statusCounts: Record<string, number> = {
    all: allProducts.length,
    draft: allProducts.filter((p) => p.status === 'draft').length,
    pending: allProducts.filter((p) => p.status === 'pending').length,
    published: allProducts.filter((p) => p.status === 'published').length,
    offline: allProducts.filter((p) => p.status === 'offline').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="section-title text-xl">产品管理</h3>
        <Link to="/upload" className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" />上传新品</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'draft', 'pending', 'published', 'offline'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === status
                ? 'bg-brand-500 text-white'
                : 'bg-surface-800/50 text-surface-400 hover:bg-surface-800 hover:text-surface-200'
            }`}
          >
            {status === 'all' ? '全部' : PRODUCT_STATUS_LABELS[status]}
            <span className="ml-1 opacity-60">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-surface-400 text-sm border-b border-surface-700/50 bg-surface-900/50">
                <th className="px-6 py-3 font-medium">产品</th>
                <th className="px-4 py-3 font-medium">分类</th>
                <th className="px-4 py-3 font-medium">价格</th>
                <th className="px-4 py-3 font-medium">销量</th>
                <th className="px-4 py-3 font-medium">下载</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const st = statusMap[p.status] || statusMap.draft
                return (
                  <tr key={p.id} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={p.thumbnails[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-surface-100 font-medium">{p.title}</span>
                    </td>
                    <td className="px-4 py-4 text-surface-300">{CATEGORY_LABELS[p.category]}</td>
                    <td className="px-4 py-4 text-surface-300">{p.isFree ? '免费' : `¥${p.pricePersonal}`}</td>
                    <td className="px-4 py-4 text-surface-300">{p.salesCount}</td>
                    <td className="px-4 py-4 text-surface-300">{p.downloadCount}</td>
                    <td className="px-4 py-4"><span className={`badge ${st.cls}`}>{st.label}</span></td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {p.status === 'pending' && (
                          <button
                            onClick={() => publishProduct(p.id)}
                            className="p-2 rounded-lg hover:bg-emerald-500/20 text-surface-400 hover:text-emerald-400 transition"
                            title="立即通过"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {p.status === 'draft' && (
                          <button
                            onClick={() => publishProduct(p.id)}
                            className="p-2 rounded-lg hover:bg-emerald-500/20 text-surface-400 hover:text-emerald-400 transition"
                            title="立即发布"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <Link
                          to={`/product/${p.id}`}
                          className="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-brand-400 transition"
                          title="查看"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/upload/${p.id}`}
                          className="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-brand-400 transition"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {p.status === 'published' && (
                          <button
                            onClick={() => updateProductStatus(p.id, 'offline')}
                            className="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-red-400 transition"
                            title="下架"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        {p.status === 'offline' && (
                          <button
                            onClick={() => publishProduct(p.id)}
                            className="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-emerald-400 transition"
                            title="重新上架"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-surface-500">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>暂无{statusFilter === 'all' ? '' : PRODUCT_STATUS_LABELS[statusFilter]}作品</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SettlementsTab() {
  const { getCreatorStats, currentUser } = useStore()
  const stats = getCreatorStats(currentUser.id)
  const { settlements } = mockData
  const totalEarned = settlements.reduce((s, r) => s + r.totalRevenue, 0) + stats.totalRevenue
  const totalFees = settlements.reduce((s, r) => s + r.platformFee, 0) + stats.totalRevenue * 0.15
  const totalNet = settlements.reduce((s, r) => s + r.netAmount, 0) + stats.totalRevenue * 0.85
  const statusMap: Record<string, { label: string; cls: string }> = {
    completed: { label: '已完成', cls: 'bg-green-500/15 text-green-400' },
    processing: { label: '处理中', cls: 'bg-amber-500/15 text-amber-400' },
    pending: { label: '待结算', cls: 'bg-surface-600/30 text-surface-400' },
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: '总收入', value: Math.round(totalEarned * 100) / 100, icon: DollarSign },
          { label: '平台手续费(15%)', value: Math.round(totalFees * 100) / 100, icon: Users },
          { label: '实际到账', value: Math.round(totalNet * 100) / 100, icon: TrendingUp },
        ].map((c) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <c.icon className="w-5 h-5 text-brand-400" />
              <span className="text-surface-400 text-sm">{c.label}</span>
            </div>
            <p className="text-2xl font-bold text-surface-100">¥{c.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-surface-400 text-sm border-b border-surface-700/50 bg-surface-900/50">
                <th className="px-6 py-3 font-medium">月份</th>
                <th className="px-4 py-3 font-medium">总收入</th>
                <th className="px-4 py-3 font-medium">平台手续费</th>
                <th className="px-4 py-3 font-medium">实际到账</th>
                <th className="px-4 py-3 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((s) => {
                const st = statusMap[s.status]
                return (
                  <tr key={s.id} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition">
                    <td className="px-6 py-4 text-surface-100">{s.month}</td>
                    <td className="px-4 py-4 text-surface-300">¥{s.totalRevenue.toLocaleString()}</td>
                    <td className="px-4 py-4 text-surface-300">¥{s.platformFee.toLocaleString()}</td>
                    <td className="px-4 py-4 text-surface-100 font-medium">¥{s.netAmount.toLocaleString()}</td>
                    <td className="px-4 py-4"><span className={`badge ${st.cls}`}>{st.label}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <div className="min-h-screen bg-surface-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">创作者中心</h1>
            <p className="text-surface-400 mt-1">管理你的作品、数据与收入</p>
          </div>
          <div className="flex items-center gap-2 bg-surface-900/80 backdrop-blur-xl border border-surface-700/50 rounded-xl p-1">
            {tabs.map((t) => {
              const labels: Record<Tab, string> = { overview: '概览', products: '产品', settlements: '结算' }
              const isActive = activeTab === t
              return (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25' : 'text-surface-400 hover:text-surface-200'}`}
                >
                  {labels[t]}
                </button>
              )
            })}
          </div>
        </div>
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'settlements' && <SettlementsTab />}
        </motion.div>
      </div>
    </div>
  )
}
