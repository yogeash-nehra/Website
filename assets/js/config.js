/**
 * Configuration for Wolfgramm Holdings Booking System
 * 
 * IMPORTANT: Update these values before deploying
 */

const CONFIG = {
  // Google Apps Script API URL
  // Replace with your deployed Apps Script web app URL
  APPS_SCRIPT_URL: 'https://script.google.com/macros/u/1/s/AKfycbygus9oG-bWgLXt-s6fzidQa8twZ4h8YQT8uaiVf0mXJkhd-e6QeaiPTnYdt6RKi5Gs/exec',
  
  // Stripe Publishable Key (Test or Live)
  // Get this from: https://dashboard.stripe.com/test/apikeys
  STRIPE_PUBLISHABLE_KEY: 'pk_test_51RHwYhEswbzoFS7mmL1ZQtJxsnQXv4cBI5K7LCFkEHTN5dCrDd0jsoisaDX3MRjAHEzmYRB54lXjy0pN5RP2Ui0F005bO3Zz3c',
  
  // Business Information
  BUSINESS_NAME: 'Wolfgramm Holdings',
  BUSINESS_EMAIL: 'info@wgholdings.co.nz',
  BUSINESS_PHONE: '0226064444',
  
  // Currency
  CURRENCY: 'NZD',
  CURRENCY_SYMBOL: '$',
  
  // API Settings
  REQUEST_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  
  // Cache Settings (for offline/performance)
  CACHE_DURATION: 120000, // 2 minutes
  
  // Feature Flags
  ENABLE_ANALYTICS: true,
  ENABLE_EMAIL_VALIDATION: true,
  
  // URLs
  BASE_URL: window.location.origin,
  WORKSHOPS_URL: '/workshops/index.html',
  BOOKING_URL: '/workshops/booking.html',
  SUCCESS_URL: '/workshops/booking-success.html',
  CANCEL_URL: '/workshops/booking-failed.html'
};

// Validate configuration on load
(function validateConfig() {
  if (CONFIG.APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
    console.warn('⚠️ Apps Script URL not configured. Please update assets/js/config.js');
  }
  
  if (CONFIG.STRIPE_PUBLISHABLE_KEY === 'YOUR_STRIPE_PUBLISHABLE_KEY_HERE') {
    console.warn('⚠️ Stripe Publishable Key not configured. Please update assets/js/config.js');
  }
})();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

