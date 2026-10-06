# Test distribution + over-the-air updates

Two independent pipelines. Mixing them up is the most common way to lose an afternoon.

| | **Firebase App Distribution** | **EAS Update (OTA)** |
|---|---|---|
| Ships | the whole app binary (APK) | only the JS + asset bundle |
| How testers get it | one email invite, install once per build | the app updates itself, silently |
| Needs | a Firebase project, the app registered, a tester group, `firebase-tools` | `expo-updates` inside the binary + `updates.url` (done) |
| Use when | native change: new native module, permission, SDK upgrade, icon, first install | any JS/UI/business-logic change |

**The rule that matters:** OTA can never fix a binary. An APK built without `expo-updates` will never receive an update (the very first APK we built could not; the rebuild adds it). Native changes always mean a new APK **and** a re-distribution.

## Status of this repo

Configured and verified:

- `expo-updates` added to `dependencies` (SDK-matched version).
- `app.json`: `updates.url = https://u.expo.dev/4bf592ac-7f17-4945-bf51-44c354de012b`, `runtimeVersion.policy = "appVersion"`.
- `eas.json`: every profile has a `channel` (`development` / `preview` / `production`). A binary only accepts updates published to **its own channel**.
- `EXPO_PUBLIC_API_URL` set as an EAS environment variable for all three environments — `eas update` reads EAS environment variables, *not* the `env` block in `eas.json`, so without this an update could publish without the API URL. (In release builds `src/config/env.ts` also falls back to `https://rexdeia.vercel.app`, so a miss degrades rather than breaks — but keep both in sync anyway.)

Still **yours** to do (needs your Google account, no way around it):

1. Firebase console → create/choose a project → **Add app → Android** → package name `com.rexdeia.staff` → copy the **App ID** (`1:…:android:…`).
2. You do **not** need `google-services.json` for App Distribution. That file is only required if you add Firebase SDK features (Analytics, Crashlytics, FCM/push).
3. App Distribution → **Testers & Groups** → create the group (e.g. `testers`) and add the email addresses.
4. Authenticate the CLI once: `npx firebase-tools login` (opens a browser). For CI, create a service account with the *Firebase App Distribution Admin* role and point `GOOGLE_APPLICATION_CREDENTIALS` at its JSON key instead.

## A. Ship a new test build

```bash
cd apps/mobile
bash scripts/build-test-apk.sh preview          # cloud build -> build/*.apk
FIREBASE_APP_ID=1:…:android:… bash scripts/distribute-firebase.sh
```

`build-test-apk.sh` runs EAS with the two flags this machine needs: `EAS_NO_VCS=1` (EAS's git-based archive fails here, and it would silently skip `apps/mobile`, which is untracked) and `EAS_PROJECT_ROOT` (metro resolves from the monorepo root).

Testers receive an email; the first install needs "Install unknown apps" permission. Testers must accept the invite before they appear as installs.

## B. Publish an update

```bash
cd apps/mobile
bash scripts/publish-ota.sh preview "fix: student search"
# equivalently:
# eas update --channel preview --environment preview --platform android --message "fix: student search"
```

- **Always pass `--platform android`** (the script does). Without it `eas update` exports web + ios + android bundles *and their sourcemaps* (~25 MB extra) and the upload dies with `Asset processing timed out for assets` — a genuine failure, printed without an obvious cause. One platform per update is also just correct: the Android binary only reads the Android bundle.

- **Channel must match the installed binary.** preview APK → `--branch`/`--channel` `preview`.
- `--environment` (required in SDK 55+) picks the EAS environment variables used to build the bundle — that is why it must equal the channel here.
- `runtimeVersion` is `appVersion`, so updates reach every binary with `version 1.0.0`. Bump `version` in `app.json` when native changes ship: that starts a *new* runtime version, and old binaries correctly stop receiving updates.
- Testers see it after **two launches** of a release build (it downloads in the background on launch 1, applies on launch 2). Force-close and reopen.
- Publishing bundles the **current working tree**. Commit first, and don't publish a half-finished change — OTA reaches every tester instantly.
- Verify adoption: `eas update:list --branch preview` (that subcommand takes `--branch`, **not** `--channel` — the publish command takes `--channel`), and the "Seen by" counter on the update's page in the EAS dashboard.
- Roll back: publish the previous state again, or `eas update:rollback`.

## Things that will bite

- **Wrong channel** → testers never see the update, with no error anywhere.
- **`eas.json`'s `node` field must be a concrete version** (`"24.9.0"`), never a range. If EAS CLI offers to pin the version your `.nvmrc`/`.node-version` declares, decline unless you use a concrete value: it writes `"24.x"` and then rejects *its own* file as invalid, which breaks every EAS command. (Removed; that is why it was blocking.)
- **Untracked app directory** → a git-based EAS upload would build a project with no app in it. Keep using `EAS_NO_VCS=1`, or commit `apps/mobile`.
- **Keystore lives on EAS.** Lose it and installed copies can never be upgraded in place.
- **Lockfile must stay in sync** — the worker runs `pnpm install --frozen-lockfile`, so a dependency change without a lockfile update fails the build.
- **`cli.appVersionSource` is unset** and EAS CLI warns it "will be required in the future". Decide once and pin it in `eas.json`: `"cli": { "appVersionSource": "remote" }` lets EAS track `versionCode` server-side (nothing to commit), `"local"` keeps it in `app.json`. Don't leave it implicit for the switchover.
- **All four ABIs** are in the APK (~100 MB). Trim with `android.buildArchs` for smaller test builds.
