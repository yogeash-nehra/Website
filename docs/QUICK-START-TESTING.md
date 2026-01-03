# ⚡ Quick Start: Test Your Booking System Now

## 🎯 3-Minute Testing Guide

### Step 1: Open Test Console (30 seconds)
1. Open your browser
2. Navigate to: `workshops/test-booking.html`
3. You'll see a beautiful purple test console

---

### Step 2: Run Validation (1 minute)
1. Click the big **"Run Complete Validation"** button
2. Wait 5-10 seconds
3. Read the results in the black console area

**Expected Results:**
```
✅ PASSED:
  ✓ Apps Script URL configured
  ✓ API connection successful (19 workshops found)
  ✓ Found X scheduled events
  ✓ Stripe initialized successfully
  
⚠️  WARNINGS:
  ⚠️  Using Stripe TEST mode
  
🎉 ALL CHECKS PASSED!
```

**If you see errors:**
- ❌ APPS_SCRIPT_URL not configured → Update `assets/js/config.js`
- ❌ Cannot connect to API → Check Apps Script deployment
- ❌ No events found → Add events to Google Sheets

---

### Step 3: Test Booking Links (1.5 minutes)

**Test A: General Booking**
1. Click "General booking page" button
2. Verify dropdown shows all workshops grouped
3. ✅ Success if you see dropdown populated

**Test B: Workshop-Specific**
1. Click "Workshop: service-10 (Tech & AI)" button
2. Verify dropdown shows:
   - "Understanding Technology & AI (Recommended)" at top
   - Separator line
   - "Browse All Other Workshops" below
3. ✅ Success if workshop events show first

**Test C: Event-Specific**
1. Click "Event: event-1" button
2. Verify that event is pre-selected
3. ✅ Success if event-1 is selected in dropdown

---

### Step 4: Test API Directly (30 seconds)

Click these buttons to test your API endpoints:

1. **"Test getWorkshops endpoint"** 
   - Opens API in new tab
   - Should show JSON with 19 workshops

2. **"Test getAllEvents endpoint"**
   - Opens API in new tab  
   - Should show JSON with your events

3. **"Test checkAvailability"**
   - Opens API in new tab
   - Should show available seats for event-1

**Expected Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "eventId": "event-1",
      "workshopId": "service-10",
      "eventDate": "2026-02-11",
      "eventTime": "10:00 AM",
      "availableSeats": 15,
      "status": "Active"
    }
  ]
}
```

---

## 🚨 Troubleshooting

### Problem: Test page shows errors

**Check 1: Is config.js updated?**
```javascript
// Open: assets/js/config.js
// Verify these are filled in:
APPS_SCRIPT_URL: 'https://script.google.com/a/macros/wgholdings.co.nz/s/AKfyc.../exec'
STRIPE_PUBLISHABLE_KEY: 'pk_test_...'
```

**Check 2: Are there events in Google Sheets?**
1. Open your Google Sheet
2. Go to "Scheduled Events" tab
3. Should have at least 2-3 rows of data
4. Status column should say "Active"

**Check 3: Is Apps Script deployed correctly?**
1. Go to Apps Script project
2. Click "Deploy" → "Manage deployments"
3. Verify:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - URL ends with `/exec` not `/dev`

---

### Problem: Dropdown is empty

**Quick Fix:**
```javascript
// Open browser console (F12)
// Run this:
await sheetsAPI.getAllEvents()

// If you see data → Config is good
// If you see error → Check APPS_SCRIPT_URL
```

---

### Problem: CORS error

**Quick Fix:**
You're testing on `file://` or `localhost` without proper server.

**Solution 1: Test on Live Website**
Push to GitHub and test on actual website URL.

**Solution 2: Use VS Code Live Server**
1. Install "Live Server" extension in VS Code
2. Right-click `test-booking.html`
3. Select "Open with Live Server"

---

### Problem: Payment button doesn't work

**You need to add Stripe key:**

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Switch to **Test Mode** (toggle at top right)
3. Click **Developers** → **API keys**
4. Copy **Publishable key** (starts with `pk_test_`)
5. Open `assets/js/config.js`
6. Replace:
   ```javascript
   STRIPE_PUBLISHABLE_KEY: 'pk_test_YOUR_ACTUAL_KEY_HERE'
   ```
