import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import LanguageSwitcher from '../components/LanguageSwitcher';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <LanguageSwitcher />
      </Box>
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout; 