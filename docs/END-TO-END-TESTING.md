# 🧪 End-to-End Testing Checklist

## ✅ Pre-Flight Checks

### 1. Verify Configuration Files

**Frontend (config.js):**
- [x] Apps Script URL: `https://script.google.com/macros/s/AKfycbxr9yA3Z8SuVWtZ2jfdI7SQdWFy1qn05SUq4KEUgBZHbGbfrFIGIXeZtldzH2ktXmvM/exec`
- [x] Stripe Publishable Key: `pk_test_51RHwYvRNR3TqkgX2...` ✅

**Backend (Apps Script Configuration.gs):**
- [ ] Stripe Secret Key: `sk_test_51RHwYvRNR3TqkgX2...` ⚠️ You need to update
- [ ] Sheet ID: Your Google Sheet ID
- [ ] New version deployed

---

## 🎯 Test Plan (Step-by-Step)

### Phase 1: API Tests (2 minutes)

#### Test 1.1: Check API is Accessible
**Open this URL in browser:**
```
https://script.google.com/macros/s/AKfycbxr9yA3Z8SuVWtZ2jfdI7SQdWFy1qn05SUq4KEUgBZHbGbfrFIGIXeZtldzH2ktXmvM/exec?action=getWorkshops
```

**Expected Result:**
```json
{
  "success": true,
  "data": [
    {
      "workshopId": "service-1",
      "name": "Relational Māori Engagement",
      "price": 150,
      ...
    }
  ]
}
```

**Status:** [ ] ✅ Pass [ ] ❌ Fail

---

#### Test 1.2: Check Events API
**Open this URL in browser:**
```
https://script.google.com/macros/s/AKfycbxr9yA3Z8SuVWtZ2jfdI7SQdWFy1qn05SUq4KEUgBZHbGbfrFIGIXeZtldzH2ktXmvM/exec?action=getAllEvents
```

**Expected Result:**
```json
{
  "success": true,
  "data": [
    {
      "eventId": "event-1",
      "workshopId": "service-10",
      "eventDate": "2026-02-11",
      "availableSeats": 15,
      ...
    }
  ]
}
```

**Status:** [ ] ✅ Pass [ ] ❌ Fail

**If this passes, your API is working!** ✅

---

### Phase 2: Booking Form Tests (3 minutes)

#### Test 2.1: Load Booking Page
**Open:**
```
workshops/booking.html
```

**Check:**
- [ ] Page loads without errors
- [ ] No console errors (F12)
- [ ] Workshop dropdown is populated
- [ ] Shows "Select a workshop" placeholder

**Status:** [ ] ✅ Pass [ ] ❌ Fail

---

#### Test 2.2: Workshop Pre-Selection
**Open:**
```
workshops/booking.html?workshop=service-10
```

**Check:**
- [ ] Dropdown shows "Understanding Technology & AI (Recommended)"
- [ ] All dates for service-10 listed first
- [ ] Separator line visible
- [ ] "Browse All Other Workshops" section below
- [ ] First event is pre-selected

**Status:** [ ] ✅ Pass [ ] ❌ Fail

---

#### Test 2.3: Form Navigation
**Fill out the form:**

**Step 1 - Select Workshop:**
- [ ] Select an event with available seats
- [ ] Click "Continue"
- [ ] Advances to Step 2

**Step 2 - Personal Details:**
- [ ] Name: Test User
- [ ] Email: your-email@test.com
- [ ] Phone: 021 123 4567
- [ ] Click "Continue"
- [ ] Advances to Step 3

**Step 3 - Professional Info:**
- [ ] Organization: Test Company
- [ ] Designation: Tester
- [ ] Click "Continue"
- [ ] Advances to Step 4

**Step 4 - Preferences:**
- [ ] Check/uncheck newsletter opt-in
- [ ] Check/uncheck promo opt-in
- [ ] Click "Continue"
- [ ] Advances to Step 5

**Step 5 - Review:**
- [ ] All details shown correctly
- [ ] "Proceed to Payment" button enabled

**Status:** [ ] ✅ Pass [ ] ❌ Fail

---

### Phase 3: Payment Flow Tests (5 minutes)

#### Test 3.1: Create Booking & Redirect to Stripe

**From Step 5:**
- [ ] Click "Proceed to Payment"
- [ ] Wait for processing (5-10 seconds)

