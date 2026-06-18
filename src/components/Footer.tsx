import { Link } from 'react-router-dom'
import { Github, Twitter, Mail } from 'lucide-react'
import { CATEGORY_LABELS, Category } from '@/types'

export default function Footer() {
  const categories: Category[] = ['figma', 'ppt', 'font', 'icon', 'code', 'notion']

  return (
    <footer className="bg-surface-950 border-t border-surface-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-display font-bold text-surface-100">创意市集</span>
            </Link>
            <p className="text-sm text-surface-500 mb-4">
              连接创作者与买家的数字素材交易平台，让创意价值得以实现。
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-surface-800 text-surface-400 hover:text-brand-400 hover:bg-surface-700 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-surface-800 text-surface-400 hover:text-brand-400 hover:bg-surface-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-surface-800 text-surface-400 hover:text-brand-400 hover:bg-surface-700 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4">素材分类</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link to={`/browse?category=${cat}`} className="text-sm text-surface-500 hover:text-brand-400 transition-colors">
                    {CATEGORY_LABELS[cat]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4">创作者</h4>
            <ul className="space-y-2">
              <li><Link to="/upload" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">发布作品</Link></li>
              <li><Link to="/dashboard" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">数据看板</Link></li>
              <li><Link to="/dashboard" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">结算记录</Link></li>
              <li><a href="#" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">创作者指南</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4">关于</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">关于我们</a></li>
              <li><a href="#" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">使用条款</a></li>
              <li><a href="#" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">隐私政策</a></li>
              <li><a href="#" className="text-sm text-surface-500 hover:text-brand-400 transition-colors">帮助中心</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-600">© 2025 创意市集 CreativeMart. 保留所有权利。</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-600">平台手续费：15%</span>
            <span className="text-xs text-surface-600">·</span>
            <span className="text-xs text-surface-600">月度结算</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
