ARG BUN_VERSION="1.3.3"
ARG NGINX_VERSION="1.29"

FROM oven/bun:$BUN_VERSION AS builder

ARG BACKEND_URL="/api/v1"

WORKDIR /app
ENV VITE_BACKEND_URL=${BACKEND_URL}
COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build


FROM nginx:$NGINX_VERSION-alpine

LABEL org.opencontainers.image.title="do/place frontend"
LABEL org.opencontainers.image.description="Frontend application for do/place."
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.base.name="nginx:$NGINX_VERSION-alpine"

EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
