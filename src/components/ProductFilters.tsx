import { useState, useEffect } from 'react';

interface Props {
  onFilterChange: (filters: any) => void;
  categories: string[];
}

export default function ProductFilters({ onFilterChange, categories }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    onFilterChange({ search, category, sortBy });
  }, [search, category, sortBy]);

  return (
    <div style={{ 
      marginBottom: '20px', 
      padding: '20px', 
      background: '#f5f5f5', 
      borderRadius: '8px',
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    }}>
      <input
        type="text"
        placeholder="🔍 Hledat produkty..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ 
          padding: '10px', 
          flex: '1',
          minWidth: '200px',
          border: '2px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      />

      <select 
        value={category} 
        onChange={(e) => setCategory(e.target.value)} 
        style={{ 
          padding: '10px',
          border: '2px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        <option value="">📦 Všechny kategorie</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)} 
        style={{ 
          padding: '10px',
          border: '2px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        <option value="">🔄 Řadit podle</option>
        <option value="price-asc">💰 Cena: Od nejnižší</option>
        <option value="price-desc">💎 Cena: Od nejvyšší</option>
        <option value="name">🔤 Název A-Z</option>
      </select>
    </div>
  );
}