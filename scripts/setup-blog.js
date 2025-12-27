#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Wolfgramm Holdings - Blog Setup\n');
console.log('This will convert your MDX blog posts to HTML pages.\n');

const steps = [
  {
    name: 'Create blog template',
    command: 'node scripts/create-blog-template.js',
    message: '✅ Template created'
  },
  {
    name: 'Convert MDX to HTML',
    command: 'node scripts/mdx-to-html.js',
    message: '✅ Blog posts converted'
  },
  {
    name: 'Copy media files',
    action: () => {
      const sourceDir = path.join(__dirname, '..', 'migration', 'mdx', 'media');
      const targetDir = path.join(__dirname, '..', 'blog', 'media');
      
      if (fs.existsSync(sourceDir)) {
        // Copy directory recursively
        fs.cpSync(sourceDir, targetDir, { recursive: true });
        return true;
      }
      return false;
    },
    message: '✅ Media files copied'
  },
  {
    name: 'Create blog index',
    command: 'node scripts/create-blog-index.js',
    message: '✅ Blog index created'
  }
];

let currentStep = 0;

function runStep(step) {
  try {
    console.log(`[${currentStep + 1}/${steps.length}] ${step.name}...`);
    
    if (step.command) {
      execSync(step.command, { stdio: 'pipe' });
    } else if (step.action) {
      step.action();
    }
    
    console.log(`    ${step.message}\n`);
    currentStep++;
    return true;
  } catch (error) {
    console.error(`    ❌ Failed: ${error.message}\n`);
    return false;
  }
}

// Run all steps
let success = true;
for (const step of steps) {
  if (!runStep(step)) {
    success = false;
    break;
  }
}

if (success) {
  console.log('\n🎉 Blog setup complete!\n');
  console.log('Your blog is ready at: blog/index.html\n');
  console.log('Next steps:');
  console.log('1. Test locally: python -m http.server 8000');
  console.log('2. Visit: http://localhost:8000/blog');
  console.log('3. Deploy the blog/ folder to your web server\n');
} else {
  console.log('\n❌ Setup failed. Please check the errors above.\n');
  process.exit(1);
}

