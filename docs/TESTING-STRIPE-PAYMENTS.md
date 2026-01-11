# 🧪 Testing Stripe Payments (Test Mode)

## Overview

You're using Stripe's **test mode** (sandbox), which means:
- ✅ No real money is charged
- ✅ You can use test card numbers
- ✅ All transactions are simulated
- ✅ Perfect for development and testing

---

## 🎯 Quick Test Flow

### 1. Complete a Test Booking

1. Go to your booking page:
   ```
   http://127.0.0.1:5500/workshops/booking.html?workshop=service-10
   ```

2. **Step 1:** Select a workshop/event
3. **Step 2:** Fill in personal details (use any test email)
4. **Step 3:** Fill in professional info (optional)
5. **Step 4:** Set preferences
6. **Step 5:** Review and click **"Proceed to Secure Payment"**

### 2. You'll Be Redirected to Stripe Checkout

The page should redirect to a Stripe-hosted payment page that looks like this:
```
https://checkout.stripe.com/c/pay/cs_test_...
```

### 3. Use Test Card Numbers

**✅ Successful Payment:**
```
Card Number:  4242 4242 4242 4242
Expiry:       Any future date (e.g., 12/34)
CVC:          Any 3 digits (e.g., 123)
ZIP:          Any 5 digits (e.g., 12345)
```

**❌ Declined Payment:**
```
Card Number:  4000 0000 0000 0002
Expiry:       Any future date
CVC:          Any 3 digits
```

**⚠️ Requires Authentication (3D Secure):**
```
Card Number:  4000 0025 0000 3155
Expiry:       Any future date
CVC:          Any 3 digits
```

[Full list of test cards](https://stripe.com/docs/testing#cards)

### 4. Complete Payment

1. Enter test card details
2. Click **"Pay $150"** (or whatever your workshop price is)
3. Wait for processing...

### 5. Check Success/Failure

**On Success:**
- You'll be redirected to: `/workshops/booking-success.html?session_id=cs_test_...`
- Should see a success message with booking details
- Booking should be recorded in your Google Sheet

**On Failure:**
- You'll be redirected to: `/workshops/booking-failed.html`
- Should see an error/cancellation message

---

## 📊 Monitoring Payments in Stripe Dashboard

### View Test Payments

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/payments)
2. Make sure you're in **TEST MODE** (toggle in top-right)
3. You should see all test payments listed

### What to Check

| Column | What to Look For |
|--------|-----------------|
| **Amount** | Should match workshop price ($150 NZD = 15000 cents) |
| **Status** | Should be "Succeeded" |
| **Customer** | Email you entered in booking form |
| **Description** | Workshop name and date |
| **Metadata** | Should contain eventId, workshopId, customer details |

### View Payment Details

1. Click on a payment
2. Check the **Metadata** section:
   ```json
   {
     "eventId": "event-1",
     "workshopId": "service-10",
     "customerName": "John Doe",
     "email": "john@example.com",
     "phone": "021 123 4567",
     "organization": "Test Company",
     "numSeats": "1",
     "newsletterOptIn": "true",
     "promoOptIn": "false"
   }
   ```

---

## 🧪 Test Scenarios

### Test 1: Successful Payment

**Steps:**
1. Complete booking form
2. Use card: `4242 4242 4242 4242`
3. Complete payment

**Expected Results:**
- ✅ Redirected to success page
- ✅ Payment appears in Stripe Dashboard with "Succeeded" status
- ✅ Booking recorded in Google Sheet "Bookings" tab
- ✅ Available seats decreased in "Scheduled Events" tab
- ✅ Confirmation email sent (if configured)

**Check in Stripe Dashboard:**
```
Status: Succeeded
Amount: $150.00 NZD
Payment Method: •••• 4242
Customer: your-test-email@example.com
```

**Check in Google Sheet:**
Go to "Bookings" tab, should have new row:
```
Booking ID | Event ID | Customer Name | Email | Payment Status | Payment ID | Amount
----------|----------|---------------|-------|----------------|------------|-------
BOOK-xxx  | event-1  | John Doe      | ...   | succeeded      | pi_test... | 150
```

---

### Test 2: Declined Card

