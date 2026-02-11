const { execSync } = require('child_process');
const path = require('path');

const projects = [
  'KnowFlow',
  'OpenWorker',
  'GitMap',
  'ProjectIQ',
  'ConflictIQ'
];

const outDir = path.join(__dirname, '..', 'out');

// Create output directory
require('fs').mkdirSync(outDir, { recursive: true });

console.log('🎬 Rendering portfolio videos...\n');

for (const project of projects) {
  console.log(`📹 Rendering ${project}...`);
  
  // Full version (16:9)
  execSync(
    `npx remotion render src/index.ts ${project} out/${project}.mp4`,
    { cwd: path.join(__dirname, '..'), stdio: 'inherit' }
  );
  
  // Short version (9:16)
  console.log(`📱 Rendering ${project} short...`);
  execSync(
    `npx remotion render src/index.ts ${project}-Short out/${project}-Short.mp4`,
    { cwd: path.join(__dirname, '..'), stdio: 'inherit' }
  );
  
  console.log(`✅ ${project} complete\n`);
}

console.log('🎉 All videos rendered to ./out/');
