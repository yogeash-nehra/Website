# 🚨 QUICK FIX: "Unable to load workshops" Error

## Problem
Your booking page shows: **"Unable to load workshops - Failed to getAllEvents: Failed to fetch"**

## Root Cause
The Google Apps Script backend is missing configuration values:
1. ❌ Google Sheet ID not set
2. ❌ Stripe Secret Key not set

## ⚡ SOLUTION (10 minutes)

---

### STEP 1: Get Your Google Sheet ID

1. Open your Google Sheet named: **"Wolfgramm Holdings - Workshop Bookings"**
   
   If you don't have it yet, create one following: `docs/GOOGLE-SHEETS-SETUP.md`

2. Look at the URL in your browser:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0/edit
                                        ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑
                                        COPY THIS ENTIRE PART
   ```

3. **Copy** the long alphanumeric string between `/d/` and `/edit`

4. **Save it** somewhere temporarily (notepad, etc.)

---

### STEP 2: Get Your Stripe Secret Key

1. Go to **[Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)**
   
   (Log in if needed)

2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) ← **Get this one**

3. Click **"Reveal test key"** next to the Secret key

4. **Copy** the full secret key (starts with `sk_test_...`)

5. **Save it** temporarily

⚠️ **Security Note:** Never commit this secret key to GitHub or share it publicly!

---

### STEP 3: Update Google Apps Script Configuration

1. Go to **[script.google.com](https://script.google.com)**

2. Find and open your Apps Script project (probably named "Wolfgramm Holdings Booking API" or similar)

3. In the left sidebar, click on **Configuration.gs**

4. Find these two lines (around lines 10-19):
   ```javascript
   SHEET_ID: 'YOUR_SHEET_ID_HERE',
   ```
   and
   ```javascript
   STRIPE_SECRET_KEY: 'YOUR_STRIPE_SECRET_KEY_HERE',
   ```

5. **Replace** with your actual values from Steps 1 & 2:
   ```javascript
   SHEET_ID: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0',
   ```
   and
   ```javascript
   STRIPE_SECRET_KEY: 'sk_test_51RHwYvRNR3TqkgX2...',
   ```

6. **IMPORTANT:** Keep the single quotes `'...'` around the values!

7. Click **💾 Save** (or press `Ctrl+S` / `Cmd+S`)

---

### STEP 4: Deploy NEW VERSION ⚠️ CRITICAL STEP

**This is the most commonly missed step!**

1. In Google Apps Script, click **Deploy** button (top right corner)

2. Click **"Manage deployments"**

3. You'll see your current deployment listed. Click the **✏️ Edit** icon (pencil icon)

4. In the popup dialog:
   - Change **"Version"** dropdown to **"New version"**
   - Description (optional): "Added configuration values"
   - Keep **"Execute as: Me (your-email@example.com)"**
   - Keep **"Who has access: Anyone"**

5. Click **"Deploy"**

6. Click **"Done"**

**⚠️ Without creating a NEW VERSION, your changes won't go live!**

---

### STEP 5: Test the Fix

1. Go back to your booking page: `http://127.0.0.1:5500/workshops/booking.html`

2. **Refresh the page** (or press `Ctrl+F5` / `Cmd+Shift+R` for hard refresh)

3. You should now see workshops loading instead of the error!

---

## ✅ Expected Result

After completing these steps, you should see:
- ✅ Workshop dropdown populated with events
- ✅ No error messages
- ✅ Ability to select a workshop and continue booking

---

## 🆘 Still Having Issues?

### Issue: Still seeing "Failed to fetch"

**Solution:**
1. Check browser console (F12 → Console tab)
2. Look for the specific error message
3. Common causes:
   - Wrong Sheet ID (doesn't match your actual sheet)
   - Sheet doesn't have required tabs: "Workshop Catalog", "Scheduled Events", "Bookings"
   - No data in the sheets

### Issue: "Sheet not found" error

**Solution:**
1. Make sure your Google Sheet has exactly these three tabs:
   - `Workshop Catalog`
   - `Scheduled Events`
   - `Bookings`
2. Names must match exactly (case-sensitive, including spaces)

### Issue: "No workshops available"

**Solution:**
1. Add data to your Google Sheets following: `docs/GOOGLE-SHEETS-SETUP.md`
2. Make sure the "Status" column in both sheets is set to "Active"
3. Make sure "Scheduled Events" has at least one event with Available Seats > 0

---

## 📚 Next Steps

Once the booking page works:
1. ✅ Test the full booking flow
2. ✅ Run the diagnostic: Open browser console and run: `validateBookingSystem()`
3. ✅ Add more workshop events to your Google Sheet
4. ✅ Update book-now links across your site to point to `booking.html`

---

## 🔗 Related Documentation

- `docs/GOOGLE-SHEETS-SETUP.md` - How to structure your Google Sheet
- `docs/GOOGLE-APPS-SCRIPT-SETUP.md` - Complete Apps Script setup guide
- `docs/BOOKING-SETUP-REFERENCE.md` - Full configuration reference
- `docs/END-TO-END-TESTING.md` - How to test the complete system

---

**Need more help?** Check the browser console (F12) for detailed error messages.
