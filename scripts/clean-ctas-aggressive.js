const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'blog');

// Get all subdirectories (blog posts)
const postDirs = fs.readdirSync(blogDir).filter(f => {
  const fullPath = path.join(blogDir, f);
  return fs.statSync(fullPath).isDirectory() && f !== 'media';
});

console.log(`\n🧹 Aggressive CTA cleanup on ${postDirs.length} blog posts...\n`);

let totalChanges = 0;

postDirs.forEach(dir => {
  const htmlPath = path.join(blogDir, dir, 'index.html');
  
  if (!fs.existsSync(htmlPath)) return;
  
  let html = fs.readFileSync(htmlPath, 'utf-8');
  const originalHtml = html;
  
  // AGGRESSIVE: Remove ALL CloudFlare email protection patterns
  // Pattern: [[\[email protected\]]](cdn-cgi link)
  html = html.replace(/\[\[\\\[email protected\\\]\]\]\(https?:\/\/[^)]*cdn-cgi\/l\/email-protection[^)]*\)/g, '<a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>');
  
  // Pattern: [[email protected]] (without link)
  html = html.replace(/\[\[email protected\]\]/g, '<a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>');
  
  // Fix: "contact [email]" → "contact us"
  html = html.replace(/contact <a href="mailto:info@wgholdings\.co\.nz">info@wgholdings\.co\.nz<\/a>/gi, 
    'contact us at <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>');
  
  html = html.replace(/email <a href="mailto:info@wgholdings\.co\.nz">info@wgholdings\.co\.nz<\/a>/gi,
    'email us at <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>');
  
  html = html.replace(/reach out to Wolfgramm Holdings at <a href="mailto:info@wgholdings\.co\.nz">info@wgholdings\.co\.nz<\/a>/gi,
    'contact us at <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>');
  
  html = html.replace(/connect with Wolfgramm Holdings at <a href="mailto:info@wgholdings\.co\.nz">info@wgholdings\.co\.nz<\/a>/gi,
    'contact us at <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>');
  
  // Replace workplaceinclusion.org.nz links
  html = html.replace(/<a href="workplaceinclusion\.org\.nz\.html">workplaceinclusion\.org\.nz<\/a>/g, 
    '<a href="/workshops">our workshops page</a>');
  
  // Replace www.wgholdings.co.nz in CTA contexts
  html = html.replace(/visit <a href="https:\/\/www\.wgholdings\.co\.nz\/">www\.wgholdings\.co\.nz<\/a>/g,
    'visit our <a href="/services">services page</a>');
  
  // Clean up "or visit www.wgholdings.co.nz"
  html = html.replace(/ or visit <a href="https:\/\/www\.wgholdings\.co\.nz\/">www\.wgholdings\.co\.nz<\/a>\./g, '.');
  
  // Replace long service URLs with simple "/services"
  html = html.replace(/https:\/\/www\.wgholdings\.co\.nz\/services\/our-services#[^"]+/g, '/services');
  html = html.replace(/<a href="https:\/\/www\.wgholdings\.co\.nz\/services">Services<\/a>/g, 
    '<a href="/services">services page</a>');
  
  // Clean "Contact us at www.wgholdings.co.nz" patterns
  html = html.replace(/<a href="https:\/\/www\.wgholdings\.co\.nz\/contact">Contact [Uu]s<\/a>/g,
    '<a href="/contact">Contact us</a>');
  
  // Remove "or enquire about tailored delivery for your leadership team at [email]" - too wordy
  html = html.replace(/ or enquire about tailored delivery for your leadership team at <a[^>]*>info@wgholdings\.co\.nz<\/a>/gi,
    ' or <a href="/contact">contact us</a> for tailored options');
  
  // Simplify: "explore our ... at wgholdings.co.nz"
  html = html.replace(/explore our [^<]+ at <a href="[^"]*wgholdings\.co\.nz[^"]*">[^<]+<\/a>/gi,
    'explore our <a href="/services">services</a>');
  
  // Clean up: "To learn how ... contact [email] or visit..."
  html = html.replace(/To learn how [^,]+, contact <a[^>]*>info@wgholdings\.co\.nz<\/a>[^<]*<\/p>/gi,
    '<p>Contact us at <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a> to learn more.</p>');
  
  // Simplify: "If your organisation ... connect with ... at [email]..."
  html = html.replace(/If your organisation [^,]+, (connect with|reach out to) Wolfgramm Holdings at <a[^>]*>info@wgholdings\.co\.nz<\/a>[^<]*<\/p>/gi,
    '<p>Contact us at <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a> to learn more.</p>');
  
  if (html !== originalHtml) {
    fs.writeFileSync(htmlPath, html);
    totalChanges++;
    console.log(`✓ Cleaned: ${dir}`);
  }
});

console.log(`\n✅ Aggressive CTA cleanup complete!`);
console.log(`Cleaned ${totalChanges} blog posts\n`);

