# Booking System Setup - Quick Reference Guide

## ✅ Configuration Checklist

### 1. Config File Setup
**File:** `assets/js/config.js`

```javascript
const CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/a/macros/wgholdings.co.nz/s/YOUR_ID/exec',
  STRIPE_PUBLISHABLE_KEY: 'pk_test_YOUR_KEY',
  // ...
};
```

**Status:** 
- [ ] Apps Script URL added
- [ ] Stripe key added
- [ ] URLs match your domain

---

### 2. Workshop Page Book Now Buttons

**Current Setup:** Links should follow these patterns:

#### For Workshop-Specific Booking (Recommended):
```html
<a href="booking.html?workshop=service-10">Book Now</a>
```
**Benefits:**
- Shows all dates for that workshop first
- Allows browsing other workshops
- Better user experience

#### For Event-Specific Booking:
```html
<a href="booking.html?event=understanding-tech-ai-11-feb-26">Book Now</a>
```
**Use when:**
- Calendar page with specific dates
- Limited-time events

---

### 3. Update All Book Now Links

**Files to update:**

1. **`workshops/index.html`** - Workshop cards
   ```html
   <!-- OLD -->
   <a href="book.html?event=service-1">Book Now</a>
   
   <!-- NEW -->
   <a href="booking.html?workshop=service-1">Book Now</a>
   ```

2. **`index.html`** - Home page CTAs
   ```html
   <a href="workshops/booking.html">Book a Workshop</a>
   ```

3. **`services/index.html`** - Services page
   ```html
   <a href="../workshops/booking.html">Book Now</a>
   ```

---

### 4. Google Sheets Structure

**Sheet Name:** "Wolfgramm Holdings - Workshop Bookings"

**Required Sheets:**
1. **Workshop Catalog** - Your 19 workshop types
2. **Scheduled Events** - All upcoming dates/times
3. **Bookings** - Auto-populated by system

**Column Headers Must Match Exactly:**

**Workshop Catalog:**
```
Workshop ID | Workshop Name | Description | Format | Duration | Price (NZD) | Total Seats | Location | Status
```

**Scheduled Events:**
```
Event ID | Workshop ID | Event Date | Event Time | Available Seats | Status | Venue Details
```

**Bookings:**
```
Booking ID | Event ID | Customer Name | Email | Phone | Organization | Designation | Number of Seats | Total Amount (NZD) | Stripe Payment ID | Payment Status | Newsletter Opt-in | Promo Opt-in | Booking Timestamp | Status
```

---

### 5. Apps Script Deployment

**Settings Must Be:**
- ✅ Execute as: **Me (info@wgholdings.co.nz)**
- ✅ Who has access: **Anyone**

**Files Required:**
- Code.gs
- Configuration.gs
- WorkshopService.gs
- BookingService.gs
- StripeService.gs
- MailService.gs

---

### 6. Test Your Setup

**Run this in browser console on any page:**
```javascript
await validateBookingSystem();
```

This will check:
- Config file loaded correctly
- API connection working
- Workshop data available
- Events data available
- Stripe configured
- Page links correct

---

## 🔧 Quick Fixes

### Issue: Dropdown Empty
**Check:**
1. Config.js has correct APPS_SCRIPT_URL
2. Google Sheet has events in "Scheduled Events"
3. Apps Script deployed with "Anyone" access

### Issue: CORS Error
**Solutions:**
1. Test on live website (not localhost)
2. Use VS Code Live Server extension
3. Apps Script deployed with correct settings

### Issue: Payment Button Doesn't Work
**Check:**
1. Stripe key in config.js (pk_test_ or pk_live_)
2. Stripe.js script loaded in HTML
3. Browser console for errors

---

## 📊 Workshop → Event Mapping

The system now intelligently filters events:

**User clicks:** `booking.html?workshop=service-10`

**Dropdown shows:**
```
Understanding Technology & AI (Recommended) ▼
  └─ 2026-02-11 at 10:00 AM (15 seats)
  └─ 2026-02-13 at 10:00 AM (15 seats)
  └─ 2026-03-11 at 10:00 AM (15 seats)
─────────────────────────────
Browse All Other Workshops ▼
  AI & Cyber Security ▼
    └─ 2026-02-16 at 10:00 AM
  AI & Social Media ▼
    └─ 2026-02-23 at 10:00 AM
  ... (all other workshops)
```

---

## 🌐 Files Across Website

**Files with booking links:**

1. `/index.html` - Home page CTA
2. `/workshops/index.html` - Workshop cards (19 cards)
3. `/services/index.html` - Service page CTAs
4. `/about/index.html` - About page CTA (if any)
5. `/contact/index.html` - Contact page CTA (if any)

**Search for:** `book.html` and replace with `booking.html`

---

## 🎯 Best Practices

### Workshop Cards
```html
<a href="booking.html?workshop=service-10" class="btn-book">
  Book Now
</a>
```

### Calendar Events
```html
<a href="booking.html?event=understanding-tech-ai-11-feb-26">
  Book This Date
</a>
```

### General Booking
```html
<a href="workshops/booking.html">
  Explore Workshops
</a>
```

---

## 📱 Mobile Testing

Test on:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop (Chrome, Firefox, Edge)

---

## ✨ Quick Start Commands

**Validate setup:**
```javascript
validateBookingSystem()
```

**Test API directly:**
```javascript
// Test workshops
await sheetsAPI.getWorkshops()

// Test events
await sheetsAPI.getAllEvents()

// Test availability
await sheetsAPI.checkAvailability('event-1')
```

---

## 📞 Support

If validation fails:
1. Check error messages in console
2. Verify Google Sheets structure
3. Confirm Apps Script deployed
4. Test API URLs directly in browser

---

**Last Updated:** Setup for wgholdings.co.nz booking system  
**Apps Script URL:** `https://script.google.com/a/macros/wgholdings.co.nz/s/...`  
**Status:** Ready for testing

