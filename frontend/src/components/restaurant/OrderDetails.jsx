import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid
} from '@mui/material';
import {
  Phone,
  LocationOn,
  AccessTime,
  Receipt
} from '@mui/icons-material';
import './OrderDetails.css';

const OrderDetails = ({ order, onStatusUpdate }) => {
  const { t } = useTranslation();

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'delivered',
      delivered: 'completed'
    };
    return statusFlow[currentStatus];
  };

  const formatAddress = (address) => {
    return `${address.street}, ${address.building}${address.apartment ? `, ${t('orders.apartment')} ${address.apartment}` : ''}`;
  };

  const calculateTotal = () => {
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = order.deliveryFee || 0;
    return {
      subtotal,
      delivery,
      total: subtotal + delivery
    };
  };

  const totals = calculateTotal();

  return (
    <Paper elevation={3} className="order-details">
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {t('orders.orderNumber', { number: order.orderNumber })}
          </Typography>
          <Chip
            label={t(`orders.status.${order.status}`)}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Grid container spacing={2} className="order-info">
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <Phone color="action" />
              <Typography variant="body1" ml={1}>
                {order.customer.phone}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOn color="action" />
              <Typography variant="body1" ml={1}>
                {formatAddress(order.deliveryAddress)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTime color="action" />
              <Typography variant="body1" ml={1}>
                {new Date(order.createdAt).toLocaleTimeString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          {t('orders.items')}
        </Typography>

        <List>
          {order.items.map((item, index) => (
            <ListItem key={index} disableGutters>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {item.quantity}x {item.name}
                  </Typography>
                }
                secondary={item.notes}
              />
              <Typography variant="body1">
                {t('currency', { value: item.price * item.quantity })}
              </Typography>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box className="order-summary">
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1">{t('orders.subtotal')}</Typography>
            <Typography variant="body1">
              {t('currency', { value: totals.subtotal })}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1">{t('orders.deliveryFee')}</Typography>
            <Typography variant="body1">
              {t('currency', { value: totals.delivery })}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {t('orders.total')}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {t('currency', { value: totals.total })}
            </Typography>
          </Box>
        </Box>

        {order.notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box className="order-notes">
              <Typography variant="subtitle2" gutterBottom>
                {t('orders.notes')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {order.notes}
              </Typography>
            </Box>
          </>
        )}

        {['pending', 'confirmed', 'preparing', 'ready', 'delivered'].includes(order.status) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="error"
                onClick={() => onStatusUpdate(order.id, 'cancelled')}
              >
                {t('orders.cancel')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onStatusUpdate(order.id, getNextStatus(order.status))}
              >
                {t(`orders.actions.${getNextStatus(order.status)}`)}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default OrderDetails; 