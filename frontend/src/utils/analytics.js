import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};

export const logEvent = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

export const logException = (description = '', fatal = false) => {
  ReactGA.exception({
    description: description,
    fatal: fatal
  });
};

export const logTiming = (category, variable, value) => {
  ReactGA.timing({
    category: category,
    variable: variable,
    value: value
  });
};

// Custom events for business metrics
export const logRestaurantView = (restaurantId, restaurantName) => {
  logEvent('Restaurant', 'view', `${restaurantId}-${restaurantName}`);
};

export const logOrderPlaced = (orderId, amount) => {
  logEvent('Order', 'place', orderId.toString(), amount);
};

export const logAddToCart = (itemId, itemName, price) => {
  logEvent('Cart', 'add_item', `${itemId}-${itemName}`, price);
};

export const logCheckout = (cartTotal, itemCount) => {
  logEvent('Cart', 'checkout', 'Checkout Started', cartTotal);
}; 