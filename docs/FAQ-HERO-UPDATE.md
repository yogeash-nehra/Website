# FAQ Page Hero Section - Updated to Match About Us Page

## Changes Made

### Hero Section Styling
The FAQ page hero section now uses the **exact same styling as the About Us page**.

### What Changed

#### BEFORE (FAQ-specific overrides)
```css
body:has(.faq-section) .about-hero-section {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 300px;
    padding: 0;
}
```
- ❌ Custom flexbox layout
- ❌ Fixed min-height
- ❌ Different padding
- ❌ Smaller title size (2.5rem)

#### AFTER (Using About Us styles)
```css
.about-hero-section {
    background-color: var(--primary-color);
    padding: 8rem 0 4rem;
    text-align: center;
}

.about-hero-content h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    color: var(--text-color);
}
```
- ✅ Same layout as About Us
- ✅ Same padding (8rem 0 4rem)
- ✅ Same title size (3.5rem)
- ✅ Tagline below title

---

## Current Hero Section Features

### Layout
- **Background**: Gold/tan (#d8aa6d via `var(--primary-color)`)
- **Padding**: `8rem 0 4rem` (top 8rem, bottom 4rem)
- **Alignment**: Center-aligned text

### Typography
- **Title**: "Frequently Asked Questions"
  - Font size: `3.5rem` (56px)
  - Margin-bottom: `1rem`
  - Color: Black (`var(--text-color)`)
  
- **Tagline**: "Find answers to common questions about our services and approach."
  - Font size: `1.125rem` (18px)
  - Line height: `1.7`
  - Color: Black (`var(--text-color)`)
  - Max-width: `900px`
  - Margin: `1rem auto`
  - Font-style: Italic (via `.hero-tagline` class)

### Responsive Behavior
**Mobile (<768px):**
- Padding: `6rem 0 3rem`
- Title size: `2rem` (32px)
- Tagline size: `1.125rem` (18px)

**Desktop (≥768px):**
- Padding: `8rem 0 4rem`
- Title size: `3.5rem` (56px)
- Tagline size: `1.125rem` (18px)

---

## HTML Structure

### FAQ Page Hero (Now matches About Us)
```html
<section class="about-hero-section">
    <div class="container">
        <div class="about-hero-content">
            <h1>Frequently Asked Questions</h1>
            <p class="hero-tagline">Find answers to common questions about our services and approach.</p>
        </div>
    </div>
</section>
```

### About Us Page Hero (Reference)
```html
<section class="about-hero-section">
    <div class="container">
        <div class="about-hero-content">
            <h1>About us</h1>
            <p class="hero-tagline">"Our Story, Our Team, Our Indigeneity."</p>
        </div>
    </div>
</section>
```

**Same structure, same classes, same styling!**

---

## Files Modified

### 1. `assets/css/components.css`
**Removed:**
- All FAQ-specific hero section overrides
- `body:has(.faq-section) .about-hero-section` rules
- `body:has(.faq-section) .about-hero-content` rules
- Mobile responsive overrides for FAQ hero

**Result:**
FAQ page now inherits the default `.about-hero-section` styles, making it identical to the About Us page hero.

### 2. `faq/index.html`
**Added:**
- Tagline paragraph with class `hero-tagline`
- Text: "Find answers to common questions about our services and approach."

**Result:**
Hero section now has the same structure as About Us page with title + tagline.

---

## Visual Comparison

### About Us Page Hero
```
┌────────────────────────────────────────┐
│         🟡 Gold/Tan Background         │
│                                        │
│                                        │
│            About us                    │ ← 3.5rem
│  "Our Story, Our Team, Our Indigeneity." │ ← Tagline (italic)
│                                        │
│                                        │
└────────────────────────────────────────┘
```

### FAQ Page Hero (Now Matches)
```
┌────────────────────────────────────────┐
│         🟡 Gold/Tan Background         │
│                                        │
│                                        │
│   Frequently Asked Questions           │ ← 3.5rem
│  Find answers to common questions...   │ ← Tagline (italic)
│                                        │
│                                        │
└────────────────────────────────────────┘
```

**Both use identical styling and layout!**

---

## Design Specifications

### Colors
- Background: `#d8aa6d` (gold/tan via `var(--primary-color)`)
- Text: `#1a1a1a` (black via `var(--text-color)`)

### Spacing
- Section padding: `8rem 0 4rem`
- Title margin-bottom: `1rem`
- Tagline margin: `1rem auto`
- Tagline max-width: `900px`

### Typography
- Title: `3.5rem`, normal weight
- Tagline: `1.125rem`, italic style, `1.7` line-height

### Responsive
- Mobile padding: `6rem 0 3rem`
- Mobile title: `2rem`
- Mobile tagline: `1.125rem`

---

## Benefits of This Change

1. **Consistency**: FAQ page hero now matches About Us page exactly
2. **Unified Design**: Same look and feel across all pages
3. **Better Proportions**: Larger title (3.5rem) is more prominent
4. **Added Context**: Tagline provides helpful description
5. **Cleaner Code**: Removed custom overrides, using shared styles
6. **Easier Maintenance**: Changes to `.about-hero-section` affect both pages

---

## Testing Checklist

### Visual Verification
- [x] Hero has gold/tan background
- [x] Title is large (3.5rem)
- [x] Tagline appears below title
- [x] Tagline is italic
- [x] Text is center-aligned
- [x] Generous padding (8rem top)

### Consistency Check
- [x] Matches About Us page layout
- [x] Same padding values
- [x] Same font sizes
- [x] Same colors
- [x] Same responsive behavior

### Responsive Testing
- [x] Mobile: Smaller title (2rem)
- [x] Mobile: Reduced padding (6rem)
- [x] Desktop: Full size (3.5rem)
- [x] Desktop: Full padding (8rem)

---

**Status**: ✅ COMPLETE - FAQ hero section now identical to About Us page
**Date**: December 28, 2025
**Change**: Removed custom overrides, now uses shared `.about-hero-section` styles

