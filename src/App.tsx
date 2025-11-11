import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import CartPage from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import CustomerSupportBot from './components/CustomerSupportBot';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
      <div>
        {/* Ostatní obsah */}
        <CustomerSupportBot />
      </div>
    </BrowserRouter>
  );
}
