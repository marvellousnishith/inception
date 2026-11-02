import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('platform packages include the shared skill and native manifest structure', async () => {
  for (const [platform, manifestPath] of [
    ['codex', '.codex-plugin/plugin.json'],
    ['claude-code', '.claude-plugin/plugin.json'],
  ]) {
    const dir = path.join(root, 'dist', platform);
    const manifest = JSON.parse(await readFile(path.join(dir, manifestPath), 'utf8'));
    assert.equal(manifest.name, 'inception');
    assert.equal(manifest.version, '0.1.0');
    await access(path.join(dir, 'skills/plan/SKILL.md'));
    const skill = await readFile(path.join(dir, 'skills/plan/SKILL.md'), 'utf8');
    assert.match(skill, /^name: plan$/m);
    for (const [, reference] of skill.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^[a-z]+:/i.test(reference) || reference.startsWith('#')) continue;
      const target = path.resolve(path.dirname(path.join(dir, 'skills/plan/SKILL.md')), reference.split('#')[0]);
      assert.ok(target.startsWith(`${dir}${path.sep}`), `${reference} stays inside package`);
      await access(target);
    }
  }
  const codex = JSON.parse(await readFile(path.join(root, 'dist/codex/.codex-plugin/plugin.json'), 'utf8'));
  assert.equal(codex.skills, './skills/');
});

test('repository root is directly loadable and listed in Claude marketplace', async () => {
  const codex = JSON.parse(await readFile(path.join(root, '.codex-plugin/plugin.json'), 'utf8'));
  const claude = JSON.parse(await readFile(path.join(root, '.claude-plugin/plugin.json'), 'utf8'));
  const marketplace = JSON.parse(await readFile(path.join(root, '.claude-plugin/marketplace.json'), 'utf8'));
  const codexMarketplace = JSON.parse(await readFile(path.join(root, '.agents/plugins/marketplace.json'), 'utf8'));
  for (const manifest of [codex, claude]) {
    assert.equal(manifest.name, 'inception');
    assert.equal(manifest.version, '0.1.0');
  }
  assert.equal(marketplace.plugins[0].name, 'inception');
  assert.equal(marketplace.name, 'marvellousnishith');
  assert.equal(marketplace.plugins[0].source, './');
  assert.equal(codexMarketplace.plugins[0].name, 'inception');
  assert.equal(codexMarketplace.name, 'marvellousnishith');
  assert.equal(codexMarketplace.plugins[0].source.path, './');
  await access(path.join(root, 'skills/plan/SKILL.md'));
});
