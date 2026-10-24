#!/bin/sh
set -e
for f in /run/secrets/*.env; do
  [ -f "$f" ] || continue
  set -a
  . "$f"
  set +a
done
exec "$@"
