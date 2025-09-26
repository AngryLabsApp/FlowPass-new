# ----- build -----
FROM node:20-alpine AS build
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
# SvelteKit con adapter-static y fallback:index.html
RUN pnpm build

# ----- runtime (nginx) -----
FROM nginx:alpine
# Fallback SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copiamos el artefacto generado
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
