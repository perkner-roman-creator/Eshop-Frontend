import { useState } from 'react';
import type { CartItem } from '../types';

interface CheckoutFormProps {
  cart: CartItem[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CheckoutForm({ cart, onSuccess, onCancel }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalPrice: total
      };

      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        alert('✅ Objednávka byla úspěšně vytvořena!');
        onSuccess();
      } else {
        alert('❌ Chyba při vytváření objednávky');
      }
    } catch (error) {
      console.error('Chyba:', error);
      alert('❌ Chyba při odesílání objednávky');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 10px 50px rgba(0,0,0,0.15)'
    }}>
      <h2 style={{ fontSize: '26px', marginBottom: '25px', color: '#2c3e50', fontWeight: 'bold' }}>
        Dokončení objednávky
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#2c3e50' }}>
            Jméno a příjmení *
          </label>
          <input
            type="text"
            required
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#2c3e50' }}>
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#2c3e50' }}>
            Telefon
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '25px'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#2c3e50' }}>
            Souhrn objednávky
          </h3>
          {cart.map(item => (
            <div key={item.product.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              fontSize: '14px'
            }}>
              <span>{item.product.name} × {item.quantity}</span>
              <strong>{item.product.price * item.quantity} Kč</strong>
            </div>
          ))}
          <div style={{
            borderTop: '2px solid #dee2e6',
            marginTop: '15px',
            paddingTop: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#27ae60'
          }}>
            <span>Celkem:</span>
            <span>{total} Kč</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              background: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 'bold'
            }}
          >
            Zrušit
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              background: loading ? '#95a5a6' : '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: 'bold',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(39, 174, 96, 0.4)'
            }}
          >
            {loading ? '⏳ Odesílání...' : '✓ Odeslat objednávku'}
          </button>
        </div>
      </form>
    </div>
  );
}