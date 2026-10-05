#!/usr/bin/env bash
# Build the test APK (default profile: preview) into apps/mobile/build/.
#
# Two flags this machine needs:
#   EAS_NO_VCS=1        EAS's default archive is `git clone --depth 1 file:///<repo>`,
#                       which fails here (exit 128) — and it would silently skip
#                       apps/mobile, which is currently untracked.
#   EAS_PROJECT_ROOT    metro.config.js resolves modules from the monorepo root, so the
#                       filesystem upload has to start there, not at apps/mobile.
set -euo pipefail

cd "$(dirname "$0")/.."                     # -> apps/mobile
REPO_ROOT="$(cd ../.. && pwd)"
PROFILE="${1:-preview}"

# eas-cli is a native Windows program: it needs C:/... style paths, not /c/...
if command -v cygpath >/dev/null 2>&1; then
  EAS_PROJECT_ROOT="$(cygpath -m "$REPO_ROOT")"
else
  EAS_PROJECT_ROOT="$REPO_ROOT"
fi

echo "Profile    : $PROFILE"
echo "Project root: $EAS_PROJECT_ROOT"
echo

EAS_NO_VCS=1 EAS_PROJECT_ROOT="$EAS_PROJECT_ROOT" \
  npx --yes eas-cli@latest build \
    --platform android \
    --profile "$PROFILE" \
    --non-interactive \
    --wait

echo
echo "Download the artifact from the URL above, or from https://expo.dev/accounts/rexdeia/projects/rexdeia-staff/builds"
