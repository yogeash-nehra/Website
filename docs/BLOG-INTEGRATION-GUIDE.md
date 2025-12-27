# 📘 How to Add MDX Blog Posts to Your Static Website

Since you're using a **static HTML site**, you have 2 main options:

---

## 🎯 RECOMMENDED: Option 1 - Convert MDX to HTML (Static)

This is the **simplest** approach that works with your existing setup.

### What You'll Get:
- Individual HTML pages for each blog post
- Works with your existing static site
- No build process needed
- SEO-friendly

### Step-by-Step Process:

#### 1. **Create Blog Structure**

```bash
mkdir blog
mkdir blog/media
```

#### 2. **Convert MDX to HTML**

I'll create a script that converts your MDX files to HTML pages using your site's template.

```javascript
// scripts/mdx-to-html.js
const fs = require('fs');
const path = require('path');
const { marked } = require('marked'); // npm install marked

const mdxDir = './migration/mdx';
const outputDir = './blog';
const templatePath = './blog-template.html';

// Read template
const template = fs.readFileSync(templatePath, 'utf-8');

// Get all MDX files
const mdxFiles = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));

mdxFiles.forEach(file => {
  const filePath = path.join(mdxDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = {};
  
  if (frontmatterMatch) {
    const yamlContent = frontmatterMatch[1];
    yamlContent.split('\n').forEach(line => {
      const [key, ...value] = line.split(':');
      if (key && value) {
        frontmatter[key.trim()] = value.join(':').trim().replace(/^"|"$/g, '');
      }
    });
    
    // Remove frontmatter from content
    content = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  }
  
  // Remove Pandoc fences
  content = content.split('\n').filter(line => {
    return !line.match(/^:+(\s*{[^}]+})?\s*$/);
  }).join('\n');
  
  // Convert markdown to HTML
  const htmlContent = marked(content);
  
  // Replace placeholders in template
  let html = template
    .replace('{{TITLE}}', frontmatter.title || 'Blog Post')
    .replace('{{DESCRIPTION}}', frontmatter.description || '')
    .replace('{{DATE}}', frontmatter.date || '')
    .replace('{{CANONICAL}}', frontmatter.canonical || '')
    .replace('{{CONTENT}}', htmlContent);
  
  // Create slug directory
  const slug = frontmatter.slug || file.replace('.mdx', '');
  const postDir = path.join(outputDir, slug);
  
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }
  
  // Write HTML file
  fs.writeFileSync(path.join(postDir, 'index.html'), html);
  console.log(`✓ Created: blog/${slug}/index.html`);
});

console.log('\n✅ All blog posts converted to HTML!');
```

#### 3. **Create Blog Post Template**

```html
<!-- blog-template.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} | Wolfgramm Holdings</title>
    <meta name="description" content="{{DESCRIPTION}}">
    <link rel="canonical" href="{{CANONICAL}}">
    
    <!-- Your existing stylesheets -->
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/css/components.css">
    <link rel="stylesheet" href="/assets/css/responsive.css">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <style>
        .blog-post {
            max-width: 800px;
            margin: 0 auto;
            padding: 60px 20px;
        }
        
        .blog-post h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #000;
        }
        
        .blog-meta {
            color: #666;
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #eee;
        }
        
        .blog-content {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #333;
        }
        
        .blog-content h2 {
            font-size: 1.8rem;
            font-weight: 600;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            color: #000;
        }
        
        .blog-content h3 {
            font-size: 1.4rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            color: #000;
        }
        
        .blog-content p {
            margin-bottom: 1.5rem;
        }
        
        .blog-content ul, .blog-content ol {
            margin-bottom: 1.5rem;
            padding-left: 2rem;
        }
        
        .blog-content li {
            margin-bottom: 0.5rem;
        }
        
        .blog-content a {
            color: #d8aa6d;
            text-decoration: underline;
        }
        
        .blog-content a:hover {
            color: #c09855;
        }
        
        .blog-content img {
            max-width: 100%;
            height: auto;
            margin: 2rem 0;
        }
        
        .blog-content strong {
            font-weight: 600;
        }
    </style>
</head>
<body>
    <!-- Copy your header from index.html -->
    <header id="website-header" class="site-header">
        <!-- Your existing header code -->
    </header>
    
    <main>
        <article class="blog-post">
            <h1>{{TITLE}}</h1>
            <div class="blog-meta">
                <span>{{DATE}}</span> • <span>By Breviss Wolfgramm</span>
            </div>
            <div class="blog-content">
                {{CONTENT}}
            </div>
        </article>
    </main>
    
    <!-- Copy your footer from index.html -->
    <footer>
        <!-- Your existing footer code -->
    </footer>
    
    <script src="/assets/js/main.js"></script>
</body>
</html>
```

#### 4. **Copy Media Files**

```bash
cp -r migration/mdx/media blog/media
```

#### 5. **Create Blog Index Page**

```html
<!-- blog/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Blog | Wolfgramm Holdings</title>
    <!-- Your existing meta/styles -->
</head>
<body>
    <!-- Header -->
    
    <main class="blog-listing">
        <div class="container">
            <h1>Blog</h1>
            
            <!-- Blog grid -->
            <div class="blog-grid">
                <article class="blog-card">
                    <a href="/blog/ai-with-aroha--how-m-ori-values-are-shaping-the-future-of-artificial-intelligence">
                        <h2>AI with Aroha</h2>
                        <p>Discover how kaupapa Māori and tikanga are guiding a new approach to AI ethics...</p>
                        <span class="read-more">Read More →</span>
                    </a>
                </article>
                <!-- Add more blog cards -->
            </div>
        </div>
    </main>
    
    <!-- Footer -->
</body>
</html>
```

#### 6. **Run Conversion**

```bash
# Install marked (markdown parser)
npm install marked

# Run conversion
node scripts/mdx-to-html.js
```

---

## 🚀 Option 2 - Use a Static Site Generator (Better Long-term)

If you want a more robust solution, convert to **Astro** or **11ty**.

### Why This is Better:
- Automatic blog listing generation
- Easy to add new posts (just create MDX file)
- Better performance
- Built-in MDX support

### Quick Astro Setup:

```bash
# Create new Astro project
npm create astro@latest blog-site

# Copy your existing HTML/CSS
# Astro lets you use your existing HTML

# Move MDX files to src/content/blog/
# Astro automatically generates routes
```

---

## ✍️ Writing a New Blog Post

### Option 1 (Static HTML):

1. **Create MDX file** in `migration/mdx/`
   ```markdown
   ---
   title: "My New Blog Post"
   description: "A great new post about..."
   slug: "my-new-blog-post"
   canonical: "https://wgholdings.co.nz/blog/my-new-blog-post"
   date: "Jan 15, 2026"
   ---

   ## Introduction

   Your content here...

   ## Main Points

   - Point 1
   - Point 2

   ## Conclusion

   Wrap up...
   ```

2. **Run conversion script**
   ```bash
   node scripts/mdx-to-html.js
   ```

3. **Add to blog index** (manually update `blog/index.html`)

4. **Deploy**

### Option 2 (Astro/11ty):

1. **Create MDX file** in `src/content/blog/`
2. **Save** - that's it! Site generator auto-creates the page
3. **Deploy**

---

## 📋 What I Recommend

**For you right now:**
1. Use **Option 1** (Static HTML conversion)
2. I'll create all the scripts for you
3. You can convert all 28 posts in ~5 minutes
4. Later, consider migrating to Astro for easier management

---

**Want me to create all the scripts and template for you?** I can have you set up in the next 10 minutes with working blog posts on your site.