**Expected:**
- [ ] Loading spinner appears
- [ ] Redirects to Stripe checkout page
- [ ] Stripe page shows:
  - Workshop name
  - Price in NZD
  - Wolfgramm Holdings as merchant

**Status:** [ ] ✅ Pass [ ] ❌ Fail

**If this fails:**
- Check browser console (F12) for errors
- Verify Stripe secret key updated in Apps Script
- Verify new version deployed

---

#### Test 3.2: Complete Stripe Payment

**On Stripe checkout page:**

**Enter test card:**
```
Card Number: 4242 4242 4242 4242
Expiry: 12/26 (or any future date)
CVC: 123
ZIP: 12345
Name: Test User
Email: test@example.com
```

- [ ] Click "Pay"
- [ ] Payment processes
- [ ] Redirects back to your site

**Status:** [ ] ✅ Pass [ ] ❌ Fail

---

#### Test 3.3: Success Page & Verification

**After payment:**
- [ ] Lands on `booking-success.html`
- [ ] Shows booking confirmation
- [ ] Displays booking reference number
- [ ] Shows workshop details

**Status:** [ ] ✅ Pass [ ] ❌ Fail

---

### Phase 4: Data Verification (2 minutes)

#### Test 4.1: Check Google Sheets - Bookings

**Open your Google Sheet → "Bookings" tab**

**Check last row:**
- [ ] New booking row added
- [ ] Booking ID populated
- [ ] Event ID matches selected event
- [ ] Customer name: "Test User"
- [ ] Email: your-email@test.com
- [ ] Phone: 021 123 4567
- [ ] Organization: Test Company
- [ ] Stripe Payment ID starts with "cs_test_"
- [ ] Payment Status: "completed" or "paid"
- [ ] Timestamp is recent

**Status:** [ ] ✅ Pass [ ] ❌ Fail

---

#### Test 4.2: Check Google Sheets - Seats Decremented

**Open your Google Sheet → "Scheduled Events" tab**

**Find the event you booked:**
- [ ] Available Seats decreased by 1
- [ ] Example: Was 15, now 14

**Status:** [ ] ✅ Pass [ ] ❌ Fail

---

### Phase 5: Email Notifications (2 minutes)

#### Test 5.1: Check Customer Email

**Check inbox for:** your-email@test.com

**Expected email:**
- [ ] Subject: "Booking Confirmation - [Workshop Name]"
- [ ] From: bookings@wgholdings.co.nz or your domain
- [ ] Contains:
  - Booking reference
  - Workshop details
  - Date and time
  - Payment confirmation

**Status:** [ ] ✅ Pass [ ] ❌ Fail [ ] ⚠️ Not configured yet

---

#### Test 5.2: Check Admin Email

**Check inbox for:** info@wgholdings.co.nz

**Expected email:**
- [ ] Subject: "New Booking - [Workshop Name]"
- [ ] Contains customer details
- [ ] Contains booking reference

**Status:** [ ] ✅ Pass [ ] ❌ Fail [ ] ⚠️ Not configured yet

---

## 🐛 Troubleshooting Guide

### Issue 1: Dropdown is Empty

**Symptoms:** No workshops appear in dropdown

**Check:**
1. Open browser console (F12)
2. Look for errors
3. Run: `await sheetsAPI.getAllEvents()`

**Common Causes:**
- ❌ Apps Script URL wrong in config.js
- ❌ No events in "Scheduled Events" sheet
- ❌ Events have Status ≠ "Active"
- ❌ CORS issue (test on live site, not localhost)

**Fix:**
- Verify APPS_SCRIPT_URL in config.js
- Add events to Google Sheets
- Set Status = "Active"
- Use VS Code Live Server or test on live site

---

### Issue 2: "Proceed to Payment" Fails

**Symptoms:** Error when clicking payment button

**Check:**
1. Browser console (F12)
2. Look for Stripe-related errors

**Common Causes:**
- ❌ Stripe secret key not updated in Apps Script
- ❌ Stripe publishable key incorrect in config.js
- ❌ Keys from different Stripe accounts
- ❌ Apps Script not deployed with new version

**Fix:**
1. Update Configuration.gs with secret key
2. Deploy NEW VERSION (not just save!)
3. Verify keys match (both from same Stripe account)
4. Check Apps Script logs (View → Executions)

---

