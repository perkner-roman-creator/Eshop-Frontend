import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product, Review } from '../types/index';
import StarRating from '../components/StarRating';
import AddReviewModal from '../components/AddReviewModal';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error('Chyba při načítání produktu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item: any) => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ product, quantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('✅ Produkt přidán do košíku!');
    }
  };

  const handleReviewAdded = () => {
    setShowReviewModal(false);
    fetchProduct();
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0
      }}>
        <div style={{ 
          background: 'white',
          padding: '30px 50px',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ margin: 0, fontSize: '22px', color: '#2c3e50' }}>⏳ Načítání...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0
      }}>
        <div style={{ 
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>😔</div>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '22px', color: '#2c3e50' }}>
            Produkt nenalezen
          </h2>
          <button onClick={() => navigate('/')} style={{
            padding: '12px 28px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            ← Zpět na hlavní stránku
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 0,
      margin: 0,
      width: '100%'
    }}>
      {/* Header */}
      <header style={{ 
        background: 'white',
        padding: '20px 40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          maxWidth: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button onClick={() => navigate('/')} style={{
            padding: '10px 20px',
            background: '#ecf0f1',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            color: '#2c3e50',
            transition: 'all 0.3s'
          }}>
            ← Zpět do obchodu
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '36px' }}>🛒</span>
            <h1 style={{ fontSize: '32px', margin: 0, color: '#2c3e50', fontWeight: 'bold' }}>
              E-shop
            </h1>
          </div>
        </div>
      </header>

      {/* Obsah produktu */}
      <main style={{ 
        padding: '40px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 50px rgba(0,0,0,0.15)',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginBottom: '50px' }}>
            {/* Obrázek */}
            <div>
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:4000${product.imageUrl}`}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '500px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '120px'
                }}>
                  📦
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div style={{
                display: 'inline-block',
                padding: '6px 16px',
                background: '#e3f2fd',
                color: '#1976d2',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}>
                {product.category}
              </div>

              <h1 style={{ margin: '0 0 15px 0', fontSize: '32px', color: '#2c3e50', fontWeight: 'bold', lineHeight: '1.2' }}>
                {product.name}
              </h1>

              {product.reviewCount !== undefined && product.reviewCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <StarRating rating={product.averageRating || 0} size={22} showNumber />
                  <span style={{ fontSize: '15px', color: '#7f8c8d' }}>
                    ({product.reviewCount} {product.reviewCount === 1 ? 'hodnocení' : 'hodnocení'})
                  </span>
                </div>
              )}

              <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6', marginBottom: '25px' }}>
                {product.description}
              </p>

              <div style={{
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#27ae60',
                marginBottom: '20px'
              }}>
                {product.price} Kč
              </div>

              <div style={{
                fontSize: '15px',
                color: product.stock > 10 ? '#27ae60' : product.stock > 0 ? '#f39c12' : '#e74c3c',
                fontWeight: 'bold',
                marginBottom: '30px',
                padding: '10px 18px',
                background: product.stock > 10 ? '#d4edda' : product.stock > 0 ? '#fff3cd' : '#f8d7da',
                borderRadius: '10px',
                display: 'inline-block'
              }}>
                {product.stock > 0 ? `✓ Skladem: ${product.stock} ks` : '✗ Není skladem'}
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  style={{
                    flex: 1,
                    padding: '16px 32px',
                    background: product.stock > 0 ? '#3498db' : '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                    fontSize: '17px',
                    fontWeight: 'bold',
                    boxShadow: product.stock > 0 ? '0 6px 20px rgba(52, 152, 219, 0.4)' : 'none',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => product.stock > 0 && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  🛒 Přidat do košíku
                </button>

                <button
                  onClick={() => setShowReviewModal(true)}
                  style={{
                    padding: '16px 32px',
                    background: '#f39c12',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '17px',
                    fontWeight: 'bold',
                    boxShadow: '0 6px 20px rgba(243, 156, 18, 0.4)',
                    transition: 'transform 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  ⭐ Hodnotit
                </button>
              </div>
            </div>
          </div>

          {/* Recenze */}
          <div style={{ borderTop: '2px solid #ecf0f1', paddingTop: '40px' }}>
            <h2 style={{ fontSize: '26px', marginBottom: '25px', color: '#2c3e50', fontWeight: 'bold' }}>
              📝 Recenze ({product.reviews?.length || 0})
            </h2>

            {product.reviews && product.reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {product.reviews.map((review: Review) => (
                  <div key={review.id} style={{
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', color: '#2c3e50' }}>
                          {review.userName}
                        </div>
                        <StarRating rating={review.rating} size={16} />
                      </div>
                      <div style={{ fontSize: '14px', color: '#95a5a6' }}>
                        {new Date(review.createdAt).toLocaleDateString('cs-CZ')}
                      </div>
                    </div>
                    {review.comment && (
                      <p style={{ margin: 0, color: '#555', lineHeight: '1.6', fontSize: '15px' }}>
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px', background: '#f8f9fa', borderRadius: '16px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🌟</div>
                <p style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '25px' }}>
                  Zatím žádné recenze. Buďte první!
                </p>
                <button
                  onClick={() => setShowReviewModal(true)}
                  style={{
                    padding: '14px 32px',
                    background: '#f39c12',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '17px',
                    fontWeight: 'bold'
                  }}
                >
                  ⭐ Přidat první recenzi
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '30px',
        textAlign: 'center',
        color: 'white',
        fontSize: '16px',
        width: '100%',
        boxSizing: 'border-box',
        marginTop: '40px'
      }}>
        <p style={{ margin: 0, fontWeight: '500' }}>
          © 2025 E-shop - Váš oblíbený obchod 💙 | Vytvořeno s láskou ❤️
        </p>
      </footer>

      {showReviewModal && (
        <AddReviewModal
          productId={Number(product.id)}
          onClose={() => setShowReviewModal(false)}
          onReviewAdded={handleReviewAdded}
        />
      )}
    </div>
  );
}