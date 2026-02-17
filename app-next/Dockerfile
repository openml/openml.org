# =========================================
# Stage 1: Install dependencies
# =========================================
FROM node:22-alpine AS deps

# Native module build dependencies (argon2, better-sqlite3)
RUN apk add --no-cache python3 make g++ linux-headers

WORKDIR /app

# Copy package files for dependency caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# =========================================
# Stage 2: Build the application
# =========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build-time environment variables (NEXT_PUBLIC_* are baked into the bundle)
# Override at build time with: docker build --build-arg NEXT_PUBLIC_API_URL=...
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_URL_API
ARG NEXT_PUBLIC_URL_SITE_BACKEND
ARG NEXT_PUBLIC_OPENML_API_URL
ARG NEXT_PUBLIC_ELASTICSEARCH_SERVER
ARG NEXT_PUBLIC_ELASTICSEARCH_URL
ARG NEXT_PUBLIC_URL_ELASTICSEARCH
ARG NEXT_PUBLIC_ENABLE_ELASTICSEARCH
ARG NEXT_PUBLIC_ELASTICSEARCH_VERSION_MAYOR
ARG NEXT_PUBLIC_ENABLE_MINIO
ARG NEXT_PUBLIC_URL_MINIO

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application (produces .next/standalone)
RUN npm run build

# =========================================
# Stage 3: Production runner
# =========================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3050
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output (includes server.js and minimal node_modules)
COPY --from=builder /app/.next/standalone ./

# Copy static assets (not included in standalone output)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Copy native modules not included in standalone output
# argon2 (password hashing) - uses prebuilt binaries
COPY --from=deps /app/node_modules/argon2 ./node_modules/argon2
COPY --from=deps /app/node_modules/@phc/format ./node_modules/@phc/format
COPY --from=deps /app/node_modules/node-addon-api ./node_modules/node-addon-api
COPY --from=deps /app/node_modules/node-gyp-build ./node_modules/node-gyp-build
# better-sqlite3 (required: db.ts imports unconditionally; MySQL used at runtime)
COPY --from=deps /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=deps /app/node_modules/bindings ./node_modules/bindings
COPY --from=deps /app/node_modules/file-uri-to-path ./node_modules/file-uri-to-path
COPY --from=deps /app/node_modules/prebuild-install ./node_modules/prebuild-install

# Set correct ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3050

CMD ["node", "server.js"]
