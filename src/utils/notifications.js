import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDERS = [
  { hour: 8,  minute: 0,  body: 'Good morning! Time to wake up & stretch 🌅' },
  { hour: 8,  minute: 15, body: 'Breakfast time — protein first 🥚' },
  { hour: 9,  minute: 0,  body: 'Deep work begins. Code time 💻' },
  { hour: 11, minute: 0,  body: 'University class starts now 🎓' },
  { hour: 13, minute: 30, body: 'Japanese study session 🇯🇵' },
  { hour: 16, minute: 0,  body: 'Play time! You earned it 🎮' },
  { hour: 18, minute: 0,  body: 'Family & nephew time 👨‍👩‍👦' },
  { hour: 23, minute: 0,  body: 'Digital cut-off. Start planning tomorrow 📋' },
];

async function ensureNotificationChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('daily-reminders', {
    name: 'Daily reminders',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#7c6af7',
  });
}

export async function getNotificationPermissionStatus() {
  if (Platform.OS === 'web') return 'web-unsupported';
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') return 'web-unsupported';
  const { status } = await Notifications.requestPermissionsAsync();
  return status;
}

export async function cancelAllReminders() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleAllReminders() {
  if (Platform.OS === 'web') return { count: 0 };
  await ensureNotificationChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const r of REMINDERS) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'STRK_OS',
        body: r.body,
        sound: true,
      },
      trigger: {
        hour: r.hour,
        minute: r.minute,
        repeats: true,
        channelId: Platform.OS === 'android' ? 'daily-reminders' : undefined,
      },
    });
  }
  return { count: REMINDERS.length };
}

export async function sendTestNotification() {
  if (Platform.OS === 'web') {
    return { ok: false, message: 'Test notifications are not supported on web.' };
  }

  await ensureNotificationChannel();
  const status = await getNotificationPermissionStatus();
  if (status !== 'granted') {
    return { ok: false, message: 'Permission is not granted yet.' };
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'STRK_OS Test',
      body: 'Notifications are working perfectly ✅',
      sound: true,
    },
    trigger: Platform.OS === 'android'
      ? { seconds: 2, channelId: 'daily-reminders' }
      : { seconds: 2 },
  });

  return { ok: true };
}
