const fs = require('fs');
const path = require('path');

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.webp': return 'image/png';
    case '.webp':
    case '.jpeg': return 'image/jpeg';
    case '.mp4': return 'video/mp4';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

function encodeBase64(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return '';
  }
  const fileBuffer = fs.readFileSync(filePath);
  const mime = getMimeType(filePath);
  return `data:${mime};base64,${fileBuffer.toString('base64')}`;
}

let html = fs.readFileSync('index.html', 'utf8');

// Replace CSS
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (match, cssPath) => {
  const absolutePath = path.resolve(cssPath);
  if (fs.existsSync(absolutePath)) {
    const cssContent = fs.readFileSync(absolutePath, 'utf8');
    return `<style>${cssContent}</style>`;
  }
  return match;
});

// Replace Local Scripts
html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, (match, jsPath) => {
  const absolutePath = path.resolve(jsPath);
  if (fs.existsSync(absolutePath)) {
    const jsContent = fs.readFileSync(absolutePath, 'utf8');
    return `<script>${jsContent}</script>`;
  }
  return match;
});

// Replace all occurrences of assets/images/filename in the bundled file (attributes, CSS url, JS strings, etc.)
html = html.replace(/assets\/images\/([a-zA-Z0-9_\-\.]+)/g, (match, fileName) => {
  const filePath = path.join('assets', 'images', fileName);
  if (fs.existsSync(filePath)) {
    console.log(`Embedding ${filePath}...`);
    return encodeBase64(filePath);
  }
  return match;
});

fs.writeFileSync('manufactura.html', html, 'utf8');
console.log('Successfully packed into manufactura.html!');
