// Builds the 3D layer: bundles x3d/src/scene.js (with three.js) into x3d/scene.js
// and copies GSAP, ScrollTrigger and Lenis into vendor/.
// Run after editing anything in x3d/src/:  npm install && npm run build
import { build } from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';

await build({
  entryPoints: ['x3d/src/scene.js'],
  bundle: true,
  format: 'esm',
  minify: true,
  target: 'es2020',
  legalComments: 'eof',
  outfile: 'x3d/scene.js',
});

mkdirSync('vendor', { recursive: true });
for (const [from, to] of [
  ['gsap/dist/gsap.min.js', 'gsap.min.js'],
  ['gsap/dist/ScrollTrigger.min.js', 'ScrollTrigger.min.js'],
  ['lenis/dist/lenis.min.js', 'lenis.min.js'],
]) copyFileSync(`node_modules/${from}`, `vendor/${to}`);
console.log('Built x3d/scene.js and vendor/');
