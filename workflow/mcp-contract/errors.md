# MCP error taxonomy

This document defines stable error codes for the AI SDLC workflow manager. Tool contracts reference the codes that can
occur for each operation. Add a code here before using it in a tool contract.

## Error layers

| Layer               | Used for                                                                                                | Handling                                                                                                                  |
|---------------------|---------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| MCP protocol error  | Invalid JSON-RPC/MCP requests, unknown protocol methods, or malformed tool calls.                       | Let the MCP implementation return the protocol-level error. Do not translate it into a workflow error code.               |
| Workflow tool error | A valid tool call cannot complete because of workflow, input, permission, storage, or state conditions. | Return a tool result with `isError: true`; begin its text content with the stable code followed by a concise explanation. |

Successful tool output schemas apply only to successful results. Workflow tool errors do not return the success payload.

## Error code conventions

- Use stable `UPPER_SNAKE_CASE` codes.
- Keep codes independent of host names and operating systems.
- Keep the explanation actionable and safe to show to the orchestrator and user.
- Do not include secrets, credentials, or unnecessary file contents in error text.
- Tool contracts list which codes their operation may return and under what conditions.
- Retryability depends on the cause. The tool response should explain what must change before retrying; a failure is not
  automatically retryable just because the client repeats the same call.

## Initial codes

| Code                          | Category              | Meaning                                                    | Retry guidance                                                                                      |
|-------------------------------|-----------------------|------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `UNKNOWN_WORKFLOW`            | Definition lookup     | No installed workflow definition matches the requested ID. | Not until the workflow is installed or the ID is corrected.                                         |
| `INVALID_WORKFLOW_DEFINITION` | Definition validation | The requested workflow definition exists but is invalid.   | Not until the definition is corrected.                                                              |
| `PROJECT_ROOT_NOT_FOUND`      | Project path          | The supplied project directory does not exist.             | After supplying a valid project directory.                                                          |
| `PROJECT_ROOT_NOT_ACCESSIBLE` | Permission            | The manager cannot access the supplied project directory.  | After access is granted or a different project directory is supplied.                               |
| `STATE_STORAGE_FAILED`        | Storage               | The manager cannot create or write workflow state.         | After the underlying storage problem is resolved.                                                   |
| `STATE_VALIDATION_FAILED`     | State validation      | Generated state failed schema or lifecycle validation.     | Not automatically; investigate and correct the state-generation or workflow-definition issue first. |

This list is the initial taxonomy for `start_workflow`. Add operation-specific codes here as additional MCP contracts
are
defined.
