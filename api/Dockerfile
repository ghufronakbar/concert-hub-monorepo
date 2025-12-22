FROM node:20-alpine AS deps
WORKDIR /usr/src/app

# Install deps (prod only)
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# (opsional tapi bagus) batasi memory JS agar ga makan RAM VM 2GB
# sesuaikan kalau perlu
ENV NODE_OPTIONS=--max-old-space-size=512

# Copy node_modules dari stage deps
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy source code
COPY . .

# Pastikan folder images ada & writable (akan di-mount volume juga)
RUN mkdir -p /usr/src/app/images \
    && addgroup -S app && adduser -S app -G app \
    && chown -R app:app /usr/src/app

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

USER app

# Express generator biasanya listen dari PORT env di bin/www.js
EXPOSE 3000

# Entry point sesuai struktur kamu
CMD ["node", "bin/www.js"]
