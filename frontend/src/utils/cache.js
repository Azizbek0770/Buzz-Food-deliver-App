// Cache class
class Cache {
  constructor(maxSize = 100, expirationTime = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.expirationTime = expirationTime;
  }

  // Get item from cache
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  // Set item in cache
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + this.expirationTime,
    });
  }

  // Delete item from cache
  delete(key) {
    this.cache.delete(key);
  }

  // Clear entire cache
  clear() {
    this.cache.clear();
  }

  // Get cache size
  size() {
    return this.cache.size;
  }

  // Check if key exists and is not expired
  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

// Create cache instances for different types of data
export const apiCache = new Cache();
export const imageCache = new Cache(50, 30 * 60 * 1000); // 30 minutes for images
export const staticDataCache = new Cache(200, 60 * 60 * 1000); // 1 hour for static data

// Cache decorator for functions
export const withCache = (fn, cache = apiCache, keyPrefix = '') => {
  return async (...args) => {
    const key = `${keyPrefix}${JSON.stringify(args)}`;
    const cachedResult = cache.get(key);

    if (cachedResult !== null) {
      return cachedResult;
    }

    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Image preloading
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, true);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
};

// Batch preload images
export const preloadImages = async (sources) => {
  const promises = sources.map(src => preloadImage(src));
  return Promise.all(promises);
};

// Local storage cache wrapper
export const localStorageCache = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const { value, expiry } = JSON.parse(item);
      if (Date.now() > expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return value;
    } catch (error) {
      return null;
    }
  },

  set(key, value, expirationInMinutes = 60) {
    try {
      const item = {
        value,
        expiry: Date.now() + expirationInMinutes * 60 * 1000,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};

// Session storage cache wrapper
export const sessionStorageCache = {
  get(key) {
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return null;

      const { value, expiry } = JSON.parse(item);
      if (Date.now() > expiry) {
        sessionStorage.removeItem(key);
        return null;
      }

      return value;
    } catch (error) {
      return null;
    }
  },

  set(key, value, expirationInMinutes = 30) {
    try {
      const item = {
        value,
        expiry: Date.now() + expirationInMinutes * 60 * 1000,
      };
      sessionStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  },

  remove(key) {
    sessionStorage.removeItem(key);
  },

  clear() {
    sessionStorage.clear();
  },
}; 