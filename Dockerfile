FROM node:22-bookworm AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build \
 && npm prune --omit=dev \
 && (git rev-parse HEAD 2>/dev/null || echo dev) > .commit

FROM node:22-bookworm-slim
ENV NODE_ENV=production NODE_OPTIONS=--no-warnings PORT=3000 DB_PATH=/data/french.db
WORKDIR /app
COPY --from=build /app/package.json /app/.commit ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/web/dist ./web/dist
COPY server ./server
COPY scripts ./scripts
COPY deploy/entrypoint.sh /usr/local/bin/cahier-entrypoint
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD node -e "fetch('http://localhost:3000/api/health').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"
ENTRYPOINT ["cahier-entrypoint"]
CMD ["node", "server/index.js"]
