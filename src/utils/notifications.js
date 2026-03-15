import * as Notifications from 'expo-notifications';

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

export async function scheduleAllReminders() {
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
      },
    });
  }
}
