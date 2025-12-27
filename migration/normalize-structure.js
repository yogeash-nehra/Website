const fs = require('fs');
const path = require('path');

const mdxDir = path.join(__dirname, 'mdx');
const files = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));

console.log(`Normalizing structure for ${files.length} MDX files...`);

files.forEach(file => {
  const filePath = path.join(mdxDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.trim()) {
    console.log(`⚠️  Skipping empty file: ${file}`);
    return;
  }
  
  const lines = content.split('\n');
  
  // Find the H1 title line (this is the true start of content)
  let titleIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^# .+{.*heading/)) {
      titleIdx = i;
      break;
    }
  }
  
  if (titleIdx === -1) {
    console.log(`⚠️  No H1 found in ${file} - skipping`);
    return;
  }
  
  // Keep everything from the title onwards, but preserve the wrapper divs
  // These wrappers are part of the Durable structure and should be kept
  // We're just ensuring clean entry point
  
  // Find where content truly starts (look back from title for the hero section container)
  let contentStart = 0;
  for (let i = titleIdx - 1; i >= 0; i--) {
    if (lines[i].includes('.container') && lines[i].includes('.mx-auto')) {
      // This is likely the hero container, include it
      contentStart = i;
      break;
    }
    if (i === 0) {
      contentStart = 0;
    }
  }
  
  // Remove excess closing colons at the end
  let contentEnd = lines.length - 1;
  while (contentEnd > titleIdx && lines[contentEnd].trim().match(/^:+$/)) {
    contentEnd--;
  }
  
  // Also remove the last few closing div markers (but keep structural ones)
  // Count how many opening sections we have vs closing
  let openCount = 0;
  let closeCount = 0;
  
  for (let i = contentStart; i <= contentEnd; i++) {
    const line = lines[i].trim();
    if (line.match(/^:+.*{/)) {
      openCount += (line.match(/^:+/)[0] || '').length;
    }
  }
  
  // Keep balanced closing tags
  let keepEnd = contentEnd;
  for (let i = contentEnd; i > titleIdx; i--) {
    if (lines[i].trim().match(/^:+$/)) {
      closeCount += lines[i].trim().length;
      if (closeCount <= openCount) {
        keepEnd = i;
      }
    } else {
      break;
    }
  }
  
  const normalizedLines = lines.slice(contentStart, keepEnd + 1);
  const normalizedContent = normalizedLines.join('\n').trim();
  
  fs.writeFileSync(filePath, normalizedContent + '\n');
  console.log(`✓ Normalized: ${file}`);
});

console.log('\n✅ Structure normalization complete!');

