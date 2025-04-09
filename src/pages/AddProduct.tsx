import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ProductFormData {
  name: string;
  description: string;
  brand: string;
  price: string;
  category: string;
  releaseDate: string;
  productAvailable: boolean;
  stockQuantity: string;
  image: File | null;
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    brand: '',
    price: '',
    category: '',
    releaseDate: '',
    productAvailable: true,
    stockQuantity: '',
    image: null,
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'image/png') {
        setError('Please upload a PNG image');
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Create a product object with all the fields
      const productData = {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        price: parseFloat(formData.price),
        category: formData.category,
        releaseDate: formData.releaseDate,
        productAvailable: formData.productAvailable,
        stockQuantity: parseInt(formData.stockQuantity)
      };

      // Append the product object as a JSON string
      formDataToSend.append('product', new Blob([JSON.stringify(productData)], {
        type: 'application/json'
      }));

      // Append the image file with the correct field name
      if (formData.image) {
        formDataToSend.append('imagefile', formData.image);
      }

      await axios.post('http://localhost:8080/api/product', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/products');
    } catch (error: any) {
      console.error('Error adding product:', error);
      if (error.response?.status === 403) {
        setError('You are not authorized to add products. Please log in again.');
      } else {
        setError(error.response?.data?.message || 'Failed to add product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Add New Product
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />

            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ step: "0.01" }}
            />

            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Release Date"
              name="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Stock Quantity"
              name="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={handleChange}
              margin="normal"
              required
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.productAvailable}
                  onChange={handleChange}
                  name="productAvailable"
                />
              }
              label="Product Available"
              sx={{ mt: 2 }}
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <input
                accept="image/png"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  component="span"
                  color="primary"
                >
                  Upload Product Image (PNG)
                </Button>
              </label>
              {formData.image && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {formData.image.name}
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddProduct; 