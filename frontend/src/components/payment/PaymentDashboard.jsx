import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Button
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { fetchPaymentStatistics } from '../../services/paymentService';

const PaymentDashboard = () => {
  const { t } = useTranslation();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await fetchPaymentStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Statistika yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const chartData = {
    labels: statistics?.daily_statistics.map(stat => stat.date).reverse(),
    datasets: [
      {
        label: t('payments.daily_amount'),
        data: statistics?.daily_statistics.map(stat => stat.total).reverse(),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {t('payments.dashboard')}
      </Typography>

      <Grid container spacing={3}>
        {/* Umumiy statistika */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('payments.total_payments')}
              </Typography>
              <Typography variant="h5">
                {statistics?.total_statistics.total_payments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('payments.total_amount')}
              </Typography>
              <Typography variant="h5">
                {statistics?.total_statistics.total_amount.toLocaleString()} {t('common.currency')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('payments.successful_payments')}
              </Typography>
              <Typography variant="h5" style={{ color: 'green' }}>
                {statistics?.total_statistics.successful_payments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('payments.failed_payments')}
              </Typography>
              <Typography variant="h5" style={{ color: 'red' }}>
                {statistics?.total_statistics.failed_payments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* To'lovlar grafigi */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('payments.daily_statistics')}
              </Typography>
              <Box height={300}>
                <Line data={chartData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* To'lov turlari */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('payments.payment_types')}
              </Typography>
              <Grid container spacing={2}>
                {statistics?.payment_types.map((type) => (
                  <Grid item xs={12} sm={6} md={3} key={type.payment_type}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1">
                          {t(`payments.types.${type.payment_type}`)}
                        </Typography>
                        <Typography variant="h6">
                          {type.total.toLocaleString()} {t('common.currency')}
                        </Typography>
                        <Typography color="textSecondary">
                          {t('payments.count')}: {type.count}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={loadStatistics}
        >
          {t('common.refresh')}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentDashboard; 