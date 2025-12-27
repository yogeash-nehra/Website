const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'blog');

// Get all subdirectories (blog posts)
const postDirs = fs.readdirSync(blogDir).filter(f => {
  const fullPath = path.join(blogDir, f);
  return fs.statSync(fullPath).isDirectory() && f !== 'media';
});

console.log(`\n🧹 Cleaning CTAs in ${postDirs.length} blog posts...\n`);

let totalChanges = 0;

postDirs.forEach(dir => {
  const htmlPath = path.join(blogDir, dir, 'index.html');
  
  if (!fs.existsSync(htmlPath)) return;
  
  let html = fs.readFileSync(htmlPath, 'utf-8');
  let changed = false;
  
  // Remove CloudFlare email protection obfuscation - all variations
  const emailProtectionPatterns = [
    // Pattern 1: [[email protected]]{...}](link){...}
    /\[\[email protected\]\]\{[^}]*\}\]\(https?:\/\/[^)]*cdn-cgi\/l\/email-protection[^)]*\)\{[^}]*\}/g,
    // Pattern 2: [[\[email protected\]]](link)
    /\[\[\[email protected\]\]\]\(https?:\/\/[^)]*cdn-cgi\/l\/email-protection[^)]*\)/g,
    // Pattern 3: Just the obfuscated text
    /\[\[email protected\]\]/g
  ];
  
  emailProtectionPatterns.forEach(pattern => {
    if (html.match(pattern)) {
      html = html.replace(pattern, '<a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>');
      changed = true;
    }
  });
  
  // Clean up messy email links with extra attributes
  html = html.replace(/\[\[email protected\]\]\{[^}]*\}\]/g, 'info@wgholdings.co.nz');
  
  // Fix broken email links that have the pattern: info@wgholdings.co.nz{...}
  html = html.replace(/info@wgholdings\.co\.nz\{[^}]*\}/g, '<a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>');
  
  // Replace training.wgholdings.co.nz links with /workshops
  const trainingLinkPattern = /<a href="training\.wgholdings\.co\.nz\.html">training\.wgholdings\.co\.nz<\/a>/g;
  if (html.match(trainingLinkPattern)) {
    html = html.replace(trainingLinkPattern, '<a href="/workshops">our workshops page</a>');
    changed = true;
  }
  
  // Replace mentions of "training portal" or "training.wgholdings.co.nz" with workshops link
  html = html.replace(/training\.wgholdings\.co\.nz/g, '<a href="/workshops">workshops</a>');
  
  // Replace "register via" patterns pointing to training with services/workshops
  html = html.replace(/register via <a[^>]*>training[^<]*<\/a>/gi, 'visit <a href="/workshops">our workshops page</a>');
  
  // Clean up "Contact us at" patterns - make them simpler
  const contactPatterns = [
    /Contact us at <a[^>]*>info@wgholdings\.co\.nz<\/a>/gi,
    /contact us at <a[^>]*>info@wgholdings\.co\.nz<\/a>/gi,
    /email <a[^>]*>info@wgholdings\.co\.nz<\/a>/gi,
    /reach out at <a[^>]*>info@wgholdings\.co\.nz<\/a>/gi
  ];
  
  contactPatterns.forEach(pattern => {
    if (html.match(pattern)) {
      html = html.replace(pattern, 'Contact us at <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>');
      changed = true;
    }
  });
  
  // Replace "Explore our upcoming workshops" with link to workshops page
  if (html.includes('upcoming workshops')) {
    html = html.replace(
      /Explore our upcoming workshops and cultural AI training sessions at <a[^>]*>[^<]*<\/a>/gi,
      'Explore our <a href="/workshops">workshops and training sessions</a>'
    );
    changed = true;
  }
  
  // Replace direct wgholdings.co.nz/services links in CTAs
  html = html.replace(
    /<a href="https:\/\/www\.wgholdings\.co\.nz\/services">wgholdings\.co\.nz<\/a>/g,
    '<a href="/services">services page</a>'
  );
  
  // Replace "To learn more" patterns with cleaner CTAs
  html = html.replace(
    /To learn more about[^,]*,?\s*contact <a[^>]*>www\.wgholdings\.co\.nz<\/a>/gi,
    'Learn more on our <a href="/services">services page</a>'
  );
  
  html = html.replace(
    /contact <a[^>]*>www\.wgholdings\.co\.nz<\/a>/gi,
    'visit our <a href="/services">services page</a>'
  );
  
  // Clean up "or email" patterns
  html = html.replace(
    /or email <a[^>]*>\[\[email protected\]\][^<]*<\/a>/g,
    'or email <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>'
  );
  
  // Replace any remaining broken email links
  html = html.replace(
    /<a href="mailto:%20info@wgholdings\.co\.nz">/g,
    '<a href="mailto:info@wgholdings.co.nz">'
  );
  
  // Remove mce-href attributes (leftover from editor)
  html = html.replace(/\s*mce-href="[^"]*"/g, '');
  
  // Clean up target and rel attributes on internal links
  html = html.replace(/<a href="\/services"[^>]*>/g, '<a href="/services">');
  html = html.replace(/<a href="\/workshops"[^>]*>/g, '<a href="/workshops">');
  
  if (changed || html !== fs.readFileSync(htmlPath, 'utf-8')) {
    fs.writeFileSync(htmlPath, html);
    totalChanges++;
    console.log(`✓ Cleaned CTAs: ${dir}`);
  }
});

console.log(`\n✅ CTA cleanup complete!`);
console.log(`Updated ${totalChanges} blog posts with clean CTAs\n`);
console.log('Changes made:');
console.log('  • Removed CloudFlare email obfuscation');
console.log('  • Cleaned email links to: info@wgholdings.co.nz');
console.log('  • Redirected training links → /workshops');
console.log('  • Redirected service queries → /services');
console.log('  • Removed messy formatting and attributes\n');