**Steps:**
1. Complete booking form
2. Use card: `4000 0000 0000 0002`
3. Try to complete payment

**Expected Results:**
- ❌ Payment fails with "Your card was declined"
- ❌ Redirected to failure page
- ❌ No booking recorded in Google Sheet
- ❌ Available seats unchanged

**Check in Stripe Dashboard:**
```
Status: Failed
Failure Message: Your card was declined
```

---

### Test 3: Authentication Required (3D Secure)

**Steps:**
1. Complete booking form
2. Use card: `4000 0025 0000 3155`
3. Click Pay
4. See authentication modal
5. Click **"Complete"** to pass authentication

**Expected Results:**
- ✅ Shows 3D Secure authentication challenge
- ✅ After completing, payment succeeds
- ✅ Booking recorded

---

### Test 4: User Cancels Payment

**Steps:**
1. Complete booking form
2. On Stripe Checkout page, click **"Back"** or close the page

**Expected Results:**
- ⚠️ Redirected to cancel/failure page
- ⚠️ No booking recorded
- ⚠️ Available seats unchanged

---

## 🔍 Debugging Payment Issues

### Check Browser Console

Open browser console (F12) during payment flow:

**Successful flow should show:**
```
💳 Creating checkout session...
✅ Checkout session created: cs_test_xxx
Redirecting to Stripe...
```

**If there's an error:**
```
❌ Payment error: [error message]
```

### Test API Endpoints Directly

#### Test 1: Validate Booking

```javascript
// In browser console on booking page:
sheetsAPI.validateBooking('event-1', 1)
  .then(result => console.log('✅ Valid:', result))
  .catch(error => console.error('❌ Error:', error));
```

**Expected Result:**
```json
{
  "isAvailable": true,
  "availableSeats": 10,
  "message": "Booking is valid"
}
```

#### Test 2: Create Checkout Session

```javascript
// In browser console on booking page:
const customerData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '021 123 4567',
  organization: 'Test Co',
  designation: 'Tester',
  numSeats: 1,
  newsletterOptIn: true,
  promoOptIn: false
};

sheetsAPI.createCheckoutSession('event-1', customerData)
  .then(session => {
    console.log('✅ Session created:', session);
    console.log('Payment URL:', session.url);
  })
  .catch(error => console.error('❌ Error:', error));
```

**Expected Result:**
```json
{
  "sessionId": "cs_test_a1b2c3d4e5f6...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

---

## 📋 End-to-End Testing Checklist

### Before Testing
- [ ] Stripe Test Mode enabled (check dashboard)
- [ ] Using test Stripe keys (pk_test_... and sk_test_...)
- [ ] Google Sheet has workshop and event data
- [ ] Booking page loads without errors

### During Test
- [ ] Can select workshop from dropdown
- [ ] Can fill in all form fields
- [ ] Form validation works
- [ ] "Proceed to Payment" button works
- [ ] Redirects to Stripe Checkout
- [ ] Can enter test card details
- [ ] Payment processes successfully
- [ ] Redirects to success page

### After Test
- [ ] Success page shows booking details
- [ ] Stripe Dashboard shows payment
- [ ] Google Sheet "Bookings" has new row
- [ ] Google Sheet "Scheduled Events" shows reduced seats
- [ ] Payment metadata is correct in Stripe

---

## 🧪 Common Test Card Numbers

| Scenario | Card Number | Result |
|----------|-------------|--------|
| **Success** | 4242 4242 4242 4242 | Payment succeeds |
| **Declined** | 4000 0000 0000 0002 | Card declined |
| **Insufficient Funds** | 4000 0000 0000 9995 | Insufficient funds error |
| **Expired Card** | 4000 0000 0000 0069 | Expired card error |
| **Incorrect CVC** | 4000 0000 0000 0127 | Incorrect CVC error |
| **Processing Error** | 4000 0000 0000 0119 | Processing error |
| **3D Secure Required** | 4000 0025 0000 3155 | Requires authentication |

**For all cards:**
- Expiry: Any future date (e.g., 12/30)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

---

## 🎬 Quick Test Script

Run this in your browser console on the booking page for automated testing:

```javascript
async function quickPaymentTest() {
  console.log('🧪 Starting payment test...\n');
  
  // Test 1: Validate booking
  console.log('1️⃣ Testing booking validation...');
  try {
    const validation = await sheetsAPI.validateBooking('event-1', 1);
    console.log('✅ Validation passed:', validation);
  } catch (e) {
    console.error('❌ Validation failed:', e.message);
    return;
  }
  
  // Test 2: Create checkout session
  console.log('\n2️⃣ Creating checkout session...');
  try {
    const session = await sheetsAPI.createCheckoutSession('event-1', {
      name: 'Test User',
      email: 'test@example.com',
      phone: '021 123 4567',
      numSeats: 1,
      newsletterOptIn: false,
      promoOptIn: false
    });
    console.log('✅ Session created!');
    console.log('Session ID:', session.sessionId);
    console.log('Payment URL:', session.url);
    console.log('\n🎉 Payment system is working!');
    console.log('📝 Manual test: Visit the URL above and use card: 4242 4242 4242 4242');
  } catch (e) {
    console.error('❌ Session creation failed:', e.message);
  }
}

