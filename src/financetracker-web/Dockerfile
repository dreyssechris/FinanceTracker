# =========================
# deps (cached dependency layer)
# =========================
FROM node:20-alpine AS deps
WORKDIR /app

# Copy only manifests for better layer caching
COPY package*.json ./
RUN npm ci

# =========================
# dev (Vite dev server)
# =========================
FROM node:20-alpine AS dev
WORKDIR /app

# Reuse installed deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

# Vite dev port
EXPOSE 5173

# Good defaults for containers (bind to all interfaces)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# =========================
# build (for later: serve via Caddy)
# =========================
FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build
