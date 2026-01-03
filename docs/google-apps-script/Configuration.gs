/**
 * Configuration settings for the booking system
 * IMPORTANT: Update these values with your actual credentials
 */

function getConfiguration() {
  return {
    // Google Sheet ID - Find this in your sheet URL
    // https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
    SHEET_ID: 'YOUR_SHEET_ID_HERE',
    
    // Sheet names
    WORKSHOP_CATALOG_SHEET: 'Workshop Catalog',
    SCHEDULED_EVENTS_SHEET: 'Scheduled Events',
    BOOKINGS_SHEET: 'Bookings',
    
    // Stripe Configuration
    // Get your secret key from: https://dashboard.stripe.com/test/apikeys
    STRIPE_SECRET_KEY: 'xxx',
    STRIPE_API_VERSION: '2023-10-16',
    
    // Website URLs (update with your actual domain)
    SUCCESS_URL: 'https://wgholdings.co.nz/workshops/booking-success.html',
    CANCEL_URL: 'https://wgholdings.co.nz/workshops/booking.html',
    
    // Email Configuration
    ADMIN_EMAIL: 'info@wgholdings.co.nz',
    FROM_EMAIL: 'bookings@wgholdings.co.nz',
    
    // Business Information
    BUSINESS_NAME: 'Wolfgramm Holdings',
    CURRENCY: 'nzd',
    
    // API Settings
    API_VERSION: '1.0',
    RATE_LIMIT_REQUESTS: 100,
    RATE_LIMIT_WINDOW: 60000, // 1 minute in milliseconds
  };
}

/**
 * Get spreadsheet reference
 */
function getSpreadsheet() {
  const config = getConfiguration();
  return SpreadsheetApp.openById(config.SHEET_ID);
}

/**
 * Get specific sheet by name
 */
function getSheet(sheetName) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  
  return sheet;
}

/**
 * Validate configuration
 */
function validateConfiguration() {
  const config = getConfiguration();
  const errors = [];
  
  if (config.SHEET_ID === 'YOUR_SHEET_ID_HERE') {
    errors.push('Sheet ID not configured');
  }
  
  if (config.STRIPE_SECRET_KEY === 'YOUR_STRIPE_SECRET_KEY_HERE') {
    errors.push('Stripe Secret Key not configured');
  }
  
  if (errors.length > 0) {
    throw new Error('Configuration errors: ' + errors.join(', '));
  }
  
  return true;
}

