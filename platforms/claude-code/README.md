# Claude Code package

Built at `dist/claude-code/`. Claude Code discovers plugin skills from `skills/<skill-name>/SKILL.md`; its manifest is independent of Codex's.

## Install from GitHub

Add the Inception marketplace in a Claude Code session:

```text
/plugin marketplace add marvellousnishith/inception
```

Install the plugin:

```text
/plugin install inception@marvellousnishith
```

## Update the installed plugin

Update Inception from your shell:

```sh
claude plugin update inception@marvellousnishith
```

Or open `/plugin`, find Inception on the **Installed** tab, and choose **Update now**. If Claude Code says the session
needs to reload plugins, run:

```text
/reload-plugins
```

Otherwise, start a new Claude Code session to load the updated plugin.

## Use the workflows

Invoke `/inception:plan` to plan a change without implementation edits. Invoke `/inception:zensical-docs` to create or
improve a Zensical documentation site in the current repository. The Zensical workflow adds project launchers at
`scripts/zensical/run.sh` and `scripts/zensical/run.bat` so you can preview or build outside the Claude Code session.

## Try from a local checkout

Start Claude Code from a project and load the repository root for that session:

```sh
claude --plugin-dir /absolute/path/to/agents
```

Then invoke `/inception:plan` or `/inception:zensical-docs` in Claude Code.

## Try a generated package locally

Build from the repository root with `npm run build`. Start Claude Code in a project and load the package directly for that session:

```sh
claude --plugin-dir /absolute/path/to/dist/claude-code
```

Invoke `/inception:plan` or `/inception:zensical-docs`. Claude Code plugin skills are namespaced by plugin name.
