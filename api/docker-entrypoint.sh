#!/bin/sh
set -e

# Seed images ke folder runtime hanya jika folder runtime masih kosong
if [ -d "/usr/src/app/images_seed" ]; then
  # cek folder images kosong (tidak ada file apa pun)
  if [ -z "$(ls -A /usr/src/app/images 2>/dev/null)" ]; then
    echo "[entrypoint] Seeding images..."
    cp -a /usr/src/app/images_seed/. /usr/src/app/images/
  else
    echo "[entrypoint] images already present, skip seeding."
  fi
fi

exec "$@"
