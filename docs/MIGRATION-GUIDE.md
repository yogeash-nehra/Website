# Migration Guide: WG Holdings Website

## Table of Contents
1. [Pre-Migration Checklist](#pre-migration-checklist)
2. [Page-by-Page Migration Process](#page-by-page-migration-process)
3. [Asset Collection](#asset-collection)
4. [Content Migration](#content-migration)
5. [Testing Procedures](#testing-procedures)
6. [Deployment Steps](#deployment-steps)

## Pre-Migration Checklist

### 1. Audit Current Website

#### Capture Current State:
```
- [ ] Take full-page screenshots of every page
- [ ] Document current page structure
- [ ] List all pages and their URLs
- [ ] Export all content
- [ ] Download all images and media
- [ ] Note all interactive elements
- [ ] Record current SEO metadata
- [ ] Document current analytics baseline
```

#### Tools for Auditing:
- **Screaming Frog**: Crawl entire site
- **Google Search Console**: Download current rankings
- **Google Analytics**: Export traffic data
- **Browser DevTools**: Inspect elements and styles
- **HTTrack**: Download complete website copy (optional)

### 2. Create Site Map

Document your site structure:

```
Home (index.html)
├── About (pages/about.html)
├── Services (pages/services.html)
│   ├── Service 1 (pages/services/service-1.html)
│   ├── Service 2 (pages/services/service-2.html)
│   └── Service 3 (pages/services/service-3.html)
├── Portfolio/Projects (pages/portfolio.html)
├── Contact (pages/contact.html)
├── Privacy Policy (pages/privacy.html)
└── Terms of Service (pages/terms.html)
```

## Page-by-Page Migration Process

### Step 1: Homepage

#### Current Page Analysis:
```
URL: https://wgholdings.co.nz
Title: [Document current title]
Description: [Document current meta description]
Keywords: [Document current keywords]
```

#### Content Inventory:
- [ ] Header/Navigation elements
- [ ] Hero section content
- [ ] Main content sections (list each)
- [ ] Images used (with dimensions)
- [ ] Call-to-action buttons
- [ ] Footer content
- [ ] Forms (if any)
- [ ] Special features/widgets

#### Migration Tasks:
1. **HTML Structure**
   - [ ] Create semantic HTML structure
   - [ ] Add proper heading hierarchy (H1-H6)
   - [ ] Implement navigation menu
   - [ ] Add footer elements
   
2. **Content Transfer**
   - [ ] Copy all text content
   - [ ] Maintain heading levels
   - [ ] Preserve formatting
   - [ ] Add images with alt text
   
3. **SEO Implementation**
   - [ ] Set page title
   - [ ] Write meta description
   - [ ] Add Open Graph tags
   - [ ] Implement schema markup
   
4. **Styling**
   - [ ] Match color scheme
   - [ ] Replicate layout
   - [ ] Ensure responsive design
   - [ ] Add animations/transitions
   
5. **Testing**
   - [ ] Cross-browser testing
   - [ ] Mobile responsiveness
   - [ ] Link functionality
   - [ ] Form validation (if applicable)

### Step 2: About Page

#### Template for Each Additional Page:

```markdown
## [Page Name] Migration

### Current URL:
[Current URL]

### New URL:
pages/[page-name].html

### Current SEO:
- Title: [Current title]
- Description: [Current description]
- Keywords: [Current keywords]

### Content Sections:
1. [Section 1 name and description]
2. [Section 2 name and description]
3. [Section 3 name and description]

### Images Required:
- [Image 1: description, current location]
- [Image 2: description, current location]

### Special Features:
- [Any forms, animations, interactive elements]

### Migration Checklist:
- [ ] HTML structure created
- [ ] Content transferred
- [ ] Images optimized and uploaded
- [ ] SEO metadata added
- [ ] Styling completed
- [ ] Desktop testing
- [ ] Mobile testing
- [ ] Links verified
```

## Asset Collection

### Images

#### Collection Process:
1. **Download all images from current site**
   - Use browser DevTools > Network tab
   - Use website downloader tool
   - Request from current hosting provider

2. **Organize images by category:**
   ```
   assets/images/
   ├── logo/
   │   ├── logo.png
   │   ├── logo-white.png
   │   ├── favicon.png
   │   └── og-image.jpg
   ├── pages/
   │   ├── home/
   │   ├── about/
   │   ├── services/
   │   └── contact/
   ├── team/
   ├── products/
   └── icons/
   ```

3. **Optimize each image:**
   - Resize to appropriate dimensions
   - Compress (use TinyPNG, ImageOptim)
   - Convert to WebP with fallbacks
   - Rename with descriptive names

#### Image Inventory Template:
```csv
Current_Location, New_Location, Dimensions, Alt_Text, Used_On_Pages
old-site/img1.jpg, assets/images/pages/home/hero.jpg, 1920x1080, WG Holdings office building, Home
```

### Other Assets

- [ ] **Fonts**: Download or link to web fonts
- [ ] **Videos**: Download and optimize
- [ ] **Documents**: PDFs, brochures, etc.
- [ ] **Icons**: SVG or icon fonts
- [ ] **Logos**: Multiple formats and sizes

## Content Migration

### Text Content

#### Extraction Methods:
1. **Manual Copy-Paste**: For smaller sites
2. **CMS Export**: If current site uses a CMS
3. **Web Scraping**: Use automated tools carefully
4. **HTML Source**: Copy from view-source

#### Content Preparation:
```markdown
### [Page Name]

#### H1 Title:
[Main heading]

#### Introduction:
[Opening paragraph]

#### Section 1:
**Heading:** [Section heading]
**Content:** [Section content]

#### Section 2:
**Heading:** [Section heading]
**Content:** [Section content]

#### CTA:
**Text:** [Call-to-action text]
**Link:** [Button/link destination]
```

### SEO Metadata Worksheet

Create a spreadsheet with:

| Page | URL | Title (50-60 chars) | Description (150-160 chars) | Keywords | H1 |
|------|-----|---------------------|------------------------------|----------|-----|
| Home | / | [Title] | [Description] | [Keywords] | [H1] |
| About | /pages/about.html | [Title] | [Description] | [Keywords] | [H1] |

## Testing Procedures

### Pre-Launch Testing

#### 1. Functionality Testing
```
- [ ] All internal links work
- [ ] All external links work
- [ ] Forms submit successfully
- [ ] Form validation works
- [ ] Search functionality (if applicable)
- [ ] Navigation menu works
- [ ] Mobile menu toggles correctly
```

#### 2. Cross-Browser Testing
```
Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)
```

#### 3. Responsive Design Testing
```
Test at breakpoints:
- [ ] Mobile portrait (375px)
- [ ] Mobile landscape (667px)
- [ ] Tablet portrait (768px)
- [ ] Tablet landscape (1024px)
- [ ] Desktop (1200px+)
- [ ] Large desktop (1920px+)
```

#### 4. Performance Testing
```
Use Google PageSpeed Insights:
- [ ] Desktop score > 90
- [ ] Mobile score > 85
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s
```

#### 5. SEO Testing
```
- [ ] All pages have unique titles
- [ ] All pages have meta descriptions
- [ ] All images have alt text
- [ ] Heading hierarchy is correct
- [ ] Sitemap.xml is accessible
- [ ] Robots.txt is configured
- [ ] Schema markup validates
- [ ] Mobile-friendly test passes
```

#### 6. Accessibility Testing
```
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast passes WCAG AA
- [ ] Form labels are proper
- [ ] Focus indicators visible
- [ ] Alt text on images
```

### Testing Tools

- **Browser DevTools**: Built-in debugging
- **Google Lighthouse**: Performance and SEO audit
- **WAVE**: Accessibility testing
- **W3C Validator**: HTML/CSS validation
- **GTmetrix**: Performance testing
- **Broken Link Checker**: Find dead links

## Deployment Steps

### 1. Pre-Deployment

```
- [ ] Backup current website
- [ ] Finalize all content
- [ ] Complete all testing
- [ ] Prepare 301 redirects (if URLs changed)
- [ ] Set up analytics tracking
- [ ] Configure Search Console
- [ ] Prepare rollback plan
```

### 2. Hosting Setup

#### Option A: Shared Hosting (cPanel)
```
1. Upload files via FTP/File Manager
2. Configure domain settings
3. Install SSL certificate
4. Set up email accounts
5. Configure .htaccess for redirects
```

#### Option B: Static Hosting (Netlify, Vercel, GitHub Pages)
```
1. Connect repository (or drag & drop)
2. Configure build settings
3. Set up custom domain
4. Enable HTTPS
5. Configure redirects
```

### 3. Launch Day

#### Morning:
```
- [ ] Upload all files to server
- [ ] Test website on staging URL
- [ ] Verify all links work
- [ ] Check forms submit correctly
- [ ] Test mobile responsiveness
```

#### Go-Live:
```
- [ ] Switch DNS or domain pointer
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Monitor for errors
- [ ] Check Google Analytics
```

#### Post-Launch (First 24 Hours):
```
- [ ] Monitor server logs
- [ ] Check for 404 errors
- [ ] Verify analytics tracking
- [ ] Test from multiple locations
- [ ] Monitor page speed
```

### 4. Post-Deployment

#### Week 1:
```
- [ ] Submit sitemap to Search Console
- [ ] Submit sitemap to Bing Webmaster
- [ ] Monitor Analytics daily
- [ ] Check for broken links
- [ ] Address any issues quickly
```

#### Month 1:
```
- [ ] Review Analytics data
- [ ] Check Search Console for errors
- [ ] Monitor keyword rankings
- [ ] Gather user feedback
- [ ] Make necessary adjustments
```

## URL Mapping & Redirects

If URLs have changed, create 301 redirects:

### Apache (.htaccess):
```apache
# Old URL to new URL
Redirect 301 /old-page.html /pages/new-page.html
Redirect 301 /about-us /pages/about.html
```

### Nginx:
```nginx
rewrite ^/old-page.html$ /pages/new-page.html permanent;
```

### Create Redirect Map:
| Old URL | New URL | Status |
|---------|---------|--------|
| /old-page | /pages/new-page.html | 301 |

## Maintenance Plan

### Daily (First Week):
- Check Analytics
- Monitor error logs
- Test critical functions

### Weekly:
- Review user feedback
- Check for broken links
- Update content as needed

### Monthly:
- Performance audit
- SEO check
- Security updates
- Backup verification

### Quarterly:
- Full site audit
- Content refresh
- Competitor analysis
- Strategy review

---

## Quick Reference: Migration Workflow

1. **Audit** → Document current site
2. **Plan** → Create structure and sitemap
3. **Collect** → Gather all assets
4. **Build** → Create HTML/CSS/JS
5. **Content** → Transfer and optimize
6. **SEO** → Implement metadata and schema
7. **Test** → Comprehensive testing
8. **Deploy** → Launch new site
9. **Monitor** → Track performance
10. **Optimize** → Continuous improvement

---

**Need Help?** Refer to the main README.md and SEO-GUIDE.md for additional information.

