import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress
} from '@mui/material';
import { initiatePayment } from '../services/payme';

const PAYMENT_METHODS = [
  { id: 'payme', label: 'Payme' },
  { id: 'click', label: 'Click' },
  { id: 'cash', label: 'cash' }
];

const PaymentForm = ({ amount, orderId, onSuccess, onError }) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('payme');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      switch (paymentMethod) {
        case 'payme':
          const result = await initiatePayment(amount, orderId);
          window.location.href = result.payment_url;
          break;
          
        case 'click':
          // Click to'lov logikasi
          break;
          
        case 'cash':
          // Naqd to'lov logikasi
          onSuccess({ method: 'cash', status: 'pending' });
          break;
          
        default:
          throw new Error('Noto\'g\'ri to\'lov usuli');
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('payment.title')}
        </Typography>
        
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            {t('payment.amount')}: {amount.toLocaleString()} {t('common.currency')}
          </Typography>
        </Box>

        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          {PAYMENT_METHODS.map((method) => (
            <FormControlLabel
              key={method.id}
              value={method.id}
              control={<Radio />}
              label={t(`payment.${method.label}`)}
            />
          ))}
        </RadioGroup>

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('payment.pay')
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentForm; 