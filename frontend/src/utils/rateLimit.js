// Rate limiting uchun Map
const rateLimitMap = new Map();

// So'rovlar orasidagi minimal vaqt (milliseconds)
const THROTTLE_DELAY = 1000; // 1 sekund

// Rate limiting tekshiruvi
export const checkRateLimit = (key) => {
  const now = Date.now();
  const lastCall = rateLimitMap.get(key);

  if (lastCall && now - lastCall < THROTTLE_DELAY) {
    return false;
  }

  rateLimitMap.set(key, now);
  return true;
};

// Debounce funksiyasi
export const debounce = (func, delay = 300) => {
  let timeoutId;

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

// Throttle funksiyasi
export const throttle = (func, limit = THROTTLE_DELAY) => {
  let inThrottle;
  
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}; 