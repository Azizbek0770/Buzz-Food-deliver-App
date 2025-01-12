import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import { fetchOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import './Orders.css';

const Orders = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.restaurantId) {
        await dispatch(fetchOrders(user.restaurantId));
      }
    };
    fetchData();
    
    // Real-time updates using WebSocket
    const ws = new WebSocket(process.env.REACT_APP_WS_URL);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ORDER_UPDATE' && data.restaurantId === user?.restaurantId) {
        fetchData();
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [dispatch, user?.restaurantId]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedOrder(null);
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status }));
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const filterOrders = () => {
    switch (selectedTab) {
      case 0: // New orders
        return orders.filter(order => ['pending', 'confirmed'].includes(order.status));
      case 1: // In progress
        return orders.filter(order => ['preparing', 'ready'].includes(order.status));
      case 2: // Completed
        return orders.filter(order => ['delivered', 'completed'].includes(order.status));
      default:
        return orders;
    }
  };

  return (
    <Box className="orders-container">
      <Paper elevation={3} className="orders-paper">
        <Typography variant="h5" gutterBottom>
          {t('orders.title')}
        </Typography>
        
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={t('orders.new')} />
          <Tab label={t('orders.inProgress')} />
          <Tab label={t('orders.completed')} />
        </Tabs>

        <Box display="flex" className="orders-content">
          <Box className="orders-list">
            <OrderList
              orders={filterOrders()}
              selectedOrder={selectedOrder}
              onOrderSelect={handleOrderSelect}
            />
          </Box>
          
          {selectedOrder && (
            <Box className="order-details">
              <OrderDetails
                order={selectedOrder}
                onStatusUpdate={handleStatusUpdate}
              />
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Orders; 