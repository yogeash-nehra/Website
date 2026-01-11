# 🚨 FIX: CORS Error - "No 'Access-Control-Allow-Origin' header"

## The Error You're Seeing

```
Access to fetch at 'https://script.google.com/macros/s/AKfycbx.../exec?action=getAllEvents' 
from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## 🔍 Root Cause

**Google Apps Script has CORS restrictions** when accessed from `localhost` or `127.0.0.1` during development. This is a known limitation of Google Apps Script web apps.

The issue occurs because:
1. Your browser is making a request from `http://127.0.0.1:5500` (local dev server)
2. Google Apps Script doesn't send CORS headers for localhost origins
3. Browser blocks the request for security reasons

---

## ✅ SOLUTION 1: Verify Deployment Settings (Most Common Fix)

### Step 1: Check Your Deployment Configuration

1. Go to **[script.google.com](https://script.google.com)**
2. Open your Apps Script project
3. Click **Deploy** → **Manage deployments**
4. Click the **✏️ Edit** icon on your current deployment

### Step 2: Verify These Settings

Make sure these are **EXACTLY** as shown:

| Setting | Required Value | Why |
|---------|---------------|-----|
| **Execute as** | **Me (your-email@gmail.com)** | Runs with your permissions |
| **Who has access** | **Anyone** | ⚠️ CRITICAL for CORS |

**⚠️ CRITICAL:** If "Who has access" is NOT set to "Anyone", you will get CORS errors!

### Step 3: Save and Deploy

1. Keep "Version" as "New version"
2. Click **Deploy**
3. Click **Done**
4. **Wait 30-60 seconds** for changes to propagate

### Step 4: Test Again

1. **Hard refresh** your booking page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check if workshops load

---

## ✅ SOLUTION 2: Create Fresh Deployment (If Solution 1 Doesn't Work)

Sometimes the deployment gets "stuck" with old settings. Creating a fresh one fixes it.

### Step 1: Delete Old Deployment

1. Go to **Deploy** → **Manage deployments**
2. Click the **🗑️** Archive icon next to your deployment
3. Confirm deletion

### Step 2: Create New Deployment

1. Click **Deploy** → **New deployment**
2. Click **Select type** → Choose **Web app**
3. Configure:
   ```
   Description: Workshop Booking API v2
   Execute as: Me (your-email@gmail.com)
   Who has access: Anyone  ← CRITICAL!
   ```
4. Click **Deploy**
5. Click **Authorize access** (if prompted)
6. **Copy the NEW Web App URL**

### Step 3: Update Frontend Config

1. Open `assets/js/config.js` in your project
2. Replace the `APPS_SCRIPT_URL` with your NEW deployment URL:

```javascript
APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_ID/exec',
```

3. Save the file
4. **Hard refresh** your booking page

---

## ✅ SOLUTION 3: Test from a Real Domain (Quick Workaround)

CORS issues often don't occur when accessing from a real domain (not localhost).

### Option A: Use GitHub Pages (Free, 5 minutes)

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Access your site via `https://yourusername.github.io/yourrepo`
4. CORS error should disappear ✅

### Option B: Use Netlify (Free, 2 minutes)

1. Drag your project folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get instant HTTPS URL
3. Test booking page from that URL
4. CORS error should disappear ✅

### Option C: Use Live Server with HTTPS

Instead of `http://127.0.0.1:5500`, use a tool that provides HTTPS locally.

---

## ✅ SOLUTION 4: Verify Google Apps Script Code

Make sure your `doGet()` and `doPost()` functions are complete:

### Check Your Code.gs

Open your Apps Script project and verify `Code.gs` has:

```javascript
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (!action) {
      return createResponse({ success: false, error: 'Action parameter required' });
    }
    
    let result;
    
    switch(action) {
      case 'getWorkshops':
        result = WorkshopService.getWorkshops();
        break;
        
      case 'getAllEvents':
        result = WorkshopService.getAllScheduledEvents();
        break;
        
      case 'checkAvailability':
        const eventId = e.parameter.eventId;
        if (!eventId) {
          return createResponse({ success: false, error: 'eventId required' });
        }
        result = WorkshopService.checkAvailability(eventId);
        break;
        
      default:
        return createResponse({ success: false, error: 'Invalid action' });
    }
    
    return createResponse({ success: true, data: result });
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return createResponse({ success: false, error: error.toString() });
  }
}

function createResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
```

**Important:** Google Apps Script does NOT support custom CORS headers. CORS is controlled by the deployment setting "Who has access: Anyone".

---

## 🧪 Test Your Deployment Directly

To confirm your Apps Script is working (bypass CORS for testing):

### Test in Browser

1. Open a NEW browser tab
2. Paste this URL (replace with YOUR deployment ID):
   ```
   https://script.google.com/macros/s/AKfycbxr9yA3Z8SuVWtZ2jfdI7SQdWFy1qn05SUq4KEUgBZHbGbfrFIGIXeZtldzH2ktXmvM/exec?action=getAllEvents
   ```
3. Press Enter

**Expected Result:**
```json
{
  "success": true,
  "data": [
    {
      "eventId": "understanding-tech-ai-11-feb-26",
      "workshopId": "service-10",
      "eventDate": "2026-02-11",
      "eventTime": "10:00 AM",
      "availableSeats": 15,
      "status": "Active",
      "venueDetails": "Venue TBC"
    },
    ...
  ]
}
```

**If you see JSON data:** ✅ Your API works! The issue is CORS.  
**If you see an error:** ❌ Your backend has a configuration issue.

---

## 🔧 Troubleshooting

### Issue: Still Getting CORS Error After Setting "Anyone"

**Possible Causes:**
1. ⏱️ **Wait Time**: Changes can take 30-60 seconds to propagate
2. 🔄 **Cache**: Your browser cached the old CORS policy
3. 🎯 **Wrong Deployment**: You're hitting an old/different deployment URL

**Solutions:**
1. Wait 60 seconds after deploying
2. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
3. Clear browser cache for your site
4. Try in Incognito/Private mode
5. Create a fresh deployment (Solution 2 above)

### Issue: "Authorization Required" When Testing URL

**This is actually GOOD!** It means:
- ✅ Your deployment URL is correct
- ✅ CORS is likely fixed (you can reach the endpoint)

**Solution:**
1. Click "Authorize"
2. Select your Google account
3. Click "Advanced" → "Go to [Your Project]"
4. Click "Allow"
5. Test again

### Issue: Backend Works in Browser but Not in Booking Page

This confirms CORS is the issue. Use Solution 1 or Solution 2 above.

---

## 📋 Quick Checklist

Before asking for more help, verify:

- [ ] Deployment setting "Who has access" is set to **"Anyone"** (not "Only myself")
- [ ] Deployment setting "Execute as" is **"Me (your-email@gmail.com)"**
- [ ] You deployed a **NEW VERSION** after making changes
- [ ] You waited 30-60 seconds after deploying
- [ ] You hard-refreshed the booking page (`Ctrl+Shift+R`)
- [ ] Your `APPS_SCRIPT_URL` in `config.js` matches your current deployment URL
- [ ] Testing the API URL directly in browser shows JSON data

---

## 🎯 Most Likely Solution

**90% of the time, this fixes it:**

1. Go to Google Apps Script → **Deploy** → **Manage deployments**
2. Click **✏️ Edit**
3. Change "Who has access" to **"Anyone"**
4. Click **Deploy**
5. Wait 60 seconds
6. Hard refresh booking page

If "Who has access" was already "Anyone", create a **fresh deployment** (Solution 2).

---

## 🆘 Still Not Working?

### Check the Exact Error

Run this in browser console on your booking page:

```javascript
fetch('https://script.google.com/macros/s/AKfycbxr9yA3Z8SuVWtZ2jfdI7SQdWFy1qn05SUq4KEUgBZHbGbfrFIGIXeZtldzH2ktXmvM/exec?action=getAllEvents')
  .then(r => r.json())
  .then(d => console.log('✅ Success:', d))
  .catch(e => console.error('❌ Error:', e));
```

**If you see "✅ Success"**: CORS is fixed!  
**If you see "❌ Error: CORS"**: Try Solution 2 (fresh deployment)  
**If you see "❌ Error: [other]"**: Share the exact error message

---

## 📚 Why This Happens

Google Apps Script has special CORS behavior:

| Deployment Setting | CORS Allowed From | Result |
|-------------------|-------------------|---------|
| "Only myself" | ❌ Nothing | CORS error everywhere |
| "Anyone" | ✅ Any origin | Works from localhost |
| "Anyone within [domain]" | ✅ Only that domain | CORS error from localhost |

**That's why "Anyone" is critical!**

---

## ✅ Expected Final Result

After fixing CORS, your browser console should show:

```
✅ 📝 Initializing booking form...
✅ 🔄 Loading workshops...
✅ 📌 Pre-selected workshop from URL: service-10
✅ ✅ Workshops loaded successfully
```

And the booking page should display the workshop dropdown populated with events! 🎉

---

**Next Steps After CORS is Fixed:**
1. Test the full booking flow
2. Run `validateBookingSystem()` in console
3. Verify Stripe integration works
4. Test on a real domain before production

---

**Last Updated:** January 11, 2026  
**Issue:** CORS blocking Google Apps Script API calls  
**Solution:** Set deployment "Who has access" to "Anyone"
