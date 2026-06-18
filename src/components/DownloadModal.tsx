import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileCheck, Shield, X, Copy, Check as CheckIcon, FileDown } from 'lucide-react'
import { useState } from 'react'

interface DownloadModalProps {
  open: boolean
  onClose: () => void
  productTitle: string
  licenseType: 'personal' | 'commercial'
  price: number
  downloadCredential: string
  fileFormat?: string
  fileSize?: string
  isFree?: boolean
}

export default function DownloadModal({
  open,
  onClose,
  productTitle,
  licenseType,
  price,
  downloadCredential,
  fileFormat,
  fileSize,
  isFree = false,
}: DownloadModalProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(downloadCredential)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      onClose()
    }, 2000)
  }

  const licenseLabel = licenseType === 'personal' ? '个人用途授权' : '商用授权'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-brand-500/20 to-brand-600/20 p-6 border-b border-surface-700/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-surface-100 font-display">下载凭证</h3>
                    <p className="text-xs text-surface-500">{isFree ? '免费授权' : '购买授权'}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-700/50 text-surface-500 hover:text-surface-200 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs text-surface-500 mb-1">作品名称</p>
                <p className="text-sm font-medium text-surface-100">{productTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-surface-500 mb-1">授权类型</p>
                  <p className="text-sm font-medium text-surface-200">{licenseLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-surface-500 mb-1">价格</p>
                  <p className="text-sm font-medium text-surface-200">{isFree ? '免费' : `¥${price}`}</p>
                </div>
                {fileFormat && (
                  <div>
                    <p className="text-xs text-surface-500 mb-1">文件格式</p>
                    <p className="text-sm font-medium text-surface-200">{fileFormat}</p>
                  </div>
                )}
                {fileSize && (
                  <div>
                    <p className="text-xs text-surface-500 mb-1">文件大小</p>
                    <p className="text-sm font-medium text-surface-200">{fileSize}</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-surface-900/70 rounded-xl border border-surface-700/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-surface-500 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> 下载凭证号
                  </p>
                  <button
                    onClick={handleCopy}
                    className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                  >
                    {copied ? <CheckIcon className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
                <p className="font-mono text-sm text-brand-300 tracking-wider">{downloadCredential}</p>
              </div>

              <div className="text-xs text-surface-600 space-y-1">
                <p>• 此下载凭证为您的唯一授权证明，请妥善保存</p>
                <p>• 授权范围以所选授权类型（个人/商用）为准</p>
                <p>• 下载包内含授权协议文件，可用于商业合规备案</p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <>
                    <FileDown className="w-5 h-5 animate-bounce" /> 正在下载...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" /> 立即下载
                  </>
                )}
              </button>
              <p className="text-xs text-surface-600 text-center mt-3">
                下载包格式：ZIP（含源文件 + 授权证书 + 使用说明）
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
