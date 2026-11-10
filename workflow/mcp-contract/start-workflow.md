# `start_workflow`

Creates a workflow run for a project and initializes its first stream. It does not start stage work; the orchestrator
uses the returned ready stage IDs to decide what to start next.

## MCP definition

- **Name:** `start_workflow`
- **Description:** Start a workflow run in a project, recording the user's initial input and creating the run's initial
  stream and stage state.
- **Input schema:** [`start-workflow.input.schema.json`](start-workflow.input.schema.json)
- **Output schema:** [`start-workflow.output.schema.json`](start-workflow.output.schema.json)
- **State-changing:** Yes. Each call creates a new workflow run.
- **Idempotent:** No. Repeating the call creates another run.

## Inputs

| Field | Required | Meaning |
| --- | --- | --- |
| `workflow_id` | Yes | Identifier of the workflow definition to run, such as `ai-sdlc`. |
| `project_root` | Yes | Project directory for which the run is created. |
| `initial_input` | Yes | Initial user text. The manager stores it once in the run-level inputs collection. |

The workflow definition version is currently selected by the manager. Requiring an explicit version remains an open
contract question.

## Preconditions

- A workflow definition matching `workflow_id` is installed and valid.
- `project_root` identifies an existing, accessible project directory.
- The manager can create and write the workflow run directory under
  `{project_root}/.ai-sdlc/workflow/runs/`.

## Behavior and state effects

1. Generate a unique `run_id` and initial `stream_id`.
2. Record `workflow_id`, the selected workflow definition version, `status: active`, timestamps, and the initial user
   input in the run state.
3. Create the first stream with `status: current` and no parent stream or branch point.
4. Create a stage state record for every stage in the workflow definition; initialize each stage to `pending` with an
   empty attempt list.
5. Validate the complete state and persist it before reporting success.
6. Derive and return `ready_stage_ids`. This is response data only; it is not stored in the state file.

The initial stage remains `pending` until the orchestrator starts it through the stage lifecycle operation.

## Response

The response returns `run_id`, `current_stream_id`, `status`, and the stage IDs ready to start. For the current AI SDLC
definition, `ready_stage_ids` should contain `intent`.

## Errors

Failures use the workflow tool error format in [`errors.md`](errors.md): an MCP tool execution error (`isError: true`)
whose content text starts with a stable machine-readable code followed by a concise explanation. An error response does
not use the success output schema and must leave no partial run state.

| Error code | Meaning |
| --- | --- |
| `UNKNOWN_WORKFLOW` | No installed workflow definition matches `workflow_id`. |
| `INVALID_WORKFLOW_DEFINITION` | A matching definition exists but fails definition validation. |
| `PROJECT_ROOT_NOT_FOUND` | The supplied project directory does not exist. |
| `PROJECT_ROOT_NOT_ACCESSIBLE` | The manager cannot access the supplied project directory. |
| `STATE_STORAGE_FAILED` | The manager cannot create or write the run directory or state file. |
| `STATE_VALIDATION_FAILED` | The generated state fails schema or lifecycle validation. |

The manager should remove any temporary or incomplete state created during a failed operation. See the shared error
taxonomy for retry guidance. The exact behavior for a response lost after a successful write, and whether
`start_workflow` needs an idempotency key, remain open.
