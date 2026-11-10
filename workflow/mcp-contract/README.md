# MCP tool contracts

This directory defines the MCP API exposed by the AI SDLC workflow manager. Each tool contract consists of machine-
readable input and output JSON Schemas plus human-readable behavior rules. The schemas define data shape; the contract
defines preconditions, state transitions, side effects, and errors.

## Contract conventions

- Tool names use `snake_case`.
- MCP input schemas have an object root.
- Successful responses use structured objects matching the output schema.
- State-changing tools validate workflow rules before writing state.
- The orchestrator is the only workflow-state writer; stage agents report outcomes through it.
- A tool error must explain the rejected operation or unresolved issue without partially applying a state change.

## Tools

| Tool | Purpose | Status |
| --- | --- | --- |
| [`start_workflow`](start-workflow.md) | Create a run and its initial stream and stage records. | Draft for review |

## Shared error taxonomy

See [`errors.md`](errors.md) for the distinction between MCP protocol errors and workflow tool errors, the error-code
format, and the initial shared codes.

## Open contract questions

- Whether the manager uses the workflow definition's latest version or requires an explicit version.
- Path handling and project-root validation rules for each installation scope.