quickPaymentTest();
```

---

## 🔐 Security Notes for Test Mode

**Test Mode is Safe:**
- ✅ No real cards can be used
- ✅ No real money is charged
- ✅ Test keys start with `pk_test_` and `sk_test_`
- ✅ Stripe clearly labels everything as "TEST"

**When You Go Live:**
- ⚠️ Switch to live keys (pk_live_... and sk_live_...)
- ⚠️ Update keys in both config.js and Configuration.gs
- ⚠️ Test with real cards (your own) first
- ⚠️ Enable webhook signing for production

---

## 📧 Email Testing (If Configured)

If you've set up email notifications:

**Check Google Apps Script Logs:**
1. Go to Apps Script editor
2. Click **Executions** (left sidebar)
3. Look for recent runs
4. Check for email sending success/failures

**Check Your Email:**
- Customer confirmation email
- Admin notification email

---

## 🆘 Troubleshooting

### Issue: "Stripe checkout session creation failed"

**Possible causes:**
1. ❌ Stripe Secret Key not configured in Configuration.gs
2. ❌ Wrong Stripe Secret Key format
3. ❌ Event not found or no longer available

**Solution:**
- Check Configuration.gs has correct `STRIPE_SECRET_KEY`
- Make sure it starts with `sk_test_`
- Verify event exists and has available seats

### Issue: Payment succeeds but booking not recorded

**Possible causes:**
1. ❌ `confirmBooking` function has errors
2. ❌ Google Sheet permissions issue
3. ❌ Webhook not configured (not needed for test)

**Solution:**
- Check Google Apps Script execution logs
- Check "Bookings" sheet exists with correct headers
- Test `confirmBooking` manually

### Issue: Redirected to wrong page after payment

**Possible causes:**
1. ❌ Success/Cancel URLs wrong in Configuration.gs
2. ❌ Domain doesn't match

**Solution:**
- Update SUCCESS_URL and CANCEL_URL in Configuration.gs
- For local testing, use: `http://127.0.0.1:5500/workshops/booking-success.html`

---

## ✅ Success Indicators

You'll know Stripe integration is working when:

1. ✅ You can reach Stripe Checkout page
2. ✅ Payment processes with test card
3. ✅ Redirects to success page
4. ✅ Payment appears in Stripe Dashboard
5. ✅ Booking recorded in Google Sheet
6. ✅ Available seats decrease

---

## 🎯 Next Steps

Once testing is complete:

1. ✅ Test all payment scenarios (success, failure, cancellation)
2. ✅ Verify bookings are recorded correctly
3. ✅ Test on different browsers
4. ✅ Test on mobile devices
5. ✅ Review Stripe Dashboard data
6. ⚠️ When ready for production, switch to live keys

---

**Happy Testing! 🚀**

**Documentation:** [Stripe Testing Guide](https://stripe.com/docs/testing)  
**Test Cards:** [Full List](https://stripe.com/docs/testing#cards)  
**Dashboard:** [Stripe Test Dashboard](https://dashboard.stripe.com/test/payments)
