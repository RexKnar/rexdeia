#!/usr/bin/env bash
# Upload a built APK to Firebase App Distribution.
#
#   FIREBASE_APP_ID=1:...:android:... bash scripts/distribute-firebase.sh [apk] [group]
#
# FIREBASE_APP_ID comes from the Firebase console -> Project settings -> Your apps
# (the Android app must be registered with the package name com.rexdeia.staff).
# Authentication: `npx firebase-tools login` once, or GOOGLE_APPLICATION_CREDENTIALS
# pointing at a service-account key with the Firebase App Distribution Admin role.
# No google-services.json is needed for App Distribution.
set -euo pipefail

cd "$(dirname "$0")/.."                     # -> apps/mobile
APP_ID="${FIREBASE_APP_ID:-1:656276815107:android:3280a6086738a9d5387d36}"
GROUP="${2:-testers}"

APK="${1:-}"
if [ -z "$APK" ]; then
  APK="$(ls -t build/*.apk 2>/dev/null | head -1 || true)"
fi
if [ -z "$APK" ] || [ ! -f "$APK" ]; then
  echo "No APK found. Build one first (scripts/build-test-apk.sh), or pass a path as \$1." >&2
  exit 1
fi

NOTES="$(mktemp)"
{
  echo "$(basename "$APK")"
  echo
  echo "git: $(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
  echo "built: $(date -r "$APK" '+%Y-%m-%d %H:%M' 2>/dev/null || date '+%Y-%m-%d %H:%M')"
  echo "sha256: $(sha256sum "$APK" | cut -d' ' -f1)"
} > "$NOTES"

echo "Uploading $APK ($(du -h "$APK" | cut -f1)) to group '$GROUP'..."
npx --yes firebase-tools appdistribution:distribute "$APK" \
  --app "$APP_ID" \
  --groups "$GROUP" \
  --release-notes-file "$NOTES"

rm -f "$NOTES"
echo
echo "Testers get an invite email. First install needs 'Install unknown apps' permission."
