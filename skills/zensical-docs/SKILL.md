---
name: zensical-docs
description: Create or improve a complete, beginner-friendly Zensical documentation site in the current repository. Use when asked to document, set up, or maintain a project's Zensical site.
---

# Create or improve a Zensical documentation site

Work in the repository the user identifies, usually the current working directory. Inspect before editing. Complete the
requested documentation work, preserve unrelated changes, and report what changed and how to use it.

## Inspect the project first

1. Read applicable repository instructions and inspect the working tree before changing files. Do not overwrite or
   discard existing user work.
2. Inspect existing Zensical configuration, documentation files, scripts, dependencies, package-manager lockfiles,
   ignore rules, and CI conventions. If a site already exists, extend and reorganize it where useful instead of
   scaffolding over it.
3. Determine the repository's operating-system and runtime conventions. Keep Zensical's Python installation separate
   from an existing JavaScript or other project toolchain.
4. Verify configuration syntax, command names, and options against an installed `zensical` CLI or current official
   Zensical documentation. Do not guess at settings or claim a check passed when it was not run.

## Build the documentation experience

Create or update a clear site structure and navigation that cover the user's requested topics. For a general beginner
guide, include:

- Getting started: what Zensical does, prerequisites, and exact installation and preview steps for this repository.
- Markdown: headings, paragraphs, emphasis, lists, links, images, code, tables, blockquotes, useful configured
  extensions, examples, and common mistakes.
- Configuration: explain only settings this site uses, with examples matching the actual TOML and official syntax.
- File management: explain the existing documentation layout, adding, renaming, moving, and removing pages, navigation
  paths, relative Markdown links, and asset organization.
- Preview and builds: exact commands, local address, output directory, useful documented options, clean-build guidance,
  and troubleshooting.

Use examples compatible with the repository's enabled Markdown extensions. Link between documentation pages using
relative paths to Markdown source files, not generated HTML URLs. Keep existing useful project documentation and avoid
duplicating it; add or reorganize navigation so pages are discoverable.

## Integrate with the repository

- Keep the root README concise: explain the project and give exact dependency-install, preview, and build commands.
- Match the repository's existing package manager and script conventions. Zensical is installed as a Python package;
  do not claim npm installs Zensical unless the project explicitly sets that up.
- Add a clearly named cleanup-and-preview script if requested. Resolve paths from the script's own location, not the
  caller's working directory. Fail clearly if Zensical is missing. Before deleting anything, verify the target is the
  repository's configured generated output directory. Never remove source documentation, arbitrary cache locations,
  or data outside that output directory. Explain what the script cleans.
- Ignore generated site output and local virtual environments as appropriate for the repository. Do not add a
  publishing workflow, global configuration changes, or unrelated tooling unless requested.
- For compatibility information, distinguish checks run in the repository from checks performed by Zensical or a
  hosting platform. Link to the official documentation used.

## Verify and report

Run focused checks appropriate to the repository, such as parsing TOML, confirming navigation paths exist, checking
local Markdown references, and running the Zensical build if the CLI is available. Do not install tools automatically.
If Zensical is unavailable, consult the official documentation when available, state that the build could not be run,
and give the installation command.

Finish with a concise summary of the files created or changed, exact commands to install, preview, and build, checks
that passed, and any platform behavior that remains unverified.
