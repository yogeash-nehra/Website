# 🚨 CORS FIX for Live Site

## Problem
You're seeing this error on your live site (https://yogeash-nehra.github.io):
```
Access to fetch at 'https://script.google.com/macros/s/.../exec' from origin 'https://yogeash-nehra.github.io' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check
```

## Root Cause
Your deployed Apps Script still has the OLD version of `doPost()` that doesn't properly handle POST requests. The new version handles both JSON and form-encoded data which resolves CORS issues.

## ✅ Solution: Deploy New Version

### Step 1: Update Code.gs in Apps Script
1. Open your Google Apps Script: https://script.google.com
2. Open your "Workshop Booking System" project
3. Click on `Code.gs` file
4. **Replace the entire `doPost` function** (lines 56-112) with this:

```javascript
/**
 * Main entry point for POST requests
 * Handles both JSON and form-encoded data
 */
function doPost(e) {
  try {
    let requestData;
    
    // Check if it's JSON or form data
    if (e.postData && e.postData.type === 'application/json') {
      // JSON request (from fetch API)
      requestData = JSON.parse(e.postData.contents);
    } else {
      // Form-encoded or parameter request
      requestData = e.parameter;
    }
    
    const action = requestData.action;
    
    if (!action) {
      return createResponse({ success: false, error: 'Action parameter required' });
    }
    
    let result;
    
    switch(action) {
      case 'createCheckoutSession':
        if (!requestData.eventId || !requestData.customerData) {
          return createResponse({ success: false, error: 'Missing required fields' });
        }
        result = StripeService.createCheckoutSession(
          requestData.eventId,
          requestData.customerData
        );
        break;
        
      case 'confirmBooking':
        if (!requestData.sessionId) {
          return createResponse({ success: false, error: 'Session ID required' });
        }
        result = BookingService.confirmBooking(requestData.sessionId);
        break;
        
      case 'validateBooking':
        if (!requestData.eventId) {
          return createResponse({ success: false, error: 'Event ID required' });
        }
        const numSeats = parseInt(requestData.numSeats) || 1;
        result = BookingService.validateBooking(
          requestData.eventId,
          numSeats
        );
        break;
        
      default:
        return createResponse({ success: false, error: 'Invalid action: ' + action });
    }
    
    return createResponse({ success: true, data: result });
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse({ success: false, error: error.toString() });
  }
}
```

### Step 2: Deploy as NEW VERSION
This is **CRITICAL** - you must deploy a new version for changes to take effect!

1. Click **"Deploy"** button (top right)
2. Select **"Manage deployments"**
3. Click the **EDIT icon** (pencil) next to your web app deployment
4. Under "Version", change from "Latest" to **"New version"**
5. Add description: "Fixed CORS for POST requests"
6. Click **"Deploy"**
7. **IMPORTANT**: The URL should remain the same:
   ```
   https://script.google.com/macros/s/AKfycbxr9yA3Z8SuVWtZ2jfdI7SQdWFy1qn05SUq4KEUgBZHbGbfrFIGIXeZtldzH2ktXmvM/exec
   ```

### Step 3: Test Again
1. Clear your browser cache (Ctrl+Shift+Delete)
2. Reload your live site: https://yogeash-nehra.github.io/workshops/booking.html
3. Try the booking flow again
4. The "Proceed to Payment" button should now work!

## What Changed?
The new `doPost` function:
- ✅ Handles both JSON and form-encoded data
- ✅ Better error messages with `success: true/false` structure
- ✅ More flexible content-type handling
- ✅ Resolves CORS preflight issues

## Verification
After deploying, you should see in the console:
```
✅ POST Request: validateBooking
✅ POST Response status: 200
✅ POST Result: {success: true, data: {valid: true, availableSeats: 10}}
```

Instead of:
```
❌ CORS error
❌ Failed to fetch
```

## Still Having Issues?
If you still see errors after deploying:

1. **Wait 1-2 minutes** - Google sometimes caches the old version
2. **Clear browser cache** completely
3. **Try incognito mode**
4. **Check Apps Script execution log**:
   - Go to Apps Script
   - Click "Executions" (left sidebar)
   - Look for recent POST requests
   - Check for any errors

## Next Steps
Once this is deployed and working:
1. ✅ POST requests will work
2. ✅ Payment redirect to Stripe will work
3. ✅ Full booking flow will be complete!

