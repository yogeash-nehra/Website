# Google Apps Script Setup Guide

## Overview
This guide will help you create the Google Apps Script backend that serves as a REST API for the booking system.

## Step 1: Create New Apps Script Project

1. Go to [Google Apps Script](https://script.google.com)
2. Click **New Project**
3. Name it: **Wolfgramm Holdings Booking API**

## Step 2: Add Script Files

Create the following script files by clicking the **+** icon next to Files:

### 2.1 Code.gs (Main Entry Point)

Copy the contents from `docs/google-apps-script/Code.gs` (provided below)

### 2.2 Configuration.gs

Copy the contents from `docs/google-apps-script/Configuration.gs`

### 2.3 WorkshopService.gs

Copy the contents from `docs/google-apps-script/WorkshopService.gs`

### 2.4 BookingService.gs

Copy the contents from `docs/google-apps-script/BookingService.gs`

### 2.5 StripeService.gs

Copy the contents from `docs/google-apps-script/StripeService.gs`

### 2.6 MailService.gs

Copy the contents from `docs/google-apps-script/MailService.gs`

## Step 3: Configure Settings

1. Open **Configuration.gs**
2. Replace the following placeholders:
   - `YOUR_SHEET_ID_HERE` - Your Google Sheet ID from previous step
   - `YOUR_STRIPE_SECRET_KEY_HERE` - Your Stripe Secret Key
   - `YOUR_ADMIN_EMAIL_HERE` - Email for admin notifications

## Step 4: Enable Required Services

1. Click on **Services** (+ icon) in left sidebar
2. Add **Google Sheets API** (if not already available)

## Step 5: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click **Select type** → Choose **Web app**
3. Configure:
   - **Description:** Workshop Booking API v1
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Copy the Web App URL** - you'll need this for the frontend

The URL will look like:
```
https://script.google.com/macros/s/AKfycbx.../exec
```

## Step 6: Test the API

Test your API endpoints:

### Test Get Workshops
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getWorkshops
```

### Test Get Events
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getEvents&workshopId=service-10
```

### Test Check Availability
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=checkAvailability&eventId=understanding-tech-ai-11-feb-26
```

## Step 7: Update Frontend Configuration

Copy your Web App URL and update `assets/js/config.js` in your website:

```javascript
const CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
  STRIPE_PUBLISHABLE_KEY: 'pk_test_YOUR_KEY_HERE'
};
```

## Troubleshooting

### CORS Issues
- Ensure Code.gs includes proper CORS headers
- The script already handles CORS with `Access-Control-Allow-Origin: *`

### Permission Errors
- Make sure you've authorized the script when first running
- Check Sheet sharing permissions

### 404 Errors
- Verify the Web App URL is correct
- Ensure deployment is set to "Anyone" access

## Security Notes

1. **Stripe Secret Key** is stored in Apps Script (server-side) - never expose it client-side
2. **Sheet ID** is also server-side only
3. The API validates all requests and sanitizes inputs
4. Rate limiting is implemented to prevent abuse

## Updating the Script

When you make changes:
1. Edit the script files
2. Click **Deploy** → **Manage deployments**
3. Click pencil icon on active deployment
4. Select **New version**
5. Click **Deploy**

The Web App URL stays the same, so no frontend changes needed.

## Next Steps

After setting up Apps Script, proceed to implement the frontend booking form following the main implementation plan.

