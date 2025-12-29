# Workshop Booking System - Quick Start Guide

## 🎯 What Was Built

A complete serverless booking system for your workshops that includes:

- **Multi-step booking form** - Collects customer details, preferences, and workshop selection
- **Stripe payment integration** - Secure payment processing
- **Google Sheets database** - Stores all bookings and manages seat inventory
- **Real-time availability** - Shows seat counts and urgency indicators
- **Admin dashboard** - View bookings and export to CSV for GHL import
- **Email notifications** - Automatic confirmations to customers and admins

## 🚀 Quick Start (5 Steps)

### Step 1: Set Up Google Sheets (10 min)

1. Create a new Google Sheet called "Wolfgramm Holdings - Workshop Bookings"
2. Create 3 sheets inside it:
   - **Workshop Catalog** - Your 19 workshop definitions
   - **Scheduled Events** - All upcoming event dates
   - **Bookings** - Will be auto-populated by bookings
3. Follow column structure in `docs/GOOGLE-SHEETS-SETUP.md`
4. Copy your Sheet ID from the URL

### Step 2: Deploy Google Apps Script (15 min)

1. Go to [script.google.com](https://script.google.com)
2. Create new project: "Wolfgramm Holdings Booking API"
3. Copy all `.gs` files from `docs/google-apps-script/` folder into the project
4. Update `Configuration.gs`:
   ```javascript
   SHEET_ID: 'YOUR_SHEET_ID_HERE'
   STRIPE_SECRET_KEY: 'sk_test_YOUR_KEY'  // From Stripe
   ADMIN_EMAIL: 'info@wgholdings.co.nz'
   ```
5. Deploy → New Deployment → Web App → Deploy
6. Copy the Web App URL

### Step 3: Configure Stripe (5 min)

1. Log in to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Go to Developers → API Keys
3. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
4. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
5. Secret key goes in Apps Script, Publishable key goes in next step

### Step 4: Update Frontend Config (2 min)

Open `assets/js/config.js` and update:

```javascript
const CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_ID/exec',
  STRIPE_PUBLISHABLE_KEY: 'pk_test_YOUR_KEY_HERE',
  // ... rest stays the same
};
```

### Step 5: Test! (10 min)

1. Open `workshops/booking.html` in your browser
2. Select a workshop
3. Fill in your details
4. Use test card: `4242 4242 4242 4242`
5. Complete payment
6. Check:
   - ✅ Success page shows
   - ✅ Booking appears in Google Sheets
   - ✅ Email received
   - ✅ Seats decremented

## 📁 Key Files You Need to Know

| File | Purpose | Action |
|------|---------|--------|
| `assets/js/config.js` | Configuration | **UPDATE with your keys** |
| `workshops/booking.html` | Main booking form | Ready to use |
| `workshops/booking-success.html` | Success page | Ready to use |
| `admin/workshop-admin.html` | Admin dashboard | Access to view bookings |
| `docs/GOOGLE-SHEETS-SETUP.md` | Sheet setup guide | Follow instructions |
| `docs/GOOGLE-APPS-SCRIPT-SETUP.md` | Backend setup | Follow instructions |

## 🎨 How It Works

```
User clicks "Book Now" 
  → Fills multi-step form
  → Redirects to Stripe payment
  → Payment succeeds
  → Apps Script saves to Google Sheets
  → Decrements available seats
  → Sends confirmation emails
  → Shows success page
```

## 🔗 URLs to Update in Your Site

Update these Book Now links in your website:

**Old:** `book.html?event=...`  
**New:** `booking.html?event=...`

Already done in `workshops/index.html` ✅

## 📊 Admin Dashboard

Access at: `admin/workshop-admin.html`

Features:
- View all bookings
- Search/filter bookings
- Export to CSV for GHL
- View revenue stats
- Monitor seat availability

**Security Note:** In production, add password protection via Netlify or similar.

## 💳 Stripe Test Cards

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Declined |
| 4000 0025 0000 3155 | Requires authentication |

Use any future expiry, any CVC, any postal code.

## 📧 Email Notifications

Automatically sent:
- **Customer:** Booking confirmation with details
- **Admin:** New booking notification

Configure sender in `Configuration.gs`:
```javascript
FROM_EMAIL: 'bookings@wgholdings.co.nz'
ADMIN_EMAIL: 'info@wgholdings.co.nz'
```

## 🔒 Security Checklist

- ✅ Stripe handles all payment data (PCI compliant)
- ✅ Apps Script validates all requests
- ✅ Atomic seat operations prevent double-booking
- ⚠️ **TODO:** Add authentication to admin dashboard
- ⚠️ **TODO:** Implement rate limiting in Apps Script

## 📈 Phase 2: GHL Integration

To sync bookings to GoHighLevel CRM:

**Option 1: Manual Export**
1. Go to admin dashboard
2. Click "Export CSV"
3. Import CSV to GHL manually

**Option 2: Zapier/Make.com (Automated)**
1. Create Zap: Google Sheets → GoHighLevel
2. Trigger: New row in "Bookings" sheet
3. Action: Create/Update contact in GHL
4. Map fields including newsletter opt-in

## 🆘 Troubleshooting

**"Unable to load workshops"**
- Check `APPS_SCRIPT_URL` in config.js
- Verify Apps Script is deployed
- Check browser console for errors

**"Payment not processing"**
- Verify using correct Stripe keys (test vs live)
- Check Stripe Dashboard for errors
- Ensure success/cancel URLs are correct

**"Bookings not saving"**
- Check Google Sheet permissions
- Verify Sheet ID in Configuration.gs
- Check Apps Script execution logs

## 📚 Full Documentation

- `docs/IMPLEMENTATION-COMPLETE.md` - Complete system overview
- `docs/TESTING-GUIDE.md` - Detailed testing scenarios
- `docs/GOOGLE-SHEETS-SETUP.md` - Sheet setup instructions
- `docs/GOOGLE-APPS-SCRIPT-SETUP.md` - Backend deployment

## ✅ Production Checklist

Before going live:

- [ ] Switch Stripe keys from test to live
- [ ] Update all URLs to production domain
- [ ] Test complete booking flow with real card (then refund)
- [ ] Add authentication to admin dashboard
- [ ] Set up email monitoring
- [ ] Configure Google Analytics tracking
- [ ] Test on mobile devices
- [ ] Set up backup for Google Sheets
- [ ] Document support processes
- [ ] Train staff on admin dashboard

## 🎉 You're Ready!

All files are created and ready to deploy. Follow the 5 steps above and you'll have a fully functional booking system!

**Need help?** Check the detailed guides in the `docs/` folder.

---

**Built for:** Wolfgramm Holdings  
**Purpose:** Workshop booking with payment processing  
**Status:** ✅ Ready for deployment

