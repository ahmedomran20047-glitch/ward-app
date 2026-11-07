import { LocalNotifications } from '@capacitor/local-notifications';

function nextOccurrence(time) {
  const [hour, minute] = (time || '05:30').split(':').map(Number);
  const now = new Date();
  const at = new Date();
  at.setHours(hour || 0, minute || 0, 0, 0);
  if (at <= now) at.setDate(at.getDate() + 1);
  return at;
}

async function enableDaily(time) {
  let permission = await LocalNotifications.checkPermissions();
  if (permission.display !== 'granted') {
    permission = await LocalNotifications.requestPermissions();
  }
  if (permission.display !== 'granted') return false;

  // Remove the previous reminder first so changing its time never creates duplicates.
  try {
    await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
  } catch (_) {}

  await LocalNotifications.schedule({
    notifications: [{
      id: 1001,
      title: '📖 وِرْدك اليومي بانتظارك',
      body: 'حان وقت وردك اليومي من القرآن الكريم. افتح وِرْد وواصل سلسلة الحماسة!',
      schedule: {
        at: nextOccurrence(time),
        repeats: true,
        every: 'day',
        allowWhileIdle: true
      },
      extra: { screen: 'home' }
    }]
  });
  return true;
}

async function disableDaily() {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
  } catch (_) {}
}

window.WardNotifications = { enableDaily, disableDaily };
