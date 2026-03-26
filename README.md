---
id: opencenter-headlamp-plugins
title: "OpenCenter Headlamp Plugins"
sidebar_label: Plugins Monorepo
description: Monorepo overview for OpenCenter Headlamp plugins covering setup, development, testing, and CI/CD.
doc_type: reference
audience: "platform engineers, plugin developers"
tags: [headlamp, plugins, monorepo, bun]
---

# OpenCenter Headlamp Plugins

Monorepo for OpenCenter Headlamp plugins providing custom branding and functionality.

## Repository Structure

```
opencenter-headlamp-plugins/
├── plugins/
│   └── branding/              # OpenCenter branding plugin
│       ├── src/               # Source code
│       ├── assets/            # Logo assets
│       ├── dist/              # Build output
│       ├── __tests__/         # Tests
│       └── README.md          # Plugin documentation
├── .github/
│   └── workflows/             # CI/CD workflows
├── package.json               # Workspace configuration (bun workspaces)
└── bun.lock                   # Bun lockfile
```

## Plugins

### @opencenter/headlamp-plugin-branding

Custom branding plugin that provides OpenCenter logos and themes for Headlamp.

**Features:**
- Custom OpenCenter logos (light/dark variants)
- Two complete themes (Cloud Day light, Abyssal Night dark)
- No Headlamp fork required

**Documentation:** See [plugins/branding/README.md](plugins/branding/README.md)

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- [Bun](https://bun.sh/) >= 1.0.0

### Installation

```bash
# Install dependencies for all plugins
bun install
```

### Development

```bash
# Start development server for specific plugin
cd plugins/branding
bun run start
```

### Building

```bash
# Build specific plugin
cd plugins/branding
bun run build
```

### Testing

```bash
# Run tests for specific plugin
cd plugins/branding
bun run test
```

### Code Quality

```bash
# Lint
cd plugins/branding
bun run lint

# Format
bun run format
```

## Workspace Commands

The monorepo uses bun workspaces for managing multiple plugins. Workspaces are defined in the root `package.json`:

```json
{
  "workspaces": ["plugins/*"]
}
```

### Running Commands for a Specific Plugin

```bash
# Using --filter flag
bun run --filter @opencenter/headlamp-plugin-branding build

# Or navigate to plugin directory
cd plugins/branding
bun run build
bun run test
```

## Adding New Plugins

To add a new plugin to the monorepo:

1. Create plugin directory:
```bash
mkdir -p plugins/my-new-plugin
cd plugins/my-new-plugin
```

2. Initialize package.json:
```json
{
  "name": "@opencenter/headlamp-plugin-my-new-plugin",
  "version": "1.0.0",
  "main": "dist/main.js",
  "scripts": {
    "dev": "webpack --mode development --watch",
    "build": "webpack --mode production",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  },
  "peerDependencies": {
    "@kinvolk/headlamp-plugin": "^0.13.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

3. Create plugin structure:
```bash
mkdir -p src __tests__ assets
touch src/index.tsx
```

4. Install dependencies:
```bash
bun install
```

5. The plugin will automatically be included in workspace commands.

## CI/CD

### Pull Request Checks

On every pull request, the CI pipeline runs:
- Dependency installation (`bun install`)
- Linting (ESLint)
- Format checking (Prettier)
- Tests (Jest)
- Build (Webpack)

### Release Process

1. Update version in plugin's package.json:
```bash
cd plugins/branding
npm version patch  # or minor, major
```

2. Commit and push:
```bash
git add .
git commit -m "chore: bump version to 1.0.1"
git push
```

3. Create and push tag:
```bash
git tag v1.0.1
git push origin v1.0.1
```

4. GitHub Actions will automatically:
   - Run tests
   - Build plugin
   - Package as ZIP
   - Create GitHub release with artifact

## Monorepo Benefits

- **Shared Configuration:** Common ESLint, Prettier, TypeScript configs
- **Dependency Management:** Single `bun.lock` for all plugins
- **Consistent Tooling:** Same build, test, and lint tools across plugins
- **Atomic Changes:** Update multiple plugins in single PR
- **Simplified CI/CD:** Single workflow for all plugins

## Troubleshooting

### bun install fails

**Solution:**
```bash
# Remove node_modules and lockfile
rm -rf node_modules bun.lock plugins/*/node_modules

# Reinstall
bun install
```

### Workspace command not finding plugin

**Solution:**
Verify plugin is listed in the root `package.json` workspaces field:
```json
{
  "workspaces": ["plugins/*"]
}
```

### Build fails for one plugin

**Solution:**
```bash
# Build specific plugin with verbose output
cd plugins/branding
bun run build

# Check for TypeScript errors
bun run lint
```

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and add tests
3. Run quality checks: `bun run lint && bun run test`
4. Commit with conventional commits: `git commit -m "feat: add new feature"`
5. Push and create pull request

## License

Apache-2.0

## Support

For issues, questions, or contributions, please contact the OpenCenter team.
