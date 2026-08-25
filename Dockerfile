FROM node:22-bookworm-slim
# Prisma's query engine needs OpenSSL on Debian bookworm; slim does not ship it.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build
ENV PORT=3000
EXPOSE 3000
# Official node image ships a `node` user (uid 1000). Own /app so prisma db
# push can write SQLite at runtime without running the process as root.
RUN chown -R node:node /app
USER node
# Probe the public health route. boot.mjs runs prisma push + seed before Next.js listens.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["npm", "start"]
