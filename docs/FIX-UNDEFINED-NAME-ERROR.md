# 🚨 FIX: "Cannot read properties of undefined (reading 'name')"

## The Error

```
❌ Unable to load workshops
Cannot read properties of undefined (reading 'name')
at BookingForm.populateEventDropdown (booking-form.js:147:46)
```

---

## 🔍 Root Cause

Your Google Sheets has events scheduled, but those events reference workshop IDs that don't exist in your "Workshop Catalog" sheet.

**What's happening:**
1. ✅ API successfully fetches events from "Scheduled Events" sheet
2. ✅ API successfully fetches workshops from "Workshop Catalog" sheet
3. ❌ Event's `workshopId` doesn't match any workshop in the catalog
4. ❌ Code tries to access `undefined.name` → Error!

---

## ✅ SOLUTION: Fix Your Google Sheets Data

### Step 1: Open Your Google Sheet

Go to your Google Sheet: **"Wolfgramm Holdings - Workshop Bookings"**

---

### Step 2: Check "Workshop Catalog" Sheet

**Required Columns (in this exact order):**

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Workshop ID | Workshop Name | Description | Format | Duration | Price (NZD) | Total Seats | Location | Status |

**Example Row (based on your URL param `service-10`):**

```
service-10 | Understanding Technology & AI - Level 1 | Learn about AI and emerging tech | Online | 70 minutes | 150 | 25 | Online/Venue TBC | Active
```

**⚠️ CRITICAL:**
- Column A must be **"Workshop ID"** (like `service-10`)
- Column I must be **"Status"** and say **"Active"**
- NO empty rows between header and data
- Workshop IDs are case-sensitive!

---

### Step 3: Check "Scheduled Events" Sheet

**Required Columns (in this exact order):**

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Event ID | Workshop ID | Event Date | Event Time | Available Seats | Status | Venue Details |

**Example Row:**

```
understanding-tech-ai-11-feb-26 | service-10 | 2026-02-11 | 10:00 AM | 15 | Active | Venue TBC
```

**⚠️ CRITICAL:**
- Column B "Workshop ID" must EXACTLY match a Workshop ID from the Catalog sheet
- Column F "Status" must be **"Active"**
- Event Date format: `YYYY-MM-DD` (e.g., `2026-02-11`)
- NO empty rows

---

### Step 4: Verify Workshop ID Matching

**Common Issue:** Event has `workshopId: "service-10"` but Workshop Catalog has `workshopId: "Service-10"` (capital S).

**Solution:**
1. In "Scheduled Events" sheet, look at column B (Workshop ID)
2. In "Workshop Catalog" sheet, look at column A (Workshop ID)
3. Make sure they **EXACTLY match** (case-sensitive!)

**Example of what should match:**

| Scheduled Events (Column B) | Workshop Catalog (Column A) | Match? |
|----------------------------|----------------------------|--------|
| `service-10` | `service-10` | ✅ Yes |
| `service-10` | `Service-10` | ❌ No (different case) |
| `service-10` | `service-1` | ❌ No (different ID) |
| `service-10` | `service-10 ` | ❌ No (extra space) |

---

### Step 5: Add Workshop Data

Since you're coming from `?workshop=service-10`, you need AT LEAST this workshop in your catalog:

**Add this row to "Workshop Catalog" sheet:**

| Column | Value |
|--------|-------|
| A: Workshop ID | `service-10` |
| B: Workshop Name | `Understanding Technology & AI - Level 1` |
| C: Description | `Foundational understanding of AI and emerging technologies` |
| D: Format | `Online` |
| E: Duration | `70 minutes` |
| F: Price (NZD) | `150` |
| G: Total Seats | `25` |
| H: Location | `Online / Venue TBC` |
| I: Status | `Active` |

**Add corresponding events to "Scheduled Events" sheet:**

| A: Event ID | B: Workshop ID | C: Event Date | D: Event Time | E: Available Seats | F: Status | G: Venue Details |
|------------|---------------|---------------|---------------|-------------------|-----------|------------------|
| `understanding-tech-ai-11-feb-26` | `service-10` | `2026-02-11` | `10:00 AM` | `15` | `Active` | `Venue TBC` |
| `understanding-tech-ai-13-feb-26` | `service-10` | `2026-02-13` | `10:00 AM` | `15` | `Active` | `Venue TBC` |

---

## 🧪 Quick Test: Check What Data Is Returned

### Option 1: Test in Browser

Open this URL in your browser (replace with YOUR deployment ID):

```
https://script.google.com/macros/s/AKfycbxr9yA3Z8SuVWtZ2jfdI7SQdWFy1qn05SUq4KEUgBZHbGbfrFIGIXeZtldzH2ktXmvM/exec?action=getWorkshops
```

**Expected Result:**
```json
{
  "success": true,
  "data": [
    {
      "workshopId": "service-10",
      "name": "Understanding Technology & AI - Level 1",
      "description": "...",
      "format": "Online",
      "duration": "70 minutes",
      "price": 150,
      "totalSeats": 25,
      "location": "Online / Venue TBC",
      "status": "Active"
    }
  ]
}
```

**If you see an empty array `[]`:** Your Workshop Catalog sheet is empty or has wrong status.

### Option 2: Test Events

```
https://script.google.com/macros/s/YOUR_ID/exec?action=getAllEvents
```

**Expected Result:**
```json
{
  "success": true,
  "data": [
    {
      "eventId": "understanding-tech-ai-11-feb-26",
      "workshopId": "service-10",
      "eventDate": "2026-02-11",
      "eventTime": "10:00 AM",
      "availableSeats": 15,
      "status": "Active",
      "venueDetails": "Venue TBC"
    }
  ]
}
```

