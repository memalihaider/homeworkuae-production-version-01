const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '../app/(public)/services');

// CTA content per service slug
const ctaContent = {
  'ac-coil-cleaning': {
    title: 'Keep Your AC Running at',
    titleHighlight: 'Peak Efficiency',
    description: 'Contact us today for professional AC coil cleaning in the UAE.',
  },
  'ac-duct-cleaning': {
    title: 'Breathe',
    titleHighlight: 'Cleaner Air Today',
    description: 'Contact us today for professional AC duct cleaning services.',
  },
  'apartment-deep-cleaning': {
    title: 'Transform Your',
    titleHighlight: 'Apartment',
    description: 'Contact us today for a professional apartment deep cleaning experience.',
  },
  'balcony-deep-cleaning': {
    title: 'Revitalize Your',
    titleHighlight: 'Outdoor Space',
    description: 'Contact us today for professional balcony deep cleaning services.',
  },
  'carpets-deep-cleaning': {
    title: 'Restore Your',
    titleHighlight: 'Carpets',
    description: 'Contact us today for professional carpet deep cleaning services.',
  },
  'facade-cleaning': {
    title: 'Restore Your',
    titleHighlight: 'Building\'s Facade',
    description: 'Contact us today for professional facade cleaning services.',
  },
  'garage-deep-cleaning': {
    title: 'Transform Your',
    titleHighlight: 'Garage',
    description: 'Contact us today for professional garage deep cleaning services.',
  },
  'grease-trap-cleaning': {
    title: 'Keep Your Grease Traps',
    titleHighlight: 'Clean & Compliant',
    description: 'Contact us today for professional grease trap cleaning services.',
  },
  'grout-deep-cleaning': {
    title: 'Restore Your',
    titleHighlight: 'Grout & Tiles',
    description: 'Contact us today for professional grout deep cleaning services.',
  },
  'gym-deep-cleaning': {
    title: 'Maintain a',
    titleHighlight: 'Hygienic Gym',
    description: 'Contact us today for professional gym deep cleaning services.',
  },
  'kitchen-deep-cleaning': {
    title: 'Transform Your',
    titleHighlight: 'Kitchen',
    description: 'Contact us today for a professional kitchen deep cleaning experience.',
  },
  'kitchen-hood-cleaning': {
    title: 'Keep Your',
    titleHighlight: 'Kitchen Hood Clean',
    description: 'Contact us today for professional kitchen hood cleaning services.',
  },
  'mattress-deep-cleaning': {
    title: 'Sleep in a',
    titleHighlight: 'Cleaner, Healthier Bed',
    description: 'Contact us today for professional mattress deep cleaning services.',
  },
  'move-in-out-cleaning': {
    title: 'Start Fresh in',
    titleHighlight: 'Your New Space',
    description: 'Contact us today for professional move in/out cleaning services.',
  },
  'office-cleaning': {
    title: 'Maintain a',
    titleHighlight: 'Professional Workspace',
    description: 'Contact us today for professional office cleaning services.',
  },
  'post-construction-cleaning': {
    title: 'Turn Your Build Into',
    titleHighlight: 'Your Home',
    description: 'Contact us today for professional post-construction cleaning services.',
  },
  'residential-cleaning': {
    title: 'Enjoy a',
    titleHighlight: 'Spotless Home',
    description: 'Contact us today for professional residential cleaning services.',
  },
  'restaurant-cleaning': {
    title: 'Keep Your Restaurant',
    titleHighlight: 'Pristine',
    description: 'Contact us today for professional restaurant cleaning services.',
  },
  'sofa-deep-cleaning': {
    title: 'Restore Your Sofa\'s',
    titleHighlight: 'Freshness',
    description: 'Contact us today for professional sofa deep cleaning services.',
  },
  'swimming-pool-cleaning': {
    title: 'Dive Into a',
    titleHighlight: 'Crystal Clear Pool',
    description: 'Contact us today for professional swimming pool cleaning services.',
  },
  'villa-deep-cleaning': {
    title: 'Transform Your',
    titleHighlight: 'Villa',
    description: 'Contact us today for a professional villa deep cleaning experience.',
  },
  'water-tank-cleaning': {
    title: 'Ensure Clean,',
    titleHighlight: 'Safe Water',
    description: 'Contact us today for professional water tank cleaning services.',
  },
  'window-cleaning': {
    title: 'Enjoy',
    titleHighlight: 'Crystal Clear Windows',
    description: 'Contact us today for professional window cleaning services.',
  },
};

function buildCTA(slug) {
  const c = ctaContent[slug];
  if (!c) return null;
  return `      {/* CTA Section */}
      <section className="py-24 bg-slate-950 text-white relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-slate-950 rounded-[3.5rem] text-center relative overflow-hidden group container mx-auto px-4 max-w-3xl"
        >
          <div className="relative z-10">
            <h4 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">${c.title} <span className="text-primary italic">${c.titleHighlight}</span></h4>
            <p className="text-slate-400 text-lg mb-10 font-bold">${c.description}</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="https://homeworkuae.com/book-service" className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-pink-700 transition-all flex items-center gap-3">
                 Book Now
              </a>
            </div>
          </div>
        </motion.div>
      </section>`;
}

function processFile(filePath, slug) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Normalize line endings to \n
  const hadCRLF = content.includes('\r\n');
  content = content.replace(/\r\n/g, '\n');

  // 1. Remove the entire Video Section block
  const videoSectionRegex = /\n[ \t]*\{\/\* Video Section \*\/\}[\s\S]*?<\/section>/;
  if (videoSectionRegex.test(content)) {
    content = content.replace(videoSectionRegex, '');
    changed = true;
    console.log(`  ✅ Removed Video Section`);
  } else {
    console.log(`  ℹ️  No Video Section found`);
  }

  // 2. If there is a "Why Choose Us Section", remove it and add CTA
  const whyChooseRegex = /(\n[ \t]*\{\/\* Why Choose Us Section \*\/\}[\s\S]*?<\/section>)(\n[ \t]*<\/div>\n[ \t]*\)\n\})/;
  if (whyChooseRegex.test(content)) {
    const cta = buildCTA(slug);
    if (cta) {
      content = content.replace(whyChooseRegex, `\n\n${cta}\n\n    </div>\n  )\n}`);
      changed = true;
      console.log(`  ✅ Replaced Why Choose Us with CTA`);
    }
  } else {
    console.log(`  ℹ️  No Why Choose Us Section (already has CTA or not found)`);
  }

  // 3. Remove unused Play import (if no longer used)
  // After removing video section, Play is only in import
  if (!content.includes('<Play') && !content.includes('Play,\n') && content.includes(', Play')) {
    content = content.replace(/, Play\b/g, '');
    changed = true;
    console.log(`  ✅ Removed unused Play import`);
  } else if (!content.includes('<Play') && content.includes('Play,')) {
    content = content.replace(/\s*Play,\n/g, '\n');
    changed = true;
    console.log(`  ✅ Removed unused Play import`);
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  💾 File saved`);
  }
}

// Get all service directories (exclude [slug] and the root page.tsx)
const entries = fs.readdirSync(servicesDir, { withFileTypes: true });
const serviceDirs = entries
  .filter(e => e.isDirectory() && e.name !== '[slug]')
  .map(e => e.name);

console.log(`Processing ${serviceDirs.length} service pages...\n`);

for (const slug of serviceDirs) {
  const pageFile = path.join(servicesDir, slug, 'page.tsx');
  if (fs.existsSync(pageFile)) {
    console.log(`\n📄 ${slug}`);
    processFile(pageFile, slug);
  }
}

console.log('\n✅ Done!');
