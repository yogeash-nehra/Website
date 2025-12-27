const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'blog');

// Get all subdirectories (blog posts)
const postDirs = fs.readdirSync(blogDir).filter(f => {
  const fullPath = path.join(blogDir, f);
  return fs.statSync(fullPath).isDirectory() && f !== 'media';
});

console.log(`\n🧹 Final CTA cleanup pass...\n`);

let totalChanges = 0;

postDirs.forEach(dir => {
  const htmlPath = path.join(blogDir, dir, 'index.html');
  
  if (!fs.existsSync(htmlPath)) return;
  
  let html = fs.readFileSync(htmlPath, 'utf-8');
  const originalHtml = html;
  
  // Remove EVERYTHING with cdn-cgi/l/email-protection
  // This catches all variants of CloudFlare email obfuscation
  html = html.replace(/\[*\[*\\*\[*email\s*protected\\*\]*\]*\]\(*https?:\/\/[^\)]*cdn-cgi[^\)]*\)*/g, 
    '<a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>');
  
  // Catch any remaining email protected text
  html = html.replace(/\[*\\*\[*email\s*protected\\*\]*\]*/g, 
    '<a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>');
  
  if (html !== originalHtml) {
    fs.writeFileSync(htmlPath, html);
    totalChanges++;
    console.log(`✓ Fixed: ${dir}`);
  }
});

console.log(`\n✅ Final cleanup complete!`);
console.log(`Fixed ${totalChanges} remaining blog posts\n`);

