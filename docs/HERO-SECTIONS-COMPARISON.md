# Hero Section Comparison - All Pages

## HTML Structure Comparison

### ✅ About Us Page
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

### ✅ Services Page
```html
<section class="about-hero-section">
    <div class="container">
        <div class="about-hero-content">
            <h1>What We Offer</h1>
            <p class="hero-tagline">Five pillars. One purpose: culturally grounded innovation.</p>
        </div>
    </div>
</section>
```

### ✅ Contact Page
```html
<section class="about-hero-section">
    <div class="container">
        <div class="about-hero-content">
            <h1>Contact Us</h1>
            <p class="hero-tagline">Ready to transform your organisation through culture, AI, or leadership?</p>
            <p>We offer free consultations, tailored workshops, and responsive guidance. Choose the option that best suits your needs.</p>
        </div>
    </div>
</section>
```

### ✅ FAQ Page (NOW MATCHES!)
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

---

## Structure Analysis

### All Pages Use:
- ✅ `.about-hero-section` (section class)
- ✅ `.container` (container div)
- ✅ `.about-hero-content` (content wrapper)
- ✅ `<h1>` (page title)
- ✅ `.hero-tagline` (tagline paragraph)

### Differences:
**Contact Page Only:**
- Has an **additional paragraph** without `.hero-tagline` class
- This is intentional - Contact page has extra description text

**All Other Pages (About, Services, FAQ):**
- Have **just title + tagline**
- No extra paragraph

---

## CSS Comparison

### Shared Hero Styles (Used by ALL pages)

```css
/* About Hero Section */
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

.about-hero-content p {
    font-size: 1.125rem;
    line-height: 1.7;
    color: var(--text-color);
    max-width: 900px;
    margin: 1rem auto;
}

.hero-tagline {
    font-size: 1.5rem;
    font-style: italic;
    color: var(--text-color);
    margin-bottom: 0.5rem;
}
```

### Responsive Styles (Shared)

```css
@media (max-width: 768px) {
    .about-hero-section {
        padding: 6rem 0 3rem;
    }
    
    .about-hero-content h1 {
        font-size: 2rem;
    }
    
    .hero-tagline {
        font-size: 1.125rem;
    }
}
```

---

## ✅ Verification Results

### HTML Classes Match:
| Page | Section Class | Content Class | Tagline Class |
|------|--------------|---------------|---------------|
| About Us | `.about-hero-section` ✅ | `.about-hero-content` ✅ | `.hero-tagline` ✅ |
| Services | `.about-hero-section` ✅ | `.about-hero-content` ✅ | `.hero-tagline` ✅ |
| Contact | `.about-hero-section` ✅ | `.about-hero-content` ✅ | `.hero-tagline` ✅ |
| FAQ | `.about-hero-section` ✅ | `.about-hero-content` ✅ | `.hero-tagline` ✅ |

### CSS Usage:
| Page | Uses Shared CSS | Has Custom CSS | Notes |
|------|----------------|----------------|-------|
| About Us | ✅ Yes | ❌ No | Uses base styles |
| Services | ✅ Yes | ❌ No | Uses base styles |
| Contact | ✅ Yes | ❌ No | Uses base styles + extra paragraph |
| FAQ | ✅ Yes | ❌ No | Uses base styles (custom removed) |

---

## Design Specifications (All Pages)

### Desktop (≥768px)
```
Background:     #d8aa6d (gold/tan)
Padding:        8rem 0 4rem
Text Align:     center

Title:
  - Size:       3.5rem (56px)
  - Weight:     normal
  - Color:      #1a1a1a
  - Margin:     0 0 1rem 0

Tagline:
  - Size:       1.5rem (24px)
  - Style:      italic
  - Color:      #1a1a1a
  - Margin:     1rem auto 0.5rem

Additional Text (Contact only):
  - Size:       1.125rem (18px)
  - Style:      normal
  - Color:      #1a1a1a
  - Max-width:  900px
```

### Mobile (<768px)
```
Padding:        6rem 0 3rem

Title:          2rem (32px)
Tagline:        1.125rem (18px)
```

---

## Conclusion

### ✅ ALL PAGES NOW IDENTICAL

**FAQ page hero section is now 100% identical to:**
- About Us page
- Services page  
- Contact page (structure-wise)

**All pages share:**
1. ✅ Same HTML structure
2. ✅ Same CSS classes
3. ✅ Same styling
4. ✅ Same padding
5. ✅ Same font sizes
6. ✅ Same alignment (center)
7. ✅ Same responsive behavior

**The only difference:** Contact page has an extra non-tagline paragraph, which is intentional for that page's design.

---

**Status**: ✅ VERIFIED - FAQ hero matches all other pages perfectly
**Date**: December 28, 2025
**Confirmation**: All hero sections use identical structure and styling

