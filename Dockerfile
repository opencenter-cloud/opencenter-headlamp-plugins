# Builds the OpenCenter Headlamp branding plugin into a plugin image that a Headlamp
# init container copies into the shared plugins volume.
#
# Layout contract: the final image exposes the plugin at /plugins/branding/main.js, which
# `cp -r /plugins/* /headlamp/plugins/` turns into /headlamp/plugins/branding/main.js.
# Headlamp 0.45.0 loads every /headlamp/plugins/*/main.js at startup.
#
# The uid/gid below deliberately match the Headlamp pod's securityContext in
# openCenter-gitops-base (runAsUser 100, runAsGroup 101), so the init container runs as the
# same identity as the main container and podSecurityContext.fsGroup: 101 is what makes the
# plugins emptyDir writable. See install-plan.md, "Permission gotcha".

FROM node:20-bookworm AS builder

# node:20-bookworm ships npm, not bun; this repo's lockfile is bun.lock.
ENV BUN_VERSION=1.4.4
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v${BUN_VERSION}" \
    && ln -s /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /build

COPY package.json bun.lock ./
COPY plugins/branding/package.json plugins/branding/package.json

# Frozen install so the image is reproducible from the committed lockfile.
RUN bun install --frozen-lockfile --ignore-scripts

COPY plugins/branding plugins/branding

# build, then use the SDK's own extractor rather than copying dist/ by hand.
# extract is what `headlamp-plugin package` uses internally, and it is the only thing that
# places package.json next to main.js. Headlamp's frontend gates every plugin on
# devDependencies['@kinvolk/headlamp-plugin'] read from that package.json; without it the
# plugin is reported "Incompatible plugins disabled" and never executes.
#
# Folder-of-packages mode (source = the plugins/ dir) names each output folder after the
# plugin directory, giving /plugins-staging/branding/. Single-package mode instead flattens
# into the output dir, which would lose the "branding" segment Headlamp scans for.
#
# Invoke the SDK bin directly rather than `bun x headlamp-plugin`: bun's runner tries to
# resolve "headlamp-plugin" from the registry (404). With bun workspaces the bin symlink
# lands in the owning package's node_modules/.bin, not the repo root.
RUN bun run --cwd plugins/branding build \
    && node plugins/branding/node_modules/.bin/headlamp-plugin extract plugins /plugins-staging

FROM alpine:3.22

# Pinned ids: alpine assigns them in creation order, so pinning keeps gid 101 stable
# even if this image later gains another group or user.
RUN addgroup -S headlamp -g 101 && adduser -S headlamp -u 100 -G headlamp

# extract already produced the final layout: /plugins-staging/branding/{main.js,logos,package.json}
COPY --from=builder /plugins-staging/ /plugins/
RUN chown -R 100:101 /plugins && chmod -R 755 /plugins

USER 100:101

LABEL org.opencontainers.image.title="opencenter-headlamp-plugin-branding" \
      org.opencontainers.image.description="OpenCenter branding plugin for Headlamp (logos and light/dark themes)" \
      org.opencontainers.image.source="https://github.com/opencenter-cloud/opencenter-headlamp-plugins" \
      org.opencontainers.image.licenses="Apache-2.0"

# The image is only a file carrier for the init container; it runs no service.
CMD ["sh", "-c", "ls -lR /plugins"]
