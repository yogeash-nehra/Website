# 🚨 URGENT FIX: Payment Not Working

## Issue Diagnosed

You're seeing: **"Failed to validateBooking: Failed to fetch"**

This means the frontend can't reach your Apps Script `validateBooking` endpoint.

---

## ⚡ Quick Fix (5 minutes)

### Step 1: Update Apps Script Configuration.gs

**Open your Google Apps Script** and make sure `Configuration.gs` has your **Sheet ID**:

1. Go to your Google Sheet
2. Copy the ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
   ```

3. In Apps Script `Configuration.gs`, update line 10:
   ```javascript
   SHEET_ID: 'YOUR_ACTUAL_SHEET_ID',
   ```

**Replace `YOUR_SHEET_ID_HERE` with your actual Sheet ID!**

---

### Step 2: Deploy NEW VERSION

This is **critical** - just saving isn't enough!

1. Click **Deploy** → **Manage deployments**
2. Click the **✏️ Edit** icon on your active deployment
3. Change **Version** to **"New version"**
4. Description: "Added validateBooking endpoint"
5. Click **Deploy**
6. Click **Done**

**⚠️ Without this step, your changes won't go live!**

---

### Step 3: Test Apps Script Manually

**In Apps Script editor:**

1. Select function: **`testSetup`** (from dropdown)
2. Click **▶️ Run**
3. Check **View → Logs**

**Expected output:**
```
Testing configuration...
Sheet ID: Configured ✅
Stripe Key: Configured ✅
Sheet access: SUCCESS ✅
Sheet name: Wolfgramm Holdings - Workshop Bookings
Test complete!
```

**If you see errors:**
- Sheet ID: MISSING → Update Configuration.gs
- Sheet access: FAILED → Check Sheet ID is correct
- Stripe Key: MISSING → Update secret key

---

### Step 4: Test the POST Endpoint

**Option A: Use Browser Console**

Open `workshops/booking.html` and press F12, then run:

```javascript
// Test validateBooking endpoint
await sheetsAPI.validateBooking('event-1', 1)
```

**Expected result:**
```javascript
{
  valid: true,
  availableSeats: 15
}
```

**Option B: Use test-e2e.html**

Add this to the console and run:

```javascript
const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'validateBooking',
    eventId: 'event-1',
    numSeats: 1
  })
});

const data = await response.json();
console.log(data);
```

---

## 🔍 Troubleshooting

### Issue 1: "Sheet ID not configured"

**In Apps Script Configuration.gs:**

```javascript
function getConfiguration() {
  return {
    // UPDATE THIS LINE:
    SHEET_ID: 'YOUR_ACTUAL_GOOGLE_SHEET_ID',  // ← Paste your Sheet ID here
    
    // Keep these the same:
    WORKSHOP_CATALOG_SHEET: 'Workshop Catalog',
    SCHEDULED_EVENTS_SHEET: 'Scheduled Events',
    BOOKINGS_SHEET: 'Bookings',
    
    // This should already be updated:
    STRIPE_SECRET_KEY: 'sk_test_51RHwYvRNR3TqkgX213XkigbvFoiNc2KKIbasqbhIZUHalF8mPUg0d2zpL9WiQnEnAMwmBL9LTbanWDqE04IDkKPC00XpT3sYhE',
    
    // ... rest of config
  };
}
```

---

### Issue 2: "Failed to fetch" persists

**Check CORS and deployment:**

1. **Verify deployment URL** ends with `/exec` not `/dev`
2. **Check deployment settings:**
   - Execute as: **Me**
   - Who has access: **Anyone**

3. **Test URL directly** in browser:
   ```
   https://script.google.com/macros/s/YOUR_ID/exec?action=getWorkshops
   ```
   Should return JSON (not sign-in page)

---

### Issue 3: POST requests blocked

**Google Apps Script requires special CORS handling for POST:**

Update `Code.gs` lines 124-130:

```javascript
function createResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // These headers are auto-added by Apps Script for web apps
  // No manual CORS headers needed when deployed as "Anyone" access
  
  return output;
}
```

This should already work, but if POST still fails, try this alternative in `doPost`:

```javascript
function doPost(e) {
  // Add this at the very top:
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    // ... rest of your doPost code ...
    
  } finally {
    lock.releaseLock();
  }
}
```

---

## 🎯 Complete Configuration.gs Template

**Copy this ENTIRE file to your Apps Script:**

```javascript
function getConfiguration() {
  return {
    // ⚠️ UPDATE THIS - Get from your Google Sheet URL
    SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',
    
    // Sheet names (must match exactly)
    WORKSHOP_CATALOG_SHEET: 'Workshop Catalog',
    SCHEDULED_EVENTS_SHEET: 'Scheduled Events',
    BOOKINGS_SHEET: 'Bookings',
    
    // Stripe Configuration (already updated with your key)
    STRIPE_SECRET_KEY: 'sk_test_51RHwYvRNR3TqkgX213XkigbvFoiNc2KKIbasqbhIZUHalF8mPUg0d2zpL9WiQnEnAMwmBL9LTbanWDqE04IDkKPC00XpT3sYhE',
    STRIPE_API_VERSION: '2023-10-16',
    
    // Website URLs
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
    RATE_LIMIT_WINDOW: 60000
  };
}

function getSpreadsheet() {
  const config = getConfiguration();
  return SpreadsheetApp.openById(config.SHEET_ID);
}

function getSheet(sheetName) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  
  return sheet;
}

function validateConfiguration() {
  const config = getConfiguration();
  const errors = [];
  
  if (config.SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE' || !config.SHEET_ID) {
    errors.push('Sheet ID not configured');
  }
  
  if (config.STRIPE_SECRET_KEY === 'YOUR_STRIPE_SECRET_KEY_HERE' || !config.STRIPE_SECRET_KEY) {
    errors.push('Stripe Secret Key not configured');
  }
  
  if (errors.length > 0) {
    throw new Error('Configuration errors: ' + errors.join(', '));
  }
  
  return true;
}
```

**Don't forget to:**
1. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with actual Sheet ID
2. Save (Ctrl+S)
3. Deploy NEW VERSION

---

## ✅ After Fixing

**Test again:**

1. Go to `workshops/booking.html`
2. Fill out form
3. Click "Proceed to Payment"

**Expected:**
- ✅ Loading spinner appears
- ✅ No error message
- ✅ Redirects to Stripe checkout page

**If it works:**
- 🎉 Enter test card details
- 🎉 Complete payment
- 🎉 Check Google Sheets for booking

---

## 📋 Quick Checklist

Before trying again:

- [ ] Opened Apps Script
- [ ] Updated SHEET_ID in Configuration.gs
- [ ] Saved Configuration.gs
- [ ] Ran testSetup() function to verify
- [ ] Deployed NEW VERSION (not just saved!)
- [ ] Verified deployment ends with /exec
- [ ] Deployment settings: Anyone can access
- [ ] Tested validateBooking in console
- [ ] Tried booking again

---

## 🆘 Still Not Working?

**Share these details:**

1. **Apps Script Logs:**
   - View → Executions
   - Copy any error messages

2. **Browser Console:**
   - F12 → Console tab
   - Copy any red error messages

3. **Test Results:**
   - What does `testSetup()` show in logs?
   - What happens when you click "Proceed to Payment"?
   - Any error message displayed?

---

**Most common cause:** Sheet ID not configured or new version not deployed!

**Fix:** Update Sheet ID → Deploy NEW VERSION → Try again

