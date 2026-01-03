# 🧪 Final End-to-End Test Guide

**System Status**: ✅ READY FOR TESTING  
**Date**: January 4, 2026  
**Test Environment**: Live Site (https://yogeash-nehra.github.io)

---

## 🎯 Complete Booking Flow Test

Follow these steps to verify your entire booking system works end-to-end.

---

### Test 1: Complete Booking with Payment

#### Step 1: Navigate to Workshops Page
1. Open: https://yogeash-nehra.github.io/Website/workshops/
2. **Expected**: Page loads with workshop listings
3. **Check**: Each workshop shows availability status

#### Step 2: Click Book Now
1. Find any workshop (e.g., "Service Excellence & Innovation")
2. Click the **"Book Now"** button
3. **Expected**: Redirect to booking page with workshop pre-selected
4. **URL should contain**: `?workshop=service-1` (or similar)

#### Step 3: Select Event (Step 1)
1. **Check**: Dropdown shows events grouped by workshop
2. **Check**: Pre-selected workshop events appear first
3. Select an event with available seats
4. **Check**: Event details display (date, time, venue, price)
5. Click **"Continue"**
6. **Expected**: Move to Step 2

#### Step 4: Enter Personal Details (Step 2)
Fill in the form:
```
Full Name: Test User
Email: test@example.com (use real email to receive confirmation)
Phone: +64 22 123 4567
```

**Validation checks:**
- ✅ Name must not be empty
- ✅ Email must be valid format
- ✅ Phone must be valid format

Click **"Continue"**  
**Expected**: Move to Step 3

#### Step 5: Organization Details (Step 3)
Fill in (optional):
```
Organization: Test Company
Designation: Manager
```

Click **"Continue"**  
**Expected**: Move to Step 4

#### Step 6: Marketing Preferences (Step 4)
Choose your preferences:
- [ ] Subscribe to newsletter
- [ ] Receive promotional offers

Click **"Continue"**  
**Expected**: Move to Step 5 (Review)

#### Step 7: Review Details (Step 5)
**Check all details are displayed correctly:**
- ✅ Workshop name
- ✅ Event date and time
- ✅ Venue location
- ✅ Your name, email, phone
- ✅ Organization (if provided)
- ✅ Total price

Click **"Proceed to Payment"**

**Watch for:**
1. Button changes to "Processing..." with spinner
2. Console log: `💳 Creating checkout session...`
3. Console log: `📤 POST Request: validateBooking`
4. Console log: `✅ POST Response status: 200`
5. Console log: `📤 POST Request: createCheckoutSession`
6. Console log: `✅ Checkout session created: cs_test_...`
7. **Expected**: Redirect to Stripe Checkout page

#### Step 8: Complete Payment on Stripe
You should now be on Stripe's checkout page.

**Use Stripe Test Card:**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

Click **"Pay"**

**Expected**: Payment processes and redirects back to your site

#### Step 9: Confirmation Page
**Expected**: Land on booking-success.html

**Check:**
- ✅ Success message displayed
- ✅ Booking details shown
- ✅ Confirmation number present
- ✅ "View Workshops" button works

---

### Test 2: Verify Backend Data

#### Check Google Sheets
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1o3dEiDxD0lf8YnndgO9ivNbvq_aSXYkybSCb6cx5lqo/edit
2. Go to **"Bookings"** tab
3. **Expected**: New row with booking details
4. **Check fields**:
   - Booking ID
   - Event ID
   - Customer Name
   - Email
   - Phone
   - Organization
   - Stripe Session ID
   - Payment Status: "completed"
   - Booking Date

#### Check Scheduled Events Sheet
1. Still in Google Sheets
2. Go to **"Scheduled Events"** tab
3. Find the event you booked
4. **Expected**: "Available Seats" decreased by 1

#### Check Stripe Dashboard
1. Go to: https://dashboard.stripe.com/test/payments
2. **Expected**: See your test payment
3. **Check**: Payment status is "Succeeded"
4. **Check**: Amount matches workshop price

#### Check Email (if real email used)
1. Check inbox for confirmation email
2. **Expected**: Email from Wolfgramm Holdings
3. **Subject**: Booking Confirmation
4. **Content**: Booking details and event information

---

### Test 3: Cancel Payment Flow

#### Step 1-7: Same as Test 1
Follow steps 1-7 from Test 1 to reach Stripe checkout

#### Step 8: Cancel on Stripe
On Stripe checkout page, click the **back arrow** or **close button**

**Expected**: Redirect to booking-failed.html

**Check:**
- ✅ Cancellation message displayed
- ✅ "Try Again" button goes back to booking page
- ✅ No booking created in Google Sheets

---

### Test 4: Error Handling

#### Test 4A: Invalid Email
1. Go to booking page
2. In Step 2, enter invalid email: `notanemail`
3. Try to continue
4. **Expected**: Validation error message
5. **Expected**: Cannot proceed until fixed

#### Test 4B: Event Becomes Full
This tests race conditions (harder to test alone):
1. Manually set "Available Seats" to 1 in Google Sheets for an event
2. Start booking that event
3. Before payment, manually set "Available Seats" to 0
4. Try to proceed to payment
5. **Expected**: Error message about event being full

#### Test 4C: Network Error
1. Open browser DevTools (F12)
2. Go to Network tab
3. Enable "Offline" mode
4. Try to proceed to payment
5. **Expected**: Graceful error message
6. **Expected**: No system crash

---

### Test 5: Multiple Workshop Bookings

#### From Workshop Listing
1. Go to workshops page
2. Click "Book Now" for Workshop A
3. **Expected**: Pre-selects Workshop A events
4. **Check**: Can also see and select events from Workshop B, C, etc.
5. Complete booking for any event

---

### Test 6: Direct Booking Link

#### With Event Parameter
1. Open: `https://yogeash-nehra.github.io/Website/workshops/booking.html?event=event-1`
2. **Expected**: Event event-1 is pre-selected
3. **Expected**: Form ready to fill

#### With Workshop Parameter
1. Open: `https://yogeash-nehra.github.io/Website/workshops/booking.html?workshop=service-1`
2. **Expected**: Dropdown shows service-1 events first
3. **Expected**: Can select from all available events

---

## 🎯 Key Things to Verify

### Console Logs (Press F12 → Console)

**On Page Load:**
```
✅ 📝 Initializing booking form...
✅ 🔄 Loading workshops...
✅ 📦 Using cached data for: getAllEvents (if repeated visits)
✅ ✅ Workshops loaded successfully
✅ 🎉 Booking form ready
```

**When Proceeding to Payment:**
```
✅ 💳 Creating checkout session...
✅ 📤 POST Request: validateBooking
✅ 📥 POST Response status: 200
✅ 📊 POST Result: {success: true, data: {valid: true, availableSeats: X}}
✅ 📤 POST Request: createCheckoutSession
✅ 📥 POST Response status: 200
✅ ✅ Checkout session created: cs_test_xxxxx
✅ 🔄 Redirecting to Stripe Checkout...
```

### Network Tab (F12 → Network)

**GET Requests:**
```
✅ getAllEvents → Status: 200, Type: xhr
✅ getWorkshops → Status: 200, Type: xhr
```

**POST Requests:**
```
✅ validateBooking → Status: 200, Type: xhr
✅ createCheckoutSession → Status: 200, Type: xhr
```

**NO CORS Errors:**
```
❌ Should NOT see: "blocked by CORS policy"
❌ Should NOT see: "Access-Control-Allow-Origin"
```

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch"

**Cause**: Apps Script not deployed as new version  
**Fix**:
1. Go to Apps Script
2. Deploy → Manage deployments → Edit
3. Version: "New version"
4. Deploy

### Issue: "Invalid Stripe key"

**Cause**: Mismatched keys (test/live)  
**Fix**:
1. Check `Configuration.gs` has `sk_test_...`
2. Check `config.js` has `pk_test_...`
3. Both must be from same Stripe account

### Issue: No redirect to Stripe

**Cause**: Session not created or Stripe script not loaded  
**Fix**:
1. Check console for errors
2. Verify Stripe publishable key in config.js
3. Check network tab for createCheckoutSession response

### Issue: Booking not in Google Sheets

**Cause**: confirmBooking not called after payment  
**Fix**:
1. Check Stripe success URL is correct
2. Verify webhook handling (Phase 2 feature)
3. For now, manual confirmation needed on success page

---

## ✅ Success Criteria

Your system is working if:

- [x] Booking form loads without errors
- [x] Events populate in dropdown
- [x] All form validation works
- [x] Can navigate through all 5 steps
- [x] Review page shows correct details
- [x] "Proceed to Payment" redirects to Stripe
- [x] Can complete test payment
- [x] Redirects to success page
- [x] No CORS errors in console
- [x] No JavaScript errors in console

---

## 🎊 You're Ready!

If all tests pass, your booking system is **fully operational** and ready to accept real bookings!

### To Switch to Live Mode:

1. Get live Stripe keys from dashboard
2. Update `Configuration.gs` with live secret key
3. Update `config.js` with live publishable key
4. Deploy new Apps Script version
5. Test with real card (small amount)
6. Start accepting real bookings! 🚀

---

## 📊 Monitoring Tips

### Daily Checks
- Google Sheets: New bookings appearing
- Stripe Dashboard: Payments processing
- Email inbox: Confirmations being sent

### Weekly Reviews
- Seat availability accuracy
- Payment success rate
- User feedback/issues

### Before Each Workshop
- Confirm all bookings received
- Send reminder emails
- Prepare attendee list

---

*Happy Testing!* 🎉

*Last Updated: January 4, 2026*

