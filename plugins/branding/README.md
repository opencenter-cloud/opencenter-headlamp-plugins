---
id: branding-plugin
title: "OpenCenter Branding Plugin"
sidebar_label: Branding Plugin
description: Headlamp branding plugin that registers custom OpenCenter logos and light/dark themes.
doc_type: reference
audience: "plugin developers, platform engineers"
tags: [headlamp, branding, themes, plugin, bun]
---

# branding

OpenCenter branding plugin for [Headlamp](https://github.com/kubernetes-sigs/headlamp).

## Developing Headlamp plugins

For more information on developing Headlamp plugins, please refer to:

- [Getting Started](https://headlamp.dev/docs/latest/development/plugins/), How to create a new Headlamp plugin.
- [API Reference](https://headlamp.dev/docs/latest/development/api/), API documentation for what you can do
- [UI Component Storybook](https://headlamp.dev/docs/latest/development/frontend/#storybook), pre-existing components you can use when creating your plugin.
- [Plugin Examples](https://github.com/kubernetes-sigs/headlamp/tree/main/plugins/examples), Example plugins you can look at to see how it's done.

## Prerequisites

- Node.js >= 20.18.1 (Node 25 can break `headlamp-plugin` commands)
- [Bun](https://bun.sh/) >= 1.0.0

## Target Headlamp Version

This plugin is built against `@kinvolk/headlamp-plugin` **0.14.0**, the plugin SDK bundled with
**Headlamp 0.45.0** — the version deployed by `openCenter-gitops-base` branch `2026.03-rc`
(`applications/base/services/headlamp/`, Helm chart `0.45.0`).

| openCenter-gitops-base branch | Headlamp chart/appVersion | `@kinvolk/headlamp-plugin` |
| ----------------------------- | ------------------------- | -------------------------- |
| `2026.03-rc`                  | 0.45.0                    | ^0.14.0                    |

Keep the SDK pinned to the SDK version bundled with the deployed Headlamp. React, MUI, and the
Headlamp frontend libraries are externalized at build time and resolved from the host app at
runtime, so an SDK newer than the deployed Headlamp can compile and pass tests while failing to
load in the browser. When the base repo bumps Headlamp, bump the SDK here in step with it
(chart `0.46.0` and later also ship SDK `0.14.0`, so no change is needed for that bump).

## Setup

```bash
# From the monorepo root
bun install

# Or from this directory
cd plugins/branding
bun install
```

## Development

```bash
bun run start    # Start dev server
bun run build    # Production build
bun run test     # Run tests
bun run lint     # Lint
bun run format   # Format
```

## Branding Behavior

- The plugin registers a custom app logo and two themes.
- Themes are not auto-applied when registered. In Headlamp, go to `Settings -> General -> Theme` and select:
  - `Light`
  - `Dark`
- Logo assets are loaded from the plugin bundle path and adapt based on the selected light/dark theme name.
