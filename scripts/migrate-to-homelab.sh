#!/bin/sh
# Imports a local cahier database into the running https://cahier.homelab, inside its container.
# Usage: scripts/migrate-to-homelab.sh [source.db]
set -eu

source_db=${1:-data/french.db}
manager=${CAHIER_SWARM_MANAGER:-192.168.5.101}
key=${CAHIER_SSH_KEY:-$HOME/.ssh/id_gen_vms}
data=/mnt/docker-data/services/cahier/data
remote() { host=$1; shift; ssh -i "$key" -o BatchMode=yes "root@$host" "$@"; }

snapshot_dir=$(mktemp -d)
trap 'rm -rf "$snapshot_dir"' EXIT
sqlite3 "$source_db" ".backup '$snapshot_dir/import.db'"
sqlite3 "$snapshot_dir/import.db" "PRAGMA journal_mode = DELETE;" > /dev/null

node=$(remote "$manager" "docker service ps cahier_app --filter desired-state=running --format '{{.Node}}' | head -1")
[ -n "$node" ] || { echo "cahier_app is not running" >&2; exit 1; }
addr=$(remote "$manager" "docker node inspect $node --format '{{.Status.Addr}}'")

scp -q -i "$key" -o BatchMode=yes "$snapshot_dir/import.db" "root@$addr:$data/import.db"
remote "$addr" "set -e
  chmod 644 $data/import.db
  container=\$(docker ps -q -f label=com.docker.swarm.service.name=cahier_app | head -1)
  docker exec \"\$container\" node scripts/import-data.js /data/import.db
  rm -f $data/import.db"
