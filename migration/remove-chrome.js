const fs = require('fs');
const path = require('path');

const mdxDir = path.join(__dirname, 'mdx');

// Get all MDX files
const files = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));

console.log(`Processing ${files.length} MDX files...`);

files.forEach(file => {
  const filePath = path.join(mdxDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  console.log(`\nProcessing: ${file}`);
  
  // Remove header section (starts with #website-header or #__next, ends before main article content)
  // Look for the pattern where the navigation/header divs start
  
  // Strategy: Remove everything before the main article/blog content starts
  // The blog content typically starts after the hero section with the title
  
  // Find where the actual blog content begins (after header + hero)
  // Keep the H1 title and everything after it
  
  const lines = content.split('\n');
  let inHeader = false;
  let inNav = false;
  let headerDepth = 0;
  let startKeeping = false;
  let keptLines = [];
  let foundTitle = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect header/navigation sections by their IDs and classes
    if (line.includes('#__next') || line.includes('#main-body') || line.includes('#website-header')) {
      inHeader = true;
      headerDepth = (line.match(/:/g) || []).length;
      continue;
    }
    
    // Skip navigation and header sections
    if (inHeader) {
      const currentDepth = (line.match(/^:+/g) || [''])[0].length;
      
      // If we find the main content section (after header)
      if (line.includes('.section .relative') && !line.includes('#website-header')) {
        // Check if this is the hero section with the title
        if (line.includes('.flex-none .items-center') || foundTitle) {
          // Keep the hero with title, but we'll clean it later
          inHeader = false;
          startKeeping = true;
        }
      }
      
      // Detect H1 title - this is where content truly starts
      if (line.match(/^# .+{.*heading/) || line.match(/^# [A-Z]/)) {
        foundTitle = true;
        startKeeping = true;
        inHeader = false;
        keptLines.push(line);
        continue;
      }
      
      continue;
    }
    
    if (startKeeping || foundTitle) {
      keptLines.push(line);
    }
  }
  
  // Now clean up the kept content - remove hero wrapper divs but keep the H1
  let cleanedLines = [];
  let skipDepth = 0;
  let inHeroWrapper = false;
  
  for (let i = 0; i < keptLines.length; i++) {
    const line = keptLines[i];
    
    // Detect hero section wrappers (before the H1)
    if (!line.startsWith('#') && line.match(/^:+.*{.*section.*relative/)) {
      inHeroWrapper = true;
      skipDepth = (line.match(/^:+/) || [''])[0].length;
      continue;
    }
    
    // Skip nested divs in hero until we hit the title
    if (inHeroWrapper && line.match(/^:+/)) {
      const currentDepth = (line.match(/^:+/) || [''])[0].length;
      if (currentDepth >= skipDepth) {
        continue;
      } else {
        inHeroWrapper = false;
      }
    }
    
    // Once we hit the H1, keep everything
    if (line.startsWith('# ')) {
      inHeroWrapper = false;
      cleanedLines.push(line);
      continue;
    }
    
    if (!inHeroWrapper) {
      cleanedLines.push(line);
    }
  }
  
  // Now remove footer sections from the cleaned content
  let finalLines = [];
  let inFooter = false;
  
  for (let i = 0; i < cleanedLines.length; i++) {
    const line = cleanedLines[i];
    
    // Detect footer start
    if (line.includes('#website-footer') || (line.includes('.relative') && line.includes('.flex-1') && line.includes('.z-10') && line.includes('.break-word'))) {
      inFooter = true;
      break; // Stop processing, everything after this is footer
    }
    
    finalLines.push(line);
  }
  
  // Write the cleaned content
  const cleanedContent = finalLines.join('\n').trim();
  
  if (cleanedContent) {
    fs.writeFileSync(filePath, cleanedContent + '\n');
    console.log(`✓ Cleaned: ${file}`);
  } else {
    console.log(`✗ Warning: ${file} resulted in empty content`);
  }
});

console.log('\n✅ Chrome removal complete!');

