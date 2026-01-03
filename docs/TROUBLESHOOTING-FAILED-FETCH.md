# 🚨 Still Getting "Failed to fetch" Error

## Quick Debug Steps

### Step 1: Open Browser Console

1. On the booking page, press **F12**
2. Click **Console** tab
3. Try clicking "Proceed to Payment" again
4. Copy any red error messages you see

### Step 2: Test API Directly

**Test 1: Open this URL in your browser:**
```
https://script.google.com/macros/s/AKfycbxr9yA3Z8SuVWtZ2jfdI7SQdWFy1qn05SUq4KEUgBZHbGbfrFIGIXeZtldzH2ktXmvM/exec?action=getWorkshops
```

**Expected:** JSON with workshops  
**If you see:** Sign-in page or error → Deployment issue

**Test 2: Test POST request in console:**

Open any page, press F12, paste this:

```javascript
fetch('https://script.google.com/macros/s/AKfycbxr9yA3Z8SuVWtZ2jfdI7SQdWFy1qn05SUq4KEUgBZHbGbfrFIGIXeZtldzH2ktXmvM/exec', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'validateBooking',
    eventId: 'event-1',
    numSeats: 1
  })
})
.then(r => r.json())
.then(data => console.log('✅ POST Result:', data))
.catch(err => console.error('❌ POST Error:', err));
```

---

## Common Issues & Solutions

### Issue 1: "Failed to fetch" = CORS Error

**Symptom:** Works on test-e2e.html but fails on booking.html

**Cause:** Testing on `file://` or `127.0.0.1` without proper server

**Fix:**
1. Test on your live website instead of localhost
2. OR use VS Code Live Server extension
3. OR push to GitHub Pages and test there

---

### Issue 2: Apps Script Not Deployed Correctly

**Check deployment:**

1. Go to script.google.com → Your project
2. Click **Deploy** → **Manage deployments**
3. Verify:
   - ✅ Type: **Web app**
   - ✅ Execute as: **Me (your@email.com)**
   - ✅ Who has access: **Anyone**
   - ✅ URL ends with `/exec` (not `/dev`)

**If settings are wrong:**
1. Click Edit (✏️)
2. Fix settings
3. Change Version to "New version"
4. Deploy

---

### Issue 3: Sheet ID Still Not Configured

**Verify in Apps Script:**

1. Open Configuration.gs
2. Check line 10
3. Should look like:
   ```javascript
   SHEET_ID: '1a2b3c4d5e6f7g8h9i0j',  // Your actual ID
   ```

**NOT like:**
```javascript
SHEET_ID: 'YOUR_SHEET_ID_HERE',  // ❌ Wrong!
```

**After updating:**
- Save (Ctrl+S)
- Deploy NEW VERSION
- Test again

---

### Issue 4: Google Sheet Permissions

**Apps Script needs permission to access your sheet:**

1. In Apps Script, select function `testSetup`
2. Click **▶️ Run**
3. If prompted, click **Review permissions**
4. Click your Google account
5. Click **Advanced** → **Go to [project name] (unsafe)**
6. Click **Allow**

---

## 🔍 Advanced Debugging

### Check Apps Script Logs

1. Go to script.google.com → Your project
2. Click **View** → **Executions**
3. Look for recent executions
4. Click on any failed ones to see error

**Common errors:**
- "Sheet not found" → SHEET_ID wrong
- "Permission denied" → Need to authorize
- "Function not found" → Deployment not updated

---

### Test Individual Functions

**In Apps Script:**

1. Select function: `WorkshopService.getWorkshops`
2. Click **▶️ Run**
3. Check logs

If this works, functions are fine. If not, Sheet ID is wrong.

---

## 🎯 Most Likely Causes

Based on "still same error", here's my diagnosis:

### 90% Probability: Deployment Issue

**The problem:** You updated Configuration.gs but didn't deploy a NEW VERSION

**The fix:**
1. Apps Script → Deploy → Manage deployments
2. Edit (✏️) your deployment
3. **Version: "New version"** ← THIS IS CRITICAL
4. Deploy
5. Test again

Just "saving" Configuration.gs doesn't update the live API!

---

### 9% Probability: CORS from localhost

**The problem:** Testing on 127.0.0.1:5500 (localhost)

**The fix:**
- Test on live website: https://wgholdings.co.nz
- Or use Python server: `python -m http.server 8000`
- Or VS Code Live Server extension

---

### 1% Probability: POST requests blocked

**The problem:** Apps Script's doPost not working

**The fix:**
Check Code.gs has proper doPost function (it should based on earlier tests)

---

## 📸 What I Need From You

To help debug, please provide:

**Option 1 (Easiest):**
Screenshot of browser console (F12) when clicking "Proceed to Payment"

**Option 2:**
Run this in console and share result:
```javascript
// Test the exact call that's failing
sheetsAPI.validateBooking('event-1', 1)
  .then(r => console.log('✅ Success:', r))
  .catch(e => console.error('❌ Error:', e));
```

**Option 3:**
Share screenshot of:
1. Apps Script → Deploy → Manage deployments (showing settings)
2. Apps Script → View → Executions (showing recent calls)

---

## ⚡ Quick Fix Attempt

If none of the above helped, try this **nuclear option**:

### Redeploy Apps Script Fresh

1. Apps Script → Deploy → Manage deployments
2. Click 🗑️ **Archive** on old deployment
3. Click **New deployment**
4. Type: **Web app**
5. Description: "Fresh deployment"
6. Execute as: **Me**
7. Who has access: **Anyone**
8. Click **Deploy**
9. Copy new URL
10. Update config.js with new URL
11. Test again

This creates a completely fresh deployment.

---

**What specific error message are you seeing? That will help me pinpoint the exact issue!** 🔍

