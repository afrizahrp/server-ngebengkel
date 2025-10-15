/**
 * Quick Script untuk Update Logo URL di Email Templates
 *
 * Usage:
 * 1. Edit LOGO_URL di bawah dengan URL logo Anda
 * 2. Run: node update-logo-url.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// UPDATE LOGO URL DI SINI
// ============================================================================
// Development (localhost)
const LOGO_URL = 'http://localhost:4000/public/images/logo.webp';

// Untuk production, ganti dengan:
// const LOGO_URL = 'https://api.ngebengkel.com/public/images/logo.webp';
// atau CDN URL:
// const LOGO_URL = 'https://cdn.ngebengkel.com/logo.webp';

console.log('⚠️  IMPORTANT: Logo URL is set to LOCAL development URL');
console.log('   For production, update LOGO_URL in this script!\n');

// ============================================================================
// FILES TO UPDATE
// ============================================================================
const templates = [
  'src/email/templates/simple-verification.template.ts',
  'src/email/templates/two-factor-otp.template.ts',
];

// ============================================================================
// UPDATE FUNCTION
// ============================================================================
function updateTemplates() {
  console.log('🔧 Updating Email Templates...\n');
  console.log(`New Logo URL: ${LOGO_URL}\n`);

  let successCount = 0;
  let errorCount = 0;

  templates.forEach((file) => {
    try {
      const filepath = path.join(__dirname, file);

      // Check if file exists
      if (!fs.existsSync(filepath)) {
        console.error(`❌ File not found: ${file}`);
        errorCount++;
        return;
      }

      // Read file
      let content = fs.readFileSync(filepath, 'utf8');

      // Replace placeholder URL
      const originalContent = content;
      content = content.replace(
        /https:\/\/yourdomain\.com\/logo\.webp/g,
        LOGO_URL,
      );

      // Check if anything was replaced
      if (content === originalContent) {
        console.log(
          `⚠️  No changes needed in ${file} (URL already updated or not found)`,
        );
      } else {
        // Write updated content
        fs.writeFileSync(filepath, content);
        console.log(`✅ Updated ${file}`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${file}:`, error.message);
      errorCount++;
    }
  });

  console.log('\n' + '='.repeat(50));
  console.log('Summary:');
  console.log('='.repeat(50));
  console.log(`✅ Success: ${successCount} file(s)`);
  if (errorCount > 0) {
    console.log(`❌ Errors:  ${errorCount} file(s)`);
  }
  console.log(`\nLogo URL: ${LOGO_URL}`);
  console.log('\n🚀 Next Steps:');
  console.log('1. Restart server: npm run start:dev');
  console.log('2. Test email: Register new user');
  console.log('3. Check email for logo\n');
}

// ============================================================================
// RUN
// ============================================================================
updateTemplates();
