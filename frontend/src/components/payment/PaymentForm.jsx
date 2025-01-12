import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  createPayment,
  initiatePaymePayment,
  initiateClickPayment
} from '../../services/paymentService';

const PAYMENT_TYPES = ['payme', 'click', 'cash', 'terminal'];

const PaymentForm = ({ orderId, amount, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [paymentType, setPaymentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (paymentType === 'payme') {
        const result = await initiatePaymePayment(amount, orderId);
        // Payme to'lov sahifasiga yo'naltirish
        window.location.href = result.payment_url;
      } else if (paymentType === 'click') {
        const result = await initiateClickPayment(amount, orderId);
        // Click to'lov sahifasiga yo'naltirish
        window.location.href = result.payment_url;
      } else {
        const paymentData = {
          order_id: orderId,
          amount,
          payment_type: paymentType
        };
        
        const result = await createPayment(paymentData);
        setSuccess(true);
        if (onSuccess) {
          onSuccess(result);
        }
      }
    } catch (error) {
      setError(t('payments.messages.payment_error'));
      console.error('To\'lov xatosi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (success) {
    return (
      <Box p={3}>
        <Alert severity="success">
          {t('payments.messages.payment_success')}
        </Alert>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {t('payments.form.title')}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <TextField
              fullWidth
              label={t('payments.form.amount')}
              value={amount.toLocaleString()}
              disabled
            />
          </Box>

          <Box mb={3}>
            <FormControl fullWidth>
              <InputLabel>{t('payments.form.payment_type')}</InputLabel>
              <Select
                value={paymentType}
                onChange={handlePaymentTypeChange}
                required
              >
                {PAYMENT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`payments.types.${type}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {error && (
            <Box mb={3}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
            >
              {t('payments.form.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !paymentType}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                t('payments.form.submit')
              )}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm; 