**Check:** Does the `workshopId` in events match a `workshopId` from workshops?

---

## 🔧 Additional Fix: Add Error Handling

To prevent this error in the future, let's add a safety check. The code should handle missing workshops gracefully.

### Quick Fix in Browser Console (Temporary)

If you want to see more details about what's going wrong, run this in your browser console:

```javascript
// Check what data we're getting
sheetsAPI.getWorkshops().then(workshops => {
  console.log('📦 Workshops:', workshops);
  workshops.forEach(w => console.log(`  - ${w.workshopId}: ${w.name}`));
});

sheetsAPI.getAllEvents().then(events => {
  console.log('📅 Events:', events);
  events.forEach(e => console.log(`  - ${e.eventId} → workshop: ${e.workshopId}`));
});
```

This will show you exactly what IDs are in your sheets.

---

## 📋 Checklist: What to Verify

In your Google Sheet:

### "Workshop Catalog" Sheet
- [ ] Has header row: `Workshop ID | Workshop Name | Description | Format | Duration | Price (NZD) | Total Seats | Location | Status`
- [ ] Has at least one row with `service-10` in column A
- [ ] Status column (I) says `Active`
- [ ] No empty rows between header and data
- [ ] No extra spaces in Workshop ID

### "Scheduled Events" Sheet
- [ ] Has header row: `Event ID | Workshop ID | Event Date | Event Time | Available Seats | Status | Venue Details`
- [ ] Workshop ID (column B) matches exactly with Workshop Catalog (column A)
- [ ] Status column (F) says `Active`
- [ ] Available Seats (column E) is a number > 0
- [ ] Event Date is in format `YYYY-MM-DD`
- [ ] No empty rows

### "Bookings" Sheet
- [ ] Exists (even if empty)
- [ ] Has header row: `Booking ID | Event ID | Customer Name | Email | Phone | Organization | Designation | Booking Date | Payment Status | Payment ID | Amount | Newsletter Opt-In | Promo Opt-In`

---

## 🎯 Most Common Issues & Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Workshop Catalog empty** | "Cannot read properties of undefined" | Add workshop data to sheet |
| **Wrong Workshop ID** | Events load but error on selection | Match Workshop IDs exactly (case-sensitive) |
| **Status not "Active"** | No workshops appear | Change Status to "Active" in column I |
| **Extra spaces** | `"service-10 "` vs `"service-10"` | Remove trailing spaces |
| **Wrong sheet names** | "Sheet not found" error | Rename sheets to exact names |

---

## 📄 Sample Data Template

### Workshop Catalog (Copy & Paste)

```
service-10	Understanding Technology & AI - Level 1	Foundational understanding of AI and emerging technologies	Online	70 minutes	150	25	Online / Venue TBC	Active
service-11	AI & Cyber Security – Level 1	Learn about AI security risks and protection	Online	70 minutes	150	25	Online / Venue TBC	Active
service-12	AI & Social Media – Level 1	Understanding AI's role in social media	Online	70 minutes	150	25	Online / Venue TBC	Active
```

### Scheduled Events (Copy & Paste)

```
understanding-tech-ai-11-feb-26	service-10	2026-02-11	10:00 AM	15	Active	Venue TBC
understanding-tech-ai-13-feb-26	service-10	2026-02-13	10:00 AM	15	Active	Venue TBC
ai-cyber-16-feb-26	service-11	2026-02-16	10:00 AM	15	Active	Venue TBC
ai-social-23-feb-26	service-12	2026-02-23	10:00 AM	15	Active	Venue TBC
```

**Note:** Use Tab to separate columns when pasting into Google Sheets.

---

## ✅ Expected Result After Fix

After adding the correct data:

1. Refresh booking page
2. Console should show:
   ```
   ✅ 📝 Initializing booking form...
   ✅ 🔄 Loading workshops...
   ✅ 📌 Pre-selected workshop from URL: service-10
   ✅ ✅ Workshops loaded successfully
   ```
3. Dropdown should be populated with events
4. No errors! 🎉

---

## 🆘 Still Getting Error?

Run this diagnostic in browser console:

```javascript
async function diagnoseData() {
  console.log('🔍 Diagnosing data mismatch...\n');
  
  const workshops = await sheetsAPI.getWorkshops();
  const events = await sheetsAPI.getAllEvents();
  
  console.log(`📦 Found ${workshops.length} workshops:`);
  workshops.forEach(w => console.log(`  ✓ ${w.workshopId}`));
  
  console.log(`\n📅 Found ${events.length} events:`);
  events.forEach(e => {
    const hasWorkshop = workshops.find(w => w.workshopId === e.workshopId);
    const icon = hasWorkshop ? '✓' : '❌';
    console.log(`  ${icon} ${e.eventId} → ${e.workshopId} ${hasWorkshop ? '' : '(MISSING!)'}`);
  });
  
  // Check for mismatches
  const mismatches = events.filter(e => !workshops.find(w => w.workshopId === e.workshopId));
  
  if (mismatches.length > 0) {
    console.error(`\n❌ Found ${mismatches.length} events with missing workshops:`);
    mismatches.forEach(e => console.error(`  - Event "${e.eventId}" references workshop "${e.workshopId}" which doesn't exist`));
  } else {
    console.log('\n✅ All events have matching workshops!');
  }
}

diagnoseData();
```

This will show you exactly which Workshop IDs are missing!

---

**Last Updated:** January 11, 2026  
**Issue:** Workshop data missing or IDs don't match  
**Solution:** Add workshop data to Google Sheets with matching IDs
