#!/bin/sh
set -e

mkdir -p /usr/src/app/images

# Seed images (copy biasa, bukan -a)
if [ -d "/usr/src/app/images_seed" ]; then
  if [ -z "$(ls -A /usr/src/app/images 2>/dev/null)" ]; then
    echo "[entrypoint] Seeding images..."
    cp -r /usr/src/app/images_seed/. /usr/src/app/images/
  else
    echo "[entrypoint] images already present, skip seeding."
  fi
fi

# Pastikan folder images bisa ditulis user app (bind mount kadang permission beda)
chown -R app:app /usr/src/app/images 2>/dev/null || true

# Tunggu MySQL siap (hindari crash karena DB belum ready)
DBH="${DB_HOST:-mysql}"
DBP="${DB_PORT:-3306}"
echo "[entrypoint] waiting for mysql at $DBH:$DBP ..."
for i in $(seq 1 60); do
  nc -z "$DBH" "$DBP" && break
  sleep 2
done

# Kalau tidak ada command (kadang terjadi), set default
# Kalau tidak ada command, atau command cuma "node", paksa jalankan entrypoint API
if [ "$#" -eq 0 ] || { [ "$#" -eq 1 ] && [ "$1" = "node" ]; }; then
  set -- node bin/www.js
fi

echo "[entrypoint] starting: $*"
exec su-exec app "$@"
