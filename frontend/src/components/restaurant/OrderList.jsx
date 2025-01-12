import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Chip,
  IconButton,
  Box,
  Paper
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { formatDistance } from 'date-fns';
import { uz } from 'date-fns/locale';
import './OrderList.css';

const OrderList = ({ orders, selectedOrder, onOrderSelect }) => {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'preparing':
        return 'primary';
      case 'ready':
        return 'secondary';
      case 'delivered':
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatOrderTime = (date) => {
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
      locale: uz
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (!orders.length) {
    return (
      <Paper elevation={0} className="empty-orders">
        <Typography variant="body1" color="textSecondary" align="center">
          {t('orders.noOrders')}
        </Typography>
      </Paper>
    );
  }

  return (
    <List className="order-list">
      {orders.map((order) => (
        <ListItem
          key={order.id}
          button
          selected={selectedOrder?.id === order.id}
          onClick={() => onOrderSelect(order)}
          className="order-list-item"
        >
          <ListItemText
            primary={
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">
                  #{order.orderNumber}
                </Typography>
                <Chip
                  label={t(`orders.status.${order.status}`)}
                  color={getStatusColor(order.status)}
                  size="small"
                />
              </Box>
            }
            secondary={
              <Box>
                <Typography variant="body2" color="textSecondary">
                  {formatOrderTime(order.createdAt)}
                </Typography>
                <Typography variant="body2">
                  {order.items.length} {t('orders.items')} • {t('currency', { value: calculateTotal(order.items) })}
                </Typography>
              </Box>
            }
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              onClick={() => onOrderSelect(order)}
              color={selectedOrder?.id === order.id ? 'primary' : 'default'}
            >
              <Info />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default OrderList; 