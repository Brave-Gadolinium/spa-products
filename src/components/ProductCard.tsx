import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: any;
  onLike: () => void;
  onDelete: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onLike, onDelete }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '200px' }}>
      <img src={product.image} alt={product.name} style={{ width: '100%' }} />
      <h3>{product.name}</h3>
      <p>{truncateText(product.description, 50)}</p>
      <button onClick={onLike} style={{ color: product.liked ? 'red' : 'black' }}>
        Like
      </button>
      <button onClick={onDelete}>Delete</button>
      <Link to={`/products/${product.id}`}>View Details</Link>
    </div>
  );
};

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export default ProductCard;