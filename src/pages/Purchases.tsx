import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Download, FileCheck, Shield, Eye } from 'lucide-react'
import { useStore } from '@/store'
import { LICENSE_LABELS, LicenseType } from '@/types'
import DownloadModal from '@/components/DownloadModal'

interface DownloadItem {
  title: string
  price: number
  licenseType: LicenseType
  credential: string
  fileFormat: string
  fileSize: string
}

export default function PurchasesPage() {
  const { orders, products } = useStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [downloadItem, setDownloadItem] = useState<DownloadItem | null>(null)

  const getProduct = (productId: string) => products.find((p) => p.id === productId)
  const getProductThumbnail = (productId: string) => getProduct(productId)?.thumbnails[0] || ''

  const handleDownload = (item: typeof orders[0]['items'][0], credential: string) => {
    const product = getProduct(item.productId)
    setDownloadItem({
      title: item.title,
      price: item.price,
      licenseType: item.licenseType,
      credential,
      fileFormat: product?.fileFormat || '',
      fileSize: product?.fileSize || '',
    })
    setModalOpen(true)
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <FileCheck className="w-16 h-16 text-surface-700 mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-surface-300 mb-2">暂无购买记录</h2>
          <p className="text-surface-500 mb-6">浏览素材市场，发现适合你的创意资源</p>
          <Link to="/browse" className="btn-primary inline-block">浏览素材</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title mb-8">我的购买</h1>

        <div className="space-y-4">
          {orders.map((order, orderIndex) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: orderIndex * 0.1 }}
              className="glass-card overflow-hidden"
            >
              <div className="p-4 border-b border-surface-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-surface-200">订单 {order.id}</p>
                    <p className="text-xs text-surface-500">{order.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${
                    order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    order.status === 'paid' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-surface-800 text-surface-400'
                  }`}>
                    {order.status === 'completed' ? '已完成' : order.status === 'paid' ? '已支付' : '处理中'}
                  </span>
                  <span className="text-sm font-bold text-brand-400">¥{order.totalAmount}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-4 p-3 bg-surface-800/50 rounded-xl">
                      <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-surface-800">
                        <img
                          src={getProductThumbnail(item.productId)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-sm font-medium text-surface-100 hover:text-brand-400 transition-colors truncate block"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-surface-500">{LICENSE_LABELS[item.licenseType]}</span>
                          <span className="text-xs text-surface-600">·</span>
                          <span className="text-xs text-surface-500">¥{item.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          to={`/product/${item.productId}`}
                          className="p-2 rounded-lg text-surface-500 hover:text-brand-400 hover:bg-surface-700 transition-all"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDownload(item, order.downloadCredential)}
                          className="p-2 rounded-lg text-surface-500 hover:text-emerald-400 hover:bg-surface-700 transition-all"
                          title="下载"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-surface-900/50 border-t border-surface-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-surface-500">
                    <Shield className="w-3 h-3" />
                    <span>下载凭证: {order.downloadCredential}</span>
                  </div>
                  <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
                    <FileCheck className="w-3 h-3" /> 查看授权证书
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {downloadItem && (
        <DownloadModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          productTitle={downloadItem.title}
          licenseType={downloadItem.licenseType}
          price={downloadItem.price}
          downloadCredential={downloadItem.credential}
          fileFormat={downloadItem.fileFormat}
          fileSize={downloadItem.fileSize}
        />
      )}
    </div>
  )
}
