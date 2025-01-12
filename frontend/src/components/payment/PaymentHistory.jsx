import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { fetchPaymentHistory } from '../../services/paymentService';

const PaymentHistory = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    try {
      const data = await fetchPaymentHistory();
      setPayments(data);
    } catch (error) {
      setError(t('payments.messages.payment_error'));
      console.error('To\'lovlar tarixini yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      case 'refunded':
        return 'secondary';
      default:
        return 'default';
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
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {t('payments.history')}
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('payments.id')}</TableCell>
                <TableCell>{t('payments.form.payment_type')}</TableCell>
                <TableCell align="right">{t('payments.form.amount')}</TableCell>
                <TableCell>{t('payments.status')}</TableCell>
                <TableCell>{t('payments.transaction_id')}</TableCell>
                <TableCell>{t('payments.date')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>
                    {t(`payments.types.${payment.payment_type}`)}
                  </TableCell>
                  <TableCell align="right">
                    {payment.amount.toLocaleString()} {t('common.currency')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`payments.status.${payment.status}`)}
                      color={getStatusColor(payment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{payment.transaction_id || '-'}</TableCell>
                  <TableCell>
                    {new Date(payment.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {payments.length === 0 && (
          <Box p={3} textAlign="center">
            <Typography color="textSecondary">
              {t('payments.no_payments')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory; 