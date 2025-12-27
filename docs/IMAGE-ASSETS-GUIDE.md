# Image Assets Guide

## Required Images for WG Holdings Website

This document lists all images needed for the website. Please provide these images in high resolution.

## Logo Files

Place in: `assets/images/logo/`

- [ ] **logo.png** - Main logo (transparent background)
  - Recommended size: 200x50px to 400x100px
  - Format: PNG with transparency
  - Use: Main header logo

- [ ] **logo-white.png** - White version for dark backgrounds
  - Recommended size: 200x50px to 400x100px
  - Format: PNG with transparency
  - Use: Footer, dark sections

- [ ] **favicon.png** - Browser tab icon
  - Size: 32x32px or 64x64px
  - Format: PNG
  - Use: Browser favicon

- [ ] **apple-touch-icon.png** - iOS home screen icon
  - Size: 180x180px
  - Format: PNG
  - Use: Apple devices bookmark

- [ ] **og-image.jpg** - Social media preview image
  - Size: 1200x630px
  - Format: JPG
  - Use: Facebook, LinkedIn sharing

- [ ] **twitter-image.jpg** - Twitter card image
  - Size: 1200x675px
  - Format: JPG
  - Use: Twitter sharing

## Homepage Images

Place in: `assets/images/pages/home/`

- [ ] **hero-background.jpg** - Hero section background
  - Recommended size: 1920x1080px
  - Format: JPG (or WebP with JPG fallback)
  - Alt text: [Describe the image]

- [ ] **about-preview.jpg** - About section image
  - Recommended size: 800x600px
  - Format: JPG
  - Alt text: "About WG Holdings"

- [ ] **service-1.jpg** - Service/Feature image 1
  - Recommended size: 600x400px
  - Format: JPG
  - Alt text: [Service name/description]

- [ ] **service-2.jpg** - Service/Feature image 2
  - Recommended size: 600x400px
  - Format: JPG
  - Alt text: [Service name/description]

- [ ] **service-3.jpg** - Service/Feature image 3
  - Recommended size: 600x400px
  - Format: JPG
  - Alt text: [Service name/description]

## About Page Images

Place in: `assets/images/pages/about/`

- [ ] **about-hero.jpg** - About page hero image
  - Recommended size: 1920x600px
  - Format: JPG
  - Alt text: [Describe the image]

- [ ] **team-photo.jpg** - Team or office photo
  - Recommended size: 1200x800px
  - Format: JPG
  - Alt text: "WG Holdings team" or "WG Holdings office"

- [ ] **company-history.jpg** - Historical or milestone image
  - Recommended size: 800x600px
  - Format: JPG
  - Alt text: [Describe the image]

- [ ] **mission-vision.jpg** - Mission/vision section image
  - Recommended size: 800x600px
  - Format: JPG
  - Alt text: [Describe the image]

## Services Page Images

Place in: `assets/images/pages/services/`

- [ ] **services-hero.jpg** - Services page hero
  - Recommended size: 1920x600px
  - Format: JPG
  - Alt text: "WG Holdings Services"

- [ ] **service-detail-1.jpg** - Detailed service image 1
  - Recommended size: 800x600px
  - Format: JPG
  - Alt text: [Service name]

- [ ] **service-detail-2.jpg** - Detailed service image 2
  - Recommended size: 800x600px
  - Format: JPG
  - Alt text: [Service name]

- [ ] **service-detail-3.jpg** - Detailed service image 3
  - Recommended size: 800x600px
  - Format: JPG
  - Alt text: [Service name]

## Contact Page Images

Place in: `assets/images/pages/contact/`

- [ ] **contact-hero.jpg** - Contact page hero (optional)
  - Recommended size: 1920x600px
  - Format: JPG
  - Alt text: "Contact WG Holdings"

- [ ] **office-exterior.jpg** - Office building exterior
  - Recommended size: 800x600px
  - Format: JPG
  - Alt text: "WG Holdings office location"

- [ ] **office-interior.jpg** - Office interior (optional)
  - Recommended size: 800x600px
  - Format: JPG
  - Alt text: "WG Holdings office"

## Team Member Photos (if applicable)

Place in: `assets/images/team/`

- [ ] **person-1.jpg** - Team member 1
  - Recommended size: 400x400px (square)
  - Format: JPG
  - Alt text: "[Person name], [Title]"

