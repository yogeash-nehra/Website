/**
 * Configuration for Wolfgramm Holdings Booking System
 * 
 * IMPORTANT: Update these values before deploying
 */

const CONFIG = {
  // Google Apps Script API URL
  // Replace with your deployed Apps Script web app URL
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxr9yA3Z8SuVWtZ2jfdI7SQdWFy1qn05SUq4KEUgBZHbGbfrFIGIXeZtldzH2ktXmvM/exec',
  
  // Stripe Publishable Key (Test or Live)x
  // Get this from: https://dashboard.stripe.com/test/apikeys
  STRIPE_PUBLISHABLE_KEY: 'pk_test_51RHwYvRNR3TqkgX2E9bltf998OhHgB5TwggSkUT5UcE2KrLepDtCaKTPlGqWLuyaAUa1qoairh2jL8M1cHkKeMc5002RALTePx',
  
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

