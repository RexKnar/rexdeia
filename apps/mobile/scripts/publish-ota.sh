#!/usr/bin/env bash
# Publish an over-the-air update to testers.
#
#   bash scripts/publish-ota.sh <channel> "<message>" [environment]
#
# The channel must match the `channel` of the build testers installed
# (preview APK -> preview). The EAS environment decides which EAS environment
# variables are compiled into the bundle, so it defaults to the channel name.
set -euo pipefail

cd "$(dirname "$0")/.."                     # -> apps/mobile
CHANNEL="${1:-preview}"
MESSAGE="${2:?usage: publish-ota.sh <channel> \"<message>\" [environment]}"
ENVIRONMENT="${3:-$CHANNEL}"
# Publish one platform only. Without --platform, `eas update` exports web + ios + android
# (sourcemaps included) and the asset upload times out - it is a real failure, not a warning.
PLATFORM="${PLATFORM:-android}"

if [ -n "$(git status --porcelain . 2>/dev/null | head -1)" ]; then
  echo "WARNING: this bundle is built from the current working tree, which has uncommitted"
  echo "         changes under apps/mobile. Testers get exactly what is on disk right now."
  echo
fi

npx --yes eas-cli@latest update \
  --channel "$CHANNEL" \
  --environment "$ENVIRONMENT" \
  --platform "$PLATFORM" \
  --message "$MESSAGE" \
  --non-interactive

echo
echo "Testers receive it on the 2nd launch of a release build (force-close and reopen)."
echo "Adoption: eas update:list --branch $CHANNEL   + the 'Seen by' counter on expo.dev"
