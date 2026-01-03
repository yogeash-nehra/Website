# ✅ Complete Setup Verification Checklist

## 🎯 How to Verify Your System End-to-End

Follow these steps in order to ensure everything is working.

---

## Step 1: Open Automated Test Page (Easiest!)

### Option A: Automated Testing (Recommended)

1. **Open in browser:**
   ```
   workshops/test-e2e.html
   ```

2. **Click:** "🚀 Run All Tests"

3. **Expected Result:**
   ```
   ✅ Tests Passed: 11/11
   🎉 ALL TESTS PASSED! Your system is ready!
   ```

4. **If any tests fail:**
   - Read the error message
   - Check troubleshooting section below
   - Fix the issue
   - Run tests again

---

## Step 2: Manual Booking Test (Complete Flow)

### 2.1 Start a Booking

1. **Open:**
   ```
   workshops/booking.html?workshop=service-10
   ```

2. **Verify dropdown shows:**
   - "Understanding Technology & AI (Recommended)"
   - At least one event with available seats
   - Separator line
   - "Browse All Other Workshops" section

3. **Select an event** and click "Continue"

---

### 2.2 Fill Personal Details

**Step 2 of 5:**
- Name: `Test User`
- Email: Your actual email (you'll check it later)
- Phone: `021 123 4567`

Click "Continue"

---

### 2.3 Fill Professional Info

**Step 3 of 5:**
- Organization: `Test Company`
- Designation: `Software Tester`

Click "Continue"

---

### 2.4 Set Preferences

**Step 4 of 5:**
- ☑️ Newsletter opt-in (check it)
- ☑️ Promo opt-in (check it)

Click "Continue"

---

### 2.5 Review and Payment

**Step 5 of 5:**

**Verify these details are shown:**
- ✅ Workshop name
- ✅ Event date and time
- ✅ Your name and email
- ✅ Organization
- ✅ Price

Click **"Proceed to Payment"**

**What should happen:**
1. Loading spinner appears (5-10 seconds)
2. Redirects to Stripe checkout page
3. Stripe page shows workshop details and price

**If it fails here:**
- ❌ Check browser console (F12) for errors
- ❌ Verify Stripe secret key updated in Apps Script
- ❌ Verify you deployed NEW VERSION in Apps Script

---

### 2.6 Complete Stripe Payment

**On Stripe checkout page:**

**Enter these test details:**
```
Email: test@example.com
Card Number: 4242 4242 4242 4242
Expiry: 12/26
CVC: 123
ZIP: 12345
Name on card: Test User
```

Click **"Pay"**

**What should happen:**
1. Payment processes (2-5 seconds)
2. Shows "Payment successful"
3. Redirects back to your website
4. Lands on `booking-success.html`

---

### 2.7 Verify Success Page

**On success page, check:**
- ✅ "Booking Confirmed" message
- ✅ Booking reference number shown
- ✅ Workshop details displayed
- ✅ Event date and time shown

**Take note of the booking reference number!**

---

## Step 3: Verify Data in Google Sheets

### 3.1 Check Bookings Sheet

1. **Open your Google Sheet:**
   "Wolfgramm Holdings - Workshop Bookings"

2. **Go to "Bookings" tab**

3. **Find the last row (your test booking)**

4. **Verify these columns:**
   - ✅ Booking ID: Starts with "BK-"
   - ✅ Event ID: Matches the event you selected
   - ✅ Customer Name: "Test User"
   - ✅ Email: Your email address
   - ✅ Phone: "021 123 4567"
   - ✅ Organization: "Test Company"
   - ✅ Designation: "Software Tester"
   - ✅ Number of Seats: 1
   - ✅ Total Amount: Price of workshop
   - ✅ Stripe Payment ID: Starts with "cs_test_"
   - ✅ Payment Status: "completed" or "paid"
   - ✅ Newsletter Opt-in: TRUE
   - ✅ Promo Opt-in: TRUE
   - ✅ Booking Timestamp: Recent date/time
   - ✅ Status: "confirmed" or "active"

**Screenshot this for your records!**

---

### 3.2 Check Seats Decremented

1. **Go to "Scheduled Events" tab**

2. **Find the event you booked**

3. **Check "Available Seats" column:**
   - Should be 1 less than before
   - Example: Was 15, now 14

**This confirms seat inventory is working!** ✅

---

## Step 4: Check Email (Optional)

### 4.1 Customer Confirmation Email

**Check inbox for:** Your email address

**Look for:**
- Subject: "Booking Confirmation" or similar
- From: info@wgholdings.co.nz or bookings@wgholdings.co.nz
- Contains:
  - Booking reference
  - Workshop details
  - Date and time
  - Next steps

**If no email:**
- ⚠️ Email notifications might not be configured yet
- ⚠️ This is optional for Phase 1
- ⚠️ Can be added later

---

### 4.2 Admin Notification Email

**Check inbox for:** info@wgholdings.co.nz

**Look for:**
- Subject: "New Booking" or similar
- Contains customer details
- Contains booking reference

---

## Step 5: Test Different Scenarios

### 5.1 Test Workshop Pre-Selection

**Open each of these URLs:**

```
workshops/booking.html?workshop=service-1
workshops/booking.html?workshop=service-10
workshops/booking.html?workshop=service-13
```

**Verify:**
- ✅ Correct workshop shown as "Recommended"
- ✅ That workshop's events listed first
- ✅ Can still browse other workshops

---

### 5.2 Test All Workshop Pages

1. **Open:** `workshops/index.html`

2. **Click "Book Now" on 3-5 different workshops**

3. **Verify each time:**
   - ✅ Correct workshop pre-selected
   - ✅ Dropdown populated
   - ✅ Form works

---

### 5.3 Test Mobile (Optional)

**On your phone:**
1. Open workshops/booking.html
2. Complete a test booking
3. Verify:
   - ✅ Form looks good
   - ✅ Dropdown works
   - ✅ Payment works

---

## 🎯 Success Criteria

### Minimum Requirements (Must Pass)

- [x] **API Tests:** All 5 API tests pass
- [x] **Booking Form:** All 5 steps work
- [x] **Payment:** Stripe checkout completes
- [x] **Data:** Booking saved to Google Sheets
- [x] **Inventory:** Seats decrement correctly

### Nice to Have (Can Add Later)

- [ ] Email notifications working
- [ ] Admin dashboard functional
- [ ] Mobile tested
- [ ] All 19 workshops tested

---

## 🐛 Troubleshooting

### Issue: Automated tests fail at API

**Symptoms:** testAPIConnection fails

**Fix:**
1. Check APPS_SCRIPT_URL in config.js
2. Verify Apps Script deployed
3. Test URL directly in browser:
   ```
   https://script.google.com/macros/s/YOUR_ID/exec?action=getWorkshops
   ```

---

### Issue: Automated tests fail at Stripe

**Symptoms:** testStripeInit fails

**Fix:**
1. Check STRIPE_PUBLISHABLE_KEY in config.js
2. Verify it starts with `pk_test_`
3. Check Stripe.js is loaded (should be in test-e2e.html)

---

### Issue: "Proceed to Payment" button fails

**Symptoms:** Click button, nothing happens or error shown

**Fix:**
1. Open browser console (F12)
2. Look for error message
3. Common causes:
   - ❌ Stripe secret key not in Apps Script
   - ❌ Apps Script not deployed as NEW VERSION
   - ❌ Keys from different Stripe accounts

**Solution:**
1. Update Configuration.gs in Apps Script with secret key
2. Deploy → Manage deployments → Edit → New version → Deploy
3. Try again

---

### Issue: Payment works but booking not saved

**Symptoms:** Success page shows but no row in Google Sheets

**Fix:**
1. Check Apps Script logs:
   - Go to script.google.com
   - Your project → Executions
   - Look for errors in `verifyPayment` or `createBooking`

2. Common causes:
   - ❌ SHEET_ID not configured in Configuration.gs
   - ❌ Sheet names don't match
   - ❌ Apps Script needs permission

**Solution:**
1. Update SHEET_ID in Configuration.gs
2. Verify sheet names: "Bookings", "Scheduled Events", "Workshop Catalog"
3. Run a function manually in Apps Script to grant permissions

---

### Issue: Seats don't decrement

**Symptoms:** Booking saved but available seats stay same

**Fix:**
1. Check Apps Script logs for `decrementSeats` function
2. Verify column headers in "Scheduled Events" sheet
3. Ensure "Available Seats" column is NUMBER format, not text

---

## ✅ Final Checklist

After completing all tests above:

### Configuration
- [ ] config.js has correct Apps Script URL
- [ ] config.js has correct Stripe publishable key
- [ ] Configuration.gs has correct Stripe secret key
- [ ] Configuration.gs has correct Sheet ID
- [ ] Apps Script deployed as NEW VERSION

### Automated Tests
- [ ] test-e2e.html shows all tests passing
- [ ] API layer: 5/5 pass
- [ ] Payment layer: 3/3 pass
- [ ] Data layer: 3/3 pass

### Manual Test
- [ ] Completed full booking flow
- [ ] Redirected to Stripe successfully
- [ ] Payment processed with test card
- [ ] Redirected to success page
- [ ] Booking appears in Google Sheets
- [ ] Seats decremented in Google Sheets

### Workshop Pages
- [ ] All 19 "Book Now" buttons work
- [ ] Workshop pre-selection works
- [ ] Can browse all workshops
- [ ] Dropdown populates correctly

### Ready for Production
- [ ] All tests above passed
- [ ] Tested on live website (not localhost)
- [ ] Mobile tested (optional)
- [ ] Ready to switch to live Stripe keys

---

## 🚀 Going Live

Once all tests pass:

1. **Switch to Live Stripe Keys:**
   - config.js: Update to `pk_live_...`
   - Configuration.gs: Update to `sk_live_...`
   - Deploy NEW VERSION

2. **Add Real Events:**
   - Open Google Sheets "Scheduled Events"
   - Add upcoming workshop dates
   - Set realistic prices
   - Set Status = "Active"

3. **Announce:**
   - Update website
   - Email customers
   - Social media
   - Start taking bookings!

4. **Monitor:**
   - Check Google Sheets regularly
   - Monitor Stripe dashboard
   - Read confirmation emails
   - Track seat availability

---

## 📊 Success Metrics

**You'll know it's working when:**
- ✅ Customers can book without help
- ✅ Payments process automatically
- ✅ Bookings appear in Google Sheets
- ✅ Seats decrement correctly
- ✅ No errors in browser console
- ✅ No errors in Apps Script logs
- ✅ Confirmation emails sent (if configured)

---

## 🎉 You're Done!

If you've completed all steps and all tests pass:

**🎊 Congratulations! Your booking system is fully operational! 🎊**

**What you've built:**
- ✅ Professional booking form
- ✅ Integrated payment processing
- ✅ Automated inventory management
- ✅ Data collection in Google Sheets
- ✅ Multi-step user experience
- ✅ Mobile-responsive design

**Next steps:**
- Add more events
- Customize email templates
- Build admin dashboard
- Add reporting
- Integrate with GoHighLevel CRM (Phase 2)

---

**Need help?**
- See `docs/END-TO-END-TESTING.md` for detailed guide
- Check `docs/ARCHITECTURE-MAP.md` for system overview
- Review `docs/STRIPE-QUICK-FIX.md` for Stripe issues

**Time to complete:** 15-20 minutes  
**Difficulty:** Easy with automated tests!

