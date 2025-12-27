# 📋 MDX Deployment Checklist

## Before You Deploy

### 🔍 Issues to Address

#### 1. **Pandoc Fence Syntax** ⚠️ NEEDS ATTENTION

Your MDX files contain Pandoc fence syntax like:
```
::::::: {.relative .container}
# Content here
:::::::
```

**Choose one:**
- [ ] **Option A**: Run `node cleanup-pandoc-fences.js` to convert to HTML divs
- [ ] **Option B**: Set up MDX with `remark-directive` to handle fence syntax
- [ ] **Option C**: Strip all wrapper divs (cleanest for simple blog)

**Recommended**: Option A (convert to HTML) - simplest and most compatible.

---

#### 2. **Image Paths** ⚠️ NEEDS ATTENTION

Images are referenced as: `mdx/media/filename.jpg`

**Choose one:**
- [ ] Copy `migration/mdx/media/` to `public/blog/media/`
- [ ] Update all image paths with a script
- [ ] Use a rehype plugin to transform paths at build time

---

#### 3. **Email Protection Links** ⚠️ NEEDS FIXING

Some posts have CloudFlare email protection:
```markdown
[email@example.com](https://wgholdings.co.nz/cdn-cgi/l/email-protection#...)
```

**Action needed:**
- [ ] Run script to replace with actual email addresses
- [ ] Or: Set up CloudFlare email protection on new site

---

#### 4. **Relative Links** ⚠️ MAY NEED UPDATING

Links like `../index.html` and `training.wgholdings.co.nz.html`

**Action needed:**
- [ ] Update to your new route structure (e.g., `/`, `/services`)
- [ ] Or: Set up redirects

---

## Quick Fix Scripts

### Strip All Wrapper Divs (Simplest)

```javascript
// migration/strip-wrappers.js
const fs = require('fs');
const path = require('path');

const mdxDir = path.join(__dirname, 'mdx');
const files = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(mdxDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove all Pandoc fence lines
  const lines = content.split('\n').filter(line => {
    return !line.match(/^:+(\s*{[^}]+})?\s*$/);
  });
  
  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`✓ Stripped: ${file}`);
});
```

### Fix Email Links

```javascript
// migration/fix-emails.js
const fs = require('fs');
const path = require('path');

const mdxDir = path.join(__dirname, 'mdx');
const files = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(mdxDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace CloudFlare email protection with actual email
  content = content.replace(
    /\[\[email protected\]\]\{[^}]+\}\]\(https:\/\/wgholdings\.co\.nz\/cdn-cgi\/l\/email-protection[^)]+\)\{[^}]+\}/g,
    'info@wgholdings.co.nz'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ Fixed: ${file}`);
});
```

### Update Image Paths

```javascript
// migration/fix-image-paths.js
const fs = require('fs');
const path = require('path');

const mdxDir = path.join(__dirname, 'mdx');
const files = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(mdxDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Update image paths from mdx/media/ to /blog/media/
  content = content.replace(/mdx\/media\//g, '/blog/media/');
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ Fixed: ${file}`);
});
```

---

## Testing Steps

1. **Pick a test post** (e.g., AI with Aroha)
2. **Render in your framework** (Next.js/Astro/etc.)
3. **Check for:**
   - [ ] Title displays correctly
   - [ ] Content is readable
   - [ ] Images load
   - [ ] Links work
   - [ ] CTAs are visible
   - [ ] No weird wrapper divs showing

---

## Minimal Clean Version

If you want the **absolute simplest** MDX files:

```bash
# Run all cleanup scripts
node migration/strip-wrappers.js
node migration/fix-emails.js
node migration/fix-image-paths.js

# Then copy media folder
cp -r migration/mdx/media public/blog/media
```

This gives you clean MDX with just content, headings, and paragraphs.

---

## Current Status

- ✅ Content migrated
- ✅ Frontmatter added
- ⚠️ Needs cleanup before deployment
- ⚠️ Test rendering required

---

## Recommendation

**For quickest deployment:**

1. Run the "strip wrappers" script (removes all Pandoc divs)
2. Run the "fix emails" script
3. Run the "fix image paths" script
4. Copy media folder to public
5. Test render 2-3 posts
6. Deploy!

**Estimated time**: 15-30 minutes

---

Need help with any of these steps?

