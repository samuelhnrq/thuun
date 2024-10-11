# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.1.29
FROM oven/bun:${BUN_VERSION} AS base

LABEL fly_launch_runtime="Bun"

# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
# RUN apt-get update -qq && \
#     apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3

# Install node modules
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Build application
RUN bun run biome ci && \
    export "AUTH_SECRET=$(openssl rand -base64 32)" && \
    bun run --bun build

# Remove development dependencies
RUN rm -rf node_modules && \
    bun install --ci --frozen-lockfile

# Final stage for app image
FROM base AS runtime

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "sh", "-c", "bun run .output/server/index.mjs" ]
