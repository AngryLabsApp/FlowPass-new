# ---------- base ----------
FROM node:20-alpine AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable pnpm && pnpm config set store-dir /pnpm/store

COPY package.json pnpm-lock.yaml* ./
COPY .npmrc .npmrc
# Pre-descarga dependencias para aprovechar la cache entre builds
RUN pnpm fetch

# ---------- build ----------
FROM base AS build
COPY . .
RUN pnpm install --offline --frozen-lockfile && pnpm build

# ---------- runtime ----------
FROM nginx:1.27-alpine-slim AS runtime
ENV NODE_ENV=production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
