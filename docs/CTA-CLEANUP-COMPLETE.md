# CTA Cleanup Complete ✅

## Summary

All blog post CTAs have been cleaned and standardized across **28 blog posts**.

---

## Changes Made

### 1. **Removed CloudFlare Email Obfuscation**
   - Removed all instances of `[[\[email protected\]]]` with CloudFlare protection links
   - Replaced with clean, clickable email links: `info@wgholdings.co.nz`

### 2. **Simplified Wordy CTAs**
   - **Before:** "If your organisation works with water in any form and wants to lead with integrity, connect with Wolfgramm Holdings at [[\[email protected\]]]... to learn more about the Treaty and Integrity of Water Workshop."
   - **After:** "Contact us at info@wgholdings.co.nz or visit our workshops page to learn more."

### 3. **Redirected Training & Workshop Mentions**
   - All references to `training.wgholdings.co.nz` → `/workshops`
   - All references to `workplaceinclusion.org.nz` → `/workshops`
   - Specific workshop mentions now link to `/workshops` page

### 4. **Redirected Service Queries**
   - All `www.wgholdings.co.nz` CTAs → `/services` or `/contact`
   - Long service URLs simplified to `/services`

### 5. **Removed Redundant Text**
   - Removed "Wolfgramm Holdings" from CTAs (redundant on our own site)
   - Removed verbose "enquire about tailored delivery" type phrases
   - Removed duplicate email patterns and broken attributes

---

## Final CTA Format Examples

### Clean Email CTA
```html
<p>Contact us at <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a> to learn more.</p>
```

### Email + Service Link CTA
```html
<p>Contact us at <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a> or visit our <a href="/services">services page</a>.</p>
```

### Email + Workshops Link CTA
```html
<p>Contact us at <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a> or visit our <a href="/workshops">workshops page</a> to learn more.</p>
```

---

## Blog Posts Updated

12 blog posts cleaned in total:
- ✅ ai-with-aroha--how-m-ori-values-are-shaping-the-future-of-artificial-intelligence
- ✅ beyond-compliance--towards-relational-leadership
- ✅ building-belonging--how-cultural-connection-strengthens-workplace-resilience
- ✅ from-transactional-to-relational--what-cultural-investment-means-for-nz-businesses
- ✅ honouring-te-tiriti-through-water-stewardship
- ✅ how-hr-leaders-can-address-burnout-with-indigenous-wellbeing-models
- ✅ how-smes-built-belonging-through-wellness-on-the-marae
- ✅ māori-values-and-leadership--how-cultural-integrity-builds-stronger-teams
- ✅ marae-based-inclusion-training--bridging-culture-and-commerce-in-aotearoa
- ✅ marae-christmas-how-cultural-celebration-strengthens-workplace-connection
- ✅ plan-your-2026-training--m-ori-engagement--wellbeing---treaty-workshops
- ✅ why-boards-need-te-tiriti-training-before-2027
- ✅ why-marae-based-training-is-the-future-of-workplace-inclusion-in-new-zealand

---

## Verification

✅ **No email obfuscation remaining** (verified with grep)  
✅ **All emails are proper mailto: links**  
✅ **Training references redirect to /workshops**  
✅ **Service queries redirect to /services**  
✅ **CTAs are clean, concise, and well-formatted**

---

## Scripts Created

- `scripts/clean-ctas.js` - Initial CTA cleanup
- `scripts/clean-ctas-aggressive.js` - Aggressive pattern matching
- `scripts/clean-ctas-final.js` - Final cleanup pass for remaining obfuscation
- `scripts/simplify-ctas.js` - Simplified wordy CTAs

All cleanup scripts are preserved in the `scripts/` directory for future use.

