import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Download, FileCheck, Shield, Eye, Package, Gift } from 'lucide-react'
import { useStore } from '@/store'
import { LICENSE_LABELS, LicenseType, DownloadCertificate } from '@/types'
import DownloadModal from '@/components/DownloadModal'

type TabType = 'purchases' | 'free'

export default function PurchasesPage() {
  const { orders, products, getDownloadCertificates, getOrCreateFreeDownload, getProductById } = useStore()
  const [activeTab, setActiveTab] = useState<TabType>('purchases')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<DownloadCertificate | null>(null)

  const allCertificates = getDownloadCertificates()
  const purchaseCerts = allCertificates.filter((c) => !c.isFree)
  const freeCerts = allCertificates.filter((c) => c.isFree)

  const handleShowCertificate = (cert: DownloadCertificate) => {
    setSelectedCertificate(cert)
    setModalOpen(true)
  }

  const handlePurchaseDownload = (cert: DownloadCertificate) => {
    handleShowCertificate(cert)
  }

  const handleFreeDownload = (productId: string) => {
    const cert = getOrCreateFreeDownload(productId)
    handleShowCertificate(cert)
  }

  const getProduct = (productId: string) => products.find((p) => p.id === productId)
  const getProductThumbnail = (productId: string) => getProduct(productId)?.thumbnails[0] || ''

  const hasPurchases = orders.length > 0 || purchaseCerts.length > 0
  const hasFreeDownloads = freeCerts.length > 0

  const CertificateCard = ({ cert }: { cert: DownloadCertificate }) => {
    const product = getProductById(cert.productId)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-4 border-b border-surface-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cert.isFree ? 'bg-emerald-500/20' : 'bg-brand-500/20'}`}>
              {cert.isFree ? <Gift className="w-5 h-5 text-emerald-400" /> : <Package className="w-5 h-5 text-brand-400" />}
            </div>
            <div>
              <p className="text-sm font-medium text-surface-200">
                {cert.isFree ? '免费领取' : '购买授权'}
              </p>
              <p className="text-xs text-surface-500">{cert.downloadedAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge ${cert.isFree ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {cert.isFree ? '免费' : `¥${cert.price}`}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4 p-3 bg-surface-800/50 rounded-xl">
            <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-surface-800">
              <img
                src={cert.thumbnail}
                alt={cert.productTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <Link
                to={`/product/${cert.productId}`}
                className="text-sm font-medium text-surface-100 hover:text-brand-400 transition-colors truncate block"
              >
                {cert.productTitle}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-surface-500">{LICENSE_LABELS[cert.licenseType]}</span>
                <span className="text-xs text-surface-600">·</span>
                <span className="text-xs text-surface-500">{cert.fileFormat}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                to={`/product/${cert.productId}`}
                className="p-2 rounded-lg text-surface-500 hover:text-brand-400 hover:bg-surface-700 transition-all"
                title="查看详情"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleShowCertificate(cert)}
                className="p-2 rounded-lg text-surface-500 hover:text-emerald-400 hover:bg-surface-700 transition-all"
                title="查看证书"
              >
                <Shield className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePurchaseDownload(cert)}
                className="p-2 rounded-lg text-surface-500 hover:text-brand-400 hover:bg-surface-700 transition-all"
                title="下载"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-surface-900/50 border-t border-surface-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-surface-500">
              <FileCheck className="w-3 h-3" />
              <span className="font-mono">{cert.credential}</span>
            </div>
            <button
              onClick={() => handleShowCertificate(cert)}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3" /> 查看授权证书
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  const EmptyState = ({ type }: { type: TabType }) => (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        {type === 'purchases' ? (
          <>
            <Package className="w-16 h-16 text-surface-700 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-surface-300 mb-2">暂无购买记录</h2>
            <p className="text-surface-500 mb-6">浏览素材市场，发现适合你的创意资源</p>
          </>
        ) : (
          <>
            <Gift className="w-16 h-16 text-surface-700 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-surface-300 mb-2">暂无免费领取</h2>
            <p className="text-surface-500 mb-6">浏览免费作品，领取你喜欢的创意资源</p>
          </>
        )}
        <Link to="/browse" className="btn-primary inline-block">
          {type === 'purchases' ? '浏览素材' : '浏览免费作品'}
        </Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="section-title mb-0">我的资产</h1>
          <div className="flex items-center gap-2 bg-surface-900/80 backdrop-blur-xl border border-surface-700/50 rounded-xl p-1 w-fit">
            {(['purchases', 'free'] as const).map((t) => {
              const labels: Record<TabType, string> = { purchases: '已购作品', free: '免费领取' }
              const counts: Record<TabType, number> = { purchases: purchaseCerts.length, free: freeCerts.length }
              const isActive = activeTab === t
              return (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                      : 'text-surface-400 hover:text-surface-200'
                  }`}
                >
                  {labels[t]}
                  <span className="ml-1.5 opacity-70">({counts[t]})</span>
                </button>
              )
            })}
          </div>
        </div>

        {activeTab === 'purchases' && (
          <div className="space-y-4">
            {purchaseCerts.length > 0 ? (
              purchaseCerts.map((cert, i) => (
                <div key={cert.id} style={{ animationDelay: `${i * 0.1}s` }}>
                  <CertificateCard cert={cert} />
                </div>
              ))
            ) : (
              <EmptyState type="purchases" />
            )}
          </div>
        )}

        {activeTab === 'free' && (
          <div className="space-y-4">
            {freeCerts.length > 0 ? (
              freeCerts.map((cert, i) => (
                <div key={cert.id} style={{ animationDelay: `${i * 0.1}s` }}>
                  <CertificateCard cert={cert} />
                </div>
              ))
            ) : (
              <EmptyState type="free" />
            )}
          </div>
        )}
      </motion.div>

      <DownloadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        certificate={selectedCertificate}
      />
    </div>
  )
}
