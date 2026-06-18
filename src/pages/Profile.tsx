import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { User, Mail, Calendar, Heart, Package, Settings, Bell, Edit3 } from 'lucide-react'
import { useStore } from '@/store'

export default function ProfilePage() {
  const { currentUser, following, orders, products } = useStore()

  const followedCreators = products
    .filter((p) => following.includes(p.creator.id))
    .reduce((acc, p) => {
      if (!acc.find((c) => c.id === p.creator.id)) {
        acc.push(p.creator)
      }
      return acc
    }, [] as typeof products[0]['creator'][])

  const purchaseCount = orders.length
  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl border-2 border-surface-700"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">
                  {currentUser.role === 'creator' ? 'C' : 'B'}
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-display font-bold text-surface-100 mb-1">{currentUser.name}</h1>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-surface-500 mb-4">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {currentUser.email}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 加入于 {currentUser.createdAt}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-brand-400">{purchaseCount}</p>
                  <p className="text-xs text-surface-500">已购作品</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-surface-100">¥{totalSpent}</p>
                  <p className="text-xs text-surface-500">累计消费</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-surface-100">{following.length}</p>
                  <p className="text-xs text-surface-500">关注创作者</p>
                </div>
              </div>
            </div>

            <button className="btn-secondary text-sm flex items-center gap-2">
              <Edit3 className="w-4 h-4" /> 编辑资料
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/purchases" className="glass-card p-6 card-hover group">
            <Package className="w-8 h-8 text-brand-400 mb-3" />
            <h3 className="text-sm font-semibold text-surface-100 mb-1 group-hover:text-brand-400 transition-colors">我的购买</h3>
            <p className="text-xs text-surface-500">{purchaseCount} 件作品</p>
          </Link>
          <Link to="/dashboard" className="glass-card p-6 card-hover group">
            <Settings className="w-8 h-8 text-brand-400 mb-3" />
            <h3 className="text-sm font-semibold text-surface-100 mb-1 group-hover:text-brand-400 transition-colors">创作者后台</h3>
            <p className="text-xs text-surface-500">管理作品和结算</p>
          </Link>
          <Link to="/upload" className="glass-card p-6 card-hover group">
            <Package className="w-8 h-8 text-brand-400 mb-3" />
            <h3 className="text-sm font-semibold text-surface-100 mb-1 group-hover:text-brand-400 transition-colors">发布作品</h3>
            <p className="text-xs text-surface-500">上传新的创意作品</p>
          </Link>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-surface-100 flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-400" /> 关注的创作者
            </h2>
            <span className="text-sm text-surface-500">{following.length} 位</span>
          </div>

          {followedCreators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {followedCreators.map((creator) => (
                <div key={creator.id} className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-xl hover:bg-surface-800 transition-colors">
                  <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-full border border-surface-700" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-200 truncate">{creator.name}</p>
                    <p className="text-xs text-surface-500">{creator.productsCount} 件作品 · {creator.followersCount >= 1000 ? `${(creator.followersCount / 1000).toFixed(1)}k` : creator.followersCount} 关注者</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-surface-700 mx-auto mb-3" />
              <p className="text-surface-500">还没有关注任何创作者</p>
              <Link to="/browse" className="text-sm text-brand-400 hover:text-brand-300 mt-2 inline-block">去发现创作者 →</Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
