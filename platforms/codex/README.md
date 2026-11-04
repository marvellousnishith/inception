# Codex package

Built at `dist/codex/`. The package uses Codex's documented `.codex-plugin/plugin.json` compatibility manifest and carries its skills directory at the package root. The repository root is also a Codex plugin source, with a repo marketplace catalog at `.agents/plugins/marketplace.json`. Repository validation checks the manifest and local files; it does not replace validation by Codex itself.

## Try from GitHub

Add the GitHub marketplace:

```sh
codex plugin marketplace add marvellousnishith/inception
```

Install Inception from the command line:

```sh
codex plugin add inception@marvellousnishith
```

### Update the installed plugin

Refresh the GitHub marketplace:

```sh
codex plugin marketplace upgrade marvellousnishith
```

Restart the ChatGPT desktop app and open a new chat to load the refreshed plugin. For a locally built package, first
rebuild it and update the copy in your local marketplace, then restart the app.

## Use the workflows

In Codex, invoke `$plan` to get a plan without implementation changes. Invoke `$zensical-docs` to create or improve a
beginner-friendly Zensical documentation site in the current repository. You can also choose either skill from the
skill picker. The Zensical workflow adds project launchers at `scripts/zensical/run.sh` and
`scripts/zensical/run.bat` so you can preview or build outside the Codex session.

## Try from a local checkout

Add the repository checkout as a marketplace:

```sh
codex plugin marketplace add /absolute/path/to/agents
```

Install Inception from that marketplace:

```sh
codex plugin add inception@marvellousnishith
```

Use `$plan` or `$zensical-docs` in Codex. This uses the repository root marketplace and does not change global Codex
configuration.

## Try a generated package locally

Build from the repository root with `npm run build`. To use the documented local marketplace flow in Codex, copy `dist/codex/` into a plugin directory within a local marketplace root, then register a `marketplace.json` there that points to it. For example, with the package copied to `./plugins/inception`, add:

```json
{
  "name": "marvellousnishith",
  "plugins": [
    {
      "name": "inception",
      "source": { "source": "local", "path": "./plugins/inception" },
      "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
      "category": "Productivity"
    }
  ]
}
```

Register that marketplace root:

```sh
codex plugin marketplace add /absolute/path/to/marketplace-root
```

Then install the plugin using the marketplace name in that catalog:

```sh
codex plugin add inception@marvellousnishith
```

Use `codex plugin marketplace list` to inspect configured marketplaces. No global settings are changed by this repository itself.
