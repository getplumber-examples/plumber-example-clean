# Base image pinned by immutable digest (not just a tag).
# Refresh with: docker buildx imagetools inspect node:22.11.0-alpine
# Dependabot (package-ecosystem: docker) keeps this digest current.
FROM node:22.11.0-alpine@sha256:b64ced2e7cd0a4816699fe308ce6e8a08ccba463c757c00c14cd372e3d2c763b

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY dist ./dist

USER node
ENTRYPOINT ["node", "dist/cli.js"]
