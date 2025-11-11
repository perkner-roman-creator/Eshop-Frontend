import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../types';
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal } from '../lib/cart';
import Header from '../components/Header';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    setCart(getCart());
  };

  const handleRemoveFromCart = async (productId: string) => {
    const updatedCart = await removeFromCart(productId);
    setCart(updatedCart);
    // Znovu načíst produkty pro aktualizaci skladu
    window.location.reload(); // Nebo použijte lepší způsob aktualizace
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const updatedCart = await updateQuantity(productId, quantity);
    setCart(updatedCart);
  };

  const handleClearCart = async () => {
    if (confirm('Opravdu chcete vyprázdnit košík?')) {
      await clearCart();
      setCart([]);
    }
  };

  const total = getCartTotal();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 0,
      margin: 0
    }}>
      {/* jednotný header */}
      <Header title="Košík" backTo="/" backLabel="← Zpět na produkty" />

      <main style={{ 
        padding: '20px',
        width: '100%',
        boxSizing: 'border-box',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {cart.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '40px 24px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 28px rgba(0,0,0,0.12)'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🛒</div>
            <h2 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '8px' }}>
              Váš košík je prázdný
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
              Přidejte nějaké produkty do košíku
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '10px 22px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(52, 152, 219, 0.35)'
              }}
            >
              Zobrazit produkty
            </button>
          </div>
        ) : (
          <>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '16px',
              boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
              marginBottom: '16px'
            }}>
              {cart.map(item => (
                <div 
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px 10px',
                    borderBottom: '2px solid #f0f0f0',
                    alignItems: 'center'
                  }}
                >
                  {item.product.imageUrl && (
                    <img 
                      src={item.product.imageUrl.startsWith('http') 
                        ? item.product.imageUrl 
                        : `http://localhost:4000${item.product.imageUrl}`}
                      alt={item.product.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '10px'
                      }}
                    />
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 6px 0', color: '#2c3e50', fontSize: '18px' }}>
                      {item.product.name}
                    </h3>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#666' }}>
                      {item.product.category}
                    </p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#27ae60' }}>
                      {item.product.price} Kč
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      style={{
                        padding: '6px 10px',
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      -
                    </button>
                    
                    <span style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      minWidth: '28px',
                      textAlign: 'center'
                    }}>
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      style={{
                        padding: '6px 10px',
                        background: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveFromCart(item.product.id)}
                    style={{
                      padding: '8px 14px',
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}
                  >
                    🗑️ Odebrat
                  </button>
                </div>
              ))}
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '16px',
              boxShadow: '0 8px 28px rgba(0,0,0,0.12)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '2px solid #f0f0f0'
              }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
                  Celková cena:
                </h2>
                <p style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: '#27ae60' }}>
                  {total} Kč
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleClearCart}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 3px 12px rgba(231, 76, 60, 0.35)'
                  }}
                >
                  🗑️ Vyprázdnit košík
                </button>
                
                <button
                  onClick={() => navigate('/checkout')}
                  style={{
                    flex: 2,
                    padding: '12px',
                    background: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 3px 12px rgba(39, 174, 96, 0.35)'
                  }}
                >
                  ✅ Pokračovat k objednávce
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}