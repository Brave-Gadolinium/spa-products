import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchProducts as fetchProductsApi } from '../api/productsApi';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  liked: boolean;
}

interface ProductsState {
  items: Product[];
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  filter: 'all' | 'liked' | 'deleted';
}

const initialState: ProductsState = {
  items: JSON.parse(localStorage.getItem('products') || '[]'),
  currentPage: 1,
  itemsPerPage: 6,
  searchQuery: '',
  loading: false,
  error: null,
  filter: 'all',
};

// Асинхронный thunk для загрузки продуктов
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  try {
    const products = await fetchProductsApi();
    return products;
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
      localStorage.setItem('products', JSON.stringify(state.items));
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const product = state.items.find((p) => p.id === action.payload);
      if (product) {
        product.liked = !product.liked;
        localStorage.setItem('products', JSON.stringify(state.items));
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      localStorage.setItem('products', JSON.stringify(state.items));
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilter: (state, action: PayloadAction<'all' | 'liked' | 'deleted'>) => {
        state.filter = action.payload;
    },
    updateProduct: (
      state,
      action: PayloadAction<{ id: string; name: string; description: string; image: string }>
    ) => {
      const { id, ...updates } = action.payload;
      const product = state.items.find((p) => p.id === id);
      if (product) {
        Object.assign(product, updates);
        localStorage.setItem('products', JSON.stringify(state.items));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        localStorage.setItem('products', JSON.stringify(state.items));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const {
  addProduct,
  toggleLike,
  deleteProduct,
  setCurrentPage,
  setSearchQuery,
  setFilter,
  updateProduct,
} = productsSlice.actions;

export default productsSlice.reducer;