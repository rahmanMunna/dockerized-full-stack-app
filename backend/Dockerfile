# syntax=docker/dockerfile:1

# Stage 1: Install dependencies for building
FROM node:24-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci


# Stage 2: Compile the NestJS application
FROM node:24-bookworm-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


# Stage 3: Production runtime dependencies
FROM node:24-bookworm-slim AS prod-deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev


# Stage 4: Production runtime
FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=prod-deps --chown=node:node \
    /app/node_modules ./node_modules

COPY --from=builder --chown=node:node \
    /app/dist ./dist

# Required at runtime: "type": "module" tells Node to load dist/ as ESM
COPY --from=builder --chown=node:node \
    /app/package.json ./package.json

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:' + process.env.PORT + '/health').then((r) => { process.exitCode = r.ok ? 0 : 1; }).catch(() => { process.exitCode = 1; })"]

CMD ["node", "dist/main.js"]
