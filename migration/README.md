# Blog Migration - Quick Reference

## Directory Structure

```
migration/
├── html/                      # Original HTML files (downloaded from wgholdings.co.nz)
│   └── wgholdings.co.nz/blog/ # Blog HTML files
├── mdx/                       # Converted MDX files (PRODUCTION READY)
│   ├── *.mdx                  # 28 blog posts + 2 pages
│   └── media/                 # 69 extracted images
├── migrate.sh                 # Step 1-2: Download + Pandoc conversion
├── remove-chrome.js           # Step 3: Remove header/footer
├── add-frontmatter.js         # Step 5: Add YAML frontmatter
├── validation-report.md       # Validation checklist
└── MIGRATION-COMPLETE.md      # Full migration summary
```

## How to Use the MDX Files

### Example: Next.js

```typescript
// app/blog/[slug]/page.tsx
import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export async function generateStaticParams() {
  const postsDirectory = join(process.cwd(), 'migration/mdx');
  const filenames = readdirSync(postsDirectory);
  
  return filenames
    .filter(f => f.endsWith('.mdx'))
    .map(filename => ({
      slug: filename.replace(/\.mdx$/, '')
    }));
}

export default async function BlogPost({ params }) {
  const fileContents = readFileSync(
    join(process.cwd(), 'migration/mdx', `${params.slug}.mdx`),
    'utf8'
  );
  
  const { data, content } = matter(fileContents);
  
  return (
    <article>
      <h1>{data.title}</h1>
      <time>{data.date}</time>
      <MDXRemote source={content} />
    </article>
  );
}
```

### Example: Astro

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <p>{post.data.description}</p>
  <Content />
</article>
```

## Media Files

All images are in `mdx/media/` and referenced as:
```markdown
![Alt text](mdx/media/filename.jpg)
```

**Important:** You'll need to either:
1. Copy `mdx/media/` to your public folder, OR
2. Update image paths in MDX files using a script

## Frontmatter Schema

Every MDX file has:
```yaml
---
title: "Post Title"
description: "SEO description (160 chars max)"
slug: "post-slug"
canonical: "https://wgholdings.co.nz/blog/post-slug"
date: "Month DD, YYYY"
---
```

## Scripts Reference

| Script | Purpose | Run Command |
|--------|---------|-------------|
| `migrate.sh` | Download HTML + Convert to MDX | `./migrate.sh` (bash) |
| `remove-chrome.js` | Remove header/footer | `node remove-chrome.js` |
| `add-frontmatter.js` | Add/update YAML frontmatter | `node add-frontmatter.js` |

## Need to Re-run?

If you need to re-run any step:

```bash
# Re-download (will overwrite html/)
./migrate.sh

# Re-convert to MDX (will overwrite mdx/*.mdx)
cd migration
mkdir -p mdx
find html/wgholdings.co.nz/blog -name "*.html" | while read file; do
  filename=$(basename "$file" .html)
  pandoc "$file" -f html -t markdown+raw_html --wrap=none \
    --extract-media=mdx/media -o "mdx/$filename.mdx"
done

# Re-clean chrome
node remove-chrome.js

# Re-add frontmatter
node add-frontmatter.js
```

## Troubleshooting

### Images not loading?
- Ensure `mdx/media/` is accessible from your web server
- Check image paths in MDX files
- Consider using a transform plugin to update paths

### Wrapper divs too complex?
- The pandoc fence syntax (`::: {.class}`) can be removed or converted to HTML
- Consider a post-processing script if needed

### Links broken?
- Update relative links (`../index.html`) to your new route structure
- Consider a find-replace script for batch updates

## Contact

Questions? Refer to `MIGRATION-COMPLETE.md` for full details.

