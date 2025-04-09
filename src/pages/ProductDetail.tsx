import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar
} from '@mui/material';
import { ShoppingCart, Edit, Delete, ShoppingBasket } from '@mui/icons-material';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: number;
  category: string;
  releaseDate: string;
  productAvailable: boolean;
  stockQuantity: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState<Partial<Product>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: ''
  });

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view product details');
        return;
      }

      const response = await axios.get(`http://localhost:8080/api/product/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProduct(response.data);
      setUpdateForm(response.data);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      setError(error.response?.data?.message || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchImage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/product/${id}/image`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.error('Error fetching image:', error);
      setImageUrl('/placeholder-image.png');
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchImage();
    }
  }, [id]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleUpdateClick = () => {
    setUpdateDialogOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateDialogOpen(false);
  };

  const handleUpdateSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to update product');
        return;
      }

      const formData = new FormData();
      
      // Format the date to yyyy-MM-dd
      const formattedDate = updateForm.releaseDate ? new Date(updateForm.releaseDate).toISOString().split('T')[0] : '';
      
      // Create a product object with all the fields
      const productData = {
        id: parseInt(id || '0'),
        name: updateForm.name || '',
        description: updateForm.description || '',
        brand: updateForm.brand || '',
        price: parseFloat(updateForm.price?.toString() || '0'),
        category: updateForm.category || '',
        releaseDate: formattedDate,
        productAvailable: updateForm.productAvailable || false,
        stockQuantity: parseInt(updateForm.stockQuantity?.toString() || '0')
      };

      // Append the product object as a JSON string
      formData.append('product', new Blob([JSON.stringify(productData)], {
        type: 'application/json'
      }));

      // Append the image file if exists
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const response = await axios.put(`http://localhost:8080/api/product/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setUpdateDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Product updated successfully!'
        });
        // Redirect to All Products page after a short delay
        setTimeout(() => {
          navigate('/products');
        }, 1500);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Failed to update product');
      } else {
        setError('An unexpected error occurred');
      }
      setSnackbar({
        open: true,
        message: 'Failed to update product. Please try again.'
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to delete product');
          return;
        }

        const response = await axios.delete(`http://localhost:8080/api/product/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          navigate('/products');
        }
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.message || 'Failed to delete product');
        } else {
          setError('An unexpected error occurred');
        }
      }
    }
  };

  const handleAddToCart = () => {
    setSnackbar({
      open: true,
      message: 'Product added to cart successfully!'
    });
  };

  const handleBuy = () => {
    setSnackbar({
      open: true,
      message: 'Thank you for your purchase!'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="400"
              image={imageUrl || '/placeholder-image.png'}
              alt={product.name}
              sx={{ 
                objectFit: 'contain',
                p: 2,
                backgroundColor: '#f5f5f5'
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ${product.price}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Brand: {product.brand}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Category: {product.category}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Release Date: {new Date(product.releaseDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status: {product.productAvailable ? 'Available' : 'Not Available'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Stock: {product.stockQuantity} units
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ShoppingBasket />}
                  onClick={handleBuy}
                >
                  Buy Now
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<Edit />}
                  onClick={handleUpdateClick}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Update Product Dialog */}
      <Dialog open={updateDialogOpen} onClose={handleUpdateClose} maxWidth="md" fullWidth>
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={updateForm.name || ''}
              onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={updateForm.description || ''}
              onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Brand"
              value={updateForm.brand || ''}
              onChange={(e) => setUpdateForm({ ...updateForm, brand: e.target.value })}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={updateForm.price || ''}
              onChange={(e) => setUpdateForm({ ...updateForm, price: parseFloat(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Category"
              value={updateForm.category || ''}
              onChange={(e) => setUpdateForm({ ...updateForm, category: e.target.value })}
              fullWidth
            />
            <TextField
              label="Release Date"
              type="date"
              value={updateForm.releaseDate || ''}
              onChange={(e) => setUpdateForm({ ...updateForm, releaseDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={updateForm.productAvailable || false}
                  onChange={(e) => setUpdateForm({ ...updateForm, productAvailable: e.target.checked })}
                />
              }
              label="Product Available"
            />
            <TextField
              label="Stock Quantity"
              type="number"
              value={updateForm.stockQuantity || ''}
              onChange={(e) => setUpdateForm({ ...updateForm, stockQuantity: parseInt(e.target.value) })}
              fullWidth
            />
            <TextField
              type="file"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  setImageFile(file);
                }
              }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose}>Cancel</Button>
          <Button onClick={handleUpdateSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Container>
  );
};

export default ProductDetail; 