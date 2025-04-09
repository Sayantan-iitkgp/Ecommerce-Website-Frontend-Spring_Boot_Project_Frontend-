import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const Home = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        elevation={3}
        sx={{
          py: 8,
          px: 4,
          backgroundColor: '#ffffff',
          color: '#000000',
          textAlign: 'center',
          mb: 4
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Our E-Commerce Store
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Discover amazing products at great prices
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                backgroundColor: '#ffffff',
                color: '#000000',
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Wide Selection
              </Typography>
              <Typography color="text.secondary">
                Browse through our extensive collection of products
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                backgroundColor: '#ffffff',
                color: '#000000',
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Secure Shopping
              </Typography>
              <Typography color="text.secondary">
                Shop with confidence using our secure payment system
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                backgroundColor: '#ffffff',
                color: '#000000',
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Fast Delivery
              </Typography>
              <Typography color="text.secondary">
                Get your orders delivered quickly and efficiently
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* About Section */}
      <Paper 
        elevation={3}
        sx={{
          py: 8,
          px: 4,
          backgroundColor: '#ffffff',
          color: '#000000',
          mb: 4
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom align="center">
            About Us
          </Typography>
          <Typography variant="body1" paragraph align="center">
            We are dedicated to providing the best shopping experience for our customers.
            Our mission is to offer high-quality products at competitive prices while
            ensuring excellent customer service.
          </Typography>
        </Container>
      </Paper>

      {/* Call to Action */}
      <Paper 
        elevation={3}
        sx={{
          py: 8,
          px: 4,
          backgroundColor: '#ffffff',
          color: '#000000',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Shopping?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            View Products
          </Button>
        </Container>
      </Paper>
    </Box>
  );
};

export default Home; 