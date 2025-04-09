import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Box } from '@mui/material';

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout; 