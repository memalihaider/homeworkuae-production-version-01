const fs = require('fs');
const content = fs.readFileSync('/Users/macbookpro/Desktop/homework_01/app/(public)/services/ac-duct-cleaning/page.tsx', 'utf-8');
const regex = /(\n\s*\{\/\* Video Section \*\/\}\n\s*<section[\s\S]*?<\/section>)/;
const match = regex.exec(content);
console.log('Match found:', !!match);
if (match) console.log('Match preview:', match[0].substring(0, 200));
else {
  // Check if the comment exists
  const idx = content.indexOf('{/* Video Section */}');
  console.log('Comment index:', idx);
  if (idx > -1) {
    console.log('Content around:', JSON.stringify(content.substring(idx - 5, idx + 80)));
  }
}
