#!/bin/sh
set -e

# pastikan folder target ada
mkdir -p /usr/src/app/images

# Seed images hanya jika images masih kosong
if [ -d "/usr/src/app/images_seed" ]; then
  if [ -z "$(ls -A /usr/src/app/images 2>/dev/null)" ]; then
    echo "[entrypoint] Seeding images..."
    # copy tanpa preserve ownership/perm
    cp -r /usr/src/app/images_seed/. /usr/src/app/images/
  else
    echo "[entrypoint] images already present, skip seeding."
  fi
fi

# pastikan user app bisa nulis ke folder images (penting karena ini bind mount)
chown -R app:app /usr/src/app/images || true

# jalankan app sebagai user non-root
exec su-exec app "$@"
