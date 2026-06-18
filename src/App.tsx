import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Browse from '@/pages/Browse'
import ProductDetail from '@/pages/ProductDetail'
import Dashboard from '@/pages/Dashboard'
import UploadPage from '@/pages/Upload'
import CartPage from '@/pages/Cart'
import PurchasesPage from '@/pages/Purchases'
import ProfilePage from '@/pages/Profile'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  )
}
