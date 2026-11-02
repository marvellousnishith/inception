# Codex package

Built at `dist/codex/`. The package uses Codex's documented `.codex-plugin/plugin.json` compatibility manifest and carries its skills directory at the package root. The repository root is also a Codex plugin source, with a repo marketplace catalog at `.agents/plugins/marketplace.json`. Repository validation checks the manifest and local files; it does not replace validation by Codex itself.

## Try from GitHub

Run `codex plugin marketplace add nisheeth/inception`, then install Inception from the Codex desktop app's plugin directory. Codex CLI manages marketplace sources; use the desktop app to install and test a local plugin.

## Try a generated package locally

Build from the repository root with `npm run build`. To use the documented local marketplace flow in Codex, copy `dist/codex/` into a plugin directory within a local marketplace root, then register a `marketplace.json` there that points to it. For example, with the package copied to `./plugins/inception`, add:

```json
{
  "name": "inception-local",
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

Register that marketplace root with `codex plugin marketplace add /absolute/path/to/marketplace-root`, then use the Codex desktop app's plugin directory to install it. Restart or refresh as directed by Codex after updating the copied package. No global settings are changed by this repository.
