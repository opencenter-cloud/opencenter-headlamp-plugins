---
id: branding-plugin-e2e-tests
title: "E2E Tests for Branding Plugin"
sidebar_label: E2E Tests
description: End-to-end Playwright tests that verify theme switching and logo behavior in a running Headlamp instance.
doc_type: how-to
audience: "plugin developers, qa engineers"
tags: [e2e, playwright, testing, headlamp, themes]
---

# E2E Tests for Headlamp Branding Plugin

## Overview

These end-to-end tests verify theme switching behavior in a running Headlamp instance using Playwright.

## Prerequisites

1. **Headlamp must be running** on http://localhost:4466
2. **Plugin must be loaded** in Headlamp
3. **Playwright browsers installed** (run `pnpm exec playwright install` if needed)

## Running Tests

### Quick Start

```bash
# Ensure Headlamp is running
podman ps | grep headlamp

# Run all E2E tests
pnpm run test:e2e

# Run tests with UI mode (interactive)
pnpm run test:e2e:ui

# Run tests in headed mode (see browser)
pnpm run test:e2e:headed

# Debug tests
pnpm run test:e2e:debug
```

### Starting Headlamp for Testing

If Headlamp is not running, start it with:

```bash
# Build plugin first
pnpm run build

# Start Headlamp with plugin mounted
podman run -d \
  --name headlamp-test \
  -p 4466:4466 \
  -v $(pwd)/dist:/headlamp/plugins/branding:ro \
  -v ~/.kube/config:/root/.kube/config:ro \
  ghcr.io/headlamp-k8s/headlamp:latest

# Wait for Headlamp to start
sleep 5

# Run tests
pnpm run test:e2e
```

## Test Coverage

### Task 14.5: Theme Switching Behavior

**Requirements Validated:** 1.4, 1.5, 13.7

The test suite verifies:

1. **Theme Availability**
   - Both OpenCenter themes are available in settings
   - Cloud Day (light) and Abyssal Night (dark)

2. **Logo Updates on Theme Switch**
   - Light logo (logo.png) appears with Cloud Day theme
   - Dark logo (logo_dark.png) appears with Abyssal Night theme
   - Logo updates immediately when theme changes

3. **Bidirectional Switching**
   - Cloud Day → Abyssal Night works correctly
   - Abyssal Night → Cloud Day works correctly

4. **Rapid Switching Stability**
   - Multiple rapid theme switches don't cause errors
   - No console errors during rapid switching
   - Logo remains functional after rapid switches

5. **Theme Persistence**
   - Abyssal Night theme persists after page reload
   - Cloud Day theme persists after page reload
   - Logo variant persists with theme

6. **Cross-Page Consistency**
   - Theme persists when navigating between pages
   - Logo variant remains consistent across navigation

7. **Visual Transition Quality**
   - No flickering during theme switch
   - Logo remains visible throughout transition
   - No broken images or layout glitches

## Test Structure

```
e2e/
├── README.md                    # This file
└── theme-switching.spec.ts      # Theme switching tests
```

## Troubleshooting

### Headlamp Not Running

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:4466`

**Solution:** Start Headlamp before running tests (see "Starting Headlamp for Testing" above)

### Plugin Not Loaded

**Error:** Tests fail because themes are not available

**Solution:**
1. Verify plugin is built: `ls -la dist/`
2. Verify plugin is mounted in container: `podman exec headlamp-test ls -la /headlamp/plugins/branding/`
3. Check Headlamp logs: `podman logs headlamp-test`

### Playwright Browsers Not Installed

**Error:** `Executable doesn't exist at /path/to/browser`

**Solution:** Install Playwright browsers:
```bash
pnpm exec playwright install
```

### Tests Timeout

**Error:** `Test timeout of 30000ms exceeded`

**Solution:**
1. Check Headlamp is responsive: `curl http://localhost:4466`
2. Increase timeout in `playwright.config.ts` if needed
3. Check network connectivity

### Selectors Not Found

**Error:** `Locator not found: [aria-label="Settings"]`

**Solution:**
1. Headlamp UI may have changed - update selectors in tests
2. Run tests in headed mode to see what's happening: `pnpm run test:e2e:headed`
3. Use Playwright Inspector to debug: `pnpm run test:e2e:debug`

## CI/CD Integration

To run E2E tests in CI:

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build plugin
        run: pnpm run build
      
      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps
      
      - name: Start Headlamp
        run: |
          docker run -d \
            --name headlamp-test \
            -p 4466:4466 \
            -v $(pwd)/dist:/headlamp/plugins/branding:ro \
            ghcr.io/headlamp-k8s/headlamp:latest
          sleep 10
      
      - name: Run E2E tests
        run: pnpm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

1. **Always start Headlamp before running tests**
2. **Use UI mode for debugging** (`pnpm run test:e2e:ui`)
3. **Check screenshots/videos on failure** (saved in `test-results/`)
4. **Keep selectors flexible** (use aria-labels, text content, not brittle CSS)
5. **Add waits for theme transitions** (allow time for CSS to apply)

## Manual Verification

While E2E tests provide automated validation, some aspects require manual visual inspection:

- Color accuracy (does theme match design?)
- Contrast and readability
- Smooth transitions (no jarring color changes)
- Logo clarity at different sizes

See `.kiro/specs/headlamp-branding-plugin/theme-switching-verification.md` for manual QA checklist.
