import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingCart, Download, Heart, ChevronLeft, ChevronRight, X, Send, User, FileCheck, Shield } from 'lucide-react'
import { useStore } from '@/store'
import { LicenseType, DownloadCertificate } from '@/types'
import ProductCard from '@/components/ProductCard'
import DownloadModal from '@/components/DownloadModal'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { getProductById, products, addToCart, toggleFollow, following, addReview, getOrCreateFreeDownload, getCertificateByProductId } = useStore()
  const product = getProductById(id!)

  const [currentImg, setCurrentImg] = useState(0)
  const [enlarged, setEnlarged] = useState(false)
  const [license, setLicense] = useState<LicenseType>('personal')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [downloadModalOpen, setDownloadModalOpen] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<DownloadCertificate | null>(null)

  if (!product) return <div className="flex items-center justify-center min-h-screen text-surface-400">产品未找到</div>

  const images = product.previewImages.length > 0 ? product.previewImages : product.thumbnails
  const isFollowing = following.includes(product.creator.id)
  const related = products.filter(p => p.category === product.category && p.id !== product.id && p.status === 'published').slice(0, 4)
  const existingCert = useMemo(() => getCertificateByProductId(product.id), [product.id, getCertificateByProductId])

  const starDist = [5, 4, 3, 2, 1].map(s => {
    const count = product.reviews.filter(r => r.rating === s).length
    return { stars: s, count, pct: product.reviews.length ? (count / product.reviews.length) * 100 : 0 }
  })

  const handleAddReview = () => {
    if (!reviewComment.trim()) return
    addReview(product.id, reviewRating, reviewComment.trim())
    setReviewComment('')
    setReviewRating(5)
  }

  const handleFreeDownload = () => {
    const cert = getOrCreateFreeDownload(product.id)
    setSelectedCertificate(cert)
    setDownloadModalOpen(true)
  }

  const handleViewCertificate = () => {
    if (existingCert) {
      setSelectedCertificate(existingCert)
      setDownloadModalOpen(true)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden glass-card cursor-pointer group" onClick={() => setEnlarged(true)}>
            <img src={images[currentImg]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white/10 text-6xl font-bold tracking-widest select-none rotate-[-20deg]">PREVIEW</span>
            </div>
            {images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); setCurrentImg(i => (i - 1 + images.length) % images.length) }} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-surface-950/60 backdrop-blur rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={e => { e.stopPropagation(); setCurrentImg(i => (i + 1) % images.length) }} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-surface-950/60 backdrop-blur rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-5 h-5" /></button>
              </>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            {images.map((img, i) => (
              <button key={i} onClick={() => setCurrentImg(i)} className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === currentImg ? 'border-brand-500' : 'border-surface-700/50 opacity-60 hover:opacity-100'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-surface-50 font-display leading-tight">{product.title}</h1>

          <div className="flex items-center gap-3">
            <img src={product.creator.avatar} alt="" className="w-10 h-10 rounded-full border border-surface-700" />
            <div className="flex-1 min-w-0">
              <p className="text-surface-200 font-medium truncate">{product.creator.name}</p>
              <p className="text-surface-500 text-xs">{product.creator.followersCount} 粉丝</p>
            </div>
            <button onClick={() => toggleFollow(product.creator.id)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}>
              {isFollowing ? '已关注' : '关注'}
            </button>
          </div>

          <div className="flex items-center gap-4 text-surface-400 text-sm">
            <span className="flex items-center gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-surface-700'}`} />)}<span className="ml-1 text-surface-200 font-medium">{product.rating}</span></span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4" />{product.ratingCount} 评价</span>
            <span className="flex items-center gap-1"><Download className="w-4 h-4" />{product.downloadCount}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(['personal', 'commercial'] as LicenseType[]).map(lt => (
              <button key={lt} onClick={() => setLicense(lt)} className={`p-4 rounded-xl border-2 text-left transition-all ${license === lt ? 'border-brand-500 bg-brand-500/10' : 'border-surface-700/50 bg-surface-900/50 hover:border-surface-600'}`}>
                <p className="text-surface-200 font-semibold text-sm">{lt === 'personal' ? '个人授权' : '商用授权'}</p>
                <p className="text-surface-500 text-xs mt-1">{lt === 'personal' ? '个人项目、学习用途，不可用于商业' : '商业项目、客户交付，完整授权'}</p>
                <p className="text-brand-400 font-bold text-lg mt-2">¥{lt === 'personal' ? product.pricePersonal : product.priceCommercial}</p>
              </button>
            ))}
          </div>

          {product.isFree ? (
            <div className="space-y-3">
              {existingCert ? (
                <>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-emerald-400">您已领取此免费作品</p>
                      <p className="text-xs text-emerald-400/70">凭证号: {existingCert.credential.slice(-8)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleFreeDownload}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />下载资源
                    </button>
                    <button
                      onClick={handleViewCertificate}
                      className="w-full btn-secondary flex items-center justify-center gap-2"
                    >
                      <Shield className="w-5 h-5" />查看证书
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleFreeDownload}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />免费下载
                </button>
              )}
            </div>
          ) : (
            <button onClick={() => addToCart(product, license)} className="w-full btn-primary flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />加入购物车
            </button>
          )}

          <div className="flex gap-6 text-sm text-surface-400">
            <span>格式: <span className="text-surface-200">{product.fileFormat}</span></span>
            <span>大小: <span className="text-surface-200">{product.fileSize}</span></span>
            <span>兼容: <span className="text-surface-200">{product.compatibility}</span></span>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => <span key={tag} className="badge bg-surface-800 text-surface-300 border border-surface-700/50">{tag}</span>)}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="section-title mb-4">产品描述</h2>
        <p className="text-surface-300 leading-relaxed max-w-4xl">{product.description}</p>
      </div>

      <div className="mt-16">
        <h2 className="section-title mb-6">用户评价</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="glass-card p-6 space-y-4">
            <div className="text-center">
              <p className="text-5xl font-bold text-surface-100">{product.rating}</p>
              <div className="flex justify-center mt-2">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-surface-700'}`} />)}</div>
              <p className="text-surface-500 text-sm mt-1">{product.ratingCount} 条评价</p>
            </div>
            <div className="space-y-2">
              {starDist.map(d => (
                <div key={d.stars} className="flex items-center gap-2 text-sm">
                  <span className="text-surface-400 w-6">{d.stars}</span>
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <div className="flex-1 h-2 bg-surface-800 rounded-full overflow-hidden"><div className="h-full bg-brand-500 rounded-full" style={{ width: `${d.pct}%` }} /></div>
                  <span className="text-surface-500 w-8 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {product.reviews.map(r => (
                <div key={r.id} className="glass-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={r.userAvatar} alt="" className="w-8 h-8 rounded-full border border-surface-700" />
                    <span className="text-surface-200 text-sm font-medium">{r.userName}</span>
                    <div className="flex gap-0.5 ml-auto">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-surface-700'}`} />)}</div>
                    <span className="text-surface-600 text-xs">{r.createdAt}</span>
                  </div>
                  <p className="text-surface-300 text-sm">{r.comment}</p>
                </div>
              ))}
            </div>

            <div className="glass-card p-5 space-y-4">
              <p className="text-surface-200 font-medium">撰写评价</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setReviewRating(i + 1)}><Star className={`w-6 h-6 transition-colors ${i < reviewRating ? 'text-yellow-500 fill-yellow-500' : 'text-surface-700 hover:text-yellow-400'}`} /></button>
                ))}
              </div>
              <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="分享你的使用体验..." className="input-dark min-h-[80px] resize-none" />
              <button onClick={handleAddReview} className="btn-primary flex items-center gap-2 text-sm"><Send className="w-4 h-4" />提交评价</button>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title mb-6">相关推荐</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}

      <AnimatePresence>
        {enlarged && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-surface-950/90 backdrop-blur flex items-center justify-center p-8" onClick={() => setEnlarged(false)}>
            <button className="absolute top-6 right-6 p-2 text-surface-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            <img src={images[currentImg]} alt="" className="max-w-full max-h-full object-contain rounded-xl" onClick={e => e.stopPropagation()} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-white/5 text-8xl font-bold tracking-[0.3em] select-none rotate-[-20deg]">PREVIEW</span></div>
          </motion.div>
        )}
      </AnimatePresence>

      <DownloadModal
        open={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        certificate={selectedCertificate}
      />
    </div>
  )
}
