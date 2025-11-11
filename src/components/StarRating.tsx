interface Props {
  rating: number;
  size?: number;
  showNumber?: boolean;
}

export default function StarRating({ rating, size = 16, showNumber = false }: Props) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} style={{ color: '#ffc107', fontSize: `${size}px` }}>★</span>
      ))}
      {hasHalfStar && (
        <span style={{ color: '#ffc107', fontSize: `${size}px` }}>★</span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} style={{ color: '#ddd', fontSize: `${size}px` }}>★</span>
      ))}
      {showNumber && (
        <span style={{ marginLeft: '4px', fontSize: '14px', color: '#666', fontWeight: 'bold' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}