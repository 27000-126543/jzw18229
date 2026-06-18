import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Search, ShoppingCart, Upload, LayoutDashboard, User, Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cart, searchQuery, setSearchQuery, currentUser, following } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const cartCount = cart.length

  const isActive = (path: string) => location.pathname === path

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate('/browse')
      setSearchOpen(false)
    }
  }

  const navLinks = [
    { path: '/browse', label: '浏览素材' },
    { path: '/dashboard', label: '创作者中心' },
    { path: '/upload', label: '发布作品' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-950/90 backdrop-blur-xl border-b border-surface-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-display font-bold text-surface-100 group-hover:text-brand-400 transition-colors">
                创意市集
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="text"
                  placeholder="搜索模板、字体、图标..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  className="w-64 pl-10 pr-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-all"
                />
              </form>
            </div>

            <Link to="/cart" className="relative p-2 text-surface-400 hover:text-brand-400 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-800 transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border-2 border-surface-700"
                />
                <ChevronDown className="w-3 h-3 text-surface-500" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-surface-900 border border-surface-700 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-surface-800">
                      <p className="text-sm font-medium text-surface-100">{currentUser.name}</p>
                      <p className="text-xs text-surface-500">{currentUser.email}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-surface-300 hover:text-surface-100 hover:bg-surface-800 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" /> 个人中心
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-surface-300 hover:text-surface-100 hover:bg-surface-800 rounded-lg transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> 创作者后台
                      </Link>
                      <Link
                        to="/upload"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-surface-300 hover:text-surface-100 hover:bg-surface-800 rounded-lg transition-colors"
                      >
                        <Upload className="w-4 h-4" /> 发布作品
                      </Link>
                      <Link
                        to="/purchases"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-surface-300 hover:text-surface-100 hover:bg-surface-800 rounded-lg transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" /> 我的购买
                      </Link>
                    </div>
                    <div className="p-1 border-t border-surface-800">
                      <div className="px-3 py-2 text-xs text-surface-500">
                        关注了 {following.length} 位创作者
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-surface-400 hover:text-surface-100"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-950 border-b border-surface-800"
          >
            <div className="px-4 py-4 space-y-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="text"
                  placeholder="搜索素材..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-800 border border-surface-700 rounded-lg text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500"
                />
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-surface-400 hover:text-surface-100"
              >
                <ShoppingCart className="w-4 h-4" /> 购物车 {cartCount > 0 && `(${cartCount})`}
              </Link>
              <Link
                to="/purchases"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-surface-400 hover:text-surface-100"
              >
                我的购买
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-surface-400 hover:text-surface-100"
              >
                个人中心
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
