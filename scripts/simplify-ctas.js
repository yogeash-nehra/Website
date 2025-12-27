const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'blog');

// Get all subdirectories (blog posts)
const postDirs = fs.readdirSync(blogDir).filter(f => {
  const fullPath = path.join(blogDir, f);
  return fs.statSync(fullPath).isDirectory() && f !== 'media';
});

console.log(`\n🧹 Simplifying wordy CTAs...\n`);

let totalChanges = 0;

postDirs.forEach(dir => {
  const htmlPath = path.join(blogDir, dir, 'index.html');
  
  if (!fs.existsSync(htmlPath)) return;
  
  let html = fs.readFileSync(htmlPath, 'utf-8');
  const originalHtml = html;
  
  // Simplify long-winded CTAs
  // Pattern: "If your organisation ... connect with Wolfgramm Holdings at [email] to learn more about..."
  html = html.replace(
    /If your organisation[^<]+connect with Wolfgramm Holdings at <a href="mailto:info@wgholdings\.co\.nz">info@wgholdings\.co\.nz<\/a> to learn more about[^<.]+\./gi,
    'Contact us at <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a> or visit our <a href="/workshops">workshops page</a> to learn more.'
  );
  
  // Pattern: "Contact us at [email] to learn more."
  // This is already simple, but ensure consistent punctuation
  
  // Redirect any remaining references to specific workshops
  html = html.replace(/Treaty and Integrity of Water Workshop/g, 
    '<a href="/workshops">Treaty and Integrity of Water Workshop</a>');
  
  // Remove "Wolfgramm Holdings" from CTA text (redundant)
  html = html.replace(/connect with Wolfgramm Holdings at/gi, 'Contact us at');
  html = html.replace(/reach out to Wolfgramm Holdings at/gi, 'Contact us at');
  
  if (html !== originalHtml) {
    fs.writeFileSync(htmlPath, html);
    totalChanges++;
    console.log(`✓ Simplified: ${dir}`);
  }
});

console.log(`\n✅ CTA simplification complete!`);
console.log(`Simplified ${totalChanges} blog posts\n`);

