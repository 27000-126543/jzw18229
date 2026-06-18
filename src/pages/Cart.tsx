import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ShoppingBag, CreditCard, Check, Shield, ArrowRight } from 'lucide-react'
import { useStore } from '@/store'
import { LICENSE_LABELS, LicenseType } from '@/types'

export default function CartPage() {
  const { cart, removeFromCart, updateCartLicense, clearCart, placeOrder, getCartTotal } = useStore()
  const navigate = useNavigate()
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const total = getCartTotal()

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  const handlePayment = () => {
    placeOrder()
    setOrderComplete(true)
    setShowCheckout(false)
  }

  if (orderComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-surface-100 mb-3">支付成功！</h2>
          <p className="text-surface-400 mb-6">您的下载凭证和授权信息已生成，可在"我的购买"中查看。</p>
          <div className="space-y-3">
            <Link to="/purchases" className="btn-primary w-full inline-block text-center">
              查看我的购买
            </Link>
            <Link to="/browse" className="btn-secondary w-full inline-block text-center">
              继续浏览
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-surface-700 mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-surface-300 mb-2">购物车为空</h2>
          <p className="text-surface-500 mb-6">去发现一些优质的数字素材吧！</p>
          <Link to="/browse" className="btn-primary inline-flex items-center gap-2">
            浏览素材 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title">购物车</h1>
          <button onClick={clearCart} className="text-sm text-surface-500 hover:text-red-400 transition-colors">
            清空购物车
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-4 flex items-center gap-4"
                >
                  <div className="w-20 h-14 bg-surface-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.productId}`} className="text-sm font-semibold text-surface-100 hover:text-brand-400 transition-colors truncate block">
                      {item.title}
                    </Link>
                    <p className="text-xs text-surface-500 mt-0.5">by {item.creatorName}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {(['personal', 'commercial'] as LicenseType[]).map((lt) => (
                        <button
                          key={lt}
                          onClick={() => updateCartLicense(item.productId, lt)}
                          className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                            item.licenseType === lt
                              ? 'bg-brand-500/20 text-brand-400 border border-brand-500/50'
                              : 'bg-surface-800 text-surface-500 border border-surface-700 hover:border-surface-600'
                          }`}
                        >
                          {LICENSE_LABELS[lt]} ¥{lt === 'personal' ? item.pricePersonal : item.priceCommercial}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-brand-400">
                      ¥{item.licenseType === 'commercial' ? item.priceCommercial : item.pricePersonal}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="mt-1 text-surface-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-surface-100 mb-4">订单摘要</h3>

              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-surface-400 truncate max-w-[180px]">{item.title}</span>
                    <span className="text-surface-200">
                      ¥{item.licenseType === 'commercial' ? item.priceCommercial : item.pricePersonal}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-surface-700 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-surface-400">小计</span>
                  <span className="text-surface-200">¥{total}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-surface-400">平台服务费</span>
                  <span className="text-surface-200">¥0</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-surface-700">
                  <span className="text-surface-100">总计</span>
                  <span className="text-brand-400">¥{total}</span>
                </div>
              </div>

              <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" /> 确认支付
              </button>

              <div className="mt-4 flex items-center gap-2 text-xs text-surface-500">
                <Shield className="w-3 h-3" />
                <span>安全支付，授权信息随下载包提供</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-display font-bold text-surface-100 mb-2">确认支付</h3>
              <p className="text-surface-400 text-sm mb-6">确认购买以下 {cart.length} 件作品</p>

              <div className="space-y-2 mb-6">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-surface-300 truncate max-w-[200px]">{item.title}</span>
                    <span className="text-surface-200">¥{item.licenseType === 'commercial' ? item.priceCommercial : item.pricePersonal}</span>
                  </div>
                ))}
                <div className="border-t border-surface-700 pt-2 mt-2 flex justify-between font-bold">
                  <span className="text-surface-100">支付金额</span>
                  <span className="text-brand-400">¥{total}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handlePayment} className="btn-primary w-full">
                  模拟支付 ¥{total}
                </button>
                <button onClick={() => setShowCheckout(false)} className="btn-secondary w-full">
                  取消
                </button>
              </div>

              <p className="text-xs text-surface-600 text-center mt-4">这是演示模式，不会产生实际支付</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
