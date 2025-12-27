const fs = require('fs');
const path = require('path');

// Simple markdown to HTML converter (basic version)
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');
  
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1">');
  
  // Lists
  html = html.replace(/^\s*\n\*/gm, '<ul>\n*');
  html = html.replace(/^(\*.+)\s*\n([^\*])/gm, '$1\n</ul>\n$2');
  html = html.replace(/^\*(.+)/gm, '<li>$1</li>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/^(.+)$/gm, '<p>$1</p>');
  
  // Clean up nested p tags
  html = html.replace(/<p><h([1-6])>/g, '<h$1>');
  html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
  html = html.replace(/<p><ul>/g, '<ul>');
  html = html.replace(/<\/ul><\/p>/g, '</ul>');
  html = html.replace(/<p><li>/g, '<li>');
  html = html.replace(/<\/li><\/p>/g, '</li>');
  
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

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Check if template exists
if (!fs.existsSync(templatePath)) {
  console.error('❌ Template not found! Please create blog-post-template.html first.');
  console.log('Run: node scripts/create-blog-template.js');
  process.exit(1);
}

// Read template
const template = fs.readFileSync(templatePath, 'utf-8');

// Get all MDX files
const mdxFiles = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));

console.log(`Converting ${mdxFiles.length} MDX files to HTML...\n`);

const blogPosts = [];

mdxFiles.forEach(file => {
  const filePath = path.join(mdxDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract frontmatter
  const frontmatter = extractFrontmatter(content);
  
  // Skip non-blog pages
  if (!frontmatter.title || !frontmatter.slug) {
    console.log(`⏭️  Skipping ${file} (no frontmatter)`);
    return;
  }
  
  // Remove frontmatter from content
  content = content.replace(/^---\n[\s\S]*?\n---\n+/, '');
  
  // Remove Pandoc fences
  content = content.split('\n').filter(line => {
    return !line.match(/^:+(\s*{[^}]+})?\s*$/);
  }).join('\n');
  
  // Fix image paths
  content = content.replace(/mdx\/media\//g, '/blog/media/');
  
  // Convert markdown to HTML
  const htmlContent = markdownToHtml(content);
  
  // Replace placeholders in template
  let html = template
    .replace(/\{\{TITLE\}\}/g, frontmatter.title || 'Blog Post')
    .replace(/\{\{DESCRIPTION\}\}/g, frontmatter.description || '')
    .replace(/\{\{DATE\}\}/g, frontmatter.date || '')
    .replace(/\{\{CANONICAL\}\}/g, frontmatter.canonical || '')
    .replace(/\{\{CONTENT\}\}/g, htmlContent);
  
  // Create slug directory
  const slug = frontmatter.slug;
  const postDir = path.join(outputDir, slug);
  
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }
  
  // Write HTML file
  fs.writeFileSync(path.join(postDir, 'index.html'), html);
  console.log(`✓ Created: blog/${slug}/index.html`);
  
  // Store post data for index
  blogPosts.push({
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    slug: slug
  });
});

// Save blog posts data for index generation
fs.writeFileSync(
  path.join(__dirname, 'blog-posts.json'),
  JSON.stringify(blogPosts, null, 2)
);

console.log(`\n✅ Converted ${blogPosts.length} blog posts!`);
console.log('\nNext steps:');
console.log('1. Copy migration/mdx/media to blog/media');
console.log('2. Run: node scripts/create-blog-index.js');
console.log('3. Test a blog post in your browser');

