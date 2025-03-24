import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { fetchProducts, toggleLike, deleteProduct, setCurrentPage, setSearchQuery, setFilter } from '../features/productsSlice';
import { RootState } from '../store';
import ProductCard from '../components/ProductCard';
import ReactPaginate from 'react-paginate';
import {
    TextField,
    Box,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
    Button,
    InputLabel,
} from '@mui/material';
import { Search } from '@mui/icons-material';

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, currentPage, itemsPerPage, searchQuery, loading, error, filter } = useSelector(
    (state: RootState) => state.products
  );
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    let filtered = items;

    // Применяем фильтр "Все", "Избранные", "Удаленные"
    if (filter === 'liked') {
      filtered = filtered.filter((item) => item.liked);
    }

    // Применяем поиск
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredItems(filtered);
    dispatch(setCurrentPage(1));
  }, [items, searchQuery, filter]);

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>;

  const offset = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(offset, offset + itemsPerPage);

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h1" align="center" gutterBottom>
        Products
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.href = '/create-product'}
        >
          Add Product
        </Button>
      </Box>
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
      <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
        <InputLabel>Filter</InputLabel>
        <Select
          value={filter}
          label="Filter"
          onChange={(e) => dispatch(setFilter(e.target.value as 'all' | 'liked' | 'deleted'))}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="liked">Liked</MenuItem>
          <MenuItem value="deleted">Deleted</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={4}>
        {paginatedItems.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
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