import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  title: string;
  backTo?: string;
  backLabel?: string;
  right?: ReactNode;
};

export default function Header({ title, backTo = '/', backLabel = '← Zpět do obchodu', right }: Props) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        background: 'white',
        height: 64,
        padding: '0 24px',
        boxShadow: '0 3px 16px rgba(0,0,0,0.12)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🛒</span>
          <h1 style={{ fontSize: 20, margin: 0, color: '#2c3e50', fontWeight: 700 }}>{title}</h1>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => navigate(backTo)}
            style={{
              padding: '8px 16px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              boxShadow: '0 3px 12px rgba(52,152,219,0.35)',
              cursor: 'pointer',
            }}
          >
            {backLabel}
          </button>
          {right}
        </div>
      </div>
    </header>
  );
}
