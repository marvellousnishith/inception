# Compatibility and validation

Inception 0.1.0 packages one Markdown planning skill for Codex and Claude Code. It does not include agents, commands, hooks, integrations, or a universal manifest. Shared skill instructions avoid platform-specific command names, while each host retains its own manifest and discovery behavior.

The GitHub repository root acts as the `marvellousnishith` marketplace and directly hosts the `inception` plugin. Claude Code can add `marvellousnishith/inception` as a marketplace and install `inception@marvellousnishith`. Codex uses its own compatibility manifest and marketplace catalog. Generated standalone packages remain available in `dist/`.

`npm run validate` checks repository source manifests, skill metadata, and package-local references. `npm test` checks the generated package layout. These are repository checks, not official host validators. No official Codex or Claude Code plugin validator is invoked by these scripts; actual loading should be checked in each host using the local workflows in the platform READMEs.

## Official documentation

- [Codex: Package your plugin](https://developers.openai.com/plugins/build/plugins) — package layout, compatibility manifest, local marketplace registration and installation.
- [Codex: Skills](https://developers.openai.com/plugins/concepts/skills) — skill structure and metadata.
- [Claude Code: Plugins overview](https://code.claude.com/docs/en/plugins) — native plugin manifest, plugin components, and `--plugin-dir` development loading.
- [Claude Code: Skills](https://code.claude.com/docs/en/skills) — `SKILL.md` behavior and skill discovery.

Host behavior and supported fields can change. Codex and Claude Code have different component formats and invocation conventions; this release verifies packaging structure but does not claim feature parity beyond carrying the shared skill.
