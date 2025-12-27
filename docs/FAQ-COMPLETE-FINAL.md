# FAQ Page - Complete Redesign to Match Target Image

## Final Changes Summary

### User Requirements
1. ✅ Hero section: **CENTER-aligned horizontally AND vertically**
2. ✅ Reformat entire page to match the attached image
3. ✅ Clean, minimal design with proper spacing

---

## Complete Design Specifications

### 1. Hero Section (Gold/Tan Banner)

#### Layout
```css
display: flex;
align-items: center;        /* Vertical centering */
justify-content: center;    /* Horizontal centering */
text-align: center;         /* Text centered */
min-height: 300px;          /* Tall banner */
```

#### Typography
- **Title**: "Frequently Asked Questions"
- **Font size**: 2.5rem (40px)
- **Font weight**: 400 (normal, not bold)
- **Line height**: 1.2
- **Color**: Black (#1a1a1a)

#### Visual
- **Background**: Gold/tan (#d8aa6d)
- **Padding**: 0 (content centered with flexbox)
- **Alignment**: Center both horizontally and vertically

---

### 2. FAQ Section (Main Content)

#### Container
- **Background**: Pure white (#ffffff)
- **Max-width**: 750px
- **Padding**: 3rem 0 4rem

#### FAQ Items Structure
```
┌─────────────────────────────────────┐
│ ─────────────────────────────────── │ ← Top border
│ Question 1                        ▼ │
│ ─────────────────────────────────── │ ← Separator
│ Question 2                        ▼ │
│ ─────────────────────────────────── │ ← Separator
│ Question 3                        ▼ │
│ ─────────────────────────────────── │
│              ...                    │
└─────────────────────────────────────┘
```

#### FAQ Item Styling
- **Background**: White (#ffffff)
- **Border**: `1px solid #d0d0d0` (between items)
- **Margin**: 0 (no gaps)
- **Hover**: No background change (stays white)

#### Question Button
- **Padding**: `1.75rem 1.5rem` (generous spacing)
- **Font size**: 1rem (16px)
- **Font weight**: 400 (normal, NOT bold)
- **Color**: Black (#1a1a1a)
- **Line height**: 1.6
- **Gap**: 2rem (space between text and icon)
- **Alignment**: `flex-start` (icon aligns with top of text)

#### Chevron Icon
- **Size**: 0.7rem (11px) - very small
- **Color**: #999 (light gray)
- **Position**: Top-aligned with text
- **Margin-top**: 0.25rem (slight offset)

#### Answer Content
- **Padding**: `0 1.5rem 1.75rem 1.5rem`
- **Font size**: 0.9375rem (15px)
- **Line height**: 1.7
- **Color**: #555 (medium gray)
- **Strong text**: Black (#1a1a1a), weight 600

---

### 3. CTA Section (Bottom Banner)

#### Layout
- **Background**: Gold/tan (#d8aa6d)
- **Padding**: 5rem 0
- **Text align**: Center

#### Typography
- **Heading**: "Still have a question?"
  - Font size: 2.25rem (36px)
  - Font weight: 400 (normal)
  - Color: Black (#1a1a1a)
  
- **Paragraph text**:
  - Font size: 1rem (16px)
  - Color: Black (#1a1a1a)
  - Line height: 1.6

- **Email link**: Underlined, black

---

## Color Palette

```css
/* Backgrounds */
Hero Background:        #d8aa6d (gold/tan)
FAQ Section:           #ffffff (white)
FAQ Items:             #ffffff (white)
CTA Background:        #d8aa6d (gold/tan)

/* Borders */
Item Borders:          #d0d0d0 (light gray)

/* Text Colors */
Headings:              #1a1a1a (black)
Question Text:         #1a1a1a (black)
Answer Text:           #555555 (medium gray)
Strong Text:           #1a1a1a (black)
Icon Color:            #999999 (light gray)
```

---

## Typography Scale

```css
/* Font Sizes */
Hero Title:            2.5rem (40px)
CTA Heading:           2.25rem (36px)
Question Text:         1rem (16px)
Answer Text:           0.9375rem (15px)
Icon Size:             0.7rem (11px)

/* Font Weights */
Hero Title:            400 (normal)
CTA Heading:           400 (normal)
Questions:             400 (normal) ← Changed from 600
Answers:               400 (normal)
Strong Terms:          600 (semi-bold)
```

---

## Spacing System

```css
/* Sections */
Hero Min-Height:       300px
FAQ Section Padding:   3rem 0 4rem
CTA Section Padding:   5rem 0

/* Container */
FAQ Max-Width:         750px
Container Padding:     0 1rem

/* FAQ Items */
Question Padding:      1.75rem 1.5rem
Answer Padding:        0 1.5rem 1.75rem 1.5rem
Text-Icon Gap:         2rem
Item Border:           1px solid

/* Margins */
Between Items:         0 (continuous)
Hero Title:            0
CTA Heading Bottom:    1rem
CTA Text Bottom:       2rem
```

---

## Key Design Principles

### 1. Minimalism
- ✅ Normal font weights (400) throughout
- ✅ No bold text in questions
- ✅ Clean white background
- ✅ Simple border separators

### 2. Centered Hero
- ✅ Flexbox centering (vertical + horizontal)
- ✅ Tall banner (300px min-height)
- ✅ Title perfectly centered in space

### 3. Clean Separators
- ✅ Single border lines between items
- ✅ No gaps or shadows
- ✅ Continuous list appearance
- ✅ Light gray borders (#d0d0d0)

### 4. Typography Hierarchy
- ✅ Normal weight for better readability
- ✅ Generous line-height (1.6-1.7)
- ✅ Subtle color differences (black vs gray)
- ✅ Small, unobtrusive icons

### 5. Spacing
- ✅ Generous padding in questions (1.75rem)
- ✅ Wide gap between text and icon (2rem)
- ✅ Consistent vertical rhythm
- ✅ Proper breathing room

---

## Before vs After

### BEFORE (Incorrect)
❌ Hero left-aligned
❌ Hero not vertically centered
❌ Bold question text (weight 600)
❌ Darker borders (#e0e0e0)
❌ Background hover effects
❌ Smaller padding
❌ Tighter spacing

### AFTER (Correct - Matches Image)
✅ Hero centered horizontally AND vertically
✅ Flexbox layout with min-height
✅ Normal question text (weight 400)
✅ Lighter borders (#d0d0d0)
✅ No hover effects (clean)
✅ Generous padding (1.75rem)
✅ Wide spacing (2rem gap)
✅ White background
✅ Small, subtle icons

---

## Responsive Design

### Mobile (<768px)
- Hero min-height: 200px
- Hero title: 1.75rem
- Question padding: 1.5rem 1rem
- Font sizes reduced appropriately
- CTA padding: 3.5rem 1.5rem

### Tablet & Desktop (≥768px)
- Hero min-height: 300px
- Hero title: 2.5rem
- Question padding: 1.75rem 1.5rem
- Full spacing maintained
- CTA padding: 5rem 0

---

## Testing Checklist

### Hero Section
- [x] Title centered horizontally
- [x] Title centered vertically
- [x] Min-height 300px (tall banner)
- [x] Gold/tan background
- [x] Normal font weight (400)
- [x] No left/right padding on section

### FAQ Items
- [x] White background
- [x] Border separators (not cards)
- [x] No gaps between items
- [x] Normal font weight (400)
- [x] Generous padding (1.75rem)
- [x] Wide text-icon gap (2rem)
- [x] Small gray icons (0.7rem, #999)
- [x] No hover background change

### CTA Section
- [x] Gold/tan background
- [x] Centered text
- [x] Normal font weight (400)
- [x] Proper spacing (5rem padding)

### Interactions
- [x] Smooth expand/collapse
- [x] Icon rotates 180°
- [x] Only one item open at a time
- [x] No visual glitches

---

## Files Modified
1. **`assets/css/components.css`** - Complete FAQ section redesign

---

**Status**: ✅ COMPLETE - Exact match to target image
**Date**: December 28, 2025
**Final Update**: Hero centered vertically + horizontally, entire page reformatted

