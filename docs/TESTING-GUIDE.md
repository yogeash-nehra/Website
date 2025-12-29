# Testing Guide - Workshop Booking System

## 🧪 Pre-Testing Setup

Before testing, ensure:
1. ✅ Google Sheets is set up with sample data
2. ✅ Apps Script is deployed and accessible
3. ✅ Frontend config.js has correct URLs and keys
4. ✅ Using Stripe **TEST MODE** keys

## 🎯 Test Scenarios

### Scenario 1: Complete Successful Booking

**Objective:** Test the entire booking flow from start to finish

**Steps:**
1. Navigate to `workshops/index.html`
2. Click "Book Now" on any workshop (e.g., "Understanding Technology & AI")
3. Verify you're redirected to `booking.html?event=understanding-tech-ai-11-feb-26`
4. Verify workshop details load correctly
5. Fill out personal details:
   - Name: Test User
   - Email: test@example.com
   - Phone: 021 123 4567
6. Click "Continue"
7. Fill professional details (optional):
   - Organization: Test Company
   - Designation: Tester
8. Click "Continue"
9. Select both marketing opt-ins
10. Click "Continue"
11. Review all details on final page
12. Click "Proceed to Secure Payment"
13. On Stripe Checkout page, use test card:
    - Card: `4242 4242 4242 4242`
    - Expiry: Any future date (e.g., 12/26)
    - CVC: Any 3 digits (e.g., 123)
    - Name: Test User
14. Click "Pay"
15. Verify redirect to `booking-success.html?session_id=...`
16. Verify booking confirmation displays
17. Check email for confirmation
18. Check Google Sheets "Bookings" tab for new entry
19. Check "Scheduled Events" tab - verify seat count decreased by 1

**Expected Results:**
- ✅ All steps complete without errors
- ✅ Booking confirmation shows correct details
- ✅ Email received (customer + admin)
- ✅ Data saved to Google Sheets
- ✅ Available seats decremented

---

### Scenario 2: Payment Failure

**Objective:** Test handling of failed payments

**Steps:**
1. Start booking process (steps 1-12 from Scenario 1)
2. On Stripe Checkout, use declined test card:
   - Card: `4000 0000 0000 0002`
   - Complete other fields
3. Click "Pay"
4. Verify payment declined message appears
5. Close Stripe Checkout or click back
6. Verify redirect to `booking-failed.html`
7. Verify helpful error message displays
8. Click "Try Booking Again"
9. Verify returns to booking form with event pre-selected

**Expected Results:**
- ✅ Payment fails gracefully
- ✅ No booking created in sheets
- ✅ No seats decremented
- ✅ User can retry easily
- ✅ No charge to card

---

### Scenario 3: User Cancels Booking

**Objective:** Test cancellation flow

**Steps:**
1. Start booking process (steps 1-12 from Scenario 1)
2. On Stripe Checkout, click the back button or close modal
3. Verify redirect to `booking-failed.html?event=...`
4. Verify cancellation message displays
5. Check Google Sheets - no booking created
6. Check event seats - unchanged

**Expected Results:**
- ✅ Graceful cancellation handling
- ✅ No data saved
- ✅ No seats decremented
- ✅ Clear messaging to user

---

### Scenario 4: Workshop Sold Out

**Objective:** Test behavior when event is full

**Steps:**
1. In Google Sheets "Scheduled Events", set an event's available seats to 0
2. Navigate to `workshops/index.html`
3. Wait 2 minutes or refresh page
4. Locate the sold-out event
5. Verify "Book Now" button shows "Sold Out"
6. Verify button is disabled
7. Verify "Sold Out" badge displays
8. Try accessing booking page directly: `booking.html?event=sold-out-event-id`
9. Verify appropriate error message

**Expected Results:**
- ✅ Sold out events clearly marked
- ✅ Booking button disabled
- ✅ Cannot complete booking for sold-out event
- ✅ Helpful error messages

---

### Scenario 5: Nearly Full Workshop

**Objective:** Test urgency indicators

**Steps:**
1. In Google Sheets "Scheduled Events", set an event to 3 available seats
2. Navigate to `workshops/index.html`
3. Wait 2 minutes or refresh page
4. Locate the nearly-full event
5. Verify "3 seats left" badge displays
6. Verify "Nearly Full!" badge displays
7. Complete a booking for this event
8. Verify seats decrease to 2
9. Refresh workshop page
10. Verify "2 seats left" displays

**Expected Results:**
- ✅ Urgency badges display correctly
- ✅ Real-time seat counts accurate
- ✅ Visual indicators help drive conversions

---

### Scenario 6: Form Validation

**Objective:** Test all form validations work

**Steps:**
1. Navigate to booking form
2. Try clicking "Continue" on step 1 without selecting workshop
   - ✅ Error: "Please select a workshop"
3. Select workshop and continue to step 2
4. Leave name field empty and click "Continue"
   - ✅ Field highlights in red
   - ✅ Error message displays
5. Enter invalid email (e.g., "notanemail")
   - ✅ Email field shows error
6. Enter valid email but no phone
   - ✅ Phone field shows error
7. Fill all required fields correctly
   - ✅ Can proceed to next step
8. Test back button navigation
   - ✅ Returns to previous step
   - ✅ Data persists

**Expected Results:**
- ✅ All validations work
- ✅ Clear error messages
- ✅ Cannot proceed with invalid data
- ✅ Navigation works smoothly

---

### Scenario 7: Admin Dashboard

**Objective:** Test admin interface and CSV export

