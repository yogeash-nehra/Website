# ✅ FIXED: Workshop API Issue

## The Problem

Your code was checking **`row[8]`** for "Active", but with the "Level" column in your sheet, Status is actually in **`row[9]`**.

## Your Actual Column Structure

```
Index  Column Letter  Column Name
-----  -------------  -----------
[0]    A              Workshop ID
[1]    B              Workshop Name
[2]    C              Level            ← This column shifts everything!
[3]    D              Description
[4]    E              Format
[5]    F              Duration
[6]    G              Price (NZD)
[7]    H              Total Seats
[8]    I              Location
[9]    J              Status           ← Should check row[9], not row[8]!
```

## The Fix Applied

Changed from:
```javascript
// OLD - Wrong!
if (row[8] === 'Active') {
  workshops.push({
    workshopId: row[0],
    name: row[1],
    description: row[2],  // ❌ Wrong index
    format: row[3],       // ❌ Wrong index
    duration: row[4],     // ❌ Wrong index
    price: row[5],        // ❌ Wrong index
    totalSeats: row[6],   // ❌ Wrong index
    location: row[7],     // ❌ Wrong index
    status: row[8]        // ❌ Wrong index
  });
}
```

To:
```javascript
// NEW - Correct!
if (row[9] === 'Active') {
  workshops.push({
    workshopId: row[0],
    name: row[1],
    level: row[2],        // ✅ Added Level field
    description: row[3],  // ✅ Correct index
    format: row[4],       // ✅ Correct index
    duration: row[5],     // ✅ Correct index
    price: row[6],        // ✅ Correct index
    totalSeats: row[7],   // ✅ Correct index
    location: row[8],     // ✅ Correct index
    status: row[9]        // ✅ Correct index
  });
}
```

## What You Need To Do

### Step 1: Update Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Open your project
3. Click on **WorkshopService.gs** in the left sidebar
4. **Replace the entire file contents** with the updated code from:
   `docs/google-apps-script/WorkshopService.gs`

### Step 2: Save

Press **Ctrl+S** or click the Save icon

### Step 3: Deploy NEW Version

1. Click **Deploy** → **Manage deployments**
2. Click **✏️ Edit** icon
3. Change "Version" to **"New version"**
4. Description: "Fixed column mapping for Workshop Catalog"
5. Click **Deploy**
6. Click **Done**

### Step 4: Wait & Test

1. Wait **30-60 seconds** for changes to propagate
2. Test the API directly:
   ```
   https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getWorkshops
   ```
3. Should now return workshops! ✅

### Step 5: Test Booking Page

1. Go to your booking page
2. Hard refresh: **Ctrl+Shift+R**
3. Should now load workshops! 🎉

## Verification

After deploying, test this URL:
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
      "name": "Relational Engagement for Non Māori Individuals",
      "level": "Level 1",
      "description": "A winner for Non Māori Individuals...",
      "format": "Online",
      "duration": "90 minutes",
      "price": 150,
      "totalSeats": 25,
      "location": "Online",
      "status": "Active"
    },
    {
      "workshopId": "service-10",
      "name": "Understanding Technology & AI",
      "level": "Level 1",
      "description": "Build foundational digital literacy...",
      "format": "Online",
      "duration": "70 minutes",
      "price": 150,
      "totalSeats": 25,
      "location": "Online",
      "status": "Active"
    }
    // ... more workshops
  ]
}
```

**Before (broken):**
```json
{
  "success": true,
  "data": []  ← Empty array!
}
```

## Summary

- ✅ Updated `WorkshopService.gs` to match your exact column structure
- ✅ Added support for "Level" field
- ✅ Changed Status check from `row[8]` to `row[9]`
- ✅ All column indices corrected

**Once deployed, your workshop API will work!** 🚀

---

**Last Updated:** January 11, 2026  
**Issue:** Column index mismatch due to "Level" column  
**Solution:** Updated row indices to match actual sheet structure
