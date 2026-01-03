# 🚨 FIX: POST Requests Failing

## ✅ Diagnosis Confirmed

**GET requests work** ✅  
**POST requests fail** ❌

This means your Apps Script deployment is accessible, but the POST endpoint has an issue.

---

## ⚡ SOLUTION: 3-Step Fix (5 minutes)

### STEP 1: Get Your Google Sheet ID

1. Open your Google Sheet: **"Wolfgramm Holdings - Workshop Bookings"**

2. Look at the URL:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0/edit
                                        ↑
                                   COPY THIS PART
   ```

3. Copy the long string between `/d/` and `/edit`

---

### STEP 2: Update Apps Script Configuration

1. Go to **[script.google.com](https://script.google.com)**

2. Open your project (should be named something like "Wolfgramm Workshop Booking API")

3. In the left panel, click **Configuration.gs**

4. You should see this around line 10:
   ```javascript
   SHEET_ID: 'YOUR_SHEET_ID_HERE',
   ```

5. **Replace** with your actual Sheet ID from Step 1:
   ```javascript
   SHEET_ID: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0',
   ```

6. **IMPORTANT:** Make sure it's inside single quotes `'...'`

7. Click **💾 Save** (or Ctrl+S)

---

### STEP 3: Deploy NEW VERSION (CRITICAL!)

**This is the step most people miss!**

1. In Apps Script, click **Deploy** (top right)

2. Click **Manage deployments**

3. You'll see your current deployment. Click the **✏️ Edit** icon (looks like a pencil)

4. In the popup:
   - Change **"Version"** dropdown from "Latest" or version number to **"New version"**
   - Description (optional): "Added Sheet ID configuration"
   - Keep "Execute as: Me"
   - Keep "Who has access: Anyone"

5. Click **Deploy**

6. Click **Done**

**⚠️ Without deploying a NEW VERSION, your changes won't go live!**

---

## 🧪 STEP 4: Test Again

1. Go back to `workshops/test-post.html`

2. Click **"Test POST (validateBooking)"**

3. **Expected result:**
   ```
   ✅ POST Request SUCCESS!

   validateBooking response:
   {
     "valid": true,
     "availableSeats": 15
   }

   🎉 Your booking system should work!
   ```

---

## 🎉 STEP 5: Try Booking Again

1. Go to `workshops/booking.html`

2. Fill out the entire form (all 5 steps)

3. Click **"Proceed to Payment"**

4. **Should now:**
   - Show loading spinner
   - Redirect to Stripe checkout page ✅

---

## 🔍 If Still Not Working

### Check Apps Script Logs

1. In Apps Script, click **View** → **Executions**

2. Look for recent POST requests

3. Click on any failed ones

4. **Share the error message** you see there

---

### Verify Configuration

Run this test in Apps Script:

1. Select function dropdown: **testSetup**

2. Click **▶️ Run**

3. Click **View** → **Logs**

4. Should show:
   ```
   Testing configuration...
   Sheet ID: Configured ✅
   Stripe Key: Configured ✅
   Sheet access: SUCCESS ✅
   Sheet name: Wolfgramm Holdings - Workshop Bookings
   Test complete!
   ```

If you see **"Sheet ID: MISSING"** or **"Sheet access: FAILED"**, your Sheet ID is wrong.

---

## 📋 Common Mistakes

### ❌ Mistake 1: Forgot Quotes
```javascript
SHEET_ID: 1a2b3c4d5e6f7g8h9,  // WRONG! No quotes
```

```javascript
SHEET_ID: '1a2b3c4d5e6f7g8h9',  // CORRECT! Has quotes
```

---

### ❌ Mistake 2: Saved But Didn't Deploy

Saving in Apps Script editor **does NOT** update your live API!

You MUST:
- Deploy → Manage deployments → Edit → **New version** → Deploy

---

### ❌ Mistake 3: Wrong Sheet ID

Make sure you copied the ID from the correct sheet:
- **Correct:** "Wolfgramm Holdings - Workshop Bookings"
- **Wrong:** Some other test sheet

---

### ❌ Mistake 4: Still Using Old Deployment

If you have multiple deployments:
- Archive old ones
- Keep only the latest active

---

## 🎯 Visual Checklist

**Before you start:**
- [ ] Have your Google Sheet open in another tab
- [ ] Have Apps Script editor open in another tab
- [ ] Ready to copy-paste Sheet ID

**Configuration.gs:**
- [ ] Line 10 has your actual Sheet ID
- [ ] Sheet ID is inside single quotes '...'
- [ ] No typos in Sheet ID
- [ ] File saved (Ctrl+S)

**Deployment:**
- [ ] Clicked "Deploy" → "Manage deployments"
- [ ] Clicked Edit (✏️) icon
- [ ] Changed Version to "New version"
- [ ] Clicked "Deploy"
- [ ] Saw "Deployment successful" message

**Testing:**
- [ ] Went back to test-post.html
- [ ] Clicked "Test POST (validateBooking)"
- [ ] Saw success message
- [ ] Tried booking.html
- [ ] "Proceed to Payment" works

---

## 💬 What to Tell Me

If it's **still not working** after following ALL steps above:

1. **Screenshot of Configuration.gs** showing your SHEET_ID line

2. **Screenshot of Apps Script → View → Executions** showing the POST error

3. **Result from test-post.html** after deploying new version

4. **Result from testSetup()** function logs

---

## 🆘 Emergency Fix: Fresh Deployment

If nothing works, try creating a **completely fresh deployment**:

1. Apps Script → Deploy → Manage deployments
2. Click 🗑️ **Archive** on current deployment
3. Click **New deployment**
4. Type: Web app
5. Execute as: Me
6. Who has access: Anyone
7. Deploy
8. Copy the NEW URL
9. Update config.js with new URL
10. Test again

---

**Most people fix this by doing Step 3 (Deploy NEW VERSION) correctly!**

**Try the fix above and let me know if POST starts working!** 🚀

