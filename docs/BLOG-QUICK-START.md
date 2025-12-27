# 🚀 Blog Setup - Quick Start

## Step-by-Step Instructions

### 1. Create Template
```bash
node scripts/create-blog-template.js
```
✅ Creates the blog post HTML template

### 2. Convert MDX to HTML
```bash
node scripts/mdx-to-html.js
```
✅ Converts all 28 blog posts to HTML pages

### 3. Copy Media Files
```bash
# Windows (PowerShell)
Copy-Item -Recurse migration\mdx\media blog\media

# Mac/Linux
cp -r migration/mdx/media blog/media
```
✅ Copies all images to blog folder

### 4. Create Blog Index
```bash
node scripts/create-blog-index.js
```
✅ Creates the main blog listing page

### 5. Test
Open `blog/index.html` in your browser or use a local server:
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# Then visit: http://localhost:8000/blog
```

---

## File Structure After Setup

```
your-project/
├── blog/
│   ├── index.html                                    ← Blog listing
│   ├── media/                                        ← All images
│   ├── ai-with-aroha--how-m-ori-values.../
│   │   └── index.html                               ← Individual post
│   ├── marae-based-inclusion-training.../
│   │   └── index.html
│   └── ... (26 more posts)
├── scripts/
│   ├── create-blog-template.js
│   ├── mdx-to-html.js
│   ├── create-blog-index.js
│   └── blog-post-template.html
└── ... (rest of your site)
```

---

## ✍️ Writing a New Blog Post

### Option A: Simple (Create HTML Directly)

1. Copy an existing post's `index.html`
2. Update the content
3. Add to blog index manually

### Option B: Use MDX (Recommended)

1. Create new MDX file in `migration/mdx/`:

```markdown
---
title: "My New Post Title"
description: "Brief description for SEO"
slug: "my-new-post-title"
canonical: "https://wgholdings.co.nz/blog/my-new-post-title"
date: "Jan 15, 2026"
---

## Introduction

Your content here...

## Main Section

More content...
```

2. Run conversion:
```bash
node scripts/mdx-to-html.js
node scripts/create-blog-index.js
```

3. Done! Your new post is live.

---

## Troubleshooting

### Images not loading?
- Make sure you ran: `cp -r migration/mdx/media blog/media`
- Check image paths in posts are `/blog/media/`

### Links broken?
- Make sure your web server is serving from the root directory
- Or use relative paths

### Styles look wrong?
- Check that `/assets/css/` files are accessible
- The template uses your existing site's CSS

---

## Deploy to Production

1. Upload entire `blog/` folder to your web server
2. Make sure the folder structure is preserved
3. Test a few blog posts
4. Update your main navigation to link to `/blog`

---

## Tips

- **SEO**: Each post has proper meta tags and canonical URLs
- **Social**: Open Graph tags for Facebook/LinkedIn sharing
- **Speed**: Static HTML = super fast loading
- **Maintenance**: Just run the scripts to add new posts

---

Ready to go! 🎉

