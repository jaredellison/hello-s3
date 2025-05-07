// build.mjs
import { build } from 'esbuild';

await build({
  entryPoints: ['./src/upload.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  outfile: 'dist/upload.js',
});