7. Save and refresh page

---

## ✅ Success Checklist

After testing, you should have confirmed:

- [ ] ✅ Test page loads without errors
- [ ] ✅ Validation passes all checks
- [ ] ✅ API endpoints return data
- [ ] ✅ Workshop-specific booking works
- [ ] ✅ Dropdown shows events grouped correctly
- [ ] ✅ All 19 workshop pages link correctly
- [ ] ✅ Stripe key configured (for full booking test)

---

## 🎯 Next: Complete a Real Booking

Once validation passes, test the full flow:

1. Go to `workshops/booking.html?workshop=service-10`
2. Select an event
3. Fill in your details:
   - Name: Test User
   - Email: your-real-email@example.com
   - Phone: 021 123 4567
   - Organization: Test Org
   - Designation: Tester
4. Continue through all 5 steps
5. On payment page, use **Stripe test card:**
   ```
   Card Number: 4242 4242 4242 4242
   Expiry: 12/26
   CVC: 123
   ZIP: 12345
   ```
6. Complete payment
7. Verify:
   - ✅ Redirected to success page
   - ✅ Booking appears in Google Sheets "Bookings" tab
   - ✅ Available seats decreased in "Scheduled Events"
   - ✅ Confirmation email received

---

## 📊 What's Working Now

| Feature | Status | Test Method |
|---------|--------|-------------|
| API Connection | ✅ Working | test-booking.html → Run Validation |
| Workshop Data | ✅ 19 workshops | API → getWorkshops |
| Events Data | ✅ 2+ events | API → getAllEvents |
| Smart Dropdown | ✅ Enhanced | booking.html?workshop=service-10 |
| All Book Now Links | ✅ Updated | workshops/index.html (19 buttons) |
| Validation Tools | ✅ Ready | F12 → validateBookingSystem() |
| Stripe Setup | ⏳ Pending | Need to add key |
| Full Booking Flow | ⏳ Pending | Needs Stripe key |

---

## 🎓 Quick Command Reference

### Browser Console Commands (F12)

```javascript
// Run full validation
await validateBookingSystem()

// Test workshops endpoint
await sheetsAPI.getWorkshops()

// Test events endpoint  
await sheetsAPI.getAllEvents()

// Check availability for specific event
await sheetsAPI.checkAvailability('event-1')

// Get events for specific workshop
await sheetsAPI.getEventsByWorkshop('service-10')
```

### Test URLs

Replace `YOUR_SCRIPT_ID` with your Apps Script deployment ID:

```
# Get all workshops
https://script.google.com/a/macros/wgholdings.co.nz/s/YOUR_SCRIPT_ID/exec?action=getWorkshops

# Get all events
https://script.google.com/a/macros/wgholdings.co.nz/s/YOUR_SCRIPT_ID/exec?action=getAllEvents

# Check availability
https://script.google.com/a/macros/wgholdings.co.nz/s/YOUR_SCRIPT_ID/exec?action=checkAvailability&eventId=event-1
```

**Your working URL:**
```
https://script.google.com/a/macros/wgholdings.co.nz/s/AKfycbxr9yA3Z8SuVWtZ2jfdI7SQdWFy1qn05SUq4KEUgBZHbGbfrFIGIXeZtldzH2ktXmvM/exec
```

---

## 🚀 You're Almost Ready!

**What's Done:** ✅
- Google Sheets configured
- Apps Script deployed and working
- All workshop links updated
- Booking form enhanced
- Test tools created
- Documentation complete

**What's Left:** ⏳
- Add Stripe publishable key to config.js
- Add more events to Google Sheets
- Test complete booking with payment
- Go live!

---

## 📞 Need Help?

**If validation fails:**
1. Read the error messages carefully
2. Check `docs/BOOKING-SYSTEM-STATUS.md` for troubleshooting
3. Verify all checklist items above
4. Test API URLs directly in browser

**If booking fails:**
1. Check browser console (F12) for errors
2. Verify Stripe key is correct
3. Ensure event has available seats
4. Check Apps Script logs

---

**🎉 Ready to test? Open `workshops/test-booking.html` now!**

---

**Last Updated:** Jan 3, 2026  
**Time to Complete:** 3 minutes  
**Difficulty:** Easy ⭐

