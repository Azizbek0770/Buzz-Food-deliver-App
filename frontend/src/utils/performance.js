import { imageCache } from './cache';

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Lazy loading images
export const lazyLoadImage = (imgElement) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');

          if (src) {
            if (imageCache.has(src)) {
              img.src = src;
            } else {
              const tempImg = new Image();
              tempImg.onload = () => {
                img.src = src;
                imageCache.set(src, true);
              };
              tempImg.src = src;
            }
          }

          observer.unobserve(img);
        }
      });
    });

    observer.observe(imgElement);
  }
};

// Batch DOM updates
export class BatchDOMUpdates {
  constructor() {
    this.updates = [];
    this.scheduled = false;
  }

  add(update) {
    this.updates.push(update);
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => this.execute());
    }
  }

  execute() {
    const updates = this.updates;
    this.updates = [];
    this.scheduled = false;
    updates.forEach(update => update());
  }
}

// Measure performance
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start}ms`);
  return result;
};

// Chunk array processing
export const processInChunks = (items, chunkSize, processor) => {
  let index = 0;
  
  return new Promise((resolve) => {
    function doChunk() {
      const chunk = items.slice(index, index + chunkSize);
      index += chunkSize;
      
      chunk.forEach(processor);
      
      if (index < items.length) {
        // Schedule next chunk
        setTimeout(doChunk, 0);
      } else {
        resolve();
      }
    }
    
    doChunk();
  });
};

// Virtual scrolling helper
export class VirtualScroll {
  constructor(container, items, rowHeight) {
    this.container = container;
    this.items = items;
    this.rowHeight = rowHeight;
    this.visibleItems = [];
    this.scrollTop = 0;
    this.containerHeight = 0;
    
    this.container.addEventListener('scroll', this.onScroll.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
    
    this.update();
  }
  
  onScroll() {
    this.scrollTop = this.container.scrollTop;
    this.update();
  }
  
  onResize() {
    this.containerHeight = this.container.clientHeight;
    this.update();
  }
  
  update() {
    const startIndex = Math.floor(this.scrollTop / this.rowHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.rowHeight),
      this.items.length
    );
    
    this.visibleItems = this.items.slice(startIndex, endIndex);
    // Trigger render callback
    if (this.onRender) {
      this.onRender(this.visibleItems, startIndex);
    }
  }
}

// RAF scheduler for animations
export class RAFScheduler {
  constructor() {
    this.callbacks = new Set();
    this.running = false;
  }
  
  add(callback) {
    this.callbacks.add(callback);
    this.start();
  }
  
  remove(callback) {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0) {
      this.stop();
    }
  }
  
  start() {
    if (!this.running) {
      this.running = true;
      this.tick();
    }
  }
  
  stop() {
    this.running = false;
  }
  
  tick() {
    if (!this.running) return;
    
    this.callbacks.forEach(callback => callback());
    requestAnimationFrame(() => this.tick());
  }
}

// Memory management helper
export const cleanupMemory = (component) => {
  // Clear timeouts
  if (component.timeouts) {
    component.timeouts.forEach(clearTimeout);
  }
  
  // Clear intervals
  if (component.intervals) {
    component.intervals.forEach(clearInterval);
  }
  
  // Clear event listeners
  if (component.listeners) {
    component.listeners.forEach(({ target, type, listener }) => {
      target.removeEventListener(type, listener);
    });
  }
  
  // Clear references
  Object.keys(component).forEach(key => {
    component[key] = null;
  });
}; 