---
id: branding-plugin
title: "OpenCenter Branding Plugin"
sidebar_label: Branding Plugin
description: Headlamp branding plugin that registers custom OpenCenter logos and light/dark themes.
doc_type: reference
audience: "plugin developers, platform engineers"
tags: [headlamp, branding, themes, plugin]
---

# branding

This is the default template README for [Headlamp Plugins](https://github.com/kubernetes-sigs/headlamp).

- The description of your plugin should go here.
- You should also edit the package.json file meta data (like name and description).

## Developing Headlamp plugins

For more information on developing Headlamp plugins, please refer to:

- [Getting Started](https://headlamp.dev/docs/latest/development/plugins/), How to create a new Headlamp plugin.
- [API Reference](https://headlamp.dev/docs/latest/development/api/), API documentation for what you can do
- [UI Component Storybook](https://headlamp.dev/docs/latest/development/frontend/#storybook), pre-existing components you can use when creating your plugin.
- [Plugin Examples](https://github.com/kubernetes-sigs/headlamp/tree/main/plugins/examples), Example plugins you can look at to see how it's done.

## Branding Behavior

- The plugin registers a custom app logo and two themes.
- Themes are not auto-applied when registered. In Headlamp, go to `Settings -> General -> Theme` and select:
  - `Light`
  - `Dark`
- Logo assets are loaded from the plugin bundle path and adapt based on the selected light/dark theme name.

## Node Version

Headlamp plugin tooling expects Node `>=20.18.1`. Using Node 25 can break `headlamp-plugin` commands.
