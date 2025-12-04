const sharp = require('sharp');
const path = require('path');

const sizes = [192, 512];

const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0a0a0a"/>
  <rect x="80" y="80" width="352" height="352" fill="#ff3d00"/>
  <text x="256" y="290" font-family="monospace" font-size="120" font-weight="bold" fill="#0a0a0a" text-anchor="middle">ST</text>
</svg>
`;

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(__dirname, '..', 'public', `icon-${size}.png`);
    await sharp(Buffer.from(svgIcon))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${outputPath}`);
  }
}

generateIcons().catch(console.error);

