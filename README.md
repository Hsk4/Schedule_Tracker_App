# STRK_OS — Setup & APK Guide

## Fastest way to get it on your Android phone (no PC setup needed)

### Option 1 — Snack (zero install, browser only)
1. Go to https://snack.expo.dev
2. Delete all default files
3. Create each file from this project and paste the code in
4. Click the Android tab to preview live
5. Click "Export" → "Download as APK" to get an installable file

### Option 2 — Build on your PC (recommended for best result)

#### Step 1 — Install Node.js
Download from https://nodejs.org (LTS version)

#### Step 2 — Install Expo CLI
Open a terminal and run:
```
npm install -g expo-cli eas-cli
```

#### Step 3 — Set up this project
```
cd strkos
npm install
```

#### Step 4 — Test on your phone instantly (no APK needed)
```
npx expo start
```
- Install "Expo Go" from the Play Store on your phone
- Scan the QR code that appears — app runs live on your phone!

#### Step 5 — Build a real APK
```
eas login         # create a free account at expo.dev
eas build:configure
eas build -p android --profile preview
```
- EAS builds it in the cloud (free tier available)
- Download the .apk link it gives you
- Transfer to phone and install (enable "Install unknown apps" in settings)

## Files in this project
```
App.js                          ← entry point
app.json                        ← app config
package.json                    ← dependencies
src/
  theme.js                      ← colors
  context/AppContext.js         ← global state
  data/schedule.js              ← your full schedule + habits
  utils/notifications.js        ← daily reminders
  screens/
    TodayScreen.js              ← daily timetable
    StreaksScreen.js             ← habit streaks
    ChecklistScreen.js          ← nightly prep + tasks
    WeekScreen.js               ← weekly overview
```

## Customising your schedule
Open `src/data/schedule.js` and edit `SCHEDULE_WEEKDAY` or `SCHEDULE_WEEKEND`.
Each block has: time, label, icon, color, sub (subtitle), and habit (optional — links to streak tracker).
