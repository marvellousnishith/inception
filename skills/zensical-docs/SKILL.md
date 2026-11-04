---
name: zensical-docs
description: Create or improve a complete, beginner-friendly Zensical documentation site in a project folder chosen by the user. Use when asked to document, set up, or maintain a project's Zensical site.
---

# Create or improve a Zensical documentation site

Work in the project folder the user identifies. Before creating a site, if the user has not specified its location,
ask whether to create or update it in the current folder or in a new folder. Do not assume the current folder. If they
choose a new folder, ask for its path or name when unclear, inspect the destination and its parent before creating
anything, and preserve existing files. Complete the requested documentation work and report what changed and how to use
it.

## Inspect the project first

1. Read applicable repository instructions and inspect the working tree before changing files. Do not overwrite or
   discard existing user work.
2. Inspect existing Zensical configuration, documentation files, scripts, dependencies, package-manager lockfiles,
   ignore rules, and CI conventions. If a site already exists, extend and reorganize it where useful instead of
   scaffolding over it.
3. Determine the repository's operating-system and runtime conventions. Keep Zensical's Python installation separate
   from an existing JavaScript or other project toolchain.
4. Do not browse the web by default. Use the project's existing files and, when installed, `zensical --help`,
   command-specific help, and version output. Do not guess at settings or claim a check passed when it was not run.
   Browse official Zensical documentation only when the user explicitly asks. If essential syntax cannot be confirmed
   locally, explain the uncertainty and ask before browsing or adding it.

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
- Project launchers: copy the bundled `scripts/run.sh` and `scripts/run.bat` into
  `scripts/zensical/run.sh` and `scripts/zensical/run.bat` in the target repository. These launchers should serve the
  site by default and pass through explicit Zensical commands such as `build`. Set the POSIX script's executable bit.
  Link both scripts from the target README and document these commands separately:
  - macOS/Linux preview: `./scripts/zensical/run.sh`
  - macOS/Linux build: `./scripts/zensical/run.sh build`
  - macOS/Linux clean preview: `./scripts/zensical/run.sh clean-serve` when installed CLI help supports `build --clean`
  - Windows preview: `.\\scripts\\zensical\\run.bat`
  - Windows build: `.\\scripts\\zensical\\run.bat build`
  - Windows clean preview: `.\\scripts\\zensical\\run.bat clean-serve` when installed CLI help supports `build --clean`
  Explain that environment activation is scoped to the launcher process and does not change the caller's shell.

Use examples compatible with the repository's enabled Markdown extensions. Link between documentation pages using
relative paths to Markdown source files, not generated HTML URLs. Keep existing useful project documentation and avoid
duplicating it; add or reorganize navigation so pages are discoverable. The launcher templates are
[run.sh](scripts/run.sh) and [run.bat](scripts/run.bat); copy those files rather than recreating their logic.

## Integrate with the repository

- Keep the root README concise: explain the project and give exact dependency-install, preview, and build commands.
- Match the repository's existing package manager and script conventions. Zensical is installed as a Python package;
  do not claim npm installs Zensical unless the project explicitly sets that up.
- The bundled launchers must resolve the target repository from their own location, use an existing repository
  `.venv` or `venv` when present, and run Zensical in that environment. They may use an already active environment or
  a Zensical executable on `PATH` when no repository environment exists. Never create an environment, install
  packages, or access the network automatically. If Zensical is unavailable in the selected environment, fail with
  setup guidance. Do not overwrite existing target scripts; inspect and adapt them or ask before replacing them.
- `clean-serve` must check local `zensical build --help` for `--clean`, run `zensical build --clean`, and start `zensical
  serve` only if the installed CLI supports the option and the clean build succeeds. Do not delete output directories or
  caches by guessing their paths.
- If a cleanup action is part of the request, verify its target is the repository's configured generated output
  directory. Never remove source documentation, arbitrary cache locations, or data outside that output directory.
  Explain exactly what the cleanup does.
- Ignore generated site output and local virtual environments as appropriate for the repository. Do not add a
  publishing workflow, global configuration changes, or unrelated tooling unless requested.
- For compatibility information, distinguish checks run in the repository from checks performed by Zensical or a
  hosting platform. Do not invent citations; link official documentation only when the user requested web research.

## Verify and report

Run focused checks appropriate to the repository, such as parsing TOML, confirming navigation paths exist, checking
local Markdown references, and running the Zensical build if the CLI is available. Do not install tools or browse
automatically. If Zensical is unavailable, state that the build could not be run and point to the project's documented
setup steps, or give a clearly labeled generic setup example without claiming it was verified.

Finish with a concise summary of files created or changed, exact install, preview, and build commands for both
platforms, checks that passed, and any platform behavior that remains unverified.
