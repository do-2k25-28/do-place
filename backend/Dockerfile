ARG DENO_VERSION="2.5.6"

FROM denoland/deno:${DENO_VERSION} AS builder

WORKDIR /app
COPY deno.json deno.lock ./

RUN deno cache --lock=deno.lock deno.json && deno cache deno.json && deno install


FROM denoland/deno:alpine-${DENO_VERSION}

LABEL org.opencontainers.image.title="do/place backend"
LABEL org.opencontainers.image.description="Deno backend application for do/place."
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.base.name="denoland/deno:alpine-${DENO_VERSION}"

WORKDIR /app

USER deno
ENV MODE=production
EXPOSE 80

COPY --from=builder --chown=deno:deno /deno-dir /deno-dir
COPY --chown=deno:deno . .

RUN deno cache src/index.ts

ENTRYPOINT [ "deno", "run", "--allow-env", "--allow-read", "--allow-write", "--allow-ffi", "--allow-net", "src/index.ts" ]
