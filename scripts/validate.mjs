import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const errors = [];
const check = async (label, fn) => { try { await fn(); } catch (error) { errors.push(`${label}: ${error.message}`); } };
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const skillsDir = path.join(root, 'skills');

for (const [platform, rel] of [['codex', '.codex-plugin/plugin.json'], ['claude-code', '.claude-plugin/plugin.json']]) {
  await check(`${platform} source manifest`, async () => {
    const manifest = await readJson(path.join(root, 'platforms', platform, rel));
    if (manifest.name !== 'inception') throw new Error('unexpected plugin name');
    if (manifest.version !== pkg.version) throw new Error('version must match package.json');
    if (typeof manifest.description !== 'string' || !manifest.description.trim()) throw new Error('description is required');
    if (platform === 'codex' && manifest.skills !== './skills/') throw new Error('skills must be ./skills/');
  });
}

for (const [platform, rel] of [['codex', '.codex-plugin/plugin.json'], ['claude-code', '.claude-plugin/plugin.json']]) {
  await check(`${platform} root manifest`, async () => {
    const manifest = await readJson(path.join(root, rel));
    if (manifest.name !== 'inception' || manifest.version !== pkg.version) throw new Error('root manifest identity/version mismatch');
    if (platform === 'codex' && manifest.skills !== './skills/') throw new Error('skills must be ./skills/');
    if (platform === 'claude-code') {
      const marketplace = await readJson(path.join(root, '.claude-plugin/marketplace.json'));
      const entry = marketplace.plugins?.find((plugin) => plugin.name === manifest.name);
      if (marketplace.name !== 'inception' || entry?.source !== './') throw new Error('Claude marketplace must expose the root plugin');
    } else {
      const marketplace = await readJson(path.join(root, '.agents/plugins/marketplace.json'));
      const entry = marketplace.plugins?.find((plugin) => plugin.name === manifest.name);
      if (marketplace.name !== 'inception' || entry?.source?.path !== './') throw new Error('Codex marketplace must expose the root plugin');
    }
  });
}

await check('skill metadata', async () => {
  const entries = await readdir(skillsDir, { withFileTypes: true });
  if (!entries.some((entry) => entry.isDirectory())) throw new Error('no skill directories found');
  for (const entry of entries.filter((item) => item.isDirectory())) {
    const file = path.join(skillsDir, entry.name, 'SKILL.md');
    const body = await readFile(file, 'utf8');
    const match = body.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
    if (!match) throw new Error(`${entry.name}/SKILL.md needs YAML frontmatter`);
    const name = match[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = match[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (name !== entry.name) throw new Error(`${entry.name}/SKILL.md name must match directory`);
    if (!description) throw new Error(`${entry.name}/SKILL.md description is required`);
  }
});

for (const platform of ['codex', 'claude-code']) {
  const dir = path.join(root, 'dist', platform);
  await check(`${platform} package`, async () => {
    await access(dir);
    const rel = platform === 'codex' ? '.codex-plugin/plugin.json' : '.claude-plugin/plugin.json';
    const manifest = await readJson(path.join(dir, rel));
    if (manifest.version !== pkg.version) throw new Error('packaged version mismatch');
    const skill = await readFile(path.join(dir, 'skills/plan/SKILL.md'), 'utf8');
    if (!skill.includes('Return a concise, actionable plan')) throw new Error('shared plan skill is missing or incomplete');
    if (platform === 'codex') await access(path.join(dir, manifest.skills, 'plan/SKILL.md'));
    const references = [...skill.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
    for (const reference of references) {
      if (/^[a-z]+:/i.test(reference) || reference.startsWith('#')) continue;
      const target = path.resolve(path.dirname(path.join(dir, 'skills/plan/SKILL.md')), reference.split('#')[0]);
      if (!target.startsWith(`${dir}${path.sep}`)) throw new Error(`reference escapes package: ${reference}`);
      await access(target);
    }
  });
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Repository manifests, skill metadata, and packaged references are valid. Host-native validation is not run here.');
}
