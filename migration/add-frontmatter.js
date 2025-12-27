const fs = require('fs');
const path = require('path');

const mdxDir = path.join(__dirname, 'mdx');
const files = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));

console.log(`Adding frontmatter to ${files.length} MDX files...`);

files.forEach(file => {
  const filePath = path.join(mdxDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.trim()) {
    console.log(`⚠️  Skipping empty file: ${file}`);
    return;
  }
  
  // Check if frontmatter already exists
  let hasExistingFrontmatter = false;
  let existingContent = content;
  if (content.startsWith('---')) {
    hasExistingFrontmatter = true;
    // Extract content without frontmatter
    const parts = content.split('---\n');
    if (parts.length >= 3) {
      existingContent = parts.slice(2).join('---\n');
    }
  }
  
  const lines = hasExistingFrontmatter ? existingContent.split('\n') : content.split('\n');
  
  // Extract title from H1
  let title = '';
  let titleLine = lines.find(l => l.match(/^# .+{/));
  if (titleLine) {
    // Extract the title text between # and {
    const match = titleLine.match(/^# (.+?)\s*{/);
    if (match) {
      title = match[1].trim();
    }
  }
  
  // Extract date if visible in content
  let date = '';
  let dateLine = lines.find(l => l.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}/));
  if (dateLine) {
    const dateMatch = dateLine.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}/);
    if (dateMatch) {
      date = dateMatch[0];
    }
  }
  
  // Extract description/excerpt from first paragraph after title
  let description = '';
  let foundTitle = false;
  let passedMetadata = false;
  for (let line of lines) {
    if (line.match(/^# .+{/)) {
      foundTitle = true;
      continue;
    }
    if (foundTitle) {
      // Skip author/date metadata lines
      if (line.includes('By Breviss') || line.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d/)) {
        passedMetadata = true;
        continue;
      }
      // Look for actual content text
      if (line.trim() && 
          !line.match(/^[:#{}\[\]!]/) && 
          !line.includes('.flex') && 
          !line.includes('.container') &&
          line.length > 30) {
        // This is likely the description/intro text
        description = line.trim();
        // Clean up any markdown formatting
        description = description.replace(/\*\*/g, '').replace(/\[(.+?)\]\(.+?\)/g, '$1');
        if (description.length > 160) {
          description = description.substring(0, 157) + '...';
        }
        break;
      }
    }
  }
  
  // Generate slug from filename
  const slug = file.replace('.mdx', '');
  
  // Create canonical URL
  const canonical = `https://wgholdings.co.nz/blog/${slug}`;
  
  // Build frontmatter
  let frontmatter = '---\n';
  if (title) frontmatter += `title: "${title.replace(/"/g, '\\"')}"\n`;
  if (description) frontmatter += `description: "${description.replace(/"/g, '\\"')}"\n`;
  frontmatter += `slug: "${slug}"\n`;
  frontmatter += `canonical: "${canonical}"\n`;
  if (date) frontmatter += `date: "${date}"\n`;
  frontmatter += '---\n\n';
  
  // Add frontmatter to content
  const newContent = frontmatter + existingContent;
  
  fs.writeFileSync(filePath, newContent);
  console.log(`✓ ${hasExistingFrontmatter ? 'Updated' : 'Added'} frontmatter: ${file}`);
});

console.log('\n✅ Frontmatter addition complete!');

