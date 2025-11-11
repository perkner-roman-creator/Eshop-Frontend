import { useState } from 'react';

const quickTopics = [
  "Stav objednávky",
  "Naše produkty",
  "Zapomenuté heslo",
  "Otázky k registraci"
];

export default function CustomerSupportBot() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'bot', content: "Ahoj!\n\nJsem Eshop bot. Jsem tu pro vás 24/7 a pomohu vám najít odpovědi.\n\nZeptejte se jednoduše, nebo klikněte na jedno z témat níže." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const sendMessage = async (msg?: string) => {
    const question = msg || input;
    if (!question.trim()) return;
    setMessages([...messages, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setMessages(msgs => [...msgs, { role: 'bot', content: data.answer }]);
    } catch {
      setMessages(msgs => [...msgs, { role: 'bot', content: 'Chyba při komunikaci se serverem.' }]);
    }
    setInput('');
    setLoading(false);
  };

  if (minimized) {
    return (
      <div style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1000,
        cursor: 'pointer'
      }}>
        <button
          onClick={() => setMinimized(false)}
          style={{
            background: '#073b7a',
            color: '#fff',
            borderRadius: 24,
            border: 'none',
            padding: '12px 24px',
            fontWeight: 'bold',
            fontSize: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
          }}
        >
          💬 Zákaznická podpora
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      width: 350,
      maxWidth: '95vw',
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      zIndex: 1000,
      fontFamily: 'sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{
        background: '#073b7a',
        color: '#fff',
        padding: '16px 20px',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        fontWeight: 'bold',
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'space-between'
      }}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span style={{
            background: '#fff',
            color: '#073b7a',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 20
          }}>🛒</span>
          Zákaznická podpora
        </span>
        <button
          onClick={() => setMinimized(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: 22,
            cursor: 'pointer',
            marginLeft: 8
          }}
          title="Minimalizovat"
        >
          &minus;
        </button>
      </div>
      <div style={{
        padding: 20,
        minHeight: 220,
        maxHeight: 320,
        overflowY: 'auto',
        background: '#f7f9fb'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            margin: '12px 0',
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '10px 16px',
              borderRadius: 16,
              background: msg.role === 'user' ? '#073b7a' : '#e0e0e0',
              color: msg.role === 'user' ? '#fff' : '#333',
              maxWidth: '80%',
              whiteSpace: 'pre-line',
              fontSize: 16
            }}>
              {msg.content}
            </span>
          </div>
        ))}
        {messages.length === 1 && (
          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {quickTopics.map(topic => (
              <button
                key={topic}
                onClick={() => sendMessage(topic)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 20,
                  border: 'none',
                  background: '#fff',
                  color: '#073b7a',
                  fontWeight: 500,
                  fontSize: 15,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                  cursor: 'pointer'
                }}
              >
                {topic}
              </button>
            ))}
          </div>
        )}
        {loading && <div style={{ color: '#888', marginTop: 8 }}>Bot: ...odpovídá</div>}
      </div>
      <div style={{
        borderTop: '1px solid #e0e0e0',
        padding: 14,
        background: '#fff',
        display: 'flex',
        gap: 8
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          placeholder="Zadejte zprávu..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: '1px solid #e0e0e0',
            fontSize: 16,
            background: '#f7f9fb'
          }}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            border: 'none',
            background: '#073b7a',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          Odeslat
        </button>
      </div>
      <div style={{
        textAlign: 'center',
        fontSize: 12,
        color: '#aaa',
        padding: '6px 0',
        background: '#f7f9fb'
      }}>
        Powered by Eshop AI
      </div>
    </div>
  );
}