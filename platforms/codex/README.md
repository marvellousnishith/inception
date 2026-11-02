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
