const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'blog');

// Get all subdirectories (blog posts)
const postDirs = fs.readdirSync(blogDir).filter(f => {
  const fullPath = path.join(blogDir, f);
  return fs.statSync(fullPath).isDirectory() && f !== 'media';
});

console.log(`\n🧹 Post-processing ${postDirs.length} blog posts...\n`);

postDirs.forEach(dir => {
  const htmlPath = path.join(blogDir, dir, 'index.html');
  
  if (!fs.existsSync(htmlPath)) return;
  
  let html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Remove empty paragraphs with brackets/artifacts
  html = html.replace(/<p>\[\]<\/p>\n?/g, '');
  html = html.replace(/<p>\[Breviss Wolfgramm\]<\/p>\n?/g, '');
  html = html.replace(/<p>\s*<\/p>\n?/g, '');
  html = html.replace(/<p>\[\s*\]<\/p>\n?/g, '');
  
  // Remove any remaining empty list items
  html = html.replace(/<li>\s*<\/li>\n?/g, '');
  
  // Clean up any remaining artifacts between paragraphs
  html = html.replace(/<\/p>\s*<p>\s*<\/p>/g, '</p>');
  
  fs.writeFileSync(htmlPath, html);
  console.log(`✓ Post-processed: ${dir}`);
});

console.log(`\n✅ Post-processing complete!`);
console.log('All artifacts removed, HTML cleaned!\n');

