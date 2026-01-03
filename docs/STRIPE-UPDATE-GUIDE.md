# 🔧 Stripe Integration - Update Instructions

## ✅ Frontend Updated
Your `assets/js/config.js` has been updated with the correct **Stripe Publishable Key**.

## ⚠️ Backend Needs Manual Update

You need to update your **Google Apps Script** with the Stripe Secret Key:

### Step 1: Open Your Apps Script Project
1. Go to [script.google.com](https://script.google.com)
2. Open your project: **"Wolfgramm Workshop Booking API"**

### Step 2: Update Configuration.gs
1. Click on **`Configuration.gs`** in the left panel
2. Find line 19 (STRIPE_SECRET_KEY)
3. Replace this line:
   ```javascript
   STRIPE_SECRET_KEY: 'YOUR_STRIPE_SECRET_KEY_HERE',
   ```
   
   **With:**
   ```javascript
   STRIPE_SECRET_KEY: 'sk_test_51RHwYvRNR3TqkgX213XkigbvFoiNc2KKIbasqbhIZUHalF8mPUg0d2zpL9WiQnEnAMwmBL9LTbanWDqE04IDkKPC00XpT3sYhE',
   ```

4. Click **Save** (💾 icon or Ctrl+S)

### Step 3: Deploy New Version
1. Click **Deploy** → **Manage deployments**
2. Click the **Edit** ✏️ icon on your active deployment
3. Change **Version** to **"New version"**
4. Add description: "Updated Stripe keys"
5. Click **Deploy**
6. Click **Done**

### Step 4: Test Payment
1. Go to `workshops/booking.html`
2. Complete a test booking
3. When you reach payment, use Stripe test card:
   ```
   Card: 4242 4242 4242 4242
   Expiry: 12/26
   CVC: 123
   ZIP: 12345
   ```
4. Click "Pay"
5. Should redirect to success page!

---

## 🔑 Your Stripe Keys (for reference)

**Publishable Key (Frontend - already updated):**
```
pk_test_51RHwYvRNR3TqkgX2E9bltf998OhHgB5TwggSkUT5UcE2KrLepDtCaKTPlGqWLuyaAUa1qoairh2jL8M1cHkKeMc5002RALTePx
```

**Secret Key (Backend - needs manual update in Apps Script):**
```
sk_test_51RHwYvRNR3TqkgX213XkigbvFoiNc2KKIbasqbhIZUHalF8mPUg0d2zpL9WiQnEnAMwmBL9LTbanWDqE04IDkKPC00XpT3sYhE
```

---

## 🧪 Testing Checklist

After updating Apps Script:

- [ ] Apps Script Configuration.gs updated with secret key
- [ ] New version deployed
- [ ] Test booking form loads
- [ ] Dropdown shows events
- [ ] Form validation works
- [ ] "Proceed to Payment" button works
- [ ] Redirects to Stripe checkout
- [ ] Test payment completes
- [ ] Redirects to success page
- [ ] Booking appears in Google Sheets
- [ ] Available seats decremented

---

## 🐛 Troubleshooting

### Issue: "Payment failed" or "Stripe error"

**Check:**
1. Secret key updated in Apps Script Configuration.gs
2. New version deployed (not just saved)
3. Keys match (pk_test_ and sk_test_ from same Stripe account)

### Issue: Redirect to Stripe but payment doesn't process

**Check:**
1. Stripe account is in Test Mode
2. Using test card: 4242 4242 4242 4242
3. Browser console for errors (F12)

### Issue: Success page loads but booking not saved

**Check:**
1. Google Sheets "Bookings" sheet exists
2. Apps Script has permission to write to sheet
3. Check Apps Script logs: View → Executions

---

## 📞 Quick Support Commands

**Test Stripe in browser console (F12):**
```javascript
// Test Stripe is loaded
typeof Stripe

// Should return: "function"

// Test publishable key
CONFIG.STRIPE_PUBLISHABLE_KEY

// Should return your pk_test_ key
```

**Test in Apps Script:**
1. Open Apps Script editor
2. Select function: `getConfiguration`
3. Click **Run**
4. Check logs (View → Logs)
5. Should show your configuration

---

## ✅ What's Updated

| Component | Status | Location |
|-----------|--------|----------|
| Frontend Publishable Key | ✅ Updated | `assets/js/config.js` line 14 |
| Backend Secret Key | ⏳ You need to update | Apps Script `Configuration.gs` line 19 |
| Deployment | ⏳ You need to deploy | Apps Script → Deploy → New version |

---

## 🎯 After This Update

Once you complete the 3 steps above, your payment flow will work:

1. User fills booking form → ✅ Working
2. Clicks "Proceed to Payment" → ✅ Will work
3. Redirects to Stripe checkout → ✅ Will work
4. Enters test card details → ✅ Will work
5. Payment processes → ✅ Will work
6. Redirects to success page → ✅ Will work
7. Booking saved to Google Sheets → ✅ Will work
8. Confirmation email sent → ✅ Will work

---

**🚀 You're almost there! Just update the Apps Script and deploy a new version.**

**Estimated time:** 2 minutes

**Next:** Update Configuration.gs → Deploy new version → Test booking!

