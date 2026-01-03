# 🐛 ISSUE FOUND: Event ID Problem

## The Error
```
Error loading event details: Error: Error: Event not found: 1
```

## Root Cause
When you select a workshop from the dropdown, it's passing `1` instead of `event-1` to the `checkAvailability` function.

## Where the Problem Is

The issue is in your Google Sheet "Scheduled Events" tab. The Event IDs must be stored as **TEXT**, not numbers.

---

## ⚡ SOLUTION 1: Fix Your Google Sheet (Easiest)

### Step 1: Open Your Google Sheet
Open: [Your Sheet](https://docs.google.com/spreadsheets/d/1o3dEiDxD0lf8YnndgO9ivNbvq_aSXYkybSCb6cx5lqo/edit)

### Step 2: Go to "Scheduled Events" Tab

### Step 3: Check Column A (Event ID)

Currently it probably looks like:
```
Event ID
1             ← NUMBER (wrong!)
2             ← NUMBER (wrong!)
```

Should be:
```
Event ID
event-1       ← TEXT (correct!)
event-2       ← TEXT (correct!)
```

### Step 4: Fix the Event IDs

**Option A: Add Prefix**
1. Select cells with event IDs (A2, A3, etc.)
2. Change `1` to `event-1`
3. Change `2` to `event-2`
4. Save

**Option B: Format as Text First**
1. Select column A
2. Format → Number → Plain text
3. Then enter your event IDs

---

## ⚡ SOLUTION 2: Deploy NEW VERSION

After fixing the sheet:

1. In Apps Script, click **Deploy** → **Manage deployments**
2. Click **✏️ Edit**
3. Version: **"New version"**
4. Click **Deploy**

---

## 🧪 Test Again

1. Refresh `workshops/booking.html`
2. Select a workshop
3. Should load event details ✅
4. Click "Proceed to Payment"
5. Should redirect to Stripe ✅

---

## 📊 Example Data Structure

Your "Scheduled Events" sheet should look like this:

| Event ID | Workshop ID | Event Date | Event Time | Available Seats | Status | Venue Details |
|----------|-------------|------------|------------|-----------------|--------|---------------|
| event-1  | service-10  | 2026-02-11 | 10:00 AM   | 10              | Active | Online        |
| event-2  | service-10  | 2026-02-13 | 10:00 AM   | 10              | Active | Online        |

**Key Point:** Event ID must be `event-1` (text), not `1` (number)!

---

## Why This Happens

Google Sheets tries to be "helpful" and converts things that look like numbers into actual numbers. So when you type `event-1`, it might show as `1`.

**Fix:** Format column as Text FIRST, then enter IDs.

---

## Quick Check

In your Google Sheet, click on cell A2 (first event ID). Look at the formula bar at the top. 

Does it show:
- ❌ `1` (just a number)
- ✅ `event-1` (text with prefix)

If it's just `1`, that's your problem!

