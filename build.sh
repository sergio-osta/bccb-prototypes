#!/usr/bin/env bash
# Builds the password-protected static site into $1 (default: dist).
# Every HTML page is AES-encrypted with StatiCrypt; assets and shared files are copied as-is.
set -euo pipefail
OUT="$(cd "$(dirname "${1:-dist}")" 2>/dev/null && pwd)/$(basename "${1:-dist}")"
: "${PROTOTYPES_PASSWORD:?Set PROTOTYPES_PASSWORD (GitHub Actions secret or local env var)}"
# Fixed salt so "remember on this device" survives redeploys. Not secret.
SALT="${STATICRYPT_SALT:-7349a56ed7f9ec0bdc3ca01172ee86d5}"
cd "$(dirname "$0")"

rm -rf "$OUT"
mkdir -p "$OUT"
cp -R assets shared "$OUT"/
touch "$OUT/.nojekyll"

# StatiCrypt writes <outdir>/<basename>, so encrypt each page from inside its own folder.
for page in index.html variant-*/index.html; do
  dir="$(dirname "$page")"
  mkdir -p "$OUT/$dir"
  ( cd "$dir" && npx --yes staticrypt@3 index.html \
      -d "$OUT/$dir" -p "$PROTOTYPES_PASSWORD" --salt "$SALT" --remember 30 --short \
      --template-title "BCCB · Prototipos" \
      --template-instructions "Introduce la contraseña para ver los prototipos." \
      --template-placeholder "Contraseña" \
      --template-button "Entrar" \
      --template-remember "Recordar en este dispositivo" \
      --template-error "Contraseña incorrecta" \
      --template-color-primary "#7eb551" \
      --template-color-secondary "#f6f7f3" >/dev/null )
done
find . -name .staticrypt.json -not -path "$OUT/*" -delete

echo "Built $(find "$OUT" -name '*.html' | wc -l | tr -d ' ') encrypted pages into $OUT/"
