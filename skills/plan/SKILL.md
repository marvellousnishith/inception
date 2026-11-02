---
name: plan
description: Inspect a project and produce an actionable implementation plan without changing files. Use when asked to plan, scope, or assess a proposed change before implementation.
---

# Plan a change

Inspect the relevant project context before proposing work. Read applicable repository instructions and the files, configuration, and existing tests that shape the requested change. Use available read-only inspection tools; do not create, edit, or delete files, and do not run commands that modify project state.

Return a concise, actionable plan with:

- **Goal and assumptions:** clarify the intended outcome and any assumptions needed to proceed.
- **Affected areas:** name the files, components, or interfaces likely to change, based on inspected evidence.
- **Steps:** list implementation work in dependency order.
- **Verification:** identify focused checks and expected outcomes.
- **Risks:** call out material compatibility, data, security, or migration risks and how to reduce them.

If context is missing, say what is unknown and make the smallest reasonable assumptions. Do not present guesses as inspected facts. Keep the response as a plan; wait for a separate request before implementing it.
