#!/bin/sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/gateway"

rm -rf trust-assets assets
cp -R offer/trust-assets trust-assets
cp -R offer/assets assets

for f in offer/*.js; do
  bn=$(basename "$f")
  rm -f "$bn"
  cp -f "$f" "$bn"
done

echo "Vercel: copied trust-assets, assets, and JS bundles into gateway/."