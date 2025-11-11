import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import StarRating from './StarRating';

interface Props {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void; // Přidání quantity jako parametru
}

export default function ProductCard({ product, onAddToCart }: Props) {
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    const quantity = 1; // Nebo jiná logika pro určení množství
    onAddToCart(product, quantity); // Použití onAddToCart místo addToCart
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '15px',
      background: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column'
    }}
    onClick={() => navigate(`/product/${product.id}`)}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}>
      {product.imageUrl ? (
        <img 
          src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:4000${product.imageUrl}`}
          alt={product.name}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '12px'
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '200px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
          fontSize: '64px'
        }}>
          📦
        </div>
      )}

      <div style={{
        display: 'inline-block',
        padding: '4px 12px',
        background: '#e3f2fd',
        color: '#1976d2',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '8px',
        alignSelf: 'flex-start'
      }}>
        {product.category}
      </div>

      <h3 style={{ 
        margin: '0 0 8px 0',
        fontSize: '18px',
        color: '#2c3e50',
        minHeight: '44px'
      }}>
        {product.name}
      </h3>

      {/* Hodnocení */}
      {product.reviewCount !== undefined && product.reviewCount > 0 && (
        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StarRating rating={product.averageRating || 0} size={18} showNumber />
          <span style={{ fontSize: '13px', color: '#999' }}>
            ({product.reviewCount} {product.reviewCount === 1 ? 'hodnocení' : 'hodnocení'})
          </span>
        </div>
      )}

      {product.description && (
        <p style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          color: '#666',
          lineHeight: '1.4',
          minHeight: '40px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.description}
        </p>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto'
      }}>
        <div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#27ae60'
          }}>
            {product.price} Kč
          </div>
          <div style={{
            fontSize: '13px',
            color: product.stock > 10 ? '#27ae60' : product.stock > 0 ? '#f39c12' : '#e74c3c',
            fontWeight: 'bold',
            marginTop: '4px'
          }}>
            {product.stock > 0 ? `✓ Skladem: ${product.stock}` : '✗ Není skladem'}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(); // Použití handleAddToCart
          }}
          disabled={product.stock === 0}
          style={{
            padding: '12px 24px',
            background: product.stock > 0 ? '#3498db' : '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            if (product.stock > 0) {
              e.currentTarget.style.background = '#2980b9';
            }
          }}
          onMouseLeave={(e) => {
            if (product.stock > 0) {
              e.currentTarget.style.background = '#3498db';
            }
          }}
        >
          🛒 Do košíku
        </button>
      </div>
    </div>
  );
}