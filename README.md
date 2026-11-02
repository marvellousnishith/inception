# Inception

Inception is a portable plugin toolkit for Codex and Claude Code. The initial 0.1.0 release packages one shared workflow: `/plan`, which inspects relevant project context and returns an actionable implementation plan without changing files. It contains no agents, commands, hooks, integrations, backend, or installer.

## Development

Requires Node.js 22 or later and npm. From the repository root:

```sh
npm ci
npm run build
npm run validate
npm test
```

Build packages are generated in `dist/codex/` and `dist/claude-code/`; `dist/` is ignored by Git. The source version is `package.json` (`0.1.0`).

## Try locally

- **Claude Code, from this checkout:** from a project, run `claude --plugin-dir /absolute/path/to/agents`, then invoke `/inception:plan`. The repository root is the plugin root.
- **Claude Code, from GitHub:** run `/plugin marketplace add nisheeth/inception`, then `/plugin install inception@nisheeth`.
- **Codex, from GitHub:** run `codex plugin marketplace add nisheeth/inception`, then install Inception from the Codex desktop app's plugin directory. The repository catalog is `.agents/plugins/marketplace.json`. See [Codex package instructions](platforms/codex/README.md).
- **Generated packages:** run `npm run build` for standalone packages in `dist/`; these can be loaded using Claude Code `--plugin-dir` or registered in a local Codex marketplace.

These host loading paths follow the official development/install documentation, but this repository's automated checks do not launch either host. Verify skill invocation in the installed host.

## Layout

- `skills/` is the source of truth for platform-portable workflows.
- `agents/` is reserved for shared instruction bodies; neither platform automatically loads it.
- `.claude-plugin/` and `.codex-plugin/` hold native root manifests so this repository is directly loadable by both hosts. `.claude-plugin/marketplace.json` and `.agents/plugins/marketplace.json` expose the root plugin through each host's GitHub marketplace flow.
- `platforms/` holds native standalone package manifests and guidance.
- `scripts/` builds and validates packages; `tests/` checks the outputs.
- `dist/` contains generated, self-contained packages and is not committed.
- `docs/` records architecture, compatibility, and official references.

See [architecture](docs/architecture.md) and [compatibility](docs/compatibility.md).