**Steps:**
1. Complete 2-3 test bookings (Scenario 1)
2. Navigate to `admin/workshop-admin.html`
3. Verify dashboard loads
4. Check statistics cards:
   - Total bookings count
   - Total revenue sum
   - Active workshops count
   - Seats booked total
5. Verify bookings table displays all bookings
6. Test search:
   - Search by customer name
   - Search by email
   - Search by booking ID
7. Test status filter (Confirmed/Cancelled)
8. Click "Export CSV" button
9. Open downloaded CSV file
10. Verify all booking data present
11. Click "Refresh" button
12. Verify data reloads

**Expected Results:**
- ✅ Dashboard displays correctly
- ✅ Stats are accurate
- ✅ Table shows all bookings
- ✅ Search/filter work
- ✅ CSV exports complete data
- ✅ Refresh updates data

---

### Scenario 8: Mobile Responsiveness

**Objective:** Test on mobile devices

**Steps:**
1. Open Chrome DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 Pro
4. Navigate through entire booking flow
5. Test all form steps
6. Verify:
   - Form is readable
   - Buttons are tappable
   - Navigation works
   - Stripe Checkout is mobile-friendly
7. Test on Android (Pixel 5)
8. Test on tablet (iPad)

**Expected Results:**
- ✅ Fully responsive on all devices
- ✅ No horizontal scrolling
- ✅ All buttons accessible
- ✅ Forms easy to fill on mobile
- ✅ Success/failure pages mobile-friendly

---

### Scenario 9: Email Notifications

**Objective:** Verify email system works

**Prerequisites:**
- Configure Gmail in Apps Script
- Use real email addresses for testing

**Steps:**
1. Complete successful booking (Scenario 1)
2. Check customer email inbox
3. Verify booking confirmation received within 2 minutes
4. Check email contains:
   - Booking reference
   - Workshop details
   - Date and time
   - Location
   - Amount paid
   - Next steps
5. Check admin email inbox
6. Verify admin notification received
7. Check admin email contains:
   - Customer details
   - Workshop info
   - Payment details
   - Marketing preferences

**Expected Results:**
- ✅ Emails send automatically
- ✅ Contain all required information
- ✅ Professional formatting
- ✅ Links work correctly

---

### Scenario 10: Concurrent Bookings

**Objective:** Test seat locking mechanism

**Setup:**
- Set event to 1 available seat
- Open booking form in 2 browser windows

**Steps:**
1. Window 1: Start booking process for event
2. Window 2: Start booking process for same event
3. Window 1: Complete through to payment
4. Window 2: Complete through to payment
5. Window 1: Complete payment first
6. Window 2: Try to complete payment
7. Verify Window 2 gets error about sold out
8. Check sheets - only 1 booking created
9. Check seats - decremented only once

**Expected Results:**
- ✅ Locking prevents double-booking
- ✅ Only first payment succeeds
- ✅ Second user gets clear error
- ✅ Data integrity maintained

---

## 🔍 API Testing

### Test API Endpoints Directly

Use a tool like Postman or browser console:

```javascript
// Test 1: Get all workshops
fetch('YOUR_APPS_SCRIPT_URL?action=getWorkshops')
  .then(r => r.json())
  .then(console.log);

// Test 2: Get events for workshop
fetch('YOUR_APPS_SCRIPT_URL?action=getEvents&workshopId=service-10')
  .then(r => r.json())
  .then(console.log);

// Test 3: Check availability
fetch('YOUR_APPS_SCRIPT_URL?action=checkAvailability&eventId=understanding-tech-ai-11-feb-26')
  .then(r => r.json())
  .then(console.log);
```

**Expected Results:**
- ✅ All endpoints return 200 OK
- ✅ Data structure is correct
- ✅ Error handling works

---

## 📊 Test Results Template

Use this template to track your testing:

| Scenario | Status | Notes | Issues |
|----------|--------|-------|--------|
| 1. Successful Booking | ⬜ | | |
| 2. Payment Failure | ⬜ | | |
| 3. User Cancels | ⬜ | | |
| 4. Sold Out | ⬜ | | |
| 5. Nearly Full | ⬜ | | |
| 6. Form Validation | ⬜ | | |
| 7. Admin Dashboard | ⬜ | | |
| 8. Mobile Responsive | ⬜ | | |
| 9. Emails | ⬜ | | |
| 10. Concurrent Bookings | ⬜ | | |

Legend: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

## 🐛 Common Issues & Solutions

### Issue: Workshop dropdown empty
**Solution:** Check APPS_SCRIPT_URL in config.js, verify Apps Script deployed

### Issue: Payment not processing
**Solution:** Verify Stripe keys are test keys, check Stripe Dashboard

### Issue: Seats not decrementing
**Solution:** Check sheet permissions, verify LockService in BookingService.gs

### Issue: Emails not sending
**Solution:** Check Gmail API authorization in Apps Script

### Issue: Admin dashboard empty
**Solution:** Add getBookings endpoint to Code.gs (see AdminEndpoint.gs)

---

## ✅ Testing Complete Checklist

- [ ] All 10 scenarios pass
- [ ] All API endpoints work
- [ ] No console errors
- [ ] Mobile responsiveness verified
- [ ] Email notifications working
- [ ] Admin dashboard functional
- [ ] CSV export works
- [ ] Security measures in place
- [ ] Error handling graceful
- [ ] Documentation reviewed

---

## 🚀 Ready for Production

Once all tests pass:
1. Switch from Stripe test mode to live mode
2. Update config.js with live Stripe key
3. Do one final live test (then refund)
4. Monitor first few real bookings closely
5. Set up ongoing monitoring

**Good luck with your workshop bookings! 🎉**

