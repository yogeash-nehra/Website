const fs = require('fs');
const path = require('path');

const mdxDir = path.join(__dirname, 'mdx');
const files = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));

console.log(`Processing ${files.length} MDX files...`);

files.forEach(file => {
  const filePath = path.join(mdxDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  let startIdx = -1;
  let endIdx = lines.length;
  
  // Find where the actual article content starts (after header)
  // Looking for the section that contains the blog title (# heading)
  for (let i = 0; i < lines.length; i++) {
    // The blog content starts with the hero section containing the H1
    // Pattern: section with min-h-64 and then container with the title
    if (lines[i].includes('.section') && 
        lines[i].includes('.relative') && 
        i < lines.length / 2) {  // Make sure we're in the first half
      // Check if this is followed by the title section structure
      let lookAhead = 10;
      for (let j = i; j < Math.min(i + lookAhead, lines.length); j++) {
        if (lines[j].match(/^# .+\{#.+\.heading-large/)) {
          startIdx = i;
          break;
        }
      }
      if (startIdx !== -1) break;
    }
  }
  
  // Find where the footer starts
  // Looking for #website-footer
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('#website-footer')) {
      endIdx = i - 1; // Include the line before footer starts
      break;
    }
  }
  
  if (startIdx === -1) {
    console.warn(`⚠️  Could not find content start in ${file} - skipping`);
    return;
  }
  
  // Extract just the content section
  const cleanedContent = lines.slice(startIdx, endIdx + 1);
  
  // Remove the wrapper divs at the start (before the actual section)
  // But keep everything from the .section onwards
  let contentStart = 0;
  for (let i = 0; i < Math.min(5, cleanedContent.length); i++) {
    if (cleanedContent[i].includes('.section')) {
      contentStart = i;
      break;
    }
  }
  
  // Count closing markers at the end and remove excess wrappers
  let contentEnd = cleanedContent.length;
  for (let i = cleanedContent.length - 1; i >= 0; i--) {
    const line = cleanedContent[i].trim();
    if (line === '' || line.match(/^:+$/)) {
      contentEnd = i;
    } else {
      break;
    }
  }
  
  const finalContent = cleanedContent.slice(contentStart, contentEnd + 1).join('\n').trim();
  
  // Write back
  fs.writeFileSync(filePath, finalContent + '\n');
  console.log(`✓ Processed: ${file}`);
});

console.log('\n✅ All files processed!');

