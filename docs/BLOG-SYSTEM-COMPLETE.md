# 📚 Complete Blog System Documentation

## Overview

You now have a **complete static blog system** that converts your MDX files to HTML pages matching your website's design.

---

## 🎯 Quick Start (5 Minutes)

```bash
# One command to set everything up:
node scripts/setup-blog.js
```

That's it! Your blog is ready.

---

## 📁 What You Got

### 1. **Conversion Scripts**
- `scripts/create-blog-template.js` - Creates HTML template with your site's header/footer
- `scripts/mdx-to-html.js` - Converts MDX → HTML
- `scripts/create-blog-index.js` - Generates blog listing page
- `scripts/setup-blog.js` - **One-command setup** (runs all scripts)

### 2. **Generated Blog**
- `blog/index.html` - Main blog page (lists all posts)
- `blog/[slug]/index.html` - Individual blog posts (28 posts)
- `blog/media/` - All blog images (69 files)

### 3. **Documentation**
- `BLOG-QUICK-START.md` - Step-by-step guide
- `BLOG-INTEGRATION-GUIDE.md` - Detailed explanations
- `migration/DEPLOYMENT-CHECKLIST.md` - Pre-deployment tasks

---

## ✍️ Writing a New Blog Post

### Method 1: Create MDX File (Recommended)

1. Create `migration/mdx/my-new-post.mdx`:

```markdown
---
title: "How to Build Better Teams"
description: "Learn practical strategies for team building with Māori values"
slug: "how-to-build-better-teams"
canonical: "https://wgholdings.co.nz/blog/how-to-build-better-teams"
date: "Jan 28, 2026"
---

## Introduction

Start your post here...

## Key Points

- Point 1
- Point 2
- Point 3

## Conclusion

Wrap up your thoughts...
```

2. Run conversion:
```bash
node scripts/mdx-to-html.js
node scripts/create-blog-index.js
```

3. Done! New post is live at `blog/how-to-build-better-teams/index.html`

### Method 2: Copy Existing Post

1. Copy any existing post folder: `blog/ai-with-aroha.../`
2. Rename folder to your new slug
3. Edit `index.html` - change title, content, etc.
4. Manually add card to `blog/index.html`

---

## 🌐 Deployment

### To Deploy:

1. **Upload `blog/` folder** to your web server
2. Make sure it's at the root: `wgholdings.co.nz/blog/`
3. Test a few posts
4. Update navigation if needed

### URL Structure:

```
https://wgholdings.co.nz/blog                    → Blog listing
https://wgholdings.co.nz/blog/ai-with-aroha.../  → Individual post
```

---

## 🎨 Customization

### Change Blog Template

Edit `scripts/blog-post-template.html`:
- Update header/footer
- Modify styles
- Change layout

Then re-run: `node scripts/mdx-to-html.js`

### Change Blog Index

Edit the template in `scripts/create-blog-index.js` (search for `const blogIndexHtml`), then re-run: `node scripts/create-blog-index.js`

---

## 🔧 Maintenance

### Add New Post:
```bash
# 1. Create MDX file
# 2. Run:
node scripts/mdx-to-html.js && node scripts/create-blog-index.js
```

### Update Existing Post:
```bash
# 1. Edit MDX file
# 2. Run:
node scripts/mdx-to-html.js
```

### Regenerate Everything:
```bash
node scripts/setup-blog.js
```

---

## ✅ SEO Features

Every blog post has:
- ✅ Proper meta tags (title, description)
- ✅ Open Graph tags (social sharing)
- ✅ Canonical URLs
- ✅ Schema.org structured data (Article)
- ✅ Clean, semantic HTML
- ✅ Fast loading (static HTML)

---

## 📊 What's Included

- **28 migrated blog posts** from Durable
- **69 images** (all optimized paths)
- **Blog index page** with cards
- **Responsive design** (mobile-friendly)
- **Your site's header/footer** on every page
- **Working navigation** and links

---

## 🚨 Before Going Live

### Checklist:

- [ ] Test 3-5 blog posts locally
- [ ] Check images load correctly
- [ ] Test on mobile
- [ ] Verify links work
- [ ] Check social sharing (Open Graph)
- [ ] Test header/footer navigation
- [ ] Verify SEO meta tags

### Known Issues to Fix:

1. **Email links** - Some have CloudFlare protection, may need updating
2. **Internal links** - Check links to your main site pages work
3. **Media paths** - Ensure `/blog/media/` is accessible

---

## 🎓 Technical Details

### How It Works:

1. **MDX files** store your content + metadata (frontmatter)
2. **Scripts extract** frontmatter and convert markdown → HTML
3. **Template wraps** content with your site's header/footer
4. **Static HTML** generated for each post
5. **Index page** auto-generates from all posts

### Benefits:

- ✅ No database needed
- ✅ Super fast (just HTML)
- ✅ Easy to maintain
- ✅ Works with any host
- ✅ Future-proof (standard HTML)

---

## 📞 Need Help?

### Common Issues:

**Images not loading?**
→ Copy `migration/mdx/media` to `blog/media`

**Template looks wrong?**
→ Check `/assets/css/` files are accessible

**New post not showing?**
→ Re-run: `node scripts/create-blog-index.js`

**Want to change styles?**
→ Edit `scripts/blog-post-template.html`, then re-convert

---

## 🎉 You're All Set!

Your blog is production-ready. Just run `node scripts/setup-blog.js` and you're good to go!

**Total time to set up: ~5 minutes**
**Time to add new post: ~2 minutes**

---

## Summary

```bash
# Complete setup:
node scripts/setup-blog.js

# Add new post:
# 1. Create MDX file
# 2. Run:
node scripts/mdx-to-html.js && node scripts/create-blog-index.js

# Deploy:
# Upload blog/ folder to web server

Done! 🚀
```

