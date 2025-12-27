const fs = require('fs');
const path = require('path');

const mdxDir = path.join(__dirname, 'mdx');
const files = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));

console.log(`Cleaning up Pandoc fence syntax in ${files.length} files...`);

files.forEach(file => {
  const filePath = path.join(mdxDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.trim()) {
    console.log(`⚠️  Skipping empty file: ${file}`);
    return;
  }
  
  // Convert Pandoc fence divs to HTML
  // Pattern: ::: {.classes} or :::::: {.classes}
  const lines = content.split('\n');
  const cleaned = [];
  
  for (let line of lines) {
    // Opening fence with classes: ::: {.class1 .class2}
    if (line.match(/^:+\s*{[^}]+}/)) {
      const colonCount = (line.match(/^:+/) || [''])[0].length;
      const classMatch = line.match(/\{([^}]+)\}/);
      
      if (classMatch) {
        const classes = classMatch[1]
          .split(/\s+/)
          .filter(c => c.startsWith('.'))
          .map(c => c.substring(1))
          .join(' ');
        
        if (classes) {
          cleaned.push(`<div className="${classes}">`);
        } else {
          cleaned.push('<div>');
        }
      }
    }
    // Closing fence: ::: or :::::: (just colons)
    else if (line.match(/^:+\s*$/)) {
      cleaned.push('</div>');
    }
    // Regular content
    else {
      cleaned.push(line);
    }
  }
  
  const cleanedContent = cleaned.join('\n');
  
  fs.writeFileSync(filePath, cleanedContent);
  console.log(`✓ Cleaned: ${file}`);
});

console.log('\n✅ Pandoc fence cleanup complete!');
console.log('\nNote: Review the files to ensure div structure is correct.');
console.log('You may need to manually adjust some nested divs.');