### Issue 3: Payment Works but Booking Not Saved

**Symptoms:** Success page shows but no data in Google Sheets

**Check:**
1. Apps Script logs (script.google.com → your project → View → Executions)
2. Look for errors in `verifyPayment` function

**Common Causes:**
- ❌ Sheet ID not configured in Configuration.gs
- ❌ Sheet names don't match exactly
- ❌ Apps Script doesn't have permission to write to sheet

**Fix:**
1. Update SHEET_ID in Configuration.gs
2. Verify sheet names: "Bookings", "Scheduled Events"
3. Run Apps Script function manually to grant permissions

---

### Issue 4: Seats Not Decrementing

**Symptoms:** Booking saved but available seats stay the same

**Check:**
1. Apps Script logs for `decrementSeats` function
2. "Scheduled Events" sheet column headers

**Common Causes:**
- ❌ Column headers don't match exactly
- ❌ Event ID doesn't match
- ❌ Available Seats column is text not number

**Fix:**
1. Verify column headers match documentation
2. Ensure Available Seats column is formatted as number
3. Check Event ID in booking matches Event ID in sheet

---

### Issue 5: No Email Received

**Symptoms:** Everything works but no confirmation email

**Check:**
1. Spam folder
2. Apps Script logs for `sendConfirmationEmail` function
3. Gmail quotas (100 emails/day for free accounts)

**Common Causes:**
- ⚠️ Email not implemented yet (Phase 2 feature)
- ❌ Email address in Apps Script incorrect
- ❌ Gmail API not enabled
- ❌ Daily quota exceeded

**Fix:**
- Email notifications are optional for now
- Can be added in Phase 2
- Manual confirmation works for testing

---

## 📊 Test Results Summary

**Fill this out after testing:**

### API Layer
- [ ] ✅ getWorkshops working
- [ ] ✅ getAllEvents working
- [ ] ✅ checkAvailability working

### Frontend Layer
- [ ] ✅ Booking page loads
- [ ] ✅ Dropdown populated
- [ ] ✅ Workshop pre-selection works
- [ ] ✅ Form validation works
- [ ] ✅ All 5 steps functional

### Payment Layer
- [ ] ✅ Stripe checkout created
- [ ] ✅ Redirects to Stripe
- [ ] ✅ Test payment processes
- [ ] ✅ Redirects to success page

### Database Layer
- [ ] ✅ Booking saved to sheet
- [ ] ✅ Seats decremented
- [ ] ✅ Payment ID recorded

### Email Layer
- [ ] ✅ Customer email sent
- [ ] ✅ Admin email sent
- [ ] ⚠️ Not tested yet
- [ ] ❌ Not working

---

## ✅ Success Criteria

**Minimum for Launch:**
- ✅ All API tests pass
- ✅ Booking form works
- ✅ Payment processes successfully
- ✅ Bookings saved to Google Sheets
- ✅ Seats decrement correctly

**Nice to Have:**
- ⚠️ Email notifications (can add later)
- ⚠️ Admin dashboard (can add later)

---

## 🚀 Quick Test Command

**Run this in browser console (F12) on booking page:**

```javascript
// Quick validation
await validateBookingSystem()

// Should show:
// ✅ Apps Script URL configured
// ✅ API connection successful (19 workshops found)
// ✅ Found X scheduled events
// ✅ Stripe initialized successfully
```

---

## 📝 Testing Notes

**Date Tested:** _____________

**Tester:** _____________

**Test Environment:**
- [ ] Local (file://)
- [ ] Local server (127.0.0.1)
- [ ] Live website (wgholdings.co.nz)

**Browser:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Issues Found:**
_____________________________________________
_____________________________________________
_____________________________________________

**Status:**
- [ ] ✅ All tests passed - Ready for production
- [ ] ⚠️ Minor issues - Can launch with fixes
- [ ] ❌ Major issues - Needs debugging

---

## 🎯 Next Steps After Testing

**If all tests pass:**
1. ✅ System is ready for production
2. Switch to Stripe live keys (pk_live_, sk_live_)
3. Add more events to Google Sheets
4. Announce to customers!

**If tests fail:**
1. Note which phase failed
2. Check troubleshooting guide above
3. Review relevant documentation
4. Re-test after fixes

---

**Ready to test? Start with Phase 1 (API Tests) above!** 🚀