- [ ] **person-2.jpg** - Team member 2
  - Recommended size: 400x400px (square)
  - Format: JPG
  - Alt text: "[Person name], [Title]"

- [ ] **person-3.jpg** - Team member 3
  - Recommended size: 400x400px (square)
  - Format: JPG
  - Alt text: "[Person name], [Title]"

## Icons (optional - can use Font Awesome instead)

Place in: `assets/images/icons/`

- [ ] **icon-service-1.svg** - Service icon 1
- [ ] **icon-service-2.svg** - Service icon 2
- [ ] **icon-service-3.svg** - Service icon 3

## Image Optimization Checklist

Before uploading images, ensure:

### Resolution:
- [ ] Images are high quality but not excessive
- [ ] Hero images: 1920px wide
- [ ] Content images: 800-1200px wide
- [ ] Thumbnails: 400-600px wide
- [ ] Icons: 64-128px or SVG

### Format:
- [ ] Photos: JPG or WebP
- [ ] Graphics with transparency: PNG
- [ ] Icons: SVG (preferred) or PNG
- [ ] Logos: PNG with transparency or SVG

### File Size:
- [ ] Hero images: < 300KB
- [ ] Content images: < 200KB
- [ ] Thumbnails: < 100KB
- [ ] Total page weight: < 3MB

### Optimization Tools:
- **TinyPNG** (https://tinypng.com/) - Compress PNG and JPG
- **Squoosh** (https://squoosh.app/) - Advanced compression
- **ImageOptim** (Mac) - Batch optimization
- **RIOT** (Windows) - Image optimization

### How to Optimize:
1. Resize to correct dimensions
2. Compress using tool above
3. Convert to WebP (with fallback)
4. Rename with descriptive names (lowercase, hyphens)
5. Add to appropriate folder

## Image Naming Convention

Use descriptive, SEO-friendly names:

✅ Good:
- `wg-holdings-office-building.jpg`
- `team-meeting-conference-room.jpg`
- `financial-consulting-service.jpg`

❌ Bad:
- `IMG_1234.jpg`
- `photo1.jpg`
- `image.jpg`

## Alt Text Guidelines

Every image MUST have descriptive alt text for:
- SEO optimization
- Accessibility (screen readers)
- Fallback when image doesn't load

### Alt Text Examples:

```html
<!-- Good alt text -->
<img src="office.jpg" alt="WG Holdings modern office building in Auckland">

<!-- Bad alt text -->
<img src="office.jpg" alt="image">
<img src="office.jpg" alt="office">
```

### Alt Text Rules:
- Be descriptive but concise
- Include relevant keywords naturally
- Don't start with "image of" or "picture of"
- Don't stuff keywords
- 125 characters or less

## Providing Images to Developer

### Method 1: Cloud Storage
- Upload to Google Drive, Dropbox, or OneDrive
- Share link with developer
- Organize in folders matching structure above

### Method 2: Direct Transfer
- Use WeTransfer or similar service
- Include folder structure
- Provide image inventory list

### Method 3: Existing Website
If images are on current website:
- Provide website URL
- Developer can download directly
- Verify image quality is sufficient

## Image Inventory Template

When providing images, include this information:

```csv
Filename, Location, Dimensions, Description, Alt Text, Pages Used
logo.png, assets/images/logo/, 300x75, Company logo, WG Holdings logo, All pages
hero-background.jpg, assets/images/pages/home/, 1920x1080, Office building, Modern WG Holdings office, Homepage
```

## Next Steps

1. **Review** this list with your team
2. **Gather** all required images
3. **Optimize** images using recommended tools
4. **Organize** into folders matching structure
5. **Share** with developer via preferred method
6. **Verify** images look good on test site

---

## Questions to Answer:

Before providing images, consider:

1. Do you have professional photos, or do you need stock images?
2. Do you have a photographer or should we source stock photos?
3. What is your brand color scheme?
4. Do you have brand guidelines for image style?
5. Do you prefer photos of people, products, abstract, or mixed?
6. Do you have specific image preferences or examples you like?

---

**Note**: If you don't have some images yet, we can:
- Use placeholder images initially
- Source free stock photos from Unsplash, Pexels
- Recommend professional photography services
- Create graphics/icons as needed

