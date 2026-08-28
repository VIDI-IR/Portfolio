# syntax=docker/dockerfile:1

# Three stages so the runtime image carries no package manager, no source, and
# no build cache — only the traced server bundle.
#
# Node 22 (LTS): Next.js 16 requires >= 20.9. Alpine needs libc6-compat for the
# glibc-linked native binaries in the toolchain.

# ---------------------------------------------------------------- dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable

# Lockfile only, so this layer is cached until dependencies actually change.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---------------------------------------------------------------------- build
FROM node:22-alpine AS build
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# -------------------------------------------------------------------- runtime
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Must be 0.0.0.0, not localhost: the server has to accept connections from
# outside the container, and Next defaults to binding localhost only.
ENV HOSTNAME=0.0.0.0

# Run unprivileged. Containers run as root by default, which means a process
# escape starts with root in the container.
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# The standalone bundle already contains the node_modules the build traced,
# so nothing is installed at this stage.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
# standalone deliberately omits these two — the docs assume a CDN serves them.
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Plain node, not `next start`: standalone emits its own minimal server.
CMD ["node", "server.js"]
