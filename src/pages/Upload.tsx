import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image, FileText, Tag, DollarSign, Shield, Check, X } from 'lucide-react'
import { useStore } from '@/store'
import { CATEGORY_LABELS, Category } from '@/types'

export default function UploadPage() {
  const { products } = useStore()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'figma' as Category,
    tags: '',
    isFree: false,
    pricePersonal: 0,
    priceCommercial: 0,
    hasPersonal: true,
    hasCommercial: true,
    fileFormat: '',
    compatibility: '',
  })
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const categories: Category[] = ['figma', 'ppt', 'font', 'icon', 'code', 'notion', 'other']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
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
          <h2 className="text-2xl font-display font-bold text-surface-100 mb-3">作品已提交</h2>
          <p className="text-surface-400 mb-6">您的作品已进入审核队列，通常 1-3 个工作日内完成审核。审核通过后将自动上架。</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm">
              继续上传
            </button>
            <a href="/dashboard" className="btn-primary text-sm inline-block">
              查看后台
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title mb-2">发布作品</h1>
        <p className="text-surface-400 mb-8">上传你的创意作品，设置价格和授权，开始赚取收入</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-surface-100 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-400" /> 基本信息
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-surface-300 mb-1.5">作品标题 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="给你的作品起个响亮的名字"
                  className="input-dark"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-surface-300 mb-1.5">作品描述 *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="详细描述你的作品，包含用途、特色、兼容性等"
                  rows={4}
                  className="input-dark resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-surface-300 mb-1.5">分类 *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                    className="input-dark"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-surface-300 mb-1.5">标签</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="用逗号分隔，如：SaaS,后台,仪表盘"
                      className="input-dark pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-surface-300 mb-1.5">文件格式</label>
                  <input
                    type="text"
                    value={form.fileFormat}
                    onChange={(e) => setForm({ ...form, fileFormat: e.target.value })}
                    placeholder="如：.fig, .svg, .zip"
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm text-surface-300 mb-1.5">兼容平台</label>
                  <input
                    type="text"
                    value={form.compatibility}
                    onChange={(e) => setForm({ ...form, compatibility: e.target.value })}
                    placeholder="如：Figma, 全平台"
                    className="input-dark"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-surface-100 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-brand-400" /> 文件上传
            </h3>
            <div
              className="border-2 border-dashed border-surface-700 rounded-xl p-8 text-center hover:border-brand-500/50 transition-colors cursor-pointer"
              onClick={() => setUploadedFiles(['模拟文件.zip'])}
            >
              <Upload className="w-10 h-10 text-surface-500 mx-auto mb-3" />
              <p className="text-surface-300 mb-1">拖拽文件到此处，或点击上传</p>
              <p className="text-xs text-surface-500">支持 .fig, .zip, .pptx, .otf, .svg 等格式，最大 500MB</p>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2 bg-surface-800 rounded-lg">
                    <span className="text-sm text-surface-300">{f}</span>
                    <button
                      type="button"
                      onClick={() => setUploadedFiles(uploadedFiles.filter((_, j) => j !== i))}
                      className="text-surface-500 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-surface-100 mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-brand-400" /> 预览图
            </h3>
            <div
              className="border-2 border-dashed border-surface-700 rounded-xl p-8 text-center hover:border-brand-500/50 transition-colors cursor-pointer"
              onClick={() => setPreviewImages(['preview_1.png'])}
            >
              <Image className="w-10 h-10 text-surface-500 mx-auto mb-3" />
              <p className="text-surface-300 mb-1">上传缩略图和效果展示图</p>
              <p className="text-xs text-surface-500">建议尺寸 1920×1080，支持 .png/.jpg，最多 10 张</p>
            </div>
            {previewImages.length > 0 && (
              <div className="mt-4 flex gap-3">
                {previewImages.map((img, i) => (
                  <div key={i} className="relative w-24 h-16 bg-surface-800 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-surface-500">{img}</div>
                    <button
                      type="button"
                      onClick={() => setPreviewImages(previewImages.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-surface-100 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-brand-400" /> 价格与授权
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setForm({ ...form, isFree: false })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !form.isFree ? 'bg-brand-500 text-white' : 'bg-surface-800 text-surface-400 hover:bg-surface-700'
                }`}
              >
                付费作品
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, isFree: true })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  form.isFree ? 'bg-emerald-500 text-white' : 'bg-surface-800 text-surface-400 hover:bg-surface-700'
                }`}
              >
                免费作品
              </button>
            </div>

            {!form.isFree && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${form.hasPersonal ? 'border-brand-500/50 bg-brand-500/5' : 'border-surface-700'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-brand-400" />
                      <span className="text-sm font-medium text-surface-200">个人用途</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.hasPersonal}
                        onChange={(e) => setForm({ ...form, hasPersonal: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                  <p className="text-xs text-surface-500 mb-3">个人项目、学习用途，不可用于商业</p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">¥</span>
                    <input
                      type="number"
                      value={form.pricePersonal}
                      onChange={(e) => setForm({ ...form, pricePersonal: Number(e.target.value) })}
                      className="input-dark pl-8"
                      min="0"
                    />
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${form.hasCommercial ? 'border-brand-500/50 bg-brand-500/5' : 'border-surface-700'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-brand-400" />
                      <span className="text-sm font-medium text-surface-200">商用授权</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.hasCommercial}
                        onChange={(e) => setForm({ ...form, hasCommercial: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                  <p className="text-xs text-surface-500 mb-3">商业项目、客户交付，完整授权</p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">¥</span>
                    <input
                      type="number"
                      value={form.priceCommercial}
                      onChange={(e) => setForm({ ...form, priceCommercial: Number(e.target.value) })}
                      className="input-dark pl-8"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {form.isFree && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <p className="text-sm text-emerald-400">免费作品可帮助您积累关注者和曝光，关注者将优先收到您后续付费作品的推送通知。</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary">保存草稿</button>
            <button type="submit" className="btn-primary">提交审核</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
