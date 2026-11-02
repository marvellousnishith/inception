# Architecture

Inception keeps reusable workflow instructions in `skills/`, with `skills/plan/SKILL.md` as the initial portable workflow. The repository root is directly loadable by both hosts through `.codex-plugin/plugin.json` and `.claude-plugin/plugin.json`. Claude Code's marketplace catalog exposes this root plugin to GitHub installs. The build also copies the skill into self-contained packages under `dist/`, beside each platform's native manifest. `platforms/` contains the standalone package manifests and guidance. `agents/` reserves shared Markdown instruction bodies; it is not automatically loaded by either platform. `scripts/`, `tests/`, and `.github/` support packaging and repository checks. Generated `dist/` output is ignored by Git.

The version is maintained once in `package.json`; the build injects it into native manifests. The generated bundles do not depend on files outside their own directory.
