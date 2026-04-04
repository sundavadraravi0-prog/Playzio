import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const ReviewStars = ({ rating, count, size = '0.9rem' }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} style={{ color: '#eab308', fontSize: size }} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} style={{ color: '#eab308', fontSize: size }} />);
    } else {
      stars.push(<FaRegStar key={i} style={{ color: '#d4d4d8', fontSize: size }} />);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      {stars}
      {count !== undefined && (
        <span style={{ fontSize: '0.8rem', color: '#71717a', marginLeft: '0.25rem' }}>
          ({count})
        </span>
      )}
    </div>
  );
};

export default ReviewStars;
