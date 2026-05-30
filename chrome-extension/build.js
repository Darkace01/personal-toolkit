import { promises as fs } from 'node:fs';
import * as esbuild from 'esbuild';
import { execSync } from 'node:child_process';

async function build() {
  const isFirefox = process.argv.includes('--firefox');
  const outDir = isFirefox ? 'dist-firefox' : 'dist';

  console.log(`Building for ${isFirefox ? 'Firefox' : 'Chrome'} into ${outDir}...`);

  // Ensure directories exist
  await fs.mkdir(`${outDir}/src/popup`, { recursive: true });
  await fs.mkdir(`${outDir}/src/options`, { recursive: true });
  await fs.mkdir(`${outDir}/src/tools`, { recursive: true });
  await fs.mkdir(`${outDir}/src/background`, { recursive: true });
  await fs.mkdir(`${outDir}/src/content`, { recursive: true });

  console.log("Bundling scripts...");
  const entryPoints = [
    'src/background/service-worker.ts',
    'src/content/content-script.ts',
    'src/popup/popup.ts',
    'src/options/options.ts',
    'src/tools/tools.ts'
  ];

  await esbuild.build({
    entryPoints,
    bundle: true,
    outdir: outDir,
    format: 'esm',
    target: 'es2020',
    sourcemap: true,
    platform: 'browser',
    // We need to handle the .js extension in imports if they exist in source
    // but since we are bundling, we can just let esbuild resolve them.
  });

  console.log("Copying manifest.json...");
  let manifest = JSON.parse(await fs.readFile('manifest.json', 'utf8'));
  
  // Adjust manifest for bundling (entry points are now .js in the same relative path)
  manifest.background.service_worker = 'src/background/service-worker.js';
  manifest.content_scripts[0].js = ['src/content/content-script.js'];
  
  if (isFirefox) {
    manifest.browser_specific_settings = {
      gecko: {
        id: "toolkit@personal.io",
        strict_min_version: "109.0"
      }
    };
    // Firefox uses 'background.scripts' instead of 'service_worker' for v3 in some versions,
    // but newer ones support 'service_worker'. However, 'scripts' is more compatible for FF.
    manifest.background = {
      scripts: ['src/background/service-worker.js'],
      type: 'module'
    };
  }

  await fs.writeFile(`${outDir}/manifest.json`, JSON.stringify(manifest, null, 2));

  console.log("Copying HTML files...");
  const htmlFiles = [
    { src: 'src/popup/popup.html', dest: 'src/popup/popup.html', js: 'popup.js' },
    { src: 'src/options/options.html', dest: 'src/options/options.html', js: 'options.js' },
    { src: 'src/tools/tools.html', dest: 'src/tools/tools.html', js: 'tools.js' }
  ];

  for (const file of htmlFiles) {
    let content = await fs.readFile(file.src, 'utf8');
    // In our bundle, the JS file is in the same directory as the HTML (relative-wise)
    // because esbuild mirrors the structure.
    content = content.replace(`${file.js.replace('.js', '.ts')}`, file.js);
    await fs.writeFile(`${outDir}/${file.dest}`, content);
  }

  console.log("Copying themes CSS...");
  await fs.cp('src/themes', `${outDir}/src/themes`, { recursive: true });

  console.log(`Done! You can now load the '${outDir}' folder as an unpacked extension.`);
}

build().catch(console.error);
