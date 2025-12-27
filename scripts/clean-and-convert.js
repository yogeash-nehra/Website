const fs = require('fs');
const path = require('path');

// Enhanced markdown to HTML converter with cleanup
function cleanAndConvertMarkdown(markdown) {
  let html = markdown;
  
  // Remove all Pandoc fence syntax artifacts
  html = html.replace(/{[^}]*}/g, '');
  html = html.replace(/\[·\]/g, '·');
  html = html.replace(/\[\[email protected\]\]/g, 'info@wgholdings.co.nz');
  
  // Remove duplicate H1 titles (they're in the hero already)
  html = html.replace(/^# .+$/gm, '');
  
  // Remove author/date lines from content (already in meta)
  html = html.replace(/^.*(By Breviss Wolfgramm|Oct \d+, \d{4}|Nov \d+, \d{4}|Dec \d+, \d{4}|Jan \d+, \d{4}|Feb \d+, \d{4}|Aug \d+, \d{4}|Jul \d+, \d{4}|Jun \d+, \d{4}|May \d+, \d{4}|Apr \d+, \d{4}|Mar \d+, \d{4}|Sep \d+, \d{4}).*$/gm, '');
  
  // Remove standalone bracket artifacts
  html = html.replace(/^\[\]$/gm, '');
  html = html.replace(/^\[Breviss Wolfgramm\]$/gm, '');
  html = html.replace(/^\[\s*\]$/gm, '');
  
  // Clean up broken image syntax
  html = html.replace(/!\[.*?\]\(.*?\)/g, '');
  html = html.replace(/\[!\[.*?\]\(.*?\)\]/g, '');
  html = html.replace(/\[\]\([^)]*\)/g, '');
  
  // Remove CloudFlare email protection remnants
  html = html.replace(/\{\.(__cf_email__|image|placeholder)[^\}]*\}/g, '');
  html = html.replace(/original-image-src="[^"]*"/g, '');
  html = html.replace(/srcset="[^"]*"/g, '');
  html = html.replace(/decoding="[^"]*"/g, '');
  html = html.replace(/nimg="[^"]*"/g, '');
  html = html.replace(/loading="[^"]*"/g, '');
  html = html.replace(/aria-hidden="[^"]*"/g, '');
  
  // Clean up mce-href attributes
  html = html.replace(/\{mce-href="[^"]*"\}/g, '');
  
  // Convert headers properly
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  
  // Convert bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert links - handle both formats
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Convert bullet lists
  let lines = html.split('\n');
  let inList = false;
  let result = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Skip empty lines
    if (!line) {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      continue;
    }
    
    // Handle list items
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      result.push('<li>' + line.substring(2) + '</li>');
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      
      // Skip if it's just a heading tag (already converted)
      if (!line.match(/^<h[123]>/)) {
        result.push('<p>' + line + '</p>');
      } else {
        result.push(line);
      }
    }
  }
  
  if (inList) {
    result.push('</ul>');
  }
  
  html = result.join('\n');
  
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p><h([123])>/g, '<h$1>');
  html = html.replace(/<\/h([123])><\/p>/g, '</h$1>');
  
  // Final cleanup - remove any remaining artifacts
  html = html.replace(/\{[^\}]*\}/g, '');
  html = html.replace(/\[[^\]]*\]\{[^\}]*\}/g, '');
  
  return html;
}

function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = {};
  
  if (frontmatterMatch) {
    const yamlContent = frontmatterMatch[1];
    yamlContent.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim().replace(/^"|"$/g, '');
        frontmatter[key] = value;
      }
    });
  }
  
  return frontmatter;
}

const mdxDir = path.join(__dirname, '..', 'migration', 'mdx');
const outputDir = path.join(__dirname, '..', 'blog');
const templatePath = path.join(__dirname, 'blog-post-template.html');

if (!fs.existsSync(templatePath)) {
  console.error('❌ Template not found!');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf-8');
const mdxFiles = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));

console.log(`\n🧹 Cleaning and re-converting ${mdxFiles.length} blog posts...\n`);

const blogPosts = [];

mdxFiles.forEach(file => {
  const filePath = path.join(mdxDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const frontmatter = extractFrontmatter(content);
  
  if (!frontmatter.title || !frontmatter.slug) {
    console.log(`⏭️  Skipping ${file} (no frontmatter)`);
    return;
  }
  
  // Remove frontmatter
  content = content.replace(/^---\n[\s\S]*?\n---\n+/, '');
  
  // Remove Pandoc fences
  content = content.split('\n').filter(line => {
    return !line.match(/^:+(\s*{[^}]+})?\s*$/);
  }).join('\n');
  
  // Fix image paths
  content = content.replace(/mdx\/media\//g, '/blog/media/');
  
  // Clean and convert markdown to HTML
  const htmlContent = cleanAndConvertMarkdown(content);
  
  // Replace placeholders in template
  let html = template
    .replace(/\{\{TITLE\}\}/g, frontmatter.title || 'Blog Post')
    .replace(/\{\{DESCRIPTION\}\}/g, frontmatter.description || '')
    .replace(/\{\{DATE\}\}/g, frontmatter.date || '')
    .replace(/\{\{CANONICAL\}\}/g, frontmatter.canonical || '')
    .replace(/\{\{CONTENT\}\}/g, htmlContent);
  
  const slug = frontmatter.slug;
  const postDir = path.join(outputDir, slug);
  
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(postDir, 'index.html'), html);
  console.log(`✓ Cleaned: ${slug}`);
  
  blogPosts.push({
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    slug: slug
  });
});

// Save blog posts data
fs.writeFileSync(
  path.join(__dirname, 'blog-posts.json'),
  JSON.stringify(blogPosts, null, 2)
);

console.log(`\n✅ Cleaned and converted ${blogPosts.length} posts!`);
console.log('All junk removed, formatting fixed!');

