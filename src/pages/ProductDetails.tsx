import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { motion } from 'framer-motion';
import { Typography, Button, Card, CardMedia, CardContent } from '@mui/material';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = useSelector((state: RootState) =>
    state.products.items.find((p) => p.id === id)
  );

  if (!product) return <Typography variant="h6">Product not found</Typography>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
        <CardMedia component="img" height="300" image={product.image} alt={product.name} />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1">{product.description}</Typography>
        </CardContent>
        <Button variant="contained" color="primary" onClick={() => window.history.back()}>
          Back
        </Button>
      </Card>
    </motion.div>
  );
};

export default ProductDetailsPage;