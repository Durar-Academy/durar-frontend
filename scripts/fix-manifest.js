const fs = require('fs');
const path = require('path');

// Path to the missing manifest file
const manifestPath = path.join(
  process.cwd(),
  '.next',
  'server',
  'app',
  '(main)',
  '(student)',
  'page_client-reference-manifest.js'
);

// Create directory if it doesn't exist
const manifestDir = path.dirname(manifestPath);
if (!fs.existsSync(manifestDir)) {
  fs.mkdirSync(manifestDir, { recursive: true });
}

// Create empty manifest file if it doesn't exist
if (!fs.existsSync(manifestPath)) {
  fs.writeFileSync(manifestPath, 'module.exports = {};', 'utf8');
  console.log('✅ Created missing client-reference-manifest.js file');
} else {
  console.log('✅ Manifest file already exists');
}

