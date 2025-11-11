import { useState, useEffect } from 'react';
import type { Order, OrderItem } from '../types/index';

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Chyba při načítání objednávek:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', fontSize: '24px' }}>
        ⏳ Načítám objednávky...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>📜 Historie objednávek ({orders.length})</h2>
        </div>

        {orders.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '60px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
            <h3 style={{ color: '#666' }}>Zatím žádné objednávky</h3>
          </div>
        ) : (
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#34495e', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Zákazník</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Telefon</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Datum</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>Cena</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Akce</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>#{order.id}</td>
                    <td style={{ padding: '15px' }}>{order.customerName}</td>
                    <td style={{ padding: '15px', color: '#3498db' }}>{order.email}</td>
                    <td style={{ padding: '15px' }}>{order.phone || '-'}</td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', color: '#27ae60' }}>
                      {order.totalPrice} Kč
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={{
                          padding: '8px 16px',
                          background: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        👁️ Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal s detailem objednávky */}
        {selectedOrder && (
          <div
            onClick={() => setSelectedOrder(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                maxWidth: '800px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>📦 Objednávka #{selectedOrder.id}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✖ Zavřít
                </button>
              </div>

              <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0 }}>👤 Informace o zákazníkovi</h3>
                <p><strong>Jméno:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.email}</p>
                <p><strong>Telefon:</strong> {selectedOrder.phone || '-'}</p>
                <p><strong>Datum objednávky:</strong> {formatDate(selectedOrder.createdAt)}</p>
              </div>

              <h3>🛒 Objednané položky</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Produkt</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Množství</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Cena/ks</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Celkem</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item: OrderItem) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{item.product.name}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{item.quantity}x</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{item.price} Kč</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                        {item.price * item.quantity} Kč
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{
                textAlign: 'right',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#27ae60',
                padding: '20px',
                background: '#f0f9f4',
                borderRadius: '8px'
              }}>
                Celková cena: {selectedOrder.totalPrice} Kč
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}