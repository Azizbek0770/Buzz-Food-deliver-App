// Form validatsiya uchun utility
export const validateOrder = (orderData) => {
    const errors = {};
    
    if (!orderData.delivery_address) {
        errors.delivery_address = "Manzil kiritilishi shart";
    }
    
    if (!orderData.items?.length) {
        errors.items = "Buyurtmada kamida 1ta taom bo'lishi kerak";
    }
    
    return errors;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email kiritilishi shart';
  if (!emailRegex.test(email)) return 'Email noto'g'ri formatda';
  return '';
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+998[0-9]{9}$/;
  if (!phone) return 'Telefon raqam kiritilishi shart';
  if (!phoneRegex.test(phone)) return 'Telefon raqam noto'g'ri formatda (+998XXXXXXXXX)';
  return '';
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} kiritilishi shart`;
  }
  return '';
};

export const validateLength = (value, fieldName, { min, max }) => {
  if (min && value.length < min) {
    return `${fieldName} kamida ${min} ta belgidan iborat bo'lishi kerak`;
  }
  if (max && value.length > max) {
    return `${fieldName} ko'pi bilan ${max} ta belgidan iborat bo'lishi mumkin`;
  }
  return '';
};

export const validateNumber = (value, fieldName, { min, max }) => {
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} raqam bo'lishi kerak`;
  if (min !== undefined && num < min) return `${fieldName} ${min} dan katta bo'lishi kerak`;
  if (max !== undefined && num > max) return `${fieldName} ${max} dan kichik bo'lishi kerak`;
  return '';
};

export const validateForm = (values, rules) => {
  const errors = {};
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      const error = rule(values[field], field);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validatsiya qoidalari
export const rules = {
  required: (fieldName) => (value) => validateRequired(value, fieldName),
  
  email: () => validateEmail,
  
  phone: () => validatePhone,
  
  minLength: (fieldName, min) => (value) => 
    validateLength(value, fieldName, { min }),
  
  maxLength: (fieldName, max) => (value) => 
    validateLength(value, fieldName, { max }),
  
  number: (fieldName, { min, max } = {}) => (value) => 
    validateNumber(value, fieldName, { min, max }),
    
  match: (fieldName, matchValue, matchFieldName) => (value) => {
    if (value !== matchValue) {
      return `${fieldName} ${matchFieldName} bilan mos kelmayapti`;
    }
    return '';
  }
}; 