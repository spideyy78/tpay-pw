#!/bin/sh
set -e
cd "$(dirname "$0")/../gateway"
rm -f trust-assets assets
ln -sf offer/trust-assets trust-assets
ln -sf offer/assets assets
for f in offer/*.js; do
  bn=$(basename "$f")
  ln -sf "offer/$bn" "$bn" 2>/dev/null || true
done
echo "Linked trust-assets, assets, and root JS bundles."