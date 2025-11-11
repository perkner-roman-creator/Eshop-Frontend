import type { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
}

export default function Cart({ cart, onUpdateQuantity, onRemove, onCheckout }: CartProps) {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div style={{
        background: 'white',
        padding: '60px 40px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 10px 50px rgba(0,0,0,0.15)'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</div>
        <h2 style={{ fontSize: '28px', marginBottom: '12px', color: '#2c3e50' }}>
          Košík je prázdný
        </h2>
        <p style={{ fontSize: '17px', color: '#7f8c8d', marginBottom: '25px' }}>
          Přidejte nějaké produkty do košíku
        </p>
        <a href="/" style={{
          display: 'inline-block',
          padding: '14px 32px',
          background: '#3498db',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '12px',
          fontSize: '17px',
          fontWeight: 'bold',
          boxShadow: '0 6px 20px rgba(52, 152, 219, 0.4)'
        }}>
          🏠 Zpět do obchodu
        </a>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 10px 50px rgba(0,0,0,0.15)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
        {cart.map(item => (
          <div key={item.product.id} style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr auto',
            gap: '20px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '12px',
            alignItems: 'center'
          }}>
            <img
              src={item.product.imageUrl?.startsWith('http') 
                ? item.product.imageUrl 
                : `http://localhost:4000${item.product.imageUrl}`
              }
              alt={item.product.name}
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '10px'
              }}
            />

            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#2c3e50' }}>
                {item.product.name}
              </h3>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#27ae60', marginBottom: '12px' }}>
                {item.product.price} Kč
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: '#ecf0f1',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#2c3e50'
                  }}
                >
                  −
                </button>

                <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '32px', textAlign: 'center' }}>
                  {item.quantity}
                </span>

                <button
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: '#ecf0f1',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#2c3e50'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '12px' }}>
                {item.product.price * item.quantity} Kč
              </div>
              <button
                onClick={() => onRemove(item.product.id)}
                style={{
                  padding: '10px 20px',
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                🗑️ Odebrat
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        borderTop: '2px solid #ecf0f1',
        paddingTop: '25px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '17px', color: '#7f8c8d', marginBottom: '8px' }}>
            Celková cena:
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#27ae60' }}>
            {total} Kč
          </div>
        </div>

        <button
          onClick={onCheckout}
          style={{
            padding: '16px 40px',
            background: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '19px',
            fontWeight: 'bold',
            boxShadow: '0 6px 20px rgba(39, 174, 96, 0.4)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          ✓ Dokončit objednávku
        </button>
      </div>
    </div>
  );
}