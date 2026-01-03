# 🎯 Quick Fix: Update Stripe in Apps Script

## What You Need to Do (2 minutes)

### ✅ Step 1: Frontend is Already Updated
I've already updated `assets/js/config.js` with your **publishable key**. ✅

### ⚠️ Step 2: Update Backend (You Need to Do This)

Open your Google Apps Script and copy-paste this updated code:

---

## 📋 Copy This Entire Configuration.gs File

**Go to:** [script.google.com](https://script.google.com) → Your project → **Configuration.gs**

**Select ALL** (Ctrl+A) and **replace** with this:

```javascript
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
    
    // Stripe Configuration - UPDATED WITH YOUR KEYS
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
```

---

## 🚀 Step 3: Deploy New Version

After pasting the code above:

1. Click **💾 Save** (Ctrl+S)
2. Click **Deploy** → **Manage deployments**
3. Click the **✏️ Edit** icon
4. Change **Version** dropdown to **"New version"**
5. Description: "Updated Stripe keys"
6. Click **Deploy**
7. Click **Done**

---

## ✅ That's It!

Now test your booking:

1. Go to `workshops/booking.html`
2. Fill out the form
3. Click "Proceed to Payment"
4. Use test card: **4242 4242 4242 4242**
5. Should work! 🎉

---

## 📝 What Changed

**Line 19 in Configuration.gs:**

**Before:**
```javascript
STRIPE_SECRET_KEY: 'YOUR_STRIPE_SECRET_KEY_HERE',
```

**After:**
```javascript
STRIPE_SECRET_KEY: 'xxx',
```

---

## 🧪 Test Card Details

```
Card Number: 4242 4242 4242 4242
Expiry: 12/26
CVC: 123
ZIP: 12345
Name: Test User
```

---

**Need help?** Check `docs/STRIPE-UPDATE-GUIDE.md` for detailed troubleshooting!

