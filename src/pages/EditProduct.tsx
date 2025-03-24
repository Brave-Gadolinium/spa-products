import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { fetchProducts, toggleLike, deleteProduct, setCurrentPage, setSearchQuery } from '../features/productsSlice';
import { TextField, Box, Typography, CircularProgress } from '@mui/material';
import { RootState } from '../store';
import { Search } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import ReactPaginate from 'react-paginate';
import { Grid } from '@mui/material'; // Используем старый Grid


const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, currentPage, itemsPerPage, searchQuery, error } = useSelector(
    (state: RootState) => state.products
  );
  const [filteredItems, setFilteredItems] = useState(items);
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    const isAlreadyLoaded = localStorage.getItem('isAlreadyLoaded');
    if (!isAlreadyLoaded) {
      const timer = setTimeout(() => {
        dispatch(fetchProducts());
        localStorage.setItem('isAlreadyLoaded', 'true');
        setIsLoading(false);
      }, 9000);

      return () => clearTimeout(timer);
    } else {
      dispatch(fetchProducts());
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
    dispatch(setCurrentPage(1));
  }, [items, searchQuery]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Loading...
        </Typography>
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }
  if (error) return <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>;

  const offset = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(offset, offset + itemsPerPage);
    
  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h1" align="center" gutterBottom>
        Products
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <Search sx={{ marginRight: '0.5rem' }} />
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          variant="outlined"
          size="small"
        />
      </Box>
      <Grid container spacing={4}>
        {paginatedItems.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard
              product={product}
              onLike={() => dispatch(toggleLike(product.id))}
              onDelete={() => dispatch(deleteProduct(product.id))}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <ReactPaginate
          pageCount={Math.ceil(filteredItems.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={({ selected }) => dispatch(setCurrentPage(selected + 1))}
          containerClassName="pagination"
          activeClassName="active-page"
          previousLabel="Previous"
          nextLabel="Next"
          breakLabel="..."
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          nextClassName="page-item"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
        />
      </Box>
    </Box>
  );
};

export default ProductsPage;