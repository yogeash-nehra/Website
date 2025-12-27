# About Us Page - Visual Testing Checklist

Use this checklist to verify the About page matches the original screenshots.

## Screenshot Comparison Checklist

### Screenshot 1: Hero Section ✅
- [ ] Tan/gold background color (#d8aa6d)
- [ ] "About us" centered heading
- [ ] Subtitle: "Our Story, Our Team, Our Indigeneity." in italics
- [ ] Proper spacing and padding

### Screenshot 2: Founder Profile ✅
- [ ] Two-column layout (image left, content right)
- [ ] Breviss Wolfgramm photo displays properly
- [ ] Name in large heading
- [ ] Title: "Indigenous Strategist & Systems Innovator"
- [ ] Subtitle: "Decades of leadership across sectors..."
- [ ] Two paragraphs of biography text
- [ ] Photo has rounded corners and shadow

### Screenshot 3: Values Section ✅
- [ ] Tan/gold background matching hero
- [ ] "Whakapapa. Purpose. Integrity." heading centered
- [ ] 5 value cards displayed
- [ ] Each card has circular icon background
- [ ] Icons visible and appropriate
- [ ] Card backgrounds are light tan/cream
- [ ] Grid layout (3 columns on desktop)
- [ ] Cards have hover effect (lift up)

**Value Cards to Verify:**
- [ ] Whakapapa (people icon)
- [ ] Manaakitanga (hands/heart icon)
- [ ] Mātauranga Māori (tree icon)
- [ ] Tino Rangatiratanga (crown icon)
- [ ] Kotahitanga (handshake icon)

### Screenshot 4: Services Overview ✅
- [ ] White background
- [ ] "Five Pillars. One Purpose..." heading
- [ ] Descriptive paragraph under heading
- [ ] 5 service cards in 2-column grid
- [ ] Cards have light gray background
- [ ] Cards have hover effect
- [ ] All text is readable

**Service Cards to Verify:**
- [ ] AI & Automation for Business
- [ ] Cultural Competency & Te Tiriti Workshops
- [ ] Māori Tourism Experiences
- [ ] Relational Research Partnerships
- [ ] Strategic Engagement & Systems Change

### Screenshot 5: Approach Section ✅
- [ ] Light gray background
- [ ] "Relational First. Outcomes Second." heading
- [ ] Two-column layout (content left, image right)
- [ ] Multiple paragraphs of text
- [ ] Highlighted principles box with border
- [ ] Team photo displays properly
- [ ] Photo has rounded corners and shadow
- [ ] Wave divider at bottom transitioning to tan

### Screenshot 6: CTA Section ✅
- [ ] Tan/gold background
- [ ] "Let's Co-Design What Comes Next" heading
- [ ] Two paragraphs of descriptive text
- [ ] Black CTA button
- [ ] Button text: "Book a Free Strategy Session"
- [ ] Button links to contact page
- [ ] Proper spacing around button

## Responsive Testing

### Desktop (1920px) ✅
- [ ] Two-column layouts display side-by-side
- [ ] Three-column values grid
- [ ] All images load and display properly
- [ ] Navigation bar looks correct
- [ ] Footer displays properly

### Tablet (768px) ✅
- [ ] Founder section stacks vertically
- [ ] Approach section stacks vertically
- [ ] Values grid shows 2 columns
- [ ] Services grid stacks to 1 column
- [ ] Text remains readable
- [ ] Images scale appropriately

### Mobile (375px) ✅
- [ ] All sections stack vertically
- [ ] Values grid shows 1 column
- [ ] Hero heading size is appropriate
- [ ] All text is readable (not too small)
- [ ] Images don't overflow
- [ ] CTA button is full-width or centered
- [ ] Navigation becomes mobile menu

## Navigation Testing

### Header ✅
- [ ] Logo links to home page
- [ ] "About Us" has active state
- [ ] All menu items link correctly
- [ ] Social media icons link correctly
- [ ] "Book a Free Session" button works
- [ ] Mobile menu toggle works

### Footer ✅
- [ ] About Us link works
- [ ] All footer links work
- [ ] Footer displays on all screen sizes

## Content Verification

### Text Content ✅
- [ ] All headings match screenshots
- [ ] All body text is present
- [ ] No typos or grammatical errors
- [ ] Māori words spelled correctly
- [ ] Macrons (tohutō) included where needed

### Images ⚠️
- [ ] Breviss Wolfgramm photo (currently placeholder)
- [ ] Approach team photo (currently placeholder)
- [ ] All images have alt text
- [ ] Images are optimized for web

## Technical Checks

### SEO ✅
- [ ] Page title set correctly
- [ ] Meta description present
- [ ] Keywords included
- [ ] Open Graph tags present
- [ ] Structured data (if needed)

### Accessibility ✅
- [ ] All images have alt text
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Sufficient color contrast
- [ ] Links are keyboard accessible
- [ ] Focus states visible

### Performance ✅
- [ ] Page loads quickly
- [ ] No console errors
- [ ] Images are appropriately sized
- [ ] CSS is minified (for production)
- [ ] No render-blocking resources

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Final Checks

- [ ] Compare side-by-side with screenshots
- [ ] Check spacing and alignment
- [ ] Verify all colors match
- [ ] Test all interactive elements
- [ ] Proofread all content
- [ ] Replace placeholder images
- [ ] Optimize images before deployment

## Known Issues

⚠️ **Images**: Currently using placeholder images from home/team-3.jpg
- Need actual Breviss Wolfgramm photo
- Need actual team/approach photo

## How to Test

1. Open `pages/about.html` in your browser
2. Compare with screenshots provided
3. Check each section against this list
4. Test on different screen sizes
5. Test in different browsers

## Quick Test Commands

```bash
# If you have Python installed
cd c:\Users\yogeash.nehra\Downloads\temp4
python -m http.server 8000
# Then open: http://localhost:8000/pages/about.html

# Or if you have Node.js with http-server
npx http-server -p 8000
# Then open: http://localhost:8000/pages/about.html
```

---

**Last Updated**: December 23, 2025  
**Status**: Ready for testing and image replacement

