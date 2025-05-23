const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js');
const targetPath = path.join(__dirname, '../public/pdf.worker.min.js');

// Create public directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, '../public'))) {
  fs.mkdirSync(path.join(__dirname, '../public'));
}

// Copy the file
fs.copyFileSync(sourcePath, targetPath);
console.log('PDF worker file copied successfully!'); 