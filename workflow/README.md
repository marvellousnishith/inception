# Workflow definition

This folder contains the machine-readable AI SDLC workflow definition and the conventions for interpreting it. The
workflow covers intent, requirement analysis, discovery, architecture, backlog, and planning. Enterprise solution design
is outside its scope and can be handled by a separate workflow.

## Identity and version fields

| Field         | Meaning                                                       |
|---------------|---------------------------------------------------------------|
| `id`          | Stable workflow identifier. Identifier values use kebab-case. |
| `name`        | Human-readable workflow name.                                 |
| `description` | Purpose of the workflow.                                      |
| `version`     | Version of the workflow definition.                           |
| `owner`       | Person or team responsible for maintaining the definition.    |

Definition field names use snake_case. Filenames and identifier values use kebab-case.

## Stage fields

Each top-level stage defines:

| Field                 | Meaning                                                                 |
|-----------------------|-------------------------------------------------------------------------|
| `id`                  | Stable kebab-case identifier.                                           |
| `name`                | Human-readable stage name.                                              |
| `description`         | Purpose and scope.                                                      |
| `depends_on`          | Prerequisite stage IDs. An empty list means there are no prerequisites. |
| `completion_criteria` | Conditions for considering the stage complete.                          |
| `order`               | Display order; it does not impose execution order.                      |
| `sub_stages`          | Optional, one-level list of substages.                                  |

## Substage fields

Substages are optional and can be defined under a stage using `sub_stages`. They use the following fields:

| Field                 | Meaning                                                                  |
|-----------------------|--------------------------------------------------------------------------|
| `id`                  | Stable kebab-case identifier, unique among sibling substages.            |
| `name`                | Human-readable substage name.                                            |
| `description`         | Purpose and scope of the substage.                                       |
| `depends_on`          | Prerequisite sibling substage IDs. An empty list means no prerequisites. |
| `completion_criteria` | Conditions for considering the substage complete.                        |
| `order`               | Display order; it does not impose execution order.                       |
| `parallel_group`      | Optional label for related concurrent substages.                         |

Substages cannot contain further `sub_stages` in this version. Substage dependencies refer to sibling IDs.

## Statuses

The workflow state file tracks status at the workflow run, stream, and stage levels.

| Level        | Statuses                                                              | Meaning                                                                                                                                 |
|--------------|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| Workflow run | `active`, `completed`, `failed`, `cancelled`                          | The run is underway, finished successfully, cannot continue or recover, or was intentionally stopped.                                   |
| Stream       | `current`, `stale`, `completed`                                       | The stream is the active line of work, has been superseded by a revision, or reached the end of the workflow.                           |
| Stage        | `pending`, `in_progress`, `completed`, `blocked`, `failed`, `skipped` | The stage has not started, is being worked on, is done, is awaiting resolution, stopped due to an error, or was intentionally bypassed. |

### Workflow run statuses

| Status      | Meaning                                                                   |
|-------------|---------------------------------------------------------------------------|
| `active`    | The workflow run is underway.                                             |
| `completed` | The workflow run has finished successfully.                               |
| `failed`    | The orchestrator determined the workflow cannot continue or be recovered. |
| `cancelled` | The workflow run was intentionally stopped before successful completion.  |

### Stream statuses

| Status      | Meaning                                                                                                                      |
|-------------|------------------------------------------------------------------------------------------------------------------------------|
| `current`   | This is the active stream where work should continue.                                                                        |
| `stale`     | A revision branched from an earlier point, superseding this stream for current work. Its history and artifacts are retained. |
| `completed` | This stream reached the end of the workflow.                                                                                 |

### Stage statuses

| Status        | Meaning                                                                                                  |
|---------------|----------------------------------------------------------------------------------------------------------|
| `pending`     | The stage has not started.                                                                               |
| `in_progress` | Work on the stage has started and is not yet complete.                                                   |
| `completed`   | The stage's completion criteria have been met.                                                           |
| `blocked`     | Work cannot proceed because of an obstacle; record the reason.                                           |
| `failed`      | An attempt stopped because an error prevented it from proceeding; record the reason and attempt.         |
| `skipped`     | The stage was exceptionally bypassed at the user's direction; record the reason and acknowledged impact. |

Stage readiness is derived: a `pending` stage is ready when its dependencies are complete. `blocked` stages record a
reason for the obstacle. `failed` stages record the error and affected attempt. A retry starts a new attempt for the
same stage without erasing earlier failure history. `skipped` stages record the user's direction, reason, and
acknowledged impact.

Potential failure causes include access denied; missing or unavailable resources; network errors, timeouts, rate limits,
or service outages; tool or execution errors; missing, corrupted, unreadable, or inconsistent inputs; state or artifact
conflicts that prevent safe continuation; and execution time, context, or resource limits.

## Execution and parallel work

Dependencies determine readiness and execution order. Any stages (or sibling substages) whose dependencies are
satisfied are eligible to run in parallel. A dependency-free stage is not required to wait for another stage merely
because its `order` value is later. `parallel_group` is optional metadata for grouping related concurrent substages;
it is not required to enable parallel execution. A workflow runner may apply a concurrency limit.

In the current workflow, Intent precedes Requirement Analysis, which precedes Discovery. Architecture depends on both
Requirement Analysis and Discovery, making both documents explicit prerequisites. Backlog depends on Architecture,
and Planning depends on Backlog. This dependency graph is sequential for the current stages; the model permits
independent stages to run in parallel when a future definition gives them no dependency relationship.

## Transitions and completion rules

An individual stage failure does not by itself fail the workflow run. Keep the run `active` while the orchestrator
can retry the stage or resolve the issue. Mark the run `failed` only when the orchestrator determines the workflow
cannot continue or recover, such as after fatal state corruption or another unrecoverable error.

### Starting a stage

A stage may start when every stage listed in its `depends_on` field has status `completed`. A `pending` stage whose
dependencies are all complete is considered ready; readiness is derived and does not need its own stored status.

### Blocking and resuming a stage

Mark a stage `blocked` when it cannot proceed until an external resolution, such as user input, required access, or
an unavailable dependency. Record the reason. Once the obstacle is resolved, the orchestrator moves the stage back to
`in_progress`.

### Failing and retrying a stage

When an error prevents an attempt from proceeding, mark the stage `failed` and record the error and attempt. When the
orchestrator retries the stage, it moves the stage to `in_progress` and starts a new attempt. Preserve prior failed
attempts in the workflow state history.

### Skipping a stage

No stage in the current AI SDLC workflow is optional or normally skippable. A forced skip is an exception that
requires the user's direction and acknowledgment of its impact on expected outputs and downstream work. Record the
reason and impact in the workflow state. A downstream stage must not start merely because its prerequisite was
skipped; the orchestrator must get the user's direction on how to handle the affected dependency first.

## Runtime state and artifacts

The definition describes the workflow and its rules. Each workflow run has a separate state file, which can track
multiple streams created by revisions. State records actual user inputs and references to files or artifacts used and
produced by stages. It should reference the content rather than duplicate it. Actual inputs, outputs, artifact links,
and runtime statuses do not belong in the static definition.

The state format is defined by [`state.schema.json`](state.schema.json), using JSON Schema Draft 2020-12. It validates
the structure and field types of a run state. Cross-record rules—such as exactly one current stream in an active run,
valid stream lineage, and dependencies being complete in the same stream—must also be enforced by the orchestrator.

State examples are available in [`examples/`](examples/); each demonstrates a different lifecycle case.
The MCP API contracts are documented in [`mcp-contract/`](mcp-contract/).

### Artifact references and reuse

For each input or produced artifact, workflow state records:

| Field | Meaning |
| --- | --- |
| `location` | Project-relative path or stable external URI. |
| `name` or `type` | Human-readable artifact name or artifact kind, such as `requirements-document`. |
| `origin` | Provenance for every artifact. Use `type: workflow_generated` with `stream_id` and `stage_id` for workflow outputs, or `type: user_provided` with a source for user inputs. |
| `revision` | Version, commit, or other identifier for the exact artifact revision used. |

When an artifact from a stale stream is reused, the new stream records a reference to the original artifact and the
orchestrator's explicit reuse decision. The artifact remains associated with its original stream; the new stream does
not copy it or make the old stream current. The orchestrator confirms that the artifact remains suitable for the
revised context. If it does not, the affected stage regenerates it.

When a user revises an earlier stage, the workflow starts a new stream from that point. The previous stream is retained
as stale history; its artifacts remain available for reuse and are not implicitly treated as current. State
serialization and artifact reference formats are described by the state schema and this document.

### Revision and branching rules

- Branch at the earliest stage affected by the user's revision.
- Carry completed stages and their artifact references from before the branch point into the new stream.
- Reset the branch stage and all downstream stages to `pending` so they can be reconsidered against the revision.
- Mark the previous stream `stale` while preserving its history and artifacts.
- Reuse downstream artifacts from the stale stream only through an explicit orchestrator decision recorded in state;
  do not silently treat them as current.
- Record the parent stream and branch point in the new stream to preserve lineage.

## Ownership and update permissions

| Actor | Responsibility |
| --- | --- |
| Orchestrator | Sole writer of workflow state. Starts and advances stages, checks completion criteria, records blocked or failed attempts, creates revision streams, and records artifact reuse decisions. |
| Stage agent | Performs assigned stage work and reports results, errors, and artifact references to the orchestrator. Does not directly modify shared workflow state. |
| User | Provides inputs and decisions, requests revisions, and authorizes any exceptional skip. The orchestrator records user decisions and communicates downstream impact. |

## Validation rules

### Stage dependencies

A stage may be `in_progress` or `completed` only when every stage in its `depends_on` list is `completed` in the same
stream. A completed stage from a different stream does not satisfy the dependency.

A `blocked` or `failed` prerequisite does not satisfy a dependency; dependent stages remain `pending` until the
prerequisite is completed. A skipped prerequisite does not satisfy a dependency automatically; the orchestrator must
get the user's direction on the affected dependency before proceeding.

### Current stream

An active workflow run has exactly one stream with status `current`. All other streams in that run are `stale` or
`completed`.

### Stream lineage

Every stream created by a revision records its `parent_stream_id` and `branch_point`. Validate that the parent stream
exists in the same workflow run and that the branch point identifies a stage in the workflow definition. The initial
stream has no parent stream or branch point.

### Artifact provenance

For a `workflow_generated` artifact, validate that its `origin.stream_id` exists in the run and its
`origin.stage_id` identifies a stage in the workflow definition. A `user_provided` artifact records its source in the
same `origin` field and does not require a workflow stream or stage.

### Workflow run completion

A stream may be marked `completed` only when every required stage in that stream is `completed`. The workflow run is
then marked `completed` once its current stream has completed. At that point, the stream status changes from `current`
to `completed`, so a completed run has no stream with status `current`.

## Stage handoffs

| Order | Stage                | Purpose                                                                                                                                                                                                                                 | Output / handoff                                                                                                      |
|------:|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
|     1 | Intent               | Narrow the ask into the actual need, goals, scope, and constraints.                                                                                                                                                                     | Agreed intent statement.                                                                                              |
|     2 | Requirement Analysis | Understand the intent and develop thorough, clear requirements.                                                                                                                                                                         | Requirements document for Discovery and Architecture.                                                                 |
|     3 | Discovery            | Use requirements and user-provided artifacts to identify relevant resources, systems, capabilities, and constraints. Inspect the repository or filesystem when requested; if inspection would help and was not requested, ask the user. | Record findings and sources in workflow state; create a discovery document when there are findings worth documenting. |
|     4 | Architecture         | Use requirements and discovery findings to design the proposed solution. Enterprise solution design is outside this workflow.                                                                                                           | Solution document.                                                                                                    |
|     5 | Backlog              | Break the solution into traceable, actionable work items.                                                                                                                                                                               | Backlog linked to relevant requirements and solution elements.                                                        |
|     6 | Planning             | Organize the backlog into a delivery sequence or plan.                                                                                                                                                                                  | Delivery plan based on the backlog.                                                                                   |

### Stage descriptions

**Intent** clarifies what the user is actually trying to achieve. It narrows the initial ask into the underlying need,
goals, scope, and known constraints, then records these in an agreed intent statement.

**Requirement Analysis** interprets the agreed intent and develops it into thorough, clear requirements. The resulting
requirements document guides Discovery and is also an explicit input to Architecture.

**Discovery** examines the requirements and user-provided artifacts to identify relevant existing resources, systems,
capabilities, and constraints. It records findings and their sources in workflow state and, when there are findings
worth documenting, in a discovery document. Repository or filesystem inspection is performed when the user requests
it. If inspection would help but has not been requested, ask the user before inspecting. If no relevant materials or
resources exist to discover, record that outcome in workflow state and complete the stage; a discovery document is
not required in that case. This is completion, not skipping.

**Architecture** uses both the requirements document and discovery findings to design and document the proposed
solution. Enterprise solution design is outside this workflow and can be handled by a separate workflow.

**Backlog** breaks the solution into actionable work items and links them to relevant requirements and solution
elements so the rationale for the work remains traceable.

**Planning** organizes backlog items into a delivery sequence or plan, using the available priorities and constraints.

See [`ai-sdlc.yaml`](ai-sdlc.yaml) for the machine-readable definition.
