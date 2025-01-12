import axios from 'axios';

const PAYME_API_URL = process.env.REACT_APP_PAYME_API_URL;
const MERCHANT_ID = process.env.REACT_APP_PAYME_MERCHANT_ID;

const paymeAPI = axios.create({
  baseURL: PAYME_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const initiatePayment = async (amount, orderId) => {
  try {
    const response = await paymeAPI.post('/cards/create', {
      amount: amount * 100, // Convert to tiyin
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      callback_url: `${window.location.origin}/payment/verify`
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payme bilan to\'lov amalga oshirilmadi');
  }
};

export const checkPaymentStatus = async (transactionId) => {
  try {
    const response = await paymeAPI.post('/cards/check', {
      merchant_id: MERCHANT_ID,
      transaction_id: transactionId
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'To\'lov holatini tekshirib bo\'lmadi');
  }
};

export const cancelPayment = async (transactionId, reason) => {
  try {
    const response = await paymeAPI.post('/cards/cancel', {
      merchant_id: MERCHANT_ID,
      transaction_id: transactionId,
      reason
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'To\'lovni bekor qilib bo\'lmadi');
  }
}; 