# Google Sheets Setup Guide

## Overview
This guide will help you set up the Google Sheets database for the Workshop Booking System.

## Step 1: Create New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it: **Wolfgramm Holdings - Workshop Bookings**
4. Note the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

## Step 2: Create Three Sheets

### Sheet 1: Workshop Catalog

Create a sheet named **"Workshop Catalog"** with the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| Workshop ID | Unique identifier | service-1 |
| Workshop Name | Full name | Relational Engagement (Entry Level) |
| Description | Brief description | Practical tikanga, language, and engagement protocols |
| Format | Online/In-Person/Marae | Online |
| Duration | Session length | 90 minutes |
| Price (NZD) | Price in dollars | 150 |
| Total Seats | Default capacity | 25 |
| Location | Venue info | Online / Venue TBC / Marae Only |
| Status | Active/Inactive | Active |

**Sample Data Row:**
```
service-1 | Relational Engagement (Entry Level) | Practical tikanga, language, and engagement protocols | Online | 90 minutes | 150 | 25 | Online | Active
```

### Sheet 2: Scheduled Events

Create a sheet named **"Scheduled Events"** with the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| Event ID | Unique identifier | understanding-tech-ai-11-feb-26 |
| Workshop ID | Links to catalog | service-10 |
| Event Date | Date of event | 2026-02-11 |
| Event Time | Start time | 09:00 AM |
| Available Seats | Current availability | 15 |
| Status | Active/Full/Cancelled | Active |
| Venue Details | Specific location | Auckland Office |

**Sample Data Rows (based on your calendar):**
```
understanding-tech-ai-11-feb-26 | service-10 | 2026-02-11 | 10:00 AM | 15 | Active | Venue TBC
understanding-tech-ai-13-feb-26 | service-10 | 2026-02-13 | 10:00 AM | 15 | Active | Venue TBC
ai-cyber-16-feb-26 | service-13 | 2026-02-16 | 10:00 AM | 15 | Active | Venue TBC
```

### Sheet 3: Bookings

Create a sheet named **"Bookings"** with the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| Booking ID | Auto-generated | BK-1735497600000 |
| Event ID | Links to event | understanding-tech-ai-11-feb-26 |
| Customer Name | Full name | John Smith |
| Email | Contact email | john@example.com |
| Phone | Contact phone | 021 123 4567 |
| Organization | Company/org | Example Ltd |
| Designation | Job title | Manager |
| Number of Seats | Seats booked | 1 |
| Total Amount (NZD) | Payment amount | 150 |
| Stripe Payment ID | Payment reference | pi_123abc |
| Payment Status | Status | Completed |
| Newsletter Opt-in | Yes/No | Yes |
| Promo Opt-in | Yes/No | Yes |
| Booking Timestamp | Date/time | 2025-12-29 14:30:00 |
| Status | Confirmed/Cancelled | Confirmed |

**This sheet will be populated automatically by bookings.**

## Step 3: Set Up Sheet Permissions

1. Click **Share** button in top right
2. Under "General access", set to **"Anyone with the link"** → **Viewer**
3. The Apps Script will run with your permissions to write data

## Step 4: Populate Initial Data

### Populate Workshop Catalog

Add all 19 workshops from your website:

1. service-1: Relational Engagement (Entry Level) - $150 - Online - 90min - 10 seats
2. service-2: Pōwhiri & Whakatau Readiness - $150 - Online - 90min - 10 seats
3. service-3: Mana Motuhake in the Workplace - $150 - Online - 90min - 10 seats
4. service-4: Pathways to Māori Relational Engagement - $450 - Marae - 3x90min - 15 seats
5. service-5: Indigenous Wellbeing (Clothing & Fashion) - $350 - Marae - 4.5hrs - 15 seats
6. service-6: Māori Bread Experience - $350 - Marae - 4.5hrs - 15 seats
7. service-7: The Treaty & The Integrity of Water - $450 - Marae - Full day - 25 seats
8. service-8: Personal Development & Team Building - $500 - Marae - Full day - Custom
9. service-9: End-of-Year Christmas Party - $500 - Marae - Full day - Custom
10. service-10: Understanding Technology & AI - $200 - In-Person - 70min - 15 seats
11. service-11: AI & Prompt Engineering - $200 - In-Person - 70min - 15 seats
12. service-12: AI & Social Media - $200 - In-Person - 70min - 15 seats
13. service-13: AI & Cyber Security - $200 - In-Person - 70min - 15 seats
14. service-14: AI & Automation - $200 - In-Person - 70min - 15 seats
15. service-15: AI Train the Trainers - $300 - In-Person - 70min - 15 seats
16. service-16: AI Audits & Diagnostics - Custom - In-Person - Custom - Custom
17. service-17: Twelve Week Unity Series - $2500 - In-Person - 12 weeks - 12 seats
18. service-18: Te Tiriti Through a Global Health Lens - $450 - Marae - Full day - 25 seats
19. service-19: Tailored Multi-Year Programmes - Custom - Custom - Custom - Custom

### Populate Scheduled Events

Add all events from your workshop calendar page (lines 598-771 in workshops/index.html):

**Understanding Technology & AI:**
- understanding-tech-ai-11-feb-26: 2026-02-11
- understanding-tech-ai-13-feb-26: 2026-02-13
- (continue for all 10 dates)

**AI & Cyber Security:**
- ai-cyber-16-feb-26: 2026-02-16
- (continue for all 9 dates)

**AI & Social Media:**
- ai-social-23-feb-26: 2026-02-23
- (continue for all 4 dates)

**And all other events...**

## Step 5: Note Your Sheet ID

Once complete, copy your Sheet ID from the URL. You'll need this for the Apps Script configuration.

Example URL:
```
https://docs.google.com/spreadsheets/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890/edit
```

Sheet ID: `1aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890`

## Next Steps

After setting up the sheets, proceed to create the Google Apps Script backend following the instructions in `GOOGLE-APPS-SCRIPT-SETUP.md`.

