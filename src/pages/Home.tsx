import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import type { Product, CartItem } from '../types';
import { addToCart, getCart } from '../lib/cart'; // Přidání importu getCart

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Vše');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchProducts();
    loadCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Chyba při načítání produktů:', error);
    }
  };

  const loadCart = () => {
    setCart(getCart()); // Použití getCart místo localStorage.getItem
  };

  const handleAddToCart = async (product: Product, quantity: number) => {
    await addToCart(product, quantity);
    // Znovu načíst produkty po přidání do košíku
    await fetchProducts();
    // Znovu načíst košík pro aktualizaci počtu v hlavičce
    loadCart();
  };

  const categories = ['Vše', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Vše' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0',
      margin: '0'
    }}>
      {/* Header */}
      <header style={{ 
        background: 'white',
        padding: '15px 30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          maxWidth: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🛒</span>
            <h1 style={{ fontSize: '28px', margin: 0, color: '#2c3e50', fontWeight: 'bold' }}>
              E-Shop
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/cart" style={{ 
              padding: '10px 20px', 
              background: '#3498db', 
              color: 'white', 
              borderRadius: '10px', 
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.4)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              🛒 Košík ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </a>
            <a href="/admin/login" style={{ 
              padding: '10px 20px', 
              background: '#e74c3c', 
              color: 'white', 
              borderRadius: '10px', 
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              🔐 Admin
            </a>
          </div>
        </div>
      </header>

      {/* Produkty */}
      <main style={{ 
        padding: '30px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ 
          fontSize: '28px', 
          color: 'white', 
          marginBottom: '25px',
          textAlign: 'center',
          textShadow: '0 3px 15px rgba(0,0,0,0.3)',
          fontWeight: 'bold'
        }}>
          ✨ Naše produkty
        </h2>

        {/* Filtrování a řazení */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '30px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          maxWidth: '1800px',
          margin: '0 auto 30px auto'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr', 
            gap: '15px',
            alignItems: 'end'
          }}>
            {/* Vyhledávání */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '700', 
                color: '#2c3e50',
                fontSize: '14px',
                letterSpacing: '0.3px'
              }}>
                🔍 Vyhledat produkt
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Hledat podle názvu nebo popisu..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Kategorie */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '700', 
                color: '#2c3e50',
                fontSize: '14px',
                letterSpacing: '0.3px'
              }}>
                📁 Kategorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  boxSizing: 'border-box',
                  outline: 'none',
                  fontFamily: 'inherit',
                  fontWeight: '500',
                  color: '#2c3e50'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} style={{ padding: '10px', fontSize: '14px' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Řazení */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '700', 
                color: '#2c3e50',
                fontSize: '14px',
                letterSpacing: '0.3px'
              }}>
                ⚡ Řadit podle
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  boxSizing: 'border-box',
                  outline: 'none',
                  fontFamily: 'inherit',
                  fontWeight: '500',
                  color: '#2c3e50'
                }}
              >
                <option value="default" style={{ padding: '10px' }}>Výchozí pořadí</option>
                <option value="price-asc" style={{ padding: '10px' }}>💰 Nejlevnější</option>
                <option value="price-desc" style={{ padding: '10px' }}>💎 Nejdražší</option>
                <option value="rating" style={{ padding: '10px' }}>⭐ Nejlepší hodnocení</option>
                <option value="name" style={{ padding: '10px' }}>🔤 Název A-Z</option>
              </select>
            </div>
          </div>

          {/* Počet nalezených produktů */}
          <div style={{ 
            marginTop: '15px', 
            padding: '10px 15px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            textAlign: 'center', 
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
          }}>
            📦 Nalezeno produktů: <strong style={{ fontSize: '16px', marginLeft: '6px' }}>{filteredProducts.length}</strong>
          </div>
        </div>

        {/* Produkty */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '25px',
          maxWidth: '1800px',
          margin: '0 auto'
        }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '50px 30px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              color: 'white',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>😔</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>
                Žádné produkty nebyly nalezeny
              </div>
              <div style={{ fontSize: '16px', opacity: 0.9 }}>
                Zkuste změnit vyhledávací kritéria nebo kategorii
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '25px',
        textAlign: 'center',
        color: 'white',
        fontSize: '14px',
        marginTop: '50px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <p style={{ margin: 0, fontWeight: '500' }}>
          © 2025 E-shop - Váš oblíbený obchod 💙 | Vytvořeno s láskou ❤️
        </p>
      </footer>
    </div>
  );
}