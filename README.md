# Inception

Inception is a portable plugin toolkit for Codex and Claude Code. It provides two shared workflows: `plan` creates an
implementation plan without changing files, and `zensical-docs` creates or improves a beginner-friendly Zensical
documentation site in the current repository. Each provider packages the same skill sources using its native plugin
format.

The initial release contains no agents, hooks, integrations, backend, or custom installer. Each provider uses its own
native plugin manifest and marketplace format.

## Development

Requires Node.js 22 or later and npm. Run these commands from the repository root:

```sh
npm ci
```

```sh
npm run build
```

```sh
npm run validate
```

```sh
npm test
```

The source version is maintained in `package.json` (`0.1.0`). The build creates standalone packages under `dist/`, which
is ignored by Git.

## Using Inception

Installation, updates, and local loading differ by provider. Follow the guide for the host you use:

- [Codex: install, update, and load Inception](platforms/codex/README.md)
- [Claude Code: install, update, and load Inception](platforms/claude-code/README.md)

## Repository layout

- `skills/` is the single source of truth for portable workflows.
- `agents/` is reserved for shared instruction bodies; neither provider automatically loads this source directory.
- `.codex-plugin/` and `.claude-plugin/` contain the root manifests in each provider's native format.
- `platforms/` contains provider-specific standalone package manifests and instructions.
- `scripts/` builds and validates packages; `tests/` checks package structure and references.
- `dist/` contains generated, self-contained packages and is not committed.
- `docs/` records architecture and compatibility limitations.

Repository checks do not launch Codex or Claude Code. Verify plugin loading and skill invocation in the target provider.
See [architecture](docs/architecture.md) and [compatibility](docs/compatibility.md).
