import { useState, useCallback } from 'react';

const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Qiymatni yangilash
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Agar maydon tegilgan bo'lsa, validatsiyani bajarish
    if (touched[name]) {
      validateField(name, value);
    }
  }, [touched]);

  // Maydonni validatsiya qilish
  const validateField = useCallback((fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return;

    let fieldErrors = [];

    // Majburiy maydon
    if (rules.required && !value) {
      fieldErrors.push('Bu maydon to\'ldirilishi shart');
    }

    // Minimal uzunlik
    if (rules.minLength && value.length < rules.minLength) {
      fieldErrors.push(`Minimal ${rules.minLength} ta belgi bo'lishi kerak`);
    }

    // Maksimal uzunlik
    if (rules.maxLength && value.length > rules.maxLength) {
      fieldErrors.push(`Maksimal ${rules.maxLength} ta belgi bo'lishi mumkin`);
    }

    // Email formati
    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      fieldErrors.push('Email manzil noto\'g\'ri');
    }

    // Telefon raqam formati
    if (rules.phone && !/^\+998[0-9]{9}$/.test(value)) {
      fieldErrors.push('Telefon raqam noto\'g\'ri (+998XXXXXXXXX)');
    }

    // Parol mustahkamligi
    if (rules.password) {
      if (!/(?=.*[a-z])/.test(value)) {
        fieldErrors.push('Kamida 1 ta kichik harf');
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        fieldErrors.push('Kamida 1 ta katta harf');
      }
      if (!/(?=.*\d)/.test(value)) {
        fieldErrors.push('Kamida 1 ta raqam');
      }
      if (!/(?=.*[!@#$%^&*])/.test(value)) {
        fieldErrors.push('Kamida 1 ta maxsus belgi (!@#$%^&*)');
      }
    }

    // Maxsus validatsiya
    if (rules.custom) {
      const customError = rules.custom(value, values);
      if (customError) {
        fieldErrors.push(customError);
      }
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors.length > 0 ? fieldErrors : null
    }));
  }, [validationRules, values]);

  // Barcha maydonlarni validatsiya qilish
  const validateForm = useCallback(() => {
    const formErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      validateField(fieldName, values[fieldName]);
      if (errors[fieldName]) {
        formErrors[fieldName] = errors[fieldName];
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  }, [validateField, values, errors, validationRules]);

  // Maydonni tegilgan deb belgilash
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  }, [validateField, values]);

  // Formani tozalash
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues
  };
};

export default useFormValidation; 