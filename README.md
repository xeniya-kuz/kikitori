# Numbers by Ear

A listening trainer for Japanese numbers. The app speaks a number in Japanese, you type what you heard, and it checks your answer and shows the correct kana reading.

## Features

- **Seven practice modes:** 0–9, 10–99, 100–999, 万 (man, ten thousands), 億 (oku, hundred millions), dates and phone numbers.
- **Mix mode:** tap **Mix**, then tap the mode chips to switch them on or off (at least one stays on). It uses the same row of chips, so nothing shifts. Tap **Mix** again to go back to your previous mode. The choice is saved.
- **Mistake tracking:** every wrong answer (or "Show answer") is remembered. Missed cards come back more often (25–50% of the time, depending on how many are waiting) until you answer them correctly. The **Stats** tab shows totals, accuracy per mode and your most-missed cards, with a reset button. A badge on the tab counts the cards waiting for review.
- **Instant feedback:** a glowing ◯ or ✕, the correct digits, the kana reading, and for large numbers the 万/億 grouping.
- **Speech speed:** 0.6×, 0.8×, 1×, 1.25× and 1.5×. Changing the speed replays the current number.
- **Score and streak** per mode, saved between sessions.
- **Dark neon look**, English interface.

## Project layout

| Folder | What it is |
| --- | --- |
| `kikitori/` | The app itself (`index.html`) and the Windows desktop shell (Electron). |
| `kikitori-android/` | The Android app (Expo and React Native). It wraps the same `index.html` in a WebView. |
| `NumbersByEar.apk` | A ready-to-install Android build (preview profile, about 20 MB, 64-bit ARM phones only). |

`kikitori/index.html` is the single source of truth for the interface and logic. Both shells use it.

## Install on Android

1. Copy `NumbersByEar.apk` to the phone.
2. Open it and allow installing from unknown sources if Android asks.
3. Install a Japanese voice (see below), then start the app.

### Japanese voice

The app uses the phone's text-to-speech engine. Without Japanese voice data, Android reads the digits in English, and the app shows a warning.

Settings → Text-to-speech (the name varies by phone) → Google Text-to-speech → Install voice data → 日本語.

## Run on Windows

Run `kikitori\dist\KikitoriNumbers-win32-x64\KikitoriNumbers.exe`. It uses the Windows speech voices. If no Japanese voice is installed, add one in Settings → Time & language → Language & region → Add a language → 日本語, with the text-to-speech pack, then restart the app.

To rebuild the executable:

```
cd kikitori
npm install
npm run pack
```

To run it without packaging, use `npm start`.

## Develop the Android app

```
cd kikitori-android
npm install
npm start
```

Scan the QR code with Expo Go. The phone and the computer must be on the same network, and on Windows the network must be set to Private so the firewall lets the phone reach the dev server.

### After editing the interface

The Android app embeds a generated copy of the page in `html.js`. Regenerate it after every change to `kikitori/index.html`:

```
cd kikitori-android
node patch-html.js
```

The script also swaps the browser speech call for native speech (`expo-speech`), because Android WebView has no reliable `speechSynthesis`. For the Windows app, run `npm run pack` in `kikitori` instead.

`index.html` in this folder is the editable source of the interface. `html.js` is generated from it, so don't edit `html.js` by hand.

### Lint and typecheck

```
npm run lint        # expo lint (ESLint with eslint-config-expo)
npm run typecheck   # tsc --noEmit (strict)
```

The app entry is `App.tsx`. `html.js` is excluded from linting because it is generated.

### Build an APK

The build runs in the Expo cloud, so Java and the Android SDK are not needed. You need a free Expo account.

```
cd kikitori-android
npx eas-cli login
npx eas-cli@latest build -p android --profile preview
```

When it finishes, EAS prints a link to the `.apk`. The `production` profile in `eas.json` builds an app bundle (`.aab`) for Google Play.

## Notes

- Fonts (Space Grotesk and Zen Kaku Gothic New) load from Google Fonts. Offline, the app falls back to system fonts.
- Progress is stored in the WebView's local storage. Clearing the app's data resets the score.
- The APK is built for `arm64-v8a` only, with code and resource shrinking on. This covers practically all phones made since about 2017. To support old 32-bit phones, add `armeabi-v7a` to `buildArchs` in `app.json` (the APK grows by about 15 MB).
- The Android package name is `com.ksufik.kikitori`.
