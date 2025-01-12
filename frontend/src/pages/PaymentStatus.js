import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button
} from '@mui/material';
import { checkPaymentStatus } from '../services/payme';

const PaymentStatus = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const transactionId = params.get('transaction_id');

    const checkStatus = async () => {
      try {
        const result = await checkPaymentStatus(transactionId);
        setStatus(result.status);
      } catch (error) {
        setError(error.message);
        setStatus('error');
      }
    };

    if (transactionId) {
      checkStatus();
    } else {
      setError('Transaction ID not found');
      setStatus('error');
    }
  }, [location]);

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'success.main';
      case 'error':
        return 'error.main';
      case 'checking':
        return 'info.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            {t('payment.status.title')}
          </Typography>

          <Box display="flex" flexDirection="column" alignItems="center" my={4}>
            {status === 'checking' ? (
              <CircularProgress />
            ) : (
              <>
                <Typography
                  variant="h6"
                  color={getStatusColor()}
                  gutterBottom
                >
                  {t(`payment.status.${status}`)}
                </Typography>
                
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
              </>
            )}
          </Box>

          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/orders')}
            >
              {t('common.backToOrders')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentStatus; 