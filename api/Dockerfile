FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=512

# install su-exec untuk drop privilege
RUN apk add --no-cache su-exec

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# create user
RUN addgroup -S app && adduser -S app -G app \
    && mkdir -p /usr/src/app/images \
    && chown -R app:app /usr/src/app

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh