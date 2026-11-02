import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const platforms = ['codex', 'claude-code'];

for (const platform of platforms) {
  const target = path.join(dist, platform);
  if (path.dirname(target) !== dist) throw new Error(`Unsafe output path: ${target}`);
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  await cp(path.join(root, 'skills'), path.join(target, 'skills'), { recursive: true });
  const sourceManifest = platform === 'codex'
    ? '.codex-plugin/plugin.json'
    : '.claude-plugin/plugin.json';
  const manifest = JSON.parse(await readFile(path.join(root, 'platforms', platform, sourceManifest), 'utf8'));
  manifest.version = pkg.version;
  const manifestPath = path.join(target, sourceManifest);
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

console.log('Built dist/codex and dist/claude-code.');
