# Inception

Inception is a portable plugin toolkit for Codex and Claude Code. The initial 0.1.0 release provides one shared workflow:
`plan`. It inspects relevant project context and returns an actionable implementation plan without changing files.

This release contains no agents, hooks, integrations, backend, or installer. Each provider uses its own native plugin
manifest and marketplace format.

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

## Codex

The repository root contains Codex's compatibility manifest at `.codex-plugin/plugin.json`. The marketplace catalog is
`.agents/plugins/marketplace.json`.

### Install from GitHub

Add the marketplace:

```sh
codex plugin marketplace add marvellousnishith/inception
```

Install the plugin from that marketplace:

```sh
codex plugin add inception@marvellousnishith
```

### Try from a local checkout

Add the checkout as a marketplace:

```sh
codex plugin marketplace add /absolute/path/to/agents
```

Install the plugin:

```sh
codex plugin add inception@marvellousnishith
```

### Build and load the standalone package

Build the platform package:

```sh
npm run build
```

The package is written to `dist/codex/`. Expose that directory through a local Codex marketplace, add the marketplace,
then install it with `codex plugin add inception@<marketplace-name>`; see [Codex package instructions](platforms/codex/README.md).

## Claude Code

The repository root contains Claude Code's native manifest at `.claude-plugin/plugin.json` and its marketplace catalog at
`.claude-plugin/marketplace.json`.

### Install from GitHub

Add the marketplace in Claude Code:

```text
/plugin marketplace add marvellousnishith/inception
```

Install the plugin:

```text
/plugin install inception@marvellousnishith
```

Run the skill:

```text
/inception:plan
```

### Try from a local checkout

Start Claude Code from a project and load the repository root for that session:

```sh
claude --plugin-dir /absolute/path/to/agents
```

Then invoke the skill in Claude Code:

```text
/inception:plan
```

### Build and load the standalone package

Build the platform package:

```sh
npm run build
```

The package is written to `dist/claude-code/`. Load it for a session with:

```sh
claude --plugin-dir /absolute/path/to/agents/dist/claude-code
```

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
