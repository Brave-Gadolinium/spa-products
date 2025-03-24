import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProductsPage from './pages/Products';
import ProductDetailsPage from './pages/ProductDetails';
import CreateProductPage from './pages/CreateProduct';
import EditProductPage from './pages/EditProduct';
import theme from './theme';
import './App.css';


function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
       <Router>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/create-product" element={<CreateProductPage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
        </Routes>
       </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;