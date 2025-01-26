# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION="1.2.0"
ARG HOSTNAME="thuun.k3s.slva.fr"

# Throw-away build stage to reduce size of final image
FROM oven/bun:${BUN_VERSION}-alpine AS build

# Install node modules
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Build application
RUN bun run biome ci && \
    bun test && \
    SERVER_PRESET=bun \
    AUTH_SECRET="$(bun -e 'console.log(await Bun.password.hash(Date.now()))')" \
    HOSTNAME="${HOSTNAME}" \
    AUTH_TRUST_HOST=true \
    bun run --bun build

# Final stage for app image
FROM oven/bun:${BUN_VERSION}-alpine AS runtime

USER bun
WORKDIR /home/bun/app

# Copy built application
COPY --from=build --chown=bun:bun /home/bun/app/.output ./

# Set production environment
ENV NODE_ENV="production"
ENV HOSTNAME=$HOSTNAME
ENV AUTH_TRUST_HOST="true"

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000

CMD [ "sh", "-c", "bun run ./server/index.mjs" ]
