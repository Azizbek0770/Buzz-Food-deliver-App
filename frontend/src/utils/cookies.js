import Cookies from 'js-cookie';

export const setAuthCookie = (token) => {
  Cookies.set('token', token, { 
    expires: 7, // 7 kunlik
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const getAuthCookie = () => {
  return Cookies.get('token');
};

export const clearAuthCookie = () => {
  Cookies.remove('token');
}; 