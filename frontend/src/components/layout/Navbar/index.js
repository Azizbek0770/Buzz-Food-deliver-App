import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Restaurant,
  Motorcycle,
  AdminPanelSettings
} from '@mui/icons-material';
import { logout } from '../../../redux/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items = [] } = useSelector((state) => state.cart);
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  const renderMobileMenu = () => (
    <Menu
      anchorEl={mobileMenuAnchor}
      open={Boolean(mobileMenuAnchor)}
      onClose={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
        },
      }}
    >
      <MenuItem component={RouterLink} to="/restaurants" onClick={handleClose}>
        <Restaurant sx={{ mr: 1 }} />
        {t('restaurants')}
      </MenuItem>
      
      {isAuthenticated ? (
        <>
          <MenuItem component={RouterLink} to="/cart" onClick={handleClose}>
            <Badge badgeContent={items.length} color="error">
              <ShoppingCart sx={{ mr: 1 }} />
            </Badge>
            {t('cart')}
          </MenuItem>

          <MenuItem component={RouterLink} to="/orders" onClick={handleClose}>
            <Restaurant sx={{ mr: 1 }} />
            {t('orders')}
          </MenuItem>

          {user?.role === 'admin' && (
            <MenuItem component={RouterLink} to="/admin" onClick={handleClose}>
              <AdminPanelSettings sx={{ mr: 1 }} />
              {t('admin')}
            </MenuItem>
          )}

          {user?.role === 'delivery' && (
            <MenuItem component={RouterLink} to="/delivery" onClick={handleClose}>
              <Motorcycle sx={{ mr: 1 }} />
              {t('delivery')}
            </MenuItem>
          )}

          <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
            <Person sx={{ mr: 1 }} />
            {t('profile')}
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <Person sx={{ mr: 1 }} />
            {t('logout')}
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem component={RouterLink} to="/login" onClick={handleClose}>
            <Person sx={{ mr: 1 }} />
            {t('login')}
          </MenuItem>
          <MenuItem component={RouterLink} to="/register" onClick={handleClose}>
            <Person sx={{ mr: 1 }} />
            {t('register')}
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar className="navbar-container">
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Restaurant sx={{ mr: 1 }} />
          Buzz
        </Typography>

        {isMobile ? (
          <IconButton
            color="inherit"
            onClick={handleMobileMenu}
            edge="end"
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box className="navbar-menu">
            <Button
              color="inherit"
              component={RouterLink}
              to="/restaurants"
              startIcon={<Restaurant />}
            >
              {t('restaurants')}
            </Button>

            {isAuthenticated ? (
              <>
                <IconButton
                  color="inherit"
                  component={RouterLink}
                  to="/cart"
                  className="cart-link"
                >
                  <Badge badgeContent={items.length} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  className="profile-button"
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user?.name?.charAt(0) || <Person />}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  className="profile-menu"
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                    {t('profile')}
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/orders" onClick={handleClose}>
                    {t('orders')}
                  </MenuItem>
                  {user?.role === 'admin' && (
                    <MenuItem component={RouterLink} to="/admin" onClick={handleClose}>
                      {t('admin')}
                    </MenuItem>
                  )}
                  {user?.role === 'delivery' && (
                    <MenuItem component={RouterLink} to="/delivery" onClick={handleClose}>
                      {t('delivery')}
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    {t('logout')}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  startIcon={<Person />}
                >
                  {t('login')}
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                  startIcon={<Person />}
                >
                  {t('register')}
                </Button>
              </>
            )}
          </Box>
        )}
        {renderMobileMenu()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 