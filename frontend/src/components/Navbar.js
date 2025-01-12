import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Link
} from '@mui/material';

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link component={RouterLink} to="/" color="inherit" underline="none">
            Food Delivery
          </Link>
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/restaurants">
            {t('restaurant.menu')}
          </Button>
          <Button color="inherit" component={RouterLink} to="/cart">
            {t('cart.title')}
          </Button>
          <Button color="inherit" component={RouterLink} to="/login">
            {t('auth.login')}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 