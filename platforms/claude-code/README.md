# Claude Code package

Built at `dist/claude-code/`. Claude Code discovers plugin skills from `skills/<skill-name>/SKILL.md`; its manifest is independent of Codex's.

## Try locally

Build from the repository root with `npm run build`. Start Claude Code in a project and load the package directly for that session:

```sh
claude --plugin-dir /absolute/path/to/dist/claude-code
```

Invoke `/inception:plan` or ask Claude to plan a change. This uses Claude Code's documented development loading option and does not install or change global configuration